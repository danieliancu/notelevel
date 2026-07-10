<?php

namespace Tests\Feature;

use App\Models\Favourite;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class P1QuotaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
        Storage::fake('tenants');
    }

    public function test_favourite_quota_is_enforced_on_rest_and_legacy_apis(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        for ($index = 0; $index < 10; $index++) {
            Favourite::create(['name' => 'Favourite '.$index, 'added_at' => now()]);
        }

        $this->post('/favourites', [
            'file' => UploadedFile::fake()->create('page.pdf', 10, 'application/pdf'),
        ])->assertSessionHasErrors('file');

        $this->post('/canvas/api', [
            'action' => 'upload_favourite',
            'pdf' => UploadedFile::fake()->create('page.pdf', 10, 'application/pdf'),
        ])->assertStatus(422)->assertJsonPath('ok', false);
    }

    public function test_pdf_size_limit_is_shared_by_rest_and_legacy_apis(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/pdfs', [
            'file' => UploadedFile::fake()->create('large.pdf', 3000, 'application/pdf'),
            'page_count' => 1,
        ])->assertSessionHasErrors('file');

        $this->actingAs($user)->post('/canvas/api', [
            'action' => 'upload_pdf',
            'pdf' => UploadedFile::fake()->create('large.pdf', 3000, 'application/pdf'),
            'pageCount' => 1,
        ])->assertStatus(422)->assertJsonPath('ok', false);
    }
}
