<?php

namespace Tests\Feature;

use App\Models\Pdf;
use App\Models\User;
use App\Services\TenantStorageTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class P0StorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_pdf_upload_commits_database_and_file_together(): void
    {
        Storage::fake('tenants');
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($user)->post('/pdfs', [
            'file' => UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf'),
            'page_count' => 2,
        ]);

        $response->assertCreated();
        $pdf = Pdf::firstOrFail();
        Storage::disk('tenants')->assertExists($user->id.'/pdfs/'.$pdf->id.'/source.pdf');
    }

    public function test_failed_file_write_rolls_back_database_record(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($user);

        $disk = Mockery::mock();
        $disk->shouldReceive('putFileAs')->once()->andReturn(false);
        $disk->shouldReceive('deleteDirectory')->once()->andReturn(true);
        Storage::shouldReceive('disk')->once()->with('tenants')->andReturn($disk);

        try {
            app(TenantStorageTransaction::class)->createWithUpload(
                UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf'),
                fn () => Pdf::create([
                    'name' => 'notes.pdf',
                    'page_count' => 1,
                    'page_order' => [0],
                    'uploaded_at' => now(),
                ]),
                fn (Pdf $pdf) => $user->id.'/pdfs/'.$pdf->id,
            );

            $this->fail('A failed tenant file write must throw.');
        } catch (RuntimeException $exception) {
            $this->assertSame('The uploaded file could not be persisted.', $exception->getMessage());
        }

        $this->assertDatabaseCount('pdfs', 0);
    }

    public function test_failed_database_delete_restores_tenant_files(): void
    {
        Storage::fake('tenants');
        Storage::disk('tenants')->put('7/documents/11/pages/1.jpg', 'original');

        try {
            app(TenantStorageTransaction::class)->deleteDirectories(
                ['7/documents/11'],
                fn () => throw new RuntimeException('Database delete failed.'),
            );

            $this->fail('A failed database delete must throw.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Database delete failed.', $exception->getMessage());
        }

        Storage::disk('tenants')->assertExists('7/documents/11/pages/1.jpg');
        $this->assertSame(
            'original',
            Storage::disk('tenants')->get('7/documents/11/pages/1.jpg'),
        );
    }
}
