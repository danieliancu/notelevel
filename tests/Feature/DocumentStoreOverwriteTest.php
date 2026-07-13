<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentStoreOverwriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_folder_by_name_when_none_exists(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->postJson('/documents', [
            'title' => 'Notes',
            'folder' => 'Schoolwork',
            'content' => ['pages' => []],
        ])->assertCreated();

        $this->assertDatabaseHas('folders', ['name' => 'Schoolwork']);
        $folder = Folder::where('name', 'Schoolwork')->firstOrFail();
        $this->assertDatabaseHas('documents', ['title' => 'Notes', 'folder_id' => $folder->id]);
    }

    public function test_it_rejects_a_name_collision_without_overwrite(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        Document::create(['title' => 'Draft', 'version' => 1]);

        $this->postJson('/documents', [
            'title' => 'Draft',
            'content' => ['pages' => []],
        ])->assertStatus(409)->assertJsonPath('exists', true);
    }

    public function test_overwrite_updates_the_existing_document_instead_of_creating_a_duplicate(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft', 'version' => 1, 'content' => ['old' => true]]);

        $this->postJson('/documents', [
            'title' => 'Draft',
            'overwrite' => true,
            'content' => ['new' => true],
        ])->assertOk()->assertJsonPath('id', $document->id)->assertJsonPath('version', 2);

        $this->assertSame(1, Document::where('title', 'Draft')->count());
        $this->assertSame(['new' => true], $document->fresh()->content);
    }
}
