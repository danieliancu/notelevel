<?php

namespace Tests\Feature;

use App\Models\Pdf;
use App\Models\PdfPageImport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfPageLockEndpointTest extends TestCase
{
    use RefreshDatabase;

    private function makePdf(): Pdf
    {
        return Pdf::create(['name' => 'Notes.pdf', 'page_count' => 3, 'page_order' => [0, 1, 2], 'uploaded_at' => now()]);
    }

    public function test_locking_a_page_creates_a_pending_row_with_no_document(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = $this->makePdf();

        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->assertDatabaseHas('pdf_page_imports', [
            'pdf_id' => $pdf->id,
            'page_index' => 1,
            'document_id' => null,
        ]);
    }

    public function test_locking_an_already_locked_page_is_rejected(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = $this->makePdf();

        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])->assertOk();
        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])
            ->assertStatus(409)
            ->assertJson(['ok' => false, 'error' => 'already_imported']);

        $this->assertSame(1, PdfPageImport::count());
    }

    public function test_locking_a_different_page_of_the_same_pdf_is_allowed(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = $this->makePdf();

        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 0])->assertOk();
        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])->assertOk();

        $this->assertSame(2, PdfPageImport::count());
    }

    public function test_unlocking_a_page_removes_the_row(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = $this->makePdf();

        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])->assertOk();
        $this->post('/canvas/api', ['action' => 'unlock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 1])
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->assertSame(0, PdfPageImport::count());
    }

    public function test_locking_an_out_of_range_page_is_rejected(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $pdf = $this->makePdf();

        $this->post('/canvas/api', ['action' => 'lock_pdf_page', 'pdf_id' => $pdf->id, 'page_index' => 99])
            ->assertStatus(422);
    }
}
