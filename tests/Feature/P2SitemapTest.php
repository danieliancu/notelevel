<?php

namespace Tests\Feature;

use App\Jobs\RebuildSitemap;
use App\Models\Post;
use App\Models\User;
use App\Services\SitemapService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class P2SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_changes_invalidate_and_queue_sitemap_rebuild(): void
    {
        Queue::fake();
        Cache::put(SitemapService::CACHE_KEY, 'stale', 3600);
        $user = User::factory()->create();

        Post::create([
            'user_id' => $user->id,
            'title' => 'Published article',
            'slug' => 'published-article',
            'body' => 'Content',
            'status' => 'published',
            'published_at' => now(),
            'noindex' => false,
        ]);

        $this->assertNull(Cache::get(SitemapService::CACHE_KEY));
        Queue::assertPushed(RebuildSitemap::class);
    }

    public function test_sitemap_rebuild_contains_published_indexable_posts(): void
    {
        Queue::fake();
        $user = User::factory()->create();
        Post::create([
            'user_id' => $user->id,
            'title' => 'Published article',
            'slug' => 'published-article',
            'body' => 'Content',
            'status' => 'published',
            'published_at' => now(),
            'noindex' => false,
        ]);

        $xml = app(SitemapService::class)->rebuild();

        $this->assertStringContainsString('/blog/published-article', $xml);
    }
}
