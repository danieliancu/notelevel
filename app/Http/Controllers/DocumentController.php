<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use App\Services\DocumentManager;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DocumentController extends Controller
{
    public function __construct(private DocumentManager $documents) {}

    public function index(Request $request)
    {
        $perPage = min(100, max(1, $request->integer('per_page', 50)));

        return response()->json(Document::with('folder')->orderByDesc('updated_at')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $title = NameSanitizer::name((string) $request->input('title', ''), 'untitled');
        $folderId = $this->resolveFolderId($request->input('folder_id'));

        if (Document::where('title', $title)->where('folder_id', $folderId)->exists()) {
            throw ValidationException::withMessages(['title' => 'A document with that name already exists.']);
        }

        $document = Document::create([
            'title' => $title,
            'folder_id' => $folderId,
            'content' => $request->input('content'),
            'guide_mode' => $request->input('guideMode', 'none'),
            'guides_visible' => $request->boolean('guidesVisible'),
            'page_background_color' => $request->input('pageBackgroundColor', '#ffffff'),
            'page_count' => (int) $request->input('page_count', 0),
        ]);

        return response()->json($document, 201);
    }

    public function update(Request $request, Document $document)
    {
        $document->update([
            'content' => $request->input('content', $document->content),
            'guide_mode' => $request->input('guideMode', $document->guide_mode),
            'guides_visible' => $request->boolean('guidesVisible', $document->guides_visible),
            'page_background_color' => $request->input('pageBackgroundColor', $document->page_background_color),
            'page_count' => (int) $request->input('page_count', $document->page_count),
            'version' => DB::raw('version + 1'),
        ]);

        return response()->json($document->refresh());
    }

    public function destroy(Document $document)
    {
        $this->documents->delete($document);

        return response()->json(['ok' => true]);
    }

    public function rename(Request $request, Document $document)
    {
        return response()->json($this->documents->rename($document, (string) $request->input('title', '')));
    }

    public function duplicate(Document $document)
    {
        return response()->json($this->documents->duplicate($document), 201);
    }

    public function move(Request $request, Document $document)
    {
        $folderId = $request->filled('folder_id') ? (int) $request->input('folder_id') : null;

        return response()->json($this->documents->move($document, $folderId));
    }

    /**
     * Thin autosave endpoint: query-builder only, optimistic concurrency via `version`.
     * POST-only so the client can send it via navigator.sendBeacon (no PATCH/custom headers support).
     */
    public function autosave(Request $request, Document $document)
    {
        $request->validate([
            'request_id' => ['required', 'uuid'],
            'version' => ['required', 'integer', 'min:1'],
            'content' => ['nullable', 'array'],
            'page_count' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'guideMode' => ['nullable', 'in:none,lined,grid,dotted'],
            'pageBackgroundColor' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        $version = $request->integer('version');
        $requestId = (string) $request->input('request_id');
        $payloadHash = hash('sha256', json_encode([
            'content' => $request->input('content'),
            'page_count' => $request->input('page_count', $document->page_count),
            'guideMode' => $request->input('guideMode', $document->guide_mode),
            'guidesVisible' => $request->boolean('guidesVisible', $document->guides_visible),
            'pageBackgroundColor' => $request->input('pageBackgroundColor', $document->page_background_color),
        ], JSON_THROW_ON_ERROR));

        if ($document->last_autosave_key === $requestId) {
            if (! hash_equals((string) $document->last_autosave_hash, $payloadHash)) {
                return response()->json([
                    'ok' => false,
                    'error' => 'idempotency_key_reused',
                ], 422);
            }

            return response()->json([
                'ok' => true,
                'version' => $document->last_autosave_version,
                'savedAt' => $document->updated_at?->toIso8601String(),
                'idempotentReplay' => true,
            ]);
        }

        $updated = DB::table('documents')
            ->where('id', $document->id)
            ->where('user_id', auth()->id())
            ->where('version', $version)
            ->update([
                'content' => $request->input('content'),
                'page_count' => (int) $request->input('page_count', $document->page_count),
                'guide_mode' => $request->input('guideMode', $document->guide_mode),
                'guides_visible' => $request->boolean('guidesVisible', $document->guides_visible),
                'page_background_color' => $request->input('pageBackgroundColor', $document->page_background_color),
                'version' => DB::raw('version + 1'),
                'last_autosave_key' => $requestId,
                'last_autosave_version' => $version + 1,
                'last_autosave_hash' => $payloadHash,
                'updated_at' => now(),
            ]);

        if ($updated === 0) {
            $current = DB::table('documents')
                ->where('id', $document->id)
                ->where('user_id', auth()->id())
                ->first();

            if (! $current) {
                abort(404);
            }

            return response()->json([
                'ok' => false,
                'error' => 'version_conflict',
                'currentVersion' => $current->version,
                'currentContent' => json_decode($current->content, true),
                'retryable' => false,
            ], 409);
        }

        return response()->json([
            'ok' => true,
            'version' => $version + 1,
            'savedAt' => now()->toIso8601String(),
            'idempotentReplay' => false,
        ]);
    }

    private function resolveFolderId(?string $folderId): ?int
    {
        if (empty($folderId)) {
            return null;
        }

        return Folder::findOrFail($folderId)->id;
    }
}
