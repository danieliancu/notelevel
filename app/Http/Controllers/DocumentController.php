<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use App\Services\DocumentManager;
use App\Services\PdfPageImportReconciler;
use App\Services\PlanQuotaService;
use App\Services\TenantStorageTransaction;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function __construct(
        private DocumentManager $documents,
        private TenantStorageTransaction $storageTransaction,
        private PlanQuotaService $quotas,
        private PdfPageImportReconciler $pdfPageImports,
    ) {}

    public function index(Request $request)
    {
        $perPage = min(100, max(1, $request->integer('per_page', 50)));

        return response()->json(Document::with('folder')->orderByDesc('updated_at')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $title = NameSanitizer::name((string) $request->input('title', ''), 'untitled');
        $folderId = $this->resolveFolderId($request->input('folder_id'));

        // Stage 3 of the autosave migration (see AUDIT.md "Migrare autosave"):
        // canvas.js's "Save As" flow only knows a folder by name (like the legacy
        // /canvas/api dispatcher did), not by id, and needs the exact-same
        // create-if-missing + overwrite-confirm UX. Both are additive/optional so
        // any other caller using bare `folder_id` keeps working unchanged.
        if ($folderId === null && $request->filled('folder')) {
            $folderName = NameSanitizer::name((string) $request->input('folder'), 'folder');
            $folderId = Folder::firstOrCreate(['name' => $folderName])->id;
        }

        $existing = Document::where('title', $title)->where('folder_id', $folderId)->first();
        if ($existing) {
            if (! $request->boolean('overwrite')) {
                return response()->json([
                    'ok' => false,
                    'exists' => true,
                    'error' => 'A document with that name already exists.',
                ], 409);
            }

            $existing->update([
                'content' => $request->input('content'),
                'guide_mode' => $request->input('guideMode', 'none'),
                'guides_visible' => $request->boolean('guidesVisible'),
                'page_background_color' => $request->input('pageBackgroundColor', '#ffffff'),
                'page_count' => (int) $request->input('page_count', 0),
                'version' => DB::raw('version + 1'),
            ]);
            $existing->refresh();

            $this->pdfPageImports->reconcile($existing, $request->input('content'));

            return response()->json($existing);
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

        $this->pdfPageImports->reconcile($document, $request->input('content'));

        return response()->json($document, 201);
    }

    public function update(Request $request, Document $document)
    {
        $content = $request->input('content', $document->content);

        $document->update([
            'content' => $content,
            'guide_mode' => $request->input('guideMode', $document->guide_mode),
            'guides_visible' => $request->boolean('guidesVisible', $document->guides_visible),
            'page_background_color' => $request->input('pageBackgroundColor', $document->page_background_color),
            'page_count' => (int) $request->input('page_count', $document->page_count),
            'version' => DB::raw('version + 1'),
        ]);
        $document->refresh();

        $this->pdfPageImports->reconcile($document, $content);

        return response()->json($document);
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
                // Etapa 4 monitoring (AUDIT.md "Migrare autosave"): a legitimate
                // client never reuses a request_id for different content, so this
                // is either a client bug or a request replayed after a crash mid
                // in-flight-edit. Worth an operator-visible signal either way.
                Log::warning('canvas.autosave_idempotency_key_reused', [
                    'document_id' => $document->id,
                    'user_id' => auth()->id(),
                ]);

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

            // Etapa 4 monitoring (AUDIT.md "Migrare autosave"): version conflicts
            // are a normal HTTP response, not an exception, so nothing else logs
            // them today. A sustained high rate here is exactly the "bake period"
            // signal the migration plan calls for before further rollout decisions.
            Log::warning('canvas.autosave_version_conflict', [
                'document_id' => $document->id,
                'user_id' => auth()->id(),
                'client_version' => $version,
                'current_version' => $current->version,
            ]);

            return response()->json([
                'ok' => false,
                'error' => 'version_conflict',
                'currentVersion' => $current->version,
                'currentContent' => json_decode($current->content, true),
                'retryable' => false,
            ], 409);
        }

        $this->pdfPageImports->reconcile($document, $request->input('content'));

        return response()->json([
            'ok' => true,
            'version' => $version + 1,
            'savedAt' => now()->toIso8601String(),
            'idempotentReplay' => false,
        ]);
    }

    /**
     * Sibling to autosave(): persists page raster images (JPEG) separately from
     * the JSON `content`, so the sendBeacon-sized autosave body never carries
     * base64 image payloads. Mirrors the legacy CanvasApiController::save()
     * storage convention exactly (`{userId}/documents/{documentId}/pages/{n}.jpg`
     * on the `tenants` disk) so the existing page_image read action and
     * thumbnail/gallery code keep working unmodified regardless of which save
     * path wrote the file.
     *
     * This is a partial update: only pages present in the request are touched.
     * Since TenantStorageTransaction::replaceDirectory() swaps the whole
     * directory atomically, untouched existing pages are read back and
     * merged into the write set first, so they aren't dropped.
     */
    public function savePages(Request $request, Document $document)
    {
        $request->validate([
            'pages' => ['required', 'array', 'min:1'],
            'pages.*.page' => ['required', 'integer', 'min:1'],
            'pages.*.image' => ['required', 'string'],
        ]);

        $incoming = [];
        foreach ($request->input('pages') as $page) {
            $number = (int) ($page['page'] ?? 0);
            $image = (string) ($page['image'] ?? '');
            if ($number < 1 || ! preg_match('/^data:image\/jpeg;base64,/', $image)) {
                continue;
            }
            $binary = base64_decode(substr($image, strpos($image, ',') + 1), true);
            if ($binary === false || $binary === '') {
                continue;
            }
            $incoming[$number] = $binary;
        }

        if (count($incoming) === 0) {
            return response()->json(['ok' => false, 'error' => 'No valid page images were provided.'], 422);
        }

        $baseDir = auth()->id().'/documents/'.$document->id.'/pages';
        $disk = Storage::disk('tenants');

        // Two overlapping saves for the same document (a manual save racing an
        // autosave, or a client retry firing while the original request is
        // still in flight) previously had no protection: each request reads
        // the existing-files snapshot independently, and whichever finishes
        // last silently overwrites the whole directory with its own stale
        // snapshot, dropping pages the other request had just written — with
        // no exception anywhere. A DB row lock (rather than Cache::lock)
        // serializes writes per document without depending on which cache
        // driver is configured.
        return DB::transaction(function () use ($document, $disk, $baseDir, $incoming) {
            Document::where('id', $document->id)->lockForUpdate()->first();

            $pageFiles = [];
            if ($disk->directoryExists($baseDir)) {
                foreach ($disk->files($baseDir) as $existingFile) {
                    $filename = basename($existingFile);
                    $existingNumber = (int) pathinfo($filename, PATHINFO_FILENAME);
                    if (! isset($incoming[$existingNumber])) {
                        $pageFiles[$filename] = $disk->get($existingFile);
                    }
                }
            }
            foreach ($incoming as $number => $binary) {
                $pageFiles[$number.'.jpg'] = $binary;
            }

            $currentTotalExcludingDocument = Document::where('id', '!=', $document->id)->sum('page_count');
            if ($this->quotas->canvasPagesCapExceeded(auth()->user(), $currentTotalExcludingDocument, count($pageFiles))) {
                // Etapa 4 monitoring (AUDIT.md "Migrare autosave"): another silent
                // business response worth a signal — actual storage write failures
                // already reach Log/OperationalAlert via the default exception handler.
                Log::info('canvas.autosave_pages_quota_exceeded', [
                    'document_id' => $document->id,
                    'user_id' => auth()->id(),
                ]);

                return response()->json([
                    'ok' => false,
                    'error' => 'You have reached your plan\'s page limit. Upgrade to Premium for unlimited pages.',
                ], 402);
            }

            $pageNumbers = array_map(
                fn (string $filename) => (int) pathinfo($filename, PATHINFO_FILENAME),
                array_keys($pageFiles),
            );
            sort($pageNumbers);

            $this->storageTransaction->replaceDirectory($baseDir, $pageFiles, function () use ($document, $pageNumbers) {
                $document->page_count = count($pageNumbers);
                $document->save();

                return $document;
            });

            return response()->json(['ok' => true, 'pages' => $pageNumbers]);
        });
    }

    private function resolveFolderId(?string $folderId): ?int
    {
        if (empty($folderId)) {
            return null;
        }

        return Folder::findOrFail($folderId)->id;
    }
}
