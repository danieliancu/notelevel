<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentPagesEndpointTest extends TestCase
{
    use RefreshDatabase;

    private function jpegDataUrl(string $bytes): string
    {
        return 'data:image/jpeg;base64,'.base64_encode($bytes);
    }

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('tenants');
    }

    public function test_it_writes_page_images_and_updates_page_count(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [
                ['page' => 1, 'image' => $this->jpegDataUrl('page-one')],
                ['page' => 2, 'image' => $this->jpegDataUrl('page-two')],
            ],
        ])->assertOk()->assertJsonPath('pages', [1, 2]);

        Storage::disk('tenants')->assertExists($user->id.'/documents/'.$document->id.'/pages/1.jpg');
        Storage::disk('tenants')->assertExists($user->id.'/documents/'.$document->id.'/pages/2.jpg');
        $this->assertSame('page-one', Storage::disk('tenants')->get($user->id.'/documents/'.$document->id.'/pages/1.jpg'));
        $this->assertSame(2, $document->fresh()->page_count);
    }

    public function test_page_image_read_action_serves_a_page_written_through_the_new_endpoint(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [['page' => 1, 'image' => $this->jpegDataUrl('hello-jpeg')]],
        ])->assertOk();

        $this->get('/canvas/api?action=page_image&id='.$document->id.'&page=1')
            ->assertOk()
            ->assertHeader('Content-Type', 'image/jpeg')
            ->assertSee('hello-jpeg', false);
    }

    public function test_it_only_replaces_the_submitted_pages_and_keeps_the_rest(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);
        Storage::disk('tenants')->put($user->id.'/documents/'.$document->id.'/pages/1.jpg', 'original-one');
        Storage::disk('tenants')->put($user->id.'/documents/'.$document->id.'/pages/2.jpg', 'original-two');

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [['page' => 2, 'image' => $this->jpegDataUrl('updated-two')]],
        ])->assertOk()->assertJsonPath('pages', [1, 2]);

        $this->assertSame('original-one', Storage::disk('tenants')->get($user->id.'/documents/'.$document->id.'/pages/1.jpg'));
        $this->assertSame('updated-two', Storage::disk('tenants')->get($user->id.'/documents/'.$document->id.'/pages/2.jpg'));
    }

    public function test_it_rejects_a_request_with_no_valid_pages(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft']);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [['page' => 1, 'image' => 'not-a-jpeg-data-url']],
        ])->assertStatus(422)->assertJsonPath('ok', false);
    }

    public function test_it_cannot_write_pages_for_another_users_document(): void
    {
        $owner = User::factory()->create();
        $this->actingAs($owner);
        $document = Document::create(['title' => 'Owner doc']);

        $intruder = User::factory()->create();
        $this->actingAs($intruder);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [['page' => 1, 'image' => $this->jpegDataUrl('nope')]],
        ])->assertStatus(404);
    }

    public function test_it_enforces_the_plan_page_quota(): void
    {
        Log::spy();
        $this->seed(PlanSeeder::class);
        $user = User::factory()->create();
        $this->actingAs($user);
        Document::create(['title' => 'Other', 'page_count' => 19]);
        $document = Document::create(['title' => 'Draft']);

        $this->postJson('/documents/'.$document->id.'/pages', [
            'pages' => [
                ['page' => 1, 'image' => $this->jpegDataUrl('a')],
                ['page' => 2, 'image' => $this->jpegDataUrl('b')],
            ],
        ])->assertStatus(402)->assertJsonPath('ok', false);

        // Etapa 4 (AUDIT.md "Migrare autosave"): quota rejections are a silent
        // business response too, worth the same operator-visible signal.
        Log::shouldHaveReceived('info')->once()->with('canvas.autosave_pages_quota_exceeded', \Mockery::on(
            fn ($context) => $context['document_id'] === $document->id
        ));
    }
}
