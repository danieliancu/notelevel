<?php

namespace App\Http\Controllers;

use App\Models\Pdf;
use App\Services\PlanQuotaService;
use App\Services\TenantStorageTransaction;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PdfController extends Controller
{
    public function __construct(
        private TenantStorageTransaction $storageTransaction,
        private PlanQuotaService $quotas,
    ) {}

    public function index(Request $request)
    {
        $perPage = min(100, max(1, $request->integer('per_page', 50)));

        return response()->json(Pdf::orderByDesc('uploaded_at')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $this->quotas->assertPdfCapacity($user);

        $request->validate([
            'file' => $this->quotas->pdfRules($user),
            'page_count' => ['required', 'integer', 'min:1', 'max:10000'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $name = NameSanitizer::name((string) $request->input('name', $request->file('file')->getClientOriginalName()), 'document');

        $pdf = $this->storageTransaction->createWithUpload(
            $request->file('file'),
            fn () => Pdf::create([
                'name' => $name,
                'page_count' => (int) $request->input('page_count'),
                'page_order' => range(0, ((int) $request->input('page_count')) - 1),
                'uploaded_at' => now(),
            ]),
            fn (Pdf $createdPdf) => auth()->id().'/pdfs/'.$createdPdf->id,
        );

        return response()->json($pdf, 201);
    }

    public function updatePageOrder(Request $request, Pdf $pdf)
    {
        $pageOrder = collect($request->input('page_order', []))
            ->map(fn ($index) => (int) $index)
            ->filter(fn ($index) => $index >= 0 && $index < $pdf->page_count)
            ->values()
            ->all();

        if (empty($pageOrder)) {
            throw ValidationException::withMessages(['page_order' => 'Invalid page order.']);
        }

        $pdf->update(['page_order' => $pageOrder]);

        return response()->json($pdf);
    }

    public function destroy(Pdf $pdf)
    {
        $this->storageTransaction->deleteDirectories(
            [auth()->id().'/pdfs/'.$pdf->id],
            fn () => $pdf->delete(),
        );

        return response()->json(['ok' => true]);
    }
}
