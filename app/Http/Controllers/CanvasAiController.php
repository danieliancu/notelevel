<?php

namespace App\Http\Controllers;

use App\Services\AiBudgetService;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class CanvasAiController extends Controller
{
    private const ALLOWED_LANGUAGES = [
        'ro' => 'Romanian',
        'en' => 'English',
        'es' => 'Spanish',
        'fr' => 'French',
        'de' => 'German',
        'it' => 'Italian',
        'pt' => 'Portuguese',
    ];

    private const ALLOWED_SLASH_COMMANDS = ['create', 'duplicate', 'align', 'distribute', 'translate', 'summarize', 'find', 'edit'];

    public function __construct(
        private AiService $ai,
        private AiBudgetService $budget,
    ) {}

    /**
     * Legacy `ai.php` compatibility endpoint for the canvas app.
     */
    public function handle(Request $request): JsonResponse
    {
        $action = (string) $request->input('action', '');

        if (! in_array($action, ['translate', 'chat', 'read'], true)) {
            return response()->json(['ok' => false, 'error' => 'Unsupported AI action.'], 400);
        }

        $quotaError = $this->checkEntitlement($action);
        if ($quotaError) {
            return $quotaError;
        }

        try {
            $reservation = $this->budget->reserve(auth()->user(), $action);
        } catch (RuntimeException $exception) {
            return response()->json(['ok' => false, 'error' => $exception->getMessage()], 402);
        }

        try {
            $response = match ($action) {
                'translate' => $this->translate($request),
                'chat' => $this->chat($request),
                'read' => $this->read($request),
            };

            $payload = $response->getData(true);
            if (($payload['ok'] ?? false) === true) {
                $this->budget->finalize(
                    $reservation,
                    (array) ($payload['usage'] ?? []),
                    (array) ($payload['cost'] ?? []),
                );
            } else {
                $this->budget->release($reservation);
            }

            return $response;
        } catch (Throwable $exception) {
            $this->budget->release($reservation);

            throw $exception;
        }
    }

    private function checkEntitlement(string $action): ?JsonResponse
    {
        $user = auth()->user();

        $allowedActions = $user->plan?->ai_actions_allowed ?? [];

        if (! in_array($action, $allowedActions, true)) {
            $labels = ['translate' => 'Translate', 'chat' => 'AI Chat', 'read' => 'Read aloud'];
            $availableLabels = array_map(fn ($a) => $labels[$a] ?? $a, $allowedActions);
            $availableText = $availableLabels === [] ? 'none' : implode(', ', $availableLabels);

            return response()->json([
                'ok' => false,
                'error' => "This AI feature isn't available on your plan. Your plan includes: {$availableText}. Upgrade to Premium to unlock it.",
            ], 402);
        }

        return null;
    }

    private function translate(Request $request): JsonResponse
    {
        $targetLanguageInput = trim((string) $request->input('targetLanguage', ''));
        if ($targetLanguageInput === '' || mb_strlen($targetLanguageInput, 'UTF-8') > 60) {
            return response()->json(['ok' => false, 'error' => 'Invalid target language.'], 422);
        }
        $targetLanguageName = self::ALLOWED_LANGUAGES[strtolower($targetLanguageInput)] ?? $targetLanguageInput;

        $items = [];
        foreach ((array) $request->input('items', []) as $item) {
            if (! is_array($item)) {
                continue;
            }
            $id = trim((string) ($item['id'] ?? ''));
            $text = (string) ($item['text'] ?? '');
            if ($id === '' || trim($text) === '') {
                continue;
            }
            if (strlen($id) > 160 || mb_strlen($text, 'UTF-8') > 5000) {
                continue;
            }
            $items[] = ['id' => $id, 'text' => $text];
        }

        if (count($items) === 0) {
            return response()->json(['ok' => false, 'error' => 'No text to translate.'], 422);
        }

        $result = $this->ai->translate($items, $targetLanguageName);
        if (! ($result['ok'] ?? false)) {
            return response()->json(['ok' => false, 'error' => (string) ($result['error'] ?? 'Translation failed.')], 500);
        }

        return response()->json([
            'ok' => true,
            'items' => $result['items'] ?? [],
            'usage' => $result['usage'] ?? ['inputTokens' => 0, 'outputTokens' => 0],
            'cost' => $result['cost'] ?? $this->emptyCost(),
        ]);
    }

    private function chat(Request $request): JsonResponse
    {
        $message = trim((string) $request->input('message', ''));
        if ($message === '') {
            return response()->json(['ok' => false, 'error' => 'Empty message.'], 422);
        }
        if (mb_strlen($message, 'UTF-8') > 2000) {
            return response()->json(['ok' => false, 'error' => 'Message is too long.'], 422);
        }

        $catalog = [];
        foreach ((array) $request->input('catalog', []) as $entry) {
            if (! is_array($entry)) {
                continue;
            }
            $id = trim((string) ($entry['id'] ?? ''));
            $kind = trim((string) ($entry['kind'] ?? ''));
            if ($id === '' || $kind === '' || strlen($id) > 160) {
                continue;
            }
            $catalog[] = [
                'id' => $id,
                'kind' => $kind,
                'shape' => isset($entry['shape']) && is_string($entry['shape']) ? $entry['shape'] : null,
                'confidence' => isset($entry['confidence']) && is_numeric($entry['confidence']) ? (float) $entry['confidence'] : null,
                'color' => isset($entry['color']) && is_string($entry['color']) ? $entry['color'] : null,
                'text' => isset($entry['text']) && is_string($entry['text']) ? mb_substr($entry['text'], 0, 80, 'UTF-8') : null,
                'bounds' => is_array($entry['bounds'] ?? null) ? $entry['bounds'] : null,
                'approxPosition' => isset($entry['approxPosition']) && is_string($entry['approxPosition']) ? $entry['approxPosition'] : null,
            ];
            if (count($catalog) >= 200) {
                break;
            }
        }

        $slashCommand = trim((string) $request->input('slashCommand', ''));
        if (! in_array($slashCommand, self::ALLOWED_SLASH_COMMANDS, true)) {
            $slashCommand = '';
        }

        $selectedIds = [];
        foreach ((array) $request->input('selectedIds', []) as $id) {
            if (is_string($id) && $id !== '' && strlen($id) <= 160) {
                $selectedIds[] = $id;
            }
            if (count($selectedIds) >= 200) {
                break;
            }
        }

        $pageText = (string) $request->input('pageText', '');
        if (mb_strlen($pageText, 'UTF-8') > 20000) {
            $pageText = mb_substr($pageText, 0, 20000, 'UTF-8');
        }

        $shapeTypes = [];
        foreach ((array) $request->input('shapeTypes', []) as $shapeType) {
            if (is_string($shapeType) && preg_match('/^[a-zA-Z][a-zA-Z0-9]{0,39}$/', $shapeType) === 1) {
                $shapeTypes[] = $shapeType;
            }
            if (count($shapeTypes) >= 60) {
                break;
            }
        }
        $shapeTypes = array_values(array_unique($shapeTypes));

        $infographicTypes = [];
        foreach ((array) $request->input('infographicTypes', []) as $infographicType) {
            if (is_string($infographicType) && preg_match('/^[a-zA-Z][a-zA-Z0-9]{0,39}$/', $infographicType) === 1) {
                $infographicTypes[] = $infographicType;
            }
            if (count($infographicTypes) >= 60) {
                break;
            }
        }
        $infographicTypes = array_values(array_unique($infographicTypes));

        $result = $this->ai->chat($message, $catalog, $slashCommand, $selectedIds, $pageText, $shapeTypes, $infographicTypes);
        if (! ($result['ok'] ?? false)) {
            return response()->json(['ok' => false, 'error' => (string) ($result['error'] ?? 'AI chat failed.')], 500);
        }

        return response()->json([
            'ok' => true,
            'kind' => $result['kind'] ?? 'refuse',
            'message' => $result['message'] ?? '',
            'action' => $result['action'] ?? null,
            'clarifyOptions' => $result['clarifyOptions'] ?? null,
            'usage' => $result['usage'] ?? ['inputTokens' => 0, 'outputTokens' => 0],
            'cost' => $result['cost'] ?? $this->emptyCost(),
        ]);
    }

    private function read(Request $request): JsonResponse
    {
        $image = (string) $request->input('image', '');
        if (! preg_match('/^data:image\/(jpeg|png|jpg);base64,/', $image)) {
            return response()->json(['ok' => false, 'error' => 'Invalid image.'], 422);
        }
        $instruction = trim((string) $request->input('instruction', ''));
        if (strlen($instruction) > 500) {
            $instruction = substr($instruction, 0, 500);
        }

        $result = $this->ai->read($image, $instruction);
        if (! ($result['ok'] ?? false)) {
            return response()->json(['ok' => false, 'error' => (string) ($result['error'] ?? 'Read failed.')], 500);
        }

        return response()->json([
            'ok' => true,
            'data' => $result['data'] ?? [],
            'usage' => $result['usage'] ?? ['inputTokens' => 0, 'outputTokens' => 0],
            'cost' => $result['cost'] ?? $this->emptyCost(),
        ]);
    }

    private function emptyCost(): array
    {
        return ['usd' => 0, 'gbp' => 0, 'inputTokens' => 0, 'outputTokens' => 0, 'model' => ''];
    }
}
