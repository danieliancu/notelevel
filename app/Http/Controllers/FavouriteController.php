<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use App\Models\PdfFolder;
use App\Services\PlanQuotaService;
use App\Services\TenantStorageTransaction;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{
    public function __construct(
        private TenantStorageTransaction $storageTransaction,
        private PlanQuotaService $quotas,
    ) {}

    public function index(Request $request)
    {
        $perPage = min(100, max(1, $request->integer('per_page', 50)));

        return response()->json(Favourite::with('pdfFolder')->orderByDesc('added_at')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $this->quotas->assertFavouriteCapacity($user);

        $request->validate([
            'file' => $this->quotas->pdfRules($user),
            'name' => ['nullable', 'string', 'max:255'],
            'folder' => ['nullable', 'string', 'max:255'],
            'source_pdf_id' => ['nullable', 'integer', 'exists:pdfs,id'],
            'source_page_index' => ['nullable', 'integer', 'min:0'],
        ]);

        $name = NameSanitizer::name((string) $request->input('name', $request->file('file')->getClientOriginalName()), 'favourite');

        $pdfFolderId = null;
        if ($folderName = $request->input('folder')) {
            $pdfFolderId = PdfFolder::firstOrCreate(['name' => NameSanitizer::name($folderName, 'folder')])->id;
        }

        $favourite = $this->storageTransaction->createWithUpload(
            $request->file('file'),
            fn () => Favourite::create([
                'name' => $name,
                'pdf_folder_id' => $pdfFolderId,
                'source_pdf_id' => $request->input('source_pdf_id'),
                'source_page_index' => $request->input('source_page_index'),
                'added_at' => now(),
            ]),
            fn (Favourite $createdFavourite) => auth()->id().'/favourites/'.$createdFavourite->id,
        );

        return response()->json($favourite, 201);
    }

    public function destroy(Favourite $favourite)
    {
        $this->storageTransaction->deleteDirectories(
            [auth()->id().'/favourites/'.$favourite->id],
            fn () => $favourite->delete(),
        );

        return response()->json(['ok' => true]);
    }
}
