<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Pdf;
use App\Models\PdfPageImport;
use App\Models\User;
use App\Services\PdfPageImportReconciler;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfPageImportReconcilerTest extends TestCase
{
    use RefreshDatabase;

    private function contentWithPages(array $sourcePdfPairs): array
    {
        return [
            'pages' => array_map(fn (array $pair) => [
                'sourcePdf' => ['pdfId' => $pair[0], 'pageIndex' => $pair[1]],
            ], $sourcePdfPairs),
        ];
    }

    public function test_importing_a_page_creates_a_lock_row(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
        $document = Document::create(['title' => 'Draft']);

        app(PdfPageImportReconciler::class)->reconcile($document, $this->contentWithPages([[$pdf->id, 0]]));

        $this->assertDatabaseHas('pdf_page_imports', [
            'pdf_id' => $pdf->id,
            'page_index' => 0,
            'document_id' => $document->id,
        ]);
    }

    public function test_removing_a_page_from_content_unlocks_it(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
        $document = Document::create(['title' => 'Draft']);
        $reconciler = app(PdfPageImportReconciler::class);

        $reconciler->reconcile($document, $this->contentWithPages([[$pdf->id, 0]]));
        $this->assertSame(1, PdfPageImport::count());

        $reconciler->reconcile($document, $this->contentWithPages([]));

        $this->assertSame(0, PdfPageImport::count());
    }

    public function test_deleting_the_document_cascades_and_unlocks_the_page(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
        $document = Document::create(['title' => 'Draft']);

        app(PdfPageImportReconciler::class)->reconcile($document, $this->contentWithPages([[$pdf->id, 0]]));
        $this->assertSame(1, PdfPageImport::count());

        $document->delete();

        $this->assertSame(0, PdfPageImport::count());
    }

    public function test_a_second_document_claiming_the_same_page_does_not_steal_the_lock(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
        $documentA = Document::create(['title' => 'A']);
        $documentB = Document::create(['title' => 'B']);
        $reconciler = app(PdfPageImportReconciler::class);

        $reconciler->reconcile($documentA, $this->contentWithPages([[$pdf->id, 0]]));
        $reconciler->reconcile($documentB, $this->contentWithPages([[$pdf->id, 0]]));

        $this->assertSame(1, PdfPageImport::count());
        $this->assertSame($documentA->id, PdfPageImport::first()->document_id);
    }

    public function test_a_pending_lock_with_no_document_yet_is_claimed_on_first_save(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
        // Simulates lockPdfPage(): locked immediately, before any document exists.
        PdfPageImport::create(['pdf_id' => $pdf->id, 'page_index' => 0, 'document_id' => null]);

        $document = Document::create(['title' => 'Draft']);
        app(PdfPageImportReconciler::class)->reconcile($document, $this->contentWithPages([[$pdf->id, 0]]));

        $this->assertSame(1, PdfPageImport::count());
        $this->assertSame($document->id, PdfPageImport::first()->document_id);
    }

    public function test_a_document_holding_the_same_source_page_twice_gets_two_locks(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        // Page 1 is duplicated in page_order, so it can back two canvas pages.
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 1, 2], 'uploaded_at' => now()]);
        $document = Document::create(['title' => 'Draft']);

        app(PdfPageImportReconciler::class)->reconcile($document, $this->contentWithPages([[$pdf->id, 1], [$pdf->id, 1]]));

        $this->assertSame(2, PdfPageImport::where('pdf_id', $pdf->id)->where('page_index', 1)->count());
    }

    public function test_removing_one_of_two_duplicated_pages_releases_only_one_lock(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 1, 2], 'uploaded_at' => now()]);
        $document = Document::create(['title' => 'Draft']);
        $reconciler = app(PdfPageImportReconciler::class);

        $reconciler->reconcile($document, $this->contentWithPages([[$pdf->id, 1], [$pdf->id, 1]]));
        $reconciler->reconcile($document, $this->contentWithPages([[$pdf->id, 1]]));

        $this->assertSame(1, PdfPageImport::where('pdf_id', $pdf->id)->where('page_index', 1)->count());
    }
}
