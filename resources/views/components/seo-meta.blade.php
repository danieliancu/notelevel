@props([
    'title',
    'description',
    'canonical',
    'image' => asset('marketing/favicon.svg'),
    'type' => 'website',
    'noindex' => false,
])

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}" />
<meta name="robots" content="{{ $noindex ? 'noindex, nofollow' : 'index, follow' }}" />
<link rel="canonical" href="{{ $canonical }}" />

<!-- Open Graph -->
<meta property="og:type" content="{{ $type }}" />
<meta property="og:site_name" content="Notelevel" />
<meta property="og:title" content="{{ $title }}" />
<meta property="og:description" content="{{ $description }}" />
<meta property="og:url" content="{{ $canonical }}" />
<meta property="og:image" content="{{ $image }}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ $title }}" />
<meta name="twitter:description" content="{{ $description }}" />
<meta name="twitter:image" content="{{ $image }}" />
