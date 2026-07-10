<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class P2LegacyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_api_advertises_its_sunset_and_successor(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/canvas/api?action=list')
            ->assertOk()
            ->assertHeader('Deprecation', 'true')
            ->assertHeader('Sunset')
            ->assertHeader('Link', '</documents>; rel="successor-version"');
    }

    public function test_rest_and_legacy_duplicate_share_document_business_logic(): void
    {
        Storage::fake('tenants');
        $user = User::factory()->create();
        $this->actingAs($user);
        $document = Document::create(['title' => 'Source', 'page_count' => 1]);
        Storage::disk('tenants')->put($user->id.'/documents/'.$document->id.'/pages/1.jpg', 'page');

        $this->postJson('/documents/'.$document->id.'/duplicate')->assertCreated();
        $this->post('/canvas/api', ['action' => 'duplicate', 'filename' => 'Source'])->assertOk();

        $this->assertDatabaseHas('documents', ['title' => 'Source copy']);
        $this->assertDatabaseHas('documents', ['title' => 'Source copy 2']);
    }

    public function test_legacy_collections_are_paginated(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        foreach (range(1, 3) as $index) {
            Document::create(['title' => 'Document '.$index]);
        }

        $this->get('/canvas/api?action=list&limit=2')
            ->assertOk()
            ->assertJsonCount(2, 'files')
            ->assertJsonPath('nextCursor', 2);

        $this->get('/canvas/api?action=list&limit=2&cursor=2')
            ->assertOk()
            ->assertJsonCount(1, 'files')
            ->assertJsonPath('nextCursor', null);
    }
}
