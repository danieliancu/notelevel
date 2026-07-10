<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Favourite;
use App\Models\Folder;
use App\Models\Pdf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class P1TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_cannot_list_or_mutate_another_users_resources(): void
    {
        Storage::fake('tenants');
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $this->actingAs($owner);
        $folder = Folder::create(['name' => 'Private']);
        $document = Document::create(['title' => 'Secret', 'folder_id' => $folder->id, 'page_count' => 1]);
        $pdf = Pdf::create(['name' => 'Secret PDF', 'page_count' => 1, 'page_order' => [0], 'uploaded_at' => now()]);
        $favourite = Favourite::create(['name' => 'Secret favourite', 'added_at' => now()]);
        Storage::disk('tenants')->put($owner->id.'/pdfs/'.$pdf->id.'/source.pdf', 'private');

        $this->actingAs($attacker)
            ->getJson('/documents')
            ->assertOk()
            ->assertJsonMissing(['title' => 'Secret']);

        $this->deleteJson('/documents/'.$document->id)->assertNotFound();
        $this->deleteJson('/folders/'.$folder->id)->assertNotFound();
        $this->deleteJson('/pdfs/'.$pdf->id)->assertNotFound();
        $this->deleteJson('/favourites/'.$favourite->id)->assertNotFound();
        $this->get('/canvas/api?action=pdf_file&id='.$pdf->id)->assertNotFound();

        $this->assertDatabaseHas('documents', ['id' => $document->id, 'user_id' => $owner->id]);
        Storage::disk('tenants')->assertExists($owner->id.'/pdfs/'.$pdf->id.'/source.pdf');
    }
}
