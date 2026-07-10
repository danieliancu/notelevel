<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<x-seo-meta
    :title="$title.' | Notelevel'"
    :description="$description"
    :canonical="url()->current()"
/>

<link rel="icon" type="image/svg+xml" href="{{ asset('marketing/favicon.svg') }}" />
<link rel="apple-touch-icon" href="{{ asset('marketing/favicon.svg') }}" />
<meta name="theme-color" content="#008c86" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

@vite(['resources/css/marketing.css', 'resources/js/marketing.js'])
</head>
<body>

@include('marketing.partials.header')

<main>
  <section class="section">
    <div class="container legal-content">
      <span class="eyebrow">Legal</span>
      <h1>{{ $title }}</h1>
      <p class="legal-subtitle">Last updated: {{ $updatedAt }}</p>

      <div class="legal-body">
        @foreach($paragraphs as $paragraph)
          <p>{{ $paragraph }}</p>
        @endforeach
      </div>
    </div>
  </section>
</main>

@include('marketing.partials.footer')

</body>
</html>
