<?php

namespace App\Models;

use App\Jobs\RebuildSitemap;
use App\Services\SitemapService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = ['name', 'slug'];

    protected static function booted(): void
    {
        static::saved(fn () => self::refreshSitemap());
        static::deleted(fn () => self::refreshSitemap());
    }

    private static function refreshSitemap(): void
    {
        app(SitemapService::class)->invalidate();
        RebuildSitemap::dispatch()->afterCommit();
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}
