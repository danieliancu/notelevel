<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class P2AutosaveTest extends TestCase
{
    use RefreshDatabase;

    public function test_autosave_replay_is_idempotent(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft', 'version' => 1]);
        $requestId = (string) Str::uuid();
        $payload = [
            'request_id' => $requestId,
            'version' => 1,
            'content' => ['pages' => [['text' => 'Hello']]],
            'page_count' => 1,
        ];

        $this->postJson('/documents/'.$document->id.'/autosave', $payload)
            ->assertOk()
            ->assertJsonPath('version', 2)
            ->assertJsonPath('idempotentReplay', false);

        $this->postJson('/documents/'.$document->id.'/autosave', $payload)
            ->assertOk()
            ->assertJsonPath('version', 2)
            ->assertJsonPath('idempotentReplay', true);

        $this->assertSame(2, $document->fresh()->version);
    }

    public function test_autosave_conflict_returns_current_version_without_retrying(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft', 'version' => 3, 'content' => ['server' => true]]);

        $this->postJson('/documents/'.$document->id.'/autosave', [
            'request_id' => (string) Str::uuid(),
            'version' => 2,
            'content' => ['client' => true],
        ])->assertStatus(409)
            ->assertJsonPath('error', 'version_conflict')
            ->assertJsonPath('currentVersion', 3)
            ->assertJsonPath('retryable', false);
    }

    public function test_reusing_a_key_for_different_content_is_rejected(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Draft', 'version' => 1]);
        $requestId = (string) Str::uuid();

        $this->postJson('/documents/'.$document->id.'/autosave', [
            'request_id' => $requestId,
            'version' => 1,
            'content' => ['value' => 1],
        ])->assertOk();

        $this->postJson('/documents/'.$document->id.'/autosave', [
            'request_id' => $requestId,
            'version' => 2,
            'content' => ['value' => 2],
        ])->assertStatus(422)->assertJsonPath('error', 'idempotency_key_reused');
    }
}
