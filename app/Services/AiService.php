<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AiService
{
    public function translate(array $items, string $targetLanguage): array
    {
        $model = (string) config('ai.model');

        $payload = [
            'model' => $model,
            'input' => [
                [
                    'role' => 'system',
                    'content' => 'You translate UI note text. Return only valid JSON with this shape: {"items":[{"id":"same id","text":"translated text"}]}. Preserve line breaks. If text is already in the target language, return it unchanged. Do not add commentary.',
                ],
                [
                    'role' => 'user',
                    'content' => json_encode([
                        'targetLanguage' => $targetLanguage,
                        'items' => $items,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ],
            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => 'translation_response',
                    'strict' => true,
                    'schema' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'properties' => [
                            'items' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'additionalProperties' => false,
                                    'properties' => [
                                        'id' => ['type' => 'string'],
                                        'text' => ['type' => 'string'],
                                    ],
                                    'required' => ['id', 'text'],
                                ],
                            ],
                        ],
                        'required' => ['items'],
                    ],
                ],
            ],
            'max_output_tokens' => 4096,
        ];

        $call = $this->callResponsesApi($payload);
        if (! ($call['ok'] ?? false)) {
            return $call;
        }
        $response = $call['response'];

        $text = $this->extractResponseText($response);
        $decoded = $this->decodeJsonText($text);
        if (! is_array($decoded) || ! isset($decoded['items']) || ! is_array($decoded['items'])) {
            return ['ok' => false, 'error' => 'AI returned translations in an unexpected format.'];
        }

        $translations = [];
        foreach ($decoded['items'] as $item) {
            if (! is_array($item) || ! isset($item['id'], $item['text']) || ! is_string($item['id']) || ! is_string($item['text'])) {
                continue;
            }
            $translations[] = ['id' => $item['id'], 'text' => $item['text']];
        }

        $usage = $this->responseUsage($response);

        return [
            'ok' => true,
            'items' => $translations,
            'usage' => $usage,
            'cost' => $this->responseCost($usage, $model),
        ];
    }

    public function chat(string $userMessage, array $catalog, string $slashCommand = '', array $selectedIds = [], string $pageText = ''): array
    {
        if ($slashCommand === 'summarize') {
            return $this->summarizePage($pageText);
        }

        $model = (string) config('ai.model');

        $systemPrompt = 'You are an assistant embedded in a drawing/notes canvas app. '
            .'Always write the "message" field in English, regardless of what language the user wrote in or what language '
            .'the canvas content is in. '
            .'You will be given a JSON catalog of the elements currently on the active page, the ids of elements currently '
            .'selected on the canvas (if any), an optional slash command the user picked from a menu, and a user message. '
            .'You must only ever reference element ids that appear in the provided catalog - never invent an id. '
            .'If the user has a non-empty selection and their message does not clearly describe different elements, prefer '
            .'the selected ids as targetIds. Otherwise resolve targets from the message text against the catalog. '
            .'If no element matches the user\'s reference, or the request is ambiguous among multiple candidate elements, '
            .'respond with kind "clarify" and list short human-readable disambiguation phrases in clarifyOptions instead of guessing an id. '
            .'Supported actions on existing elements: recolor, delete, move, resize, editText, duplicate, align, distribute, translateText, highlight, calculate. '
            .'Supported action to add new content: create (text, shape, or table) - create does not target existing elements, so targetIds must be an empty array for it. '
            .'move, resize, align and distribute only work reliably on text, table, rectangle, circle and ellipse elements - for other shapes (line, arrow, triangle, rhombus) or raw ink strokes ("ink" kind), prefer recolor, delete, duplicate, answer or refuse instead. '
            .'align requires params.edge to be one of left, center, right, top, middle, bottom, and at least two targetIds. '
            .'distribute requires params.axis to be horizontal or vertical, and at least three targetIds. '
            .'translateText requires params.targetLanguage to be the plain English name of the language the user asked for '
            .'(e.g. "Spanish", "Japanese", "Klingon") - any language is allowed, not just a fixed list - and targetIds of text elements. '
            .'highlight is used for "find" requests: resolve which elements in the catalog match the user\'s criteria and return their ids as targetIds so the app can visually select them; put a short description of what was found in message. '
            .'calculate is used when the user asks to solve, compute, or evaluate a math expression that exists on the canvas as a "formula" kind element (its catalog text field contains the LaTeX source, e.g. "\\frac{3}{4}"). '
            .'Read and evaluate that expression yourself, then set params.text to a short, clear result string (e.g. "3/4 = 0.75") - the app will place this next to the original formula unchanged. targetIds must be the formula element(s) to solve. Do not use calculate on text or table elements. '
            .'create requires params.elementType (text, shape, or table); for text set params.text; for shape set params.shapeType (line, arrow, rectangle, circle, ellipse, triangle, rhombus); for table set params.rows and params.cols. '
            .'If a slashCommand hint is given, strongly prefer producing the corresponding action type unless the message clearly asks for something else, using this mapping: '
            .'create->create, duplicate->duplicate, align->align, distribute->distribute, translate->translateText, summarize->answer (summaries are handled separately and should not reach you), find->highlight, edit->recolor or move or resize or editText (whichever the message describes). '
            .'If the request is something else you cannot do, respond with kind "refuse" and a short explanation. '
            .'If the user is only asking a question about what is on the canvas, respond with kind "answer", put the answer in message, and set action to null. '
            .'The action params object always has these fields: color, dx, dy, width, height, text, row, col, elementType, shapeType, rows, cols, edge, axis, targetLanguage. '
            .'Only fill the fields relevant to the action type and set every other field to null - '
            .'recolor uses color; move uses dx/dy (relative pixel offsets); resize uses width/height (new absolute size); '
            .'editText uses text (and row/col for table cells, 0 for the first row/column); calculate also uses text, but there it holds the result YOU computed, not new input text; delete and duplicate use none of them; '
            .'align uses edge; distribute uses axis; translateText uses targetLanguage; '
            .'create uses elementType plus text/shapeType/rows/cols as relevant to that elementType, and may also set color if the user specified one. '
            .'Whenever you set color (for recolor or for create), it MUST be a 6-digit hex code in the form #rrggbb (e.g. #ff0000 for red, #111827 for near-black) - never a color name, since the app only accepts hex. Pick the closest sensible hex value for any color name the user mentions. '
            .'Keep message short and conversational. Respond only with a JSON object matching the given schema.';

        $payload = [
            'model' => $model,
            'input' => [
                ['role' => 'system', 'content' => $systemPrompt],
                [
                    'role' => 'user',
                    'content' => json_encode([
                        'message' => $userMessage,
                        'catalog' => $catalog,
                        'selectedIds' => $selectedIds,
                        'slashCommand' => $slashCommand !== '' ? $slashCommand : null,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ],
            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => 'chat_response',
                    'strict' => true,
                    'schema' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'properties' => [
                            'kind' => ['type' => 'string', 'enum' => ['answer', 'action', 'clarify', 'refuse']],
                            'message' => ['type' => 'string'],
                            'action' => [
                                'type' => ['object', 'null'],
                                'additionalProperties' => false,
                                'properties' => [
                                    'type' => ['type' => 'string', 'enum' => [
                                        'recolor', 'delete', 'move', 'resize', 'editText',
                                        'create', 'duplicate', 'align', 'distribute', 'translateText', 'highlight', 'calculate',
                                    ]],
                                    'targetIds' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'params' => [
                                        'type' => 'object',
                                        'additionalProperties' => false,
                                        'properties' => [
                                            'color' => ['type' => ['string', 'null']],
                                            'dx' => ['type' => ['number', 'null']],
                                            'dy' => ['type' => ['number', 'null']],
                                            'width' => ['type' => ['number', 'null']],
                                            'height' => ['type' => ['number', 'null']],
                                            'text' => ['type' => ['string', 'null']],
                                            'row' => ['type' => ['number', 'null']],
                                            'col' => ['type' => ['number', 'null']],
                                            'elementType' => ['type' => ['string', 'null'], 'enum' => ['text', 'shape', 'table', null]],
                                            'shapeType' => ['type' => ['string', 'null'], 'enum' => ['line', 'arrow', 'rectangle', 'circle', 'ellipse', 'triangle', 'rhombus', null]],
                                            'rows' => ['type' => ['number', 'null']],
                                            'cols' => ['type' => ['number', 'null']],
                                            'edge' => ['type' => ['string', 'null'], 'enum' => ['left', 'center', 'right', 'top', 'middle', 'bottom', null]],
                                            'axis' => ['type' => ['string', 'null'], 'enum' => ['horizontal', 'vertical', null]],
                                            'targetLanguage' => ['type' => ['string', 'null']],
                                        ],
                                        'required' => ['color', 'dx', 'dy', 'width', 'height', 'text', 'row', 'col', 'elementType', 'shapeType', 'rows', 'cols', 'edge', 'axis', 'targetLanguage'],
                                    ],
                                ],
                                'required' => ['type', 'targetIds', 'params'],
                            ],
                            'clarifyOptions' => ['type' => ['array', 'null'], 'items' => ['type' => 'string']],
                        ],
                        'required' => ['kind', 'message', 'action', 'clarifyOptions'],
                    ],
                ],
            ],
            'temperature' => 0.1,
            'max_output_tokens' => 1024,
        ];

        $call = $this->callResponsesApi($payload);
        if (! ($call['ok'] ?? false)) {
            return $call;
        }
        $response = $call['response'];

        $text = $this->extractResponseText($response);
        $decoded = $this->decodeJsonText($text);
        if (! is_array($decoded) || ! isset($decoded['kind']) || ! isset($decoded['message'])) {
            return ['ok' => false, 'error' => 'AI returned a chat response in an unexpected format.'];
        }

        $allowedKinds = ['answer', 'action', 'clarify', 'refuse'];
        $kind = in_array($decoded['kind'], $allowedKinds, true) ? $decoded['kind'] : 'refuse';
        $message = is_string($decoded['message']) ? $decoded['message'] : '';
        $action = null;
        $catalogIds = array_map(static fn ($entry) => is_array($entry) ? (string) ($entry['id'] ?? '') : '', $catalog);

        if ($kind === 'action' && is_array($decoded['action'] ?? null)) {
            $rawAction = $decoded['action'];
            $type = (string) ($rawAction['type'] ?? '');
            $allowedTypes = [
                'recolor', 'delete', 'move', 'resize', 'editText',
                'create', 'duplicate', 'align', 'distribute', 'translateText', 'highlight', 'calculate',
            ];
            $targetIds = [];
            foreach (($rawAction['targetIds'] ?? []) as $id) {
                if (is_string($id) && in_array($id, $catalogIds, true)) {
                    $targetIds[] = $id;
                }
            }
            $params = is_array($rawAction['params'] ?? null) ? $rawAction['params'] : [];
            $isCreate = $type === 'create';
            $minTargets = $type === 'align' ? 2 : ($type === 'distribute' ? 3 : 1);
            if ($isCreate && in_array(($params['elementType'] ?? null), ['text', 'shape', 'table'], true)) {
                $action = ['type' => $type, 'targetIds' => [], 'params' => $params];
            } elseif (! $isCreate && in_array($type, $allowedTypes, true) && count($targetIds) >= $minTargets) {
                $action = [
                    'type' => $type,
                    'targetIds' => $targetIds,
                    'params' => $params,
                ];
            } else {
                $kind = 'refuse';
                $message = $message !== '' ? $message : 'I could not safely resolve that request to something on the canvas.';
            }
        }

        $clarifyOptions = null;
        if ($kind === 'clarify' && is_array($decoded['clarifyOptions'] ?? null)) {
            $clarifyOptions = array_values(array_filter($decoded['clarifyOptions'], 'is_string'));
        }

        $usage = $this->responseUsage($response);

        return [
            'ok' => true,
            'kind' => $kind,
            'message' => $message,
            'action' => $action,
            'clarifyOptions' => $clarifyOptions,
            'usage' => $usage,
            'cost' => $this->responseCost($usage, $model),
        ];
    }

    public function read(string $imageBase64, string $instruction): array
    {
        $model = (string) config('ai.model');
        $apiKey = trim((string) config('ai.api_key'));
        if ($apiKey === '') {
            return ['ok' => false, 'error' => 'Missing OpenAI API key.'];
        }

        $systemPrompt = 'You are a precise handwriting OCR assistant. '
            .'Your #1 priority, above everything else, is transcription accuracy: read every word, number and symbol '
            .'exactly as handwritten, in the original order, without skipping, paraphrasing, correcting spelling, or guessing '
            .'unclear characters - if genuinely illegible, transcribe your best literal reading rather than omitting it. '
            .'Preserve line breaks and structure exactly as written. '
            .'Once the transcription itself is correct, do one secondary pass: split the transcription, top to bottom, into an '
            .'ordered list of segments, where each segment is plain text ({"type":"text","content":"..."}) or, only for clearly '
            .'mathematical/physics/chemistry notation, a formula ({"type":"formula","latex":"..."}) as valid LaTeX rendered by '
            .'MathJax with the mhchem, braket and cancel packages available. '
            .'Only use "formula" for notation that plain characters cannot represent correctly - fractions, radicals/roots, '
            .'exponents/subscripts, integrals/sums/limits, matrices, vectors ("@@vec{F}"), bra-ket ("@@bra{@@psi}", "@@ket{@@phi}"), '
            .'or chemical equations via @@ce{...} (e.g. "@@ce{2H2 + O2 -> 2H2O}"). '
            .'CRITICAL formatting rule for the "latex" field: the latex value is placed inside a JSON string, and a literal '
            .'backslash character is very error-prone there (it is easy to accidentally produce an invalid escape sequence). '
            .'To avoid this entirely, NEVER write a literal backslash "\\" anywhere in a "latex" value. Instead, write the two '
            .'characters "@@" immediately before every LaTeX command name, exactly where a backslash would normally go '
            .'(e.g. write "@@frac{5}{3}" instead of "\\frac{5}{3}", "@@sqrt{x+1}" instead of "\\sqrt{x+1}", "@@ce{H2O}" instead '
            .'of "\\ce{H2O}"). This "@@" convention applies only inside "latex" values, never inside "text"/"content" values. '
            .'When in doubt whether something is a formula, prefer "text" - a wrong classification is far less harmful than a '
            .'wrong transcription. Simple numbers, single variables, or plain words are always "text", never "formula". '
            .'Do not wrap latex in surrounding $ or $$ delimiters. '
            .'IMPORTANT - a formula is ONE logical unit, never split across multiple segments, even if it visually spans several '
            .'physical rows on the page. A fraction\'s numerator and denominator (stacked above/below a fraction line), a '
            .'multi-row equation, an exponent or subscript written slightly above/below the main line, or a multi-line chemical '
            .'equation, all belong to a SINGLE "formula" segment with one complete latex value (e.g. a handwritten fraction '
            .'drawn across two rows must become one segment {"type":"formula","latex":"@@frac{a}{b}"}, not two separate '
            .'segments for the numerator row and the denominator row). Only start a new segment when the handwriting moves on '
            .'to a genuinely different sentence, formula or exercise, not merely because it occupies another row on the page. '
            .'Each piece of handwriting belongs to exactly one segment - never repeat the same content as both a "text" segment '
            .'and a "formula" segment. If a single row mixes prose and a formula, split it into separate adjacent segments with '
            .'no overlapping content. '
            .'Return ONLY valid JSON with this shape: '
            .'{"segments":[{"type":"text","content":"..."},{"type":"formula","latex":"@@frac{5}{3}"}],"fullText":"..."}. '
            .'fullText must contain the complete literal transcription as plain text (formulas written inline in plain characters, '
            .'using a real backslash there since fullText is not a "latex" field), independent of and at least as accurate as the segments.';

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                [
                    'role' => 'user',
                    'content' => [
                        ['type' => 'text', 'text' => $instruction ?: 'Extract all text from this image.'],
                        ['type' => 'image_url', 'image_url' => ['url' => $imageBase64]],
                    ],
                ],
            ],
            'max_tokens' => 2000,
            'response_format' => ['type' => 'json_object'],
        ];

        try {
            $response = Http::withToken($apiKey)
                ->timeout((int) config('ai.timeout_seconds', 45))
                ->post('https://api.openai.com/v1/chat/completions', $payload);
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'AI request failed: '.$e->getMessage()];
        }

        if ($response->failed()) {
            return ['ok' => false, 'error' => (string) ($response->json('error.message') ?? 'AI request failed.')];
        }

        $body = $response->json();
        $text = $body['choices'][0]['message']['content'] ?? '';
        $decoded = $this->decodeJsonText($text);
        if (! is_array($decoded)) {
            return ['ok' => false, 'error' => 'AI returned an unexpected format.'];
        }

        if (isset($decoded['segments']) && is_array($decoded['segments'])) {
            foreach ($decoded['segments'] as &$segment) {
                if (is_array($segment) && isset($segment['latex']) && is_string($segment['latex'])) {
                    $segment['latex'] = str_replace('@@', '\\', $segment['latex']);
                }
            }
            unset($segment);
        }

        $usage = [
            'inputTokens' => (int) ($body['usage']['prompt_tokens'] ?? 0),
            'outputTokens' => (int) ($body['usage']['completion_tokens'] ?? 0),
        ];

        return [
            'ok' => true,
            'data' => $decoded,
            'usage' => $usage,
            'cost' => $this->responseCost($usage, $model),
        ];
    }

    private function summarizePage(string $pageText): array
    {
        $model = (string) config('ai.model');

        if (trim($pageText) === '') {
            $usage = ['inputTokens' => 0, 'outputTokens' => 0];

            return [
                'ok' => true,
                'kind' => 'answer',
                'message' => 'There is no text on this page to summarize.',
                'action' => null,
                'clarifyOptions' => null,
                'usage' => $usage,
                'cost' => $this->responseCost($usage, $model),
            ];
        }

        $payload = [
            'model' => $model,
            'input' => [
                [
                    'role' => 'system',
                    'content' => 'You summarize the text content of a notes/drawing page. Reply with a short, clear '
                        .'summary (a few sentences or bullet points), always written in English regardless of the '
                        .'source text language. Return only valid JSON matching the schema.',
                ],
                [
                    'role' => 'user',
                    'content' => json_encode(['pageText' => $pageText], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ],
            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => 'summary_response',
                    'strict' => true,
                    'schema' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'properties' => [
                            'summary' => ['type' => 'string'],
                        ],
                        'required' => ['summary'],
                    ],
                ],
            ],
            'temperature' => 0.2,
            'max_output_tokens' => 700,
        ];

        $call = $this->callResponsesApi($payload);
        if (! ($call['ok'] ?? false)) {
            return $call;
        }
        $response = $call['response'];
        $text = $this->extractResponseText($response);
        $decoded = $this->decodeJsonText($text);
        $summary = is_array($decoded) && isset($decoded['summary']) && is_string($decoded['summary']) ? $decoded['summary'] : '';
        if ($summary === '') {
            return ['ok' => false, 'error' => 'AI returned a summary in an unexpected format.'];
        }

        $usage = $this->responseUsage($response);

        return [
            'ok' => true,
            'kind' => 'answer',
            'message' => $summary,
            'action' => null,
            'clarifyOptions' => null,
            'usage' => $usage,
            'cost' => $this->responseCost($usage, $model),
        ];
    }

    private function callResponsesApi(array $payload): array
    {
        $apiKey = trim((string) config('ai.api_key'));
        if ($apiKey === '') {
            return ['ok' => false, 'error' => 'Missing OpenAI API key. Add it to OPENAI_API_KEY in .env.'];
        }

        try {
            $response = Http::withToken($apiKey)
                ->timeout((int) config('ai.timeout_seconds', 45))
                ->post('https://api.openai.com/v1/responses', $payload);
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'AI request failed: '.$e->getMessage()];
        }

        if ($response->failed()) {
            return ['ok' => false, 'error' => (string) ($response->json('error.message') ?? 'AI request failed.')];
        }

        return ['ok' => true, 'response' => $response->json()];
    }

    private function extractResponseText(array $response): string
    {
        if (isset($response['output_text']) && is_string($response['output_text'])) {
            return trim($response['output_text']);
        }

        $parts = [];
        foreach (($response['output'] ?? []) as $output) {
            foreach (($output['content'] ?? []) as $content) {
                if (isset($content['text']) && is_string($content['text'])) {
                    $parts[] = $content['text'];
                }
            }
        }

        return trim(implode("\n", $parts));
    }

    private function decodeJsonText(string $text): ?array
    {
        $text = trim($text);
        if (preg_match('/^```(?:json)?\s*(.*?)\s*```$/s', $text, $fenced)) {
            $text = trim($fenced[1]);
        }

        $decoded = json_decode($text, true);
        if (is_array($decoded)) {
            if ($this->arrayIsList($decoded)) {
                return ['items' => $decoded];
            }
            if (! isset($decoded['items']) && isset($decoded['translations']) && is_array($decoded['translations'])) {
                return ['items' => $decoded['translations']];
            }

            return $decoded;
        }

        if (preg_match('/\{.*\}/s', $text, $match)) {
            $decoded = json_decode($match[0], true);

            return is_array($decoded) ? $decoded : null;
        }

        return null;
    }

    private function arrayIsList(array $value): bool
    {
        return array_keys($value) === range(0, count($value) - 1);
    }

    private function responseUsage(array $response): array
    {
        $usage = is_array($response['usage'] ?? null) ? $response['usage'] : [];

        return [
            'inputTokens' => max(0, (int) ($usage['input_tokens'] ?? 0)),
            'outputTokens' => max(0, (int) ($usage['output_tokens'] ?? 0)),
        ];
    }

    private function responseCost(array $usage, string $model): array
    {
        $pricing = is_array(config("ai.pricing.{$model}")) ? config("ai.pricing.{$model}") : [];
        $inputPrice = max(0.0, (float) ($pricing['input_per_1m_usd'] ?? 0));
        $outputPrice = max(0.0, (float) ($pricing['output_per_1m_usd'] ?? 0));
        $usdToGbp = max(0.0, (float) config('ai.usd_to_gbp', 0.75));
        $inputTokens = max(0, (int) ($usage['inputTokens'] ?? 0));
        $outputTokens = max(0, (int) ($usage['outputTokens'] ?? 0));
        $usd = (($inputTokens / 1_000_000) * $inputPrice) + (($outputTokens / 1_000_000) * $outputPrice);

        return [
            'usd' => $usd,
            'gbp' => $usd * $usdToGbp,
            'inputTokens' => $inputTokens,
            'outputTokens' => $outputTokens,
            'model' => $model,
        ];
    }
}
