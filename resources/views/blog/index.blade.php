<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<x-seo-meta
    :title="$heading.' — Notelevel Blog'"
    description="Guides, tips and product updates from the Notelevel team."
    :canonical="url()->current()"
/>

<link rel="icon" type="image/svg+xml" href="{{ asset('marketing/favicon.svg') }}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

@vite(['resources/css/marketing.css', 'resources/js/marketing.js'])
</head>
<body>

@include('marketing.partials.header')

<main>
  <section class="section">
    <div class="container">
      <div class="section-heading center">
        <h1>{{ $heading }}</h1>
      </div>

      @if($posts->isEmpty())
        <p style="text-align:center;color:var(--muted, #667085);">No posts yet — check back soon.</p>
      @else
        <div class="blog-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:32px;margin-top:32px;">
          @foreach($posts as $post)
            <article class="blog-card" style="border:1px solid rgba(16,24,40,0.08);border-radius:14px;overflow:hidden;">
              <a href="{{ route('blog.show', $post->slug) }}" style="text-decoration:none;color:inherit;">
                @if($post->cover_image_path)
                  <img src="{{ Storage::disk('public')->url($post->cover_image_path) }}" alt="{{ $post->title }}" style="width:100%;height:180px;object-fit:cover;display:block;">
                @endif
                <div style="padding:18px;">
                  <h3 style="margin:0 0 8px;font-size:18px;">{{ $post->title }}</h3>
                  @if($post->excerpt)
                    <p style="margin:0 0 10px;color:#667085;font-size:14px;">{{ Str::limit($post->excerpt, 120) }}</p>
                  @endif
                  <span style="font-size:12px;color:#98a2b3;">{{ $post->published_at?->format('d M Y') }}</span>
                </div>
              </a>
            </article>
          @endforeach
        </div>

        <div style="margin-top:32px;">
          {{ $posts->links() }}
        </div>
      @endif
    </div>
  </section>
</main>

@include('marketing.partials.footer')
@include('marketing.partials.accessibility-widget')

</body>
</html>
