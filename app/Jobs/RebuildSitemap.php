<?php

namespace App\Jobs;

use App\Services\SitemapService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RebuildSitemap implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var list<int> */
    public array $backoff = [10, 60, 300];

    public function handle(SitemapService $sitemap): void
    {
        $sitemap->rebuild();
    }
}
