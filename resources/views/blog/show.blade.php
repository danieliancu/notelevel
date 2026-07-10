<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<x-seo-meta
    :title="($post->meta_title ?: $post->title).' — Notelevel Blog'"
    :description="$post->effectiveOgDescription()"
    :canonical="$post->effectiveCanonicalUrl()"
    :image="$ogImageUrl"
    type="article"
    :noindex="$post->noindex"
/>

<link rel="icon" type="image/svg+xml" href="{{ asset('marketing/favicon.svg') }}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

@vite(['resources/css/marketing.css', 'resources/js/marketing.js'])

<script type="application/ld+json">{!! $jsonLd !!}</script>
</head>
<body>

@include('marketing.partials.header')

<main>
  <article class="section" style="max-width:760px;margin:0 auto;">
    <div class="container">
      <h1>{{ $post->title }}</h1>
      <p style="color:#98a2b3;font-size:14px;margin-top:-8px;">
        {{ $post->published_at?->format('d M Y') }}
        @if($post->user) &middot; {{ $post->user->name }} @endif
      </p>

      @if($post->cover_image_path)
        <img src="{{ Storage::disk('public')->url($post->cover_image_path) }}" alt="{{ $post->title }}" style="width:100%;border-radius:14px;margin:20px 0;">
      @endif

      <div class="blog-post-body">
        {!! $post->body !!}
      </div>

      @if($post->categories->isNotEmpty() || $post->tags->isNotEmpty())
        <div style="margin-top:32px;display:flex;gap:8px;flex-wrap:wrap;">
          @foreach($post->categories as $category)
            <a href="{{ route('blog.category', $category->slug) }}" style="font-size:12px;padding:4px 10px;border-radius:999px;background:#f0fdfa;color:#0f766e;text-decoration:none;">{{ $category->name }}</a>
          @endforeach
          @foreach($post->tags as $tag)
            <a href="{{ route('blog.tag', $tag->slug) }}" style="font-size:12px;padding:4px 10px;border-radius:999px;background:#f2f4f7;color:#475467;text-decoration:none;">#{{ $tag->name }}</a>
          @endforeach
        </div>
      @endif
    </div>
  </article>
</main>

@include('marketing.partials.footer')

</body>
</html>
