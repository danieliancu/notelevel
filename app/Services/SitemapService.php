<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\Cache;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapService
{
    public const CACHE_KEY = 'sitemap.xml';

    public function cached(): string
    {
        return Cache::remember(self::CACHE_KEY, 3600, fn () => $this->render());
    }

    public function rebuild(): string
    {
        $xml = $this->render();
        Cache::put(self::CACHE_KEY, $xml, 3600);

        return $xml;
    }

    public function invalidate(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public function render(): string
    {
        $sitemap = Sitemap::create()
            ->add(Url::create(route('home'))->setPriority(1.0))
            ->add(Url::create(route('blog.index'))->setPriority(0.8));

        Post::query()->where('status', 'published')->where('published_at', '<=', now())
            ->where('noindex', false)->get()->each(function (Post $post) use ($sitemap) {
                $sitemap->add(Url::create(route('blog.show', $post->slug))
                    ->setLastModificationDate($post->updated_at)->setPriority(0.6));
            });

        Category::all()->each(fn (Category $category) => $sitemap->add(
            Url::create(route('blog.category', $category->slug))->setPriority(0.4)
        ));
        Tag::all()->each(fn (Tag $tag) => $sitemap->add(
            Url::create(route('blog.tag', $tag->slug))->setPriority(0.3)
        ));

        return $sitemap->render();
    }
}
