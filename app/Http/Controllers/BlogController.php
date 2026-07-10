<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;

class BlogController extends Controller
{
    public function index()
    {
        $posts = Post::query()
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->with(['categories', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(9);

        return view('blog.index', [
            'posts' => $posts,
            'heading' => 'Blog',
        ]);
    }

    public function show(Post $post)
    {
        abort_unless($post->status === 'published' && $post->published_at?->lte(now()), 404);

        $post->load(['categories', 'tags', 'user']);

        $ogImagePath = $post->effectiveOgImagePath();
        $ogImageUrl = $ogImagePath
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($ogImagePath)
            : asset('marketing/favicon.svg');

        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->title,
            'description' => $post->effectiveOgDescription(),
            'datePublished' => $post->published_at?->toIso8601String(),
            'dateModified' => $post->updated_at->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $post->user?->name ?? 'Notelevel',
            ],
            'image' => $ogImageUrl,
            'mainEntityOfPage' => $post->effectiveCanonicalUrl(),
        ]);

        return view('blog.show', [
            'post' => $post,
            'ogImageUrl' => $ogImageUrl,
            'jsonLd' => $jsonLd,
        ]);
    }

    public function category(Category $category)
    {
        $posts = $category->posts()
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->with(['categories', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(9);

        return view('blog.index', [
            'posts' => $posts,
            'heading' => 'Category: '.$category->name,
        ]);
    }

    public function tag(Tag $tag)
    {
        $posts = $tag->posts()
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->with(['categories', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(9);

        return view('blog.index', [
            'posts' => $posts,
            'heading' => 'Tag: '.$tag->name,
        ]);
    }
}
