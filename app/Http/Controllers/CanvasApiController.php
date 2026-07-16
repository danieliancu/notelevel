<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Favourite;
use App\Models\Folder;
use App\Models\Pdf;
use App\Models\PdfFolder;
use App\Models\PdfPageImport;
use App\Services\DocumentManager;
use App\Services\PdfPageImportReconciler;
use App\Services\PlanQuotaService;
use App\Services\TenantStorageTransaction;
use App\Support\DocumentPayloadRules;
use App\Support\NameSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

/**
 * Legacy `index.php?action=X` compatibility endpoint for the canvas app.
 *
 * This mirrors the network contract that resources/js/canvas.js (a verbatim
 * extraction of the old monolithic index.php inline script) still expects,
 * but backs it with the tenant-scoped Eloquent models instead of the old
 * flat `save/` directory. It intentionally duplicates some of what
 * DocumentController/FolderController/PdfController/PdfFolderController/
 * FavouriteController already do, because those controllers expose a
 * different (newer) response shape for a separate API surface.
 */
class CanvasApiController extends Controller
{
    private const READ_ACTIONS = [
        'list',
        'list_pdfs',
        'list_favourites',
        'get_document',
        'page_image',
        'pdf_file',
        'favourite_file',
    ];

    public function __construct(
        private TenantStorageTransaction $storageTransaction,
        private PlanQuotaService $quotas,
        private DocumentManager $documents,
        private PdfPageImportReconciler $pdfPageImports,
    ) {}

    public function handleRead(Request $request): mixed
    {
        $action = (string) $request->query('action', '');

        if (! in_array($action, self::READ_ACTIONS, true)) {
            return response()->json([
                'ok' => false,
                'error' => 'This action requires a CSRF-protected POST request.',
            ], 405)->header('Allow', 'POST');
        }

        return $this->handle($request);
    }

    public function handle(Request $request): mixed
    {
        $action = (string) $request->input('action', '');

        return match ($action) {
            'list' => $this->list($request),
            'save' => $this->save($request),
            'delete' => $this->deleteDocument($request),
            'rename' => $this->renameDocument($request),
            'duplicate' => $this->duplicateDocument($request),
            'move_document' => $this->moveDocument($request),
            'create_folder' => $this->createFolder($request),
            'rename_folder' => $this->renameFolder($request),
            'delete_folder' => $this->deleteFolder($request),
            'upload_pdf' => $this->uploadPdf($request),
            'list_pdfs' => $this->listPdfs($request),
            'update_pdf_page_order' => $this->updatePdfPageOrder($request),
            'delete_pdf' => $this->deletePdf($request),
            'create_pdf_folder' => $this->createPdfFolder($request),
            'delete_pdf_folder' => $this->deletePdfFolder($request),
            'upload_favourite' => $this->uploadFavourite($request),
            'list_favourites' => $this->listFavourites($request),
            'delete_favourite' => $this->deleteFavourite($request),
            'get_document' => $this->getDocument($request),
            'page_image' => $this->pageImage($request),
            'pdf_file' => $this->pdfFile($request),
            'favourite_file' => $this->favouriteFile($request),
            'lock_pdf_page' => $this->lockPdfPage($request),
            'unlock_pdf_page' => $this->unlockPdfPage($request),
            default => response()->json(['ok' => false, 'error' => 'Unknown action.'], 400),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Documents / folders
    |--------------------------------------------------------------------------
    */

    private function list(Request $request): JsonResponse
    {
        [$offset, $limit] = $this->pagination($request);
        $documents = Document::orderByDesc('updated_at')->with('folder')->skip($offset)->take($limit + 1)->get();
        $hasMore = $documents->count() > $limit;
        $documents = $documents->take($limit);

        $disk = Storage::disk('tenants');

        $files = $documents->map(function (Document $document) use ($disk) {
            $folderName = $document->folder?->name ?? '';
            $ref = $this->ref($folderName, $document->title);
            $pages = $this->pageNumbersFor($document);
            $pageUrls = [];
            foreach ($pages as $pageNumber) {
                // Only advertise a page_image URL when the file genuinely
                // exists — otherwise the client (thumbnail <img>, or
                // loadDocument()) requests a URL that's guaranteed to 404.
                $path = $document->user_id.'/documents/'.$document->id.'/pages/'.$pageNumber.'.jpg';
                if ($disk->exists($path)) {
                    $pageUrls[(string) $pageNumber] = "/canvas/api?action=page_image&id={$document->id}&page={$pageNumber}";
                }
            }

            $firstPageUrl = null;
            foreach ($pages as $pageNumber) {
                if (isset($pageUrls[(string) $pageNumber])) {
                    $firstPageUrl = $pageUrls[(string) $pageNumber];
                    break;
                }
            }

            return [
                'name' => $ref,
                'folder' => $folderName,
                'url' => $firstPageUrl ?? '',
                'pages' => $pages,
                'pageUrls' => $pageUrls,
                'documentUrl' => "/canvas/api?action=get_document&id={$document->id}",
                'modified' => $document->updated_at?->getTimestampMs() ?? 0,
                'metadata' => [
                    'guideMode' => $document->guide_mode,
                    'guidesVisible' => (bool) $document->guides_visible,
                    'pageBackgroundColor' => $document->page_background_color,
                    'pages' => $pages,
                ],
            ];
        })->values();

        $folders = Folder::withCount('documents')->orderBy('name')->get()->map(function (Folder $folder) {
            return [
                'name' => $folder->name,
                'count' => $folder->documents_count,
                'modified' => $folder->updated_at?->getTimestampMs() ?? 0,
            ];
        })->values();

        return response()->json([
            'ok' => true,
            'files' => $files,
            'folders' => $folders,
            'nextCursor' => $hasMore ? $offset + $limit : null,
        ]);
    }

    private function save(Request $request): JsonResponse
    {
        $filenameRaw = (string) $request->input('filename', '');
        [$folderName, $title] = $this->splitRef($filenameRaw);
        $title = NameSanitizer::name($title, 'untitled');
        $overwrite = $this->truthy($request->input('overwrite'));

        $folder = null;
        if ($folderName !== '') {
            $folderName = NameSanitizer::name($folderName, 'folder');
            $folder = Folder::firstOrCreate(['name' => $folderName]);
        }
        $folderId = $folder?->id;

        $pages = json_decode((string) $request->input('pages', '[]'), true);
        if (! is_array($pages) || count($pages) === 0) {
            return response()->json(['ok' => false, 'error' => 'There are no written pages to save.'], 422);
        }

        $documentJson = (string) $request->input('document', '');
        $documentData = $documentJson !== '' ? json_decode($documentJson, true) : null;

        // Same bounds as the REST DocumentController surface (AUDIT.md VAL-01 /
        // API-01): `document`/`content` arrives here as a hand-decoded JSON
        // string rather than a native request field, so it can't go through
        // $request->validate() directly.
        $contentValidator = Validator::make(
            ['content' => $documentData],
            ['content' => DocumentPayloadRules::content()],
        );
        if ($contentValidator->fails()) {
            return response()->json(['ok' => false, 'error' => $contentValidator->errors()->first('content')], 422);
        }

        $existing = Document::where('title', $title)->where('folder_id', $folderId)->first();
        if ($existing && ! $overwrite) {
            return response()->json([
                'ok' => false,
                'exists' => true,
                'file' => $this->ref($folderName, $title),
                'error' => 'A document with this name already exists.',
            ], 409);
        }

        $validPages = [];
        foreach ($pages as $page) {
            $number = (int) ($page['page'] ?? 0);
            $image = (string) ($page['image'] ?? '');
            if ($number < 1 || ! preg_match('/^data:image\/jpeg;base64,/', $image)) {
                continue;
            }
            if (strlen($image) > DocumentPayloadRules::MAX_PAGE_IMAGE_BASE64_LENGTH) {
                continue;
            }
            $binary = base64_decode(substr($image, strpos($image, ',') + 1), true);
            if ($binary === false || $binary === '') {
                continue;
            }
            $validPages[$number] = $binary;
        }

        if (count($validPages) === 0) {
            return response()->json(['ok' => false, 'error' => 'There are no written pages to save.'], 422);
        }

        ksort($validPages);
        $pageNumbers = array_keys($validPages);

        $quotaError = $this->checkCanvasPagesQuota($existing, count($pageNumbers));
        if ($quotaError) {
            return $quotaError;
        }

        $guideMode = $this->safeGuideMode((string) $request->input('guideMode', 'none'));
        $guidesVisible = $this->truthy($request->input('guidesVisible'));
        $pageBackgroundColor = $this->safeHexColor((string) $request->input('pageBackgroundColor', '#ffffff'));

        $document = $existing ?? new Document;
        $wasNew = ! $document->exists;
        $pageFiles = [];
        foreach ($validPages as $number => $binary) {
            $pageFiles[$number.'.jpg'] = $binary;
        }

        if ($wasNew) {
            DB::beginTransaction();
            $document->title = $title;
            $document->folder_id = $folderId;
            $document->content = is_array($documentData) ? $documentData : null;
            $document->guide_mode = $guideMode;
            $document->guides_visible = $guidesVisible;
            $document->page_background_color = $pageBackgroundColor;
            $document->page_count = count($pageNumbers);
            $document->version = 1;
            $document->save();
        }

        $baseDir = auth()->id().'/documents/'.$document->id.'/pages';

        try {
            // Row lock serializes this write against any other concurrent save
            // for the same document — see the comment on
            // DocumentController::savePages() for the race this closes.
            DB::transaction(function () use (
                $baseDir,
                $pageFiles,
                $document,
                $wasNew,
                $title,
                $folderId,
                $documentData,
                $guideMode,
                $guidesVisible,
                $pageBackgroundColor,
                $pageNumbers,
            ) {
                Document::where('id', $document->id)->lockForUpdate()->first();

                $this->storageTransaction->replaceDirectory($baseDir, $pageFiles, function () use (
                    $document,
                    $wasNew,
                    $title,
                    $folderId,
                    $documentData,
                    $guideMode,
                    $guidesVisible,
                    $pageBackgroundColor,
                    $pageNumbers,
                ) {
                    $document->title = $title;
                    $document->folder_id = $folderId;
                    $document->content = is_array($documentData) ? $documentData : null;
                    $document->guide_mode = $guideMode;
                    $document->guides_visible = $guidesVisible;
                    $document->page_background_color = $pageBackgroundColor;
                    $document->page_count = count($pageNumbers);
                    $document->version = $wasNew ? 1 : ((int) $document->version + 1);
                    $document->save();

                    return $document;
                });
            });

            if ($wasNew) {
                DB::commit();
            }
        } catch (Throwable $exception) {
            if ($wasNew && DB::transactionLevel() > 0) {
                DB::rollBack();
            }

            throw $exception;
        }

        $this->pdfPageImports->reconcile($document, is_array($documentData) ? $documentData : null);

        return response()->json([
            'ok' => true,
            'file' => $this->ref($folderName, $title),
            // Additive fields for the REST-autosave migration (see AUDIT.md
            // "Migrare autosave"): the client previously had no way to learn
            // a document's numeric id/version when saved via this legacy action.
            'id' => $document->id,
            'version' => $document->version,
            'metadata' => [
                'guideMode' => $guideMode,
                'guidesVisible' => $guidesVisible,
                'pageBackgroundColor' => $pageBackgroundColor,
                'pages' => $pageNumbers,
            ],
        ]);
    }

    private function deleteDocument(Request $request): JsonResponse
    {
        $document = $this->findDocumentByRef((string) $request->input('filename', ''));
        if (! $document) {
            return response()->json(['ok' => false, 'error' => 'The document no longer exists.'], 404);
        }

        $ref = $this->refForDocument($document);
        $this->documents->delete($document);

        return response()->json(['ok' => true, 'file' => $ref]);
    }

    private function renameDocument(Request $request): JsonResponse
    {
        $document = $this->findDocumentByRef((string) $request->input('filename', ''));
        if (! $document) {
            return response()->json(['ok' => false, 'error' => 'The document no longer exists.'], 404);
        }

        $oldRef = $this->refForDocument($document);
        $newTitle = NameSanitizer::name((string) $request->input('newFilename', ''), 'untitled');

        if ($document->title === $newTitle) {
            return response()->json(['ok' => true, 'file' => $oldRef]);
        }

        try {
            $this->documents->rename($document, $newTitle);
        } catch (ValidationException) {
            return response()->json(['ok' => false, 'exists' => true, 'error' => 'A document with this name already exists.'], 409);
        }

        return response()->json(['ok' => true, 'file' => $this->refForDocument($document), 'oldFile' => $oldRef]);
    }

    private function duplicateDocument(Request $request): JsonResponse
    {
        $document = $this->findDocumentByRef((string) $request->input('filename', ''));
        if (! $document) {
            return response()->json(['ok' => false, 'error' => 'The document no longer exists.'], 404);
        }

        $sourceRef = $this->refForDocument($document);
        $copy = $this->documents->duplicate($document);

        return response()->json(['ok' => true, 'file' => $this->refForDocument($copy), 'sourceFile' => $sourceRef]);
    }

    private function moveDocument(Request $request): JsonResponse
    {
        $document = $this->findDocumentByRef((string) $request->input('filename', ''));
        if (! $document) {
            return response()->json(['ok' => false, 'error' => 'The document no longer exists.'], 404);
        }

        $oldRef = $this->refForDocument($document);
        $targetFolderName = trim((string) $request->input('folder', ''));
        $folder = null;
        if ($targetFolderName !== '') {
            $targetFolderName = NameSanitizer::name($targetFolderName, 'folder');
            $folder = Folder::firstOrCreate(['name' => $targetFolderName]);
        }
        $targetFolderId = $folder?->id;

        if ($document->folder_id === $targetFolderId) {
            return response()->json(['ok' => true, 'file' => $oldRef, 'oldFile' => $oldRef]);
        }

        try {
            $this->documents->move($document, $targetFolderId);
        } catch (ValidationException) {
            return response()->json(['ok' => false, 'exists' => true, 'error' => 'A document with this name already exists there.'], 409);
        }

        return response()->json(['ok' => true, 'file' => $this->refForDocument($document), 'oldFile' => $oldRef]);
    }

    private function createFolder(Request $request): JsonResponse
    {
        $name = NameSanitizer::name((string) $request->input('folder', ''), 'folder');

        if (Folder::where('name', $name)->exists()) {
            return response()->json(['ok' => false, 'exists' => true, 'error' => 'A folder with this name already exists.'], 409);
        }

        Folder::create(['name' => $name]);

        return response()->json(['ok' => true, 'folder' => $name]);
    }

    private function renameFolder(Request $request): JsonResponse
    {
        $name = NameSanitizer::name((string) $request->input('folder', ''), 'folder');
        $newName = NameSanitizer::name((string) $request->input('newFolder', ''), 'folder');

        $folder = Folder::where('name', $name)->first();
        if (! $folder) {
            return response()->json(['ok' => false, 'error' => 'The folder no longer exists.'], 404);
        }

        if (Folder::where('name', $newName)->where('id', '!=', $folder->id)->exists()) {
            return response()->json(['ok' => false, 'exists' => true, 'error' => 'A folder with this name already exists.'], 409);
        }

        $folder->update(['name' => $newName]);

        return response()->json(['ok' => true, 'folder' => $newName, 'oldFolder' => $name]);
    }

    private function deleteFolder(Request $request): JsonResponse
    {
        $name = NameSanitizer::name((string) $request->input('folder', ''), 'folder');
        $folder = Folder::where('name', $name)->first();
        if (! $folder) {
            return response()->json(['ok' => false, 'error' => 'The folder no longer exists.'], 404);
        }

        $directories = $folder->documents
            ->map(fn (Document $document) => auth()->id().'/documents/'.$document->id)
            ->all();

        $this->storageTransaction->deleteDirectories($directories, function () use ($folder) {
            $folder->documents()->delete();

            return $folder->delete();
        });

        return response()->json(['ok' => true, 'folder' => $name]);
    }

    /*
    |--------------------------------------------------------------------------
    | PDF library
    |--------------------------------------------------------------------------
    */

    private function uploadPdf(Request $request): JsonResponse
    {
        $upload = $request->file('pdf');
        if (! $upload) {
            return response()->json(['ok' => false, 'error' => 'No PDF file was received.'], 422);
        }

        try {
            $request->validate([
                'pdf' => $this->quotas->pdfRules(auth()->user()),
                'name' => ['nullable', 'string', 'max:255'],
                'pageCount' => ['required', 'integer', 'min:1', 'max:10000'],
            ]);
            $this->quotas->assertPdfCapacity(auth()->user());
        } catch (ValidationException $exception) {
            return response()->json(['ok' => false, 'error' => $exception->validator->errors()->first()], 422);
        }

        $sizeError = $this->checkGuestUploadSize($upload);
        if ($sizeError) {
            return $sizeError;
        }

        $sizeError = $this->checkPdfSizeQuota($upload);
        if ($sizeError) {
            return $sizeError;
        }

        $quotaError = $this->checkPdfCountQuota();
        if ($quotaError) {
            return $quotaError;
        }

        $name = NameSanitizer::name((string) $request->input('name', $upload->getClientOriginalName()), 'document');
        $pageCount = max(0, (int) $request->input('pageCount', 0));

        $pdf = $this->storageTransaction->createWithUpload(
            $upload,
            fn () => Pdf::create([
                'name' => $name,
                'page_count' => $pageCount,
                'page_order' => range(0, max(0, $pageCount - 1)),
                'uploaded_at' => now(),
            ]),
            fn (Pdf $createdPdf) => auth()->id().'/pdfs/'.$createdPdf->id,
        );

        return response()->json([
            'ok' => true,
            'id' => (string) $pdf->id,
            'name' => $pdf->name,
            'pageCount' => $pdf->page_count,
            'url' => "/canvas/api?action=pdf_file&id={$pdf->id}",
        ]);
    }

    private function listPdfs(Request $request): JsonResponse
    {
        [$offset, $limit] = $this->pagination($request);
        $pdfs = Pdf::orderByDesc('uploaded_at')->skip($offset)->take($limit + 1)->get();
        $hasMore = $pdfs->count() > $limit;
        $pageOfPdfs = $pdfs->take($limit);

        $importedByPdfId = PdfPageImport::whereIn('pdf_id', $pageOfPdfs->pluck('id'))
            ->get()
            ->groupBy('pdf_id')
            ->map(fn ($rows) => $rows->pluck('page_index')->values()->all());

        $items = $pageOfPdfs->map(function (Pdf $pdf) use ($importedByPdfId) {
            return [
                'id' => (string) $pdf->id,
                'name' => $pdf->name,
                'pageCount' => $pdf->page_count,
                'uploaded' => $pdf->uploaded_at?->getTimestamp() ?? 0,
                'url' => "/canvas/api?action=pdf_file&id={$pdf->id}",
                'pageOrder' => $pdf->page_order ?? [],
                'importedPageIndices' => $importedByPdfId->get($pdf->id, []),
            ];
        })->values();

        return response()->json(['ok' => true, 'items' => $items, 'nextCursor' => $hasMore ? $offset + $limit : null]);
    }

    /**
     * Locks a PDF page the moment it's inserted into canvas, independent of
     * whether the document holding it has ever been saved. Background
     * autosave refuses to create new documents (see DocumentController's
     * autosave doc comment), so a brand-new, never-saved canvas would never
     * reach PdfPageImportReconciler otherwise — this endpoint is the fix for
     * that gap. Locked with document_id null ("pending"); reconcile() claims
     * it for a real document the first time that document is actually saved.
     */
    private function lockPdfPage(Request $request): JsonResponse
    {
        $pdf = Pdf::find($request->input('pdf_id'));
        if (! $pdf) {
            return response()->json(['ok' => false, 'error' => 'The PDF no longer exists.'], 404);
        }

        $pageIndex = (int) $request->input('page_index', -1);
        if ($pageIndex < 0 || $pageIndex >= $pdf->page_count) {
            return response()->json(['ok' => false, 'error' => 'Invalid page.'], 422);
        }

        // A page duplicated in page_order can be imported once per
        // occurrence — only the specific occurrence being used locks, not
        // every occurrence of that source page.
        $occurrences = max(1, collect($pdf->page_order ?? [])->filter(fn ($index) => (int) $index === $pageIndex)->count());
        $lockedCount = PdfPageImport::where('pdf_id', $pdf->id)->where('page_index', $pageIndex)->count();
        if ($lockedCount >= $occurrences) {
            return response()->json(['ok' => false, 'error' => 'already_imported'], 409);
        }

        PdfPageImport::create(['pdf_id' => $pdf->id, 'page_index' => $pageIndex, 'document_id' => null]);

        return response()->json(['ok' => true]);
    }

    /**
     * Releases one lock taken by lockPdfPage() when a page is removed from
     * canvas again (before or after the document was ever saved). Releases
     * exactly one occurrence, so a duplicated page's other, still-imported
     * occurrences stay locked.
     */
    private function unlockPdfPage(Request $request): JsonResponse
    {
        $pdf = Pdf::find($request->input('pdf_id'));
        if (! $pdf) {
            return response()->json(['ok' => false, 'error' => 'The PDF no longer exists.'], 404);
        }

        $pageIndex = (int) $request->input('page_index', -1);
        PdfPageImport::where('pdf_id', $pdf->id)->where('page_index', $pageIndex)->first()?->delete();

        return response()->json(['ok' => true]);
    }

    private function updatePdfPageOrder(Request $request): JsonResponse
    {
        $pdf = Pdf::find($request->input('id'));
        if (! $pdf) {
            return response()->json(['ok' => false, 'error' => 'The PDF no longer exists.'], 404);
        }

        $rawPageOrder = json_decode((string) $request->input('pageOrder', '[]'), true);
        if (! is_array($rawPageOrder)) {
            return response()->json(['ok' => false, 'error' => 'Invalid page order.'], 422);
        }

        $pageOrder = collect($rawPageOrder)
            ->map(fn ($index) => (int) $index)
            ->filter(fn ($index) => $index >= 0 && $index < $pdf->page_count)
            ->values()
            ->all();

        $pdf->update(['page_order' => $pageOrder]);

        return response()->json(['ok' => true, 'pageOrder' => $pageOrder]);
    }

    private function deletePdf(Request $request): JsonResponse
    {
        $pdf = Pdf::find($request->input('id'));
        if (! $pdf) {
            return response()->json(['ok' => false, 'error' => 'The PDF no longer exists.'], 404);
        }

        $this->storageTransaction->deleteDirectories(
            [auth()->id().'/pdfs/'.$pdf->id],
            fn () => $pdf->delete(),
        );

        return response()->json(['ok' => true]);
    }

    /*
    |--------------------------------------------------------------------------
    | Favourites (PDF page clippings)
    |--------------------------------------------------------------------------
    */

    private function createPdfFolder(Request $request): JsonResponse
    {
        $name = NameSanitizer::name((string) $request->input('name', ''), 'folder');
        if ($name !== '') {
            PdfFolder::firstOrCreate(['name' => $name]);
        }

        return response()->json(['ok' => true, 'folders' => $this->pdfFolderNames()]);
    }

    private function deletePdfFolder(Request $request): JsonResponse
    {
        $name = (string) $request->input('name', '');
        if ($name === '') {
            return response()->json(['ok' => false, 'error' => 'Invalid folder name.'], 422);
        }

        $folder = PdfFolder::where('name', $name)->first();
        if ($folder) {
            $directories = $folder->favourites
                ->map(fn (Favourite $favourite) => auth()->id().'/favourites/'.$favourite->id)
                ->all();

            $this->storageTransaction->deleteDirectories($directories, function () use ($folder) {
                $folder->favourites()->delete();

                return $folder->delete();
            });
        }

        return response()->json(['ok' => true, 'folders' => $this->pdfFolderNames()]);
    }

    private function uploadFavourite(Request $request): JsonResponse
    {
        $upload = $request->file('pdf');
        if (! $upload) {
            return response()->json(['ok' => false, 'error' => 'No PDF file was received.'], 422);
        }

        try {
            $request->validate([
                'pdf' => $this->quotas->pdfRules(auth()->user()),
                'name' => ['nullable', 'string', 'max:255'],
                'folder' => ['nullable', 'string', 'max:255'],
                'sourcePdfId' => ['nullable', 'integer', 'exists:pdfs,id'],
                'sourcePageIndex' => ['nullable', 'integer', 'min:0'],
            ]);
            $this->quotas->assertFavouriteCapacity(auth()->user());
        } catch (ValidationException $exception) {
            return response()->json(['ok' => false, 'error' => $exception->validator->errors()->first()], 422);
        }

        $sizeError = $this->checkGuestUploadSize($upload);
        if ($sizeError) {
            return $sizeError;
        }

        $name = NameSanitizer::name((string) $request->input('name', $upload->getClientOriginalName()), 'page');
        $folderName = trim((string) $request->input('folder', ''));
        $pdfFolderId = null;
        if ($folderName !== '') {
            $folderName = NameSanitizer::name($folderName, 'folder');
            $pdfFolderId = PdfFolder::firstOrCreate(['name' => $folderName])->id;
        }

        $sourcePdfId = $request->input('sourcePdfId') ?: null;
        $sourcePageIndex = $request->filled('sourcePageIndex') ? max(0, (int) $request->input('sourcePageIndex')) : null;

        $favourite = $this->storageTransaction->createWithUpload(
            $upload,
            fn () => Favourite::create([
                'name' => $name,
                'pdf_folder_id' => $pdfFolderId,
                'source_pdf_id' => $sourcePdfId,
                'source_page_index' => $sourcePageIndex,
                'added_at' => now(),
            ]),
            fn (Favourite $createdFavourite) => auth()->id().'/favourites/'.$createdFavourite->id,
        );

        return response()->json([
            'ok' => true,
            'id' => (string) $favourite->id,
            'name' => $favourite->name,
            'folder' => $folderName,
            'url' => "/canvas/api?action=favourite_file&id={$favourite->id}",
        ]);
    }

    private function listFavourites(Request $request): JsonResponse
    {
        [$offset, $limit] = $this->pagination($request);
        $favourites = Favourite::with('pdfFolder')->orderByDesc('added_at')->skip($offset)->take($limit + 1)->get();
        $hasMore = $favourites->count() > $limit;
        $pageOfFavourites = $favourites->take($limit);

        $sourcePdfIds = $pageOfFavourites->pluck('source_pdf_id')->filter()->unique()->values();
        $sourcePdfsById = Pdf::whereIn('id', $sourcePdfIds)->get()->keyBy('id');

        $importRowsByPair = PdfPageImport::whereIn('pdf_id', $sourcePdfIds)
            ->get(['pdf_id', 'page_index', 'document_id'])
            ->groupBy(fn ($row) => $row->pdf_id.':'.$row->page_index);

        $items = $pageOfFavourites->map(function (Favourite $favourite) use ($importRowsByPair, $sourcePdfsById) {
            $pairKey = $favourite->source_pdf_id !== null && $favourite->source_page_index !== null
                ? $favourite->source_pdf_id.':'.$favourite->source_page_index
                : null;
            $rows = $pairKey ? ($importRowsByPair->get($pairKey) ?? collect()) : collect();

            // A page duplicated in the source PDF locks per occurrence — the
            // favourite only counts as "already imported" once every
            // occurrence of that page has been used.
            $occurrences = 1;
            $sourcePdf = $favourite->source_pdf_id !== null ? $sourcePdfsById->get($favourite->source_pdf_id) : null;
            if ($sourcePdf) {
                $occurrences = max(1, collect($sourcePdf->page_order ?? [])
                    ->filter(fn ($index) => (int) $index === (int) $favourite->source_page_index)
                    ->count());
            }

            $editedRow = $rows->first(fn ($row) => $row->document_id !== null);

            return [
                'id' => (string) $favourite->id,
                'name' => $favourite->name,
                'folder' => $favourite->pdfFolder?->name ?? '',
                'pageCount' => 1,
                'addedAt' => $favourite->added_at?->getTimestamp() ?? 0,
                'url' => "/canvas/api?action=favourite_file&id={$favourite->id}",
                'sourcePdfId' => $favourite->source_pdf_id ? (string) $favourite->source_pdf_id : '',
                'sourcePageIndex' => $favourite->source_page_index,
                'isImported' => $rows->count() >= $occurrences,
                // The document currently holding the edited/annotated version of
                // this exact page, if any — lets the client pull in real canvas
                // edits when downloading, instead of just the original PDF page.
                'editedDocumentId' => $editedRow ? (string) $editedRow->document_id : null,
            ];
        })->values();

        return response()->json([
            'ok' => true,
            'folders' => $this->pdfFolderNames(),
            'items' => $items,
            'nextCursor' => $hasMore ? $offset + $limit : null,
        ]);
    }

    private function deleteFavourite(Request $request): JsonResponse
    {
        $favourite = Favourite::find($request->input('id'));
        if (! $favourite) {
            return response()->json(['ok' => false, 'error' => 'The favourite no longer exists.'], 404);
        }

        $this->storageTransaction->deleteDirectories(
            [auth()->id().'/favourites/'.$favourite->id],
            fn () => $favourite->delete(),
        );

        return response()->json(['ok' => true]);
    }

    /*
    |--------------------------------------------------------------------------
    | Binary / JSON file serving (replaces the old flat `save/` directory)
    |--------------------------------------------------------------------------
    */

    private function getDocument(Request $request): JsonResponse
    {
        $document = Document::find($request->input('id'));
        if (! $document) {
            return response()->json(['ok' => false, 'error' => 'The document no longer exists.'], 404);
        }

        $content = $document->content;
        $content = is_array($content) ? $content : ['pages' => []];

        // Additive fields for the REST-autosave migration: the client has no
        // other way to learn a document's real numeric id/version today (see
        // AUDIT.md "Migrare autosave"). Overwrites any stale fake `version`
        // baked into `content` by the legacy save action on purpose.
        return response()->json(array_merge($content, [
            'id' => $document->id,
            'version' => $document->version,
        ]));
    }

    private function pageImage(Request $request): Response
    {
        $document = Document::find($request->input('id'));
        $page = (int) $request->input('page', 0);
        if (! $document || $page < 1) {
            abort(404);
        }

        $path = auth()->id().'/documents/'.$document->id.'/pages/'.$page.'.jpg';
        if (! Storage::disk('tenants')->exists($path)) {
            abort(404);
        }

        return response(Storage::disk('tenants')->get($path), 200, ['Content-Type' => 'image/jpeg']);
    }

    private function pdfFile(Request $request): StreamedResponse
    {
        $pdf = Pdf::find($request->input('id'));
        if (! $pdf) {
            abort(404);
        }

        $path = auth()->id().'/pdfs/'.$pdf->id.'/source.pdf';
        if (! Storage::disk('tenants')->exists($path)) {
            abort(404);
        }

        return Storage::disk('tenants')->response($path, 'source.pdf', ['Content-Type' => 'application/pdf']);
    }

    private function favouriteFile(Request $request): StreamedResponse
    {
        $favourite = Favourite::find($request->input('id'));
        if (! $favourite) {
            abort(404);
        }

        $path = auth()->id().'/favourites/'.$favourite->id.'/source.pdf';
        if (! Storage::disk('tenants')->exists($path)) {
            abort(404);
        }

        return Storage::disk('tenants')->response($path, 'source.pdf', ['Content-Type' => 'application/pdf']);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    private function pdfFolderNames(): array
    {
        return PdfFolder::orderBy('name')->pluck('name')->values()->all();
    }

    private function pageNumbersFor(Document $document): array
    {
        $content = $document->content;
        if (is_array($content) && isset($content['pages']) && is_array($content['pages'])) {
            $pages = array_map(fn ($page) => (int) ($page['page'] ?? 0), $content['pages']);
            $pages = array_values(array_filter($pages, fn ($page) => $page >= 1));
            if (count($pages) > 0) {
                sort($pages);

                return $pages;
            }
        }

        return $document->page_count > 0 ? range(1, $document->page_count) : [];
    }

    /**
     * Split a legacy "folder/name" document reference into [folderName, title].
     */
    private function splitRef(string $ref): array
    {
        $ref = trim(str_replace('\\', '/', $ref), '/');
        $parts = array_values(array_filter(explode('/', $ref), fn ($part) => trim($part) !== ''));

        if (count($parts) >= 2) {
            return [$parts[0], $parts[count($parts) - 1]];
        }

        return ['', $parts[0] ?? $ref];
    }

    private function ref(string $folderName, string $title): string
    {
        return $folderName !== '' ? $folderName.'/'.$title : $title;
    }

    private function refForDocument(Document $document): string
    {
        return $this->ref($document->folder?->name ?? '', $document->title);
    }

    private function findDocumentByRef(string $ref): ?Document
    {
        [$folderName, $title] = $this->splitRef($ref);

        $query = Document::where('title', $title);
        if ($folderName !== '') {
            $folder = Folder::where('name', $folderName)->first();
            if (! $folder) {
                return null;
            }
            $query->where('folder_id', $folder->id);
        } else {
            $query->whereNull('folder_id');
        }

        return $query->first();
    }

    private function safeGuideMode(string $mode): string
    {
        if ($mode === 'dictation') {
            return 'ruled';
        }

        return in_array($mode, ['none', 'ruled', 'grid'], true) ? $mode : 'none';
    }

    private function safeHexColor(string $color): string
    {
        return preg_match('/^#[0-9a-fA-F]{6}$/', $color) ? strtolower($color) : '#ffffff';
    }

    private function truthy(mixed $value): bool
    {
        return in_array((string) $value, ['1', 'true', 'on', 'yes'], true);
    }

    /** @return array{0: int, 1: int} */
    private function pagination(Request $request): array
    {
        return [
            max(0, $request->integer('cursor', 0)),
            min(100, max(1, $request->integer('limit', 100))),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Quota enforcement
    |--------------------------------------------------------------------------
    */

    private function checkCanvasPagesQuota(?Document $existing, int $newPageCount): ?JsonResponse
    {
        $cap = auth()->user()->effectiveMaxCanvasPages();
        if ($cap === null) {
            return null;
        }

        $currentTotal = Document::when($existing, fn ($query) => $query->where('id', '!=', $existing->id))
            ->sum('page_count');

        if (($currentTotal + $newPageCount) > $cap) {
            return response()->json([
                'ok' => false,
                'error' => 'You have reached your plan\'s page limit. Upgrade to Premium for unlimited pages.',
            ], 402);
        }

        return null;
    }

    private function checkPdfCountQuota(): ?JsonResponse
    {
        $cap = auth()->user()->effectiveMaxPdfs();
        if ($cap === null) {
            return null;
        }

        if (Pdf::count() >= $cap) {
            return response()->json([
                'ok' => false,
                'error' => 'You have reached your plan\'s PDF limit. Upgrade to Premium for unlimited PDFs.',
            ], 402);
        }

        return null;
    }

    private function checkPdfSizeQuota(UploadedFile $upload): ?JsonResponse
    {
        if (auth()->user()->isGuest()) {
            return null;
        }

        $cap = auth()->user()->effectiveMaxPdfSizeBytes();
        if ($cap === null) {
            return null;
        }

        if ($upload->getSize() > $cap) {
            $capMb = round($cap / (1024 * 1024), 1);

            return response()->json([
                'ok' => false,
                'error' => "This PDF is too large. Your plan allows up to {$capMb}MB per file.",
            ], 413);
        }

        return null;
    }

    private function checkGuestUploadSize(UploadedFile $upload): ?JsonResponse
    {
        $user = auth()->user();
        if (! $user->isGuest()) {
            return null;
        }

        $cap = $user->effectiveMaxPdfSizeBytes();
        if ($cap !== null && $upload->getSize() > $cap) {
            $capMb = round($cap / (1024 * 1024), 1);

            return response()->json([
                'ok' => false,
                'error' => "Demo uploads are limited to {$capMb}MB. Please register for larger files.",
            ], 413);
        }

        return null;
    }
}
