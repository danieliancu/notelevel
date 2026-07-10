<?php

namespace App\Models;

use App\Jobs\RebuildSitemap;
use App\Services\SeoAnalyzer;
use App\Services\SitemapService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image_path',
        'status',
        'published_at',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image_path',
        'canonical_url',
        'focus_keyword',
        'seo_score',
        'noindex',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'noindex' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $post) {
            $post->seo_score = app(SeoAnalyzer::class)->analyze($post)['score'];
        });

        static::saved(fn () => self::refreshSitemap());
        static::deleted(fn () => self::refreshSitemap());
    }

    private static function refreshSitemap(): void
    {
        app(SitemapService::class)->invalidate();
        RebuildSitemap::dispatch()->afterCommit();
    }

    public function effectiveOgTitle(): string
    {
        return $this->og_title ?: ($this->meta_title ?: $this->title);
    }

    public function effectiveOgDescription(): string
    {
        return $this->og_description ?: ($this->meta_description ?: (string) $this->excerpt);
    }

    public function effectiveOgImagePath(): ?string
    {
        return $this->og_image_path ?: $this->cover_image_path;
    }

    public function effectiveCanonicalUrl(): string
    {
        return $this->canonical_url ?: route('blog.show', $this->slug);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
