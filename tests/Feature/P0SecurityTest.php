<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class P0SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_mutations_are_rejected_over_get(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $document = Document::create([
            'user_id' => $user->id,
            'title' => 'Protected document',
            'page_count' => 1,
        ]);

        $this->actingAs($user)
            ->get('/canvas/api?action=delete&filename=Protected%20document')
            ->assertStatus(405)
            ->assertHeader('Allow', 'POST');

        $this->assertDatabaseHas('documents', ['id' => $document->id]);
    }

    public function test_legacy_reads_remain_available_over_get(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)
            ->get('/canvas/api?action=list')
            ->assertOk()
            ->assertJsonPath('ok', true);
    }

    public function test_unverified_users_can_access_product_apis_while_verification_is_paused(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->getJson('/documents')
            ->assertOk();
    }
}
