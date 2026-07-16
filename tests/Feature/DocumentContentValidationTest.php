<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use App\Rules\CanvasDocumentContent;
use App\Support\DocumentPayloadRules;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * AUDIT.md VAL-01: document save/autosave payloads previously had no size or
 * structure bounds on either the REST (DocumentController) or legacy
 * (CanvasApiController) save surface.
 */
class DocumentContentValidationTest extends TestCase
{
    use RefreshDatabase;

    private function oversizedContent(): array
    {
        return ['pages' => [['text' => str_repeat('a', CanvasDocumentContent::MAX_BYTES + 1024)]]];
    }

    private function contentWithTooManyElementsOnOnePage(): array
    {
        $elements = array_fill(0, CanvasDocumentContent::MAX_ELEMENTS_PER_PAGE + 1, ['type' => 'text', 'text' => 'x']);

        return ['pages' => [['elements' => $elements]]];
    }

    public function test_store_rejects_oversized_content(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->postJson('/documents', [
            'title' => 'Too big',
            'content' => $this->oversizedContent(),
        ])->assertStatus(422)->assertJsonValidationErrors('content');

        $this->assertDatabaseMissing('documents', ['title' => 'Too big']);
    }

    public function test_store_rejects_a_page_with_too_many_elements(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->postJson('/documents', [
            'title' => 'Too many elements',
            'content' => $this->contentWithTooManyElementsOnOnePage(),
        ])->assertStatus(422)->assertJsonValidationErrors('content');
    }

    public function test_store_accepts_a_normal_document(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->postJson('/documents', [
            'title' => 'Normal doc',
            'content' => ['pages' => [['elements' => [['type' => 'text', 'text' => 'hello']]]]],
        ])->assertStatus(201);

        $this->assertDatabaseHas('documents', ['title' => 'Normal doc']);
    }

    public function test_update_rejects_oversized_content(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);

        $this->putJson('/documents/'.$document->id, [
            'content' => $this->oversizedContent(),
        ])->assertStatus(422)->assertJsonValidationErrors('content');

        $this->assertNull($document->fresh()->content);
    }

    public function test_autosave_rejects_oversized_content(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft', 'version' => 1]);

        $this->postJson('/documents/'.$document->id.'/autosave', [
            'request_id' => (string) Str::uuid(),
            'version' => 1,
            'content' => $this->oversizedContent(),
        ])->assertStatus(422)->assertJsonValidationErrors('content');

        $this->assertSame(1, $document->fresh()->version);
    }

    public function test_save_pages_rejects_an_oversized_image(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);

        $oversizedImage = 'data:image/jpeg;base64,'.str_repeat('A', DocumentPayloadRules::MAX_PAGE_IMAGE_BASE64_LENGTH + 1);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [['page' => 1, 'image' => $oversizedImage]],
        ])->assertStatus(422)->assertJsonValidationErrors('pages.0.image');
    }

    public function test_legacy_save_rejects_oversized_document_content(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post('/canvas/api', [
            'action' => 'save',
            'filename' => 'Legacy too big',
            'pages' => json_encode([['page' => 1, 'image' => 'data:image/jpeg;base64,'.base64_encode('page-one')]]),
            'document' => json_encode($this->oversizedContent()),
        ])->assertStatus(422)->assertJsonPath('ok', false);

        $this->assertDatabaseMissing('documents', ['title' => 'Legacy too big']);
    }

    public function test_legacy_save_skips_an_oversized_page_image_but_keeps_valid_ones(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $oversizedImage = 'data:image/jpeg;base64,'.str_repeat('A', DocumentPayloadRules::MAX_PAGE_IMAGE_BASE64_LENGTH + 1);

        $this->post('/canvas/api', [
            'action' => 'save',
            'filename' => 'Legacy mixed pages',
            'pages' => json_encode([
                ['page' => 1, 'image' => 'data:image/jpeg;base64,'.base64_encode('page-one')],
                ['page' => 2, 'image' => $oversizedImage],
            ]),
            'document' => json_encode(['pages' => []]),
        ])->assertOk()->assertJsonPath('metadata.pages', [1]);
    }

    public function test_legacy_save_accepts_a_normal_document(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post('/canvas/api', [
            'action' => 'save',
            'filename' => 'Legacy normal',
            'pages' => json_encode([['page' => 1, 'image' => 'data:image/jpeg;base64,'.base64_encode('page-one')]]),
            'document' => json_encode(['pages' => [['elements' => [['type' => 'text', 'text' => 'hi']]]]]),
        ])->assertOk()->assertJsonPath('ok', true);

        $this->assertDatabaseHas('documents', ['title' => 'Legacy normal']);
    }
}
