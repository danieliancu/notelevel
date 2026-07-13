<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>Notelevel — AI-Powered Digital Notebook | Turn Messy Notes Into Clear Ideas</title>
<meta name="description" content="Notelevel is your AI-powered digital notebook for drawing, writing, planning and learning — without buying an expensive paper tablet. Start writing free." />
<meta name="robots" content="index, follow" />
<meta name="author" content="Notelevel" />
<link rel="canonical" href="https://notelevel.com/" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Notelevel" />
<meta property="og:title" content="Notelevel — AI-Powered Digital Notebook" />
<meta property="og:description" content="Turn messy notes into clear ideas. Write, draw, plan and let AI handle the rest — directly in your browser." />
<meta property="og:url" content="https://notelevel.com/" />
<meta property="og:image" content="https://notelevel.com/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Notelevel — AI-Powered Digital Notebook" />
<meta name="twitter:description" content="Turn messy notes into clear ideas. Write, draw, plan and let AI handle the rest — directly in your browser." />
<meta name="twitter:image" content="https://notelevel.com/assets/og-image.png" />

<!-- Icons -->
<link rel="icon" type="image/svg+xml" href="{{ asset('marketing/favicon.svg') }}" />
<link rel="apple-touch-icon" href="{{ asset('marketing/favicon.svg') }}" />
<meta name="theme-color" content="#008c86" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

@vite(['resources/css/marketing.css', 'resources/js/marketing.js'])

<!-- Structured data: Organization -->
<script type="application/ld+json">
@verbatim
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Notelevel",
  "url": "https://notelevel.com/",
  "logo": "https://notelevel.com/favicon.svg",
  "sameAs": [
    "https://twitter.com/notelevel",
    "https://youtube.com/@notelevel",
    "https://discord.gg/notelevel"
  ]
}
@endverbatim
</script>

<!-- Structured data: SoftwareApplication + pricing -->
<script type="application/ld+json">
@verbatim
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notelevel",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "description": "AI-powered digital notebook for drawing, writing, planning and learning, directly in the browser.",
  "url": "https://notelevel.com/",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "GBP"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "6.99",
      "priceCurrency": "GBP"
    }
  ]
}
@endverbatim
</script>
</head>
<body>

@include('marketing.partials.header')

<main>

  <!-- HERO -->
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-left">
        <span class="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          100% In-Browser Notebook
        </span>

        <h1 class="hero-title">Turn messy notes into<br /> <span class="text-accent">clear ideas.</span></h1>

        <p class="hero-desc">Your AI-powered digital notebook for drawing, writing, planning and learning — without buying an expensive paper tablet. <strong>No special device needed.</strong> Works with stylus, finger or mouse.</p>

        <div class="hero-buttons">
          @include('marketing.partials.cta-button', ['class' => 'btn btn-primary btn-lg'])
          @guest
          <a href="{{ route('demo') }}" class="btn btn-outline btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            Try demo
          </a>
          @endguest
        </div>
        <ul class="mini-features">
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            Unlimited pages
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            AI Assistant
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            Works anywhere
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
            Secure &amp; private
          </li>
        </ul>
      </div>

      <div class="hero-right" aria-label="Notelevel digital notebook interface preview">
        <div class="hero-carousel">
          <img class="hero-image" src="{{ asset('marketing/hero.webp') }}" alt="Notelevel digital notebook interface" />
          <img class="hero-image" src="{{ asset('marketing/hero-2.webp') }}" alt="" aria-hidden="true" />
          <img class="hero-image" src="{{ asset('marketing/hero-3.webp') }}" alt="" aria-hidden="true" />
          <img class="hero-image" src="{{ asset('marketing/hero.webp') }}" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>

  <!-- WHY -->
  <section class="section why" id="features">
    <div class="container why-inner">
      <div class="why-text">
        <span class="eyebrow">Why people choose Notelevel</span>
        <h2>Stop paying tablet prices for basic thinking.</h2>
        <p>reMarkable is beautiful, but expensive. Notelevel gives you the digital notebook experience plus AI help, directly in the browser.</p>
      </div>

      <div class="why-cards">
        <article class="card">
          <span class="icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
          </span>
          <h3>Write naturally</h3>
          <p>Pen, eraser, shapes, text, tables and paper guides. Everything you need to express ideas your way.</p>
        </article>
        <article class="card">
          <span class="icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
          </span>
          <h3>Organize documents</h3>
          <p>Save, duplicate, rename and reopen notebooks. All your work, always organized.</p>
        </article>
        <article class="card">
          <span class="icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </span>
          <h3>Ask AI</h3>
          <p>Improve drawings, text, homework and diagrams. Your AI thinking partner.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- AI TOOLS -->
  <section class="section ai-tools" id="ai-tools">
    <div class="container">
      <div class="section-heading center">
        <span class="eyebrow">AI that understands your page</span>
        <h2>AI that helps you think better.</h2>
      </div>

      <div class="ai-grid">
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            </span>
          </div>
          <h3>Clean up drawings</h3>
          <p>Straighten messy sketches and make them presentation-ready.</p>
        </article>
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
            </span>
          </div>
          <h3>Improve notes</h3>
          <p>Turn rough writing into structured, readable notes.</p>
        </article>
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
            </span>
          </div>
          <h3>Explain homework</h3>
          <p>Get step-by-step explanations, not just answers.</p>
        </article>
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </span>
          </div>
          <h3>Create infographics</h3>
          <p>Transform ideas into clean, beautiful visual layouts.</p>
        </article>
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            </span>
          </div>
          <h3>Summarize pages</h3>
          <p>Extract the key points from long notes in seconds.</p>
        </article>
        <article class="ai-card-tile">
          <div class="icon-wrap">
            <span class="icon-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
            </span>
          </div>
          <h3>Translate &amp; rewrite</h3>
          <p>Make your notes clearer in any language.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- COMPARISON -->
  <section class="section comparison" id="templates">
    <div class="ai-tools-sketch" aria-hidden="true">
      <img class="crayon-corner" src="{{ asset('marketing/crayon.webp') }}" alt="" loading="lazy" decoding="async" />
      <img class="ai-drawing ai-drawing-one" src="{{ asset('marketing/draw-1.webp') }}" alt="" loading="lazy" decoding="async" />
      <img class="eraser-corner" src="{{ asset('marketing/rubber.webp') }}" alt="" />
    </div>
    <div class="container comparison-inner">
      <div class="comparison-left">
        <span class="eyebrow">A smarter notebook, without the expensive device.</span>
        <div class="table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>reMarkable</th>
                <th class="accent-col">Notelevel</th>
              </tr>
            </thead>
            <tbody>
              <tr><td data-label="reMarkable">Expensive hardware</td><td class="accent-col" data-label="Notelevel">Runs in browser</td></tr>
              <tr><td data-label="reMarkable">Mostly writing-focused</td><td class="accent-col" data-label="Notelevel">Writing + AI</td></tr>
              <tr><td data-label="reMarkable">Limited flexibility</td><td class="accent-col" data-label="Notelevel">Text, drawing, tables, guides</td></tr>
              <tr><td data-label="reMarkable">Device locked</td><td class="accent-col" data-label="Notelevel">Use tablet, laptop, Chromebook</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="comparison-right">
        <span class="eyebrow">Built for people who think visually</span>
        <ul class="audience-list">
          <li>
            <span class="icon-circle small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg></span>
            <span><strong>Students</strong><small>Homework, notes, explanations</small></span>
          </li>
          <li>
            <span class="icon-circle small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg></span>
            <span><strong>Creators</strong><small>Sketches, diagrams, storyboards</small></span>
          </li>
          <li>
            <span class="icon-circle small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg></span>
            <span><strong>Teachers</strong><small>Corrections, feedback, lesson planning</small></span>
          </li>
          <li>
            <span class="icon-circle small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></span>
            <span><strong>Founders</strong><small>Ideas, wireframes, product notes</small></span>
          </li>
          <li>
            <span class="icon-circle small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg></span>
            <span><strong>Designers</strong><small>Quick concepts and visual thinking</small></span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- PRODUCT DEMO -->
  <section class="section product-demo">
    <video class="product-demo-video" muted loop playsinline preload="metadata" poster="{{ asset('marketing/0_Woman_Businesswoman_small.webp') }}" aria-hidden="true">
      <source src="{{ asset('marketing/0_Woman_Businesswoman_small.mp4') }}" type="video/mp4" media="(min-width: 601px)" />
    </video>
    <div class="container demo-inner">
      <div class="demo-text">
        <span class="eyebrow">Simple tools. Powerful results.</span>
        <h2>A clean, distraction-free workspace with everything at hand.</h2>
        <p>Write, draw, plan and let AI handle the rest.</p>
        <div class="demo-feature-list">
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M32 12v40"></path>
              <path d="M12 32h40"></path>
            </svg>
            <strong>Folders</strong>
            <span>Organize files into clear folders.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M12 52 20 32 44 8l12 12-24 24-20 8Z"></path>
              <path d="m39 13 12 12"></path>
              <path d="m20 32 12 12"></path>
            </svg>
            <strong>Pen</strong>
            <span>Write, sketch and mark up ideas.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M42 9 55 22 29 48H14L8 42 42 9Z"></path>
              <path d="M30 21 43 34"></path>
              <path d="M14 48h36"></path>
            </svg>
            <strong>Eraser</strong>
            <span>Clean strokes, keep your flow.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M16 16h32"></path>
              <path d="M32 16v36"></path>
              <path d="M24 52h16"></path>
            </svg>
            <strong>Text</strong>
            <span>Add clear labels, notes and headings.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M32 6c3.9 14.1 11.9 22.1 26 26-14.1 3.9-22.1 11.9-26 26C28.1 43.9 20.1 35.9 6 32 20.1 28.1 28.1 20.1 32 6Z"></path>
              <path d="M15 0c1.8 6.5 5.5 10.2 12 12-6.5 1.8-10.2 5.5-12 12C13.2 17.5 9.5 13.8 3 12c6.5-1.8 10.2-5.5 12-12Z"></path>
              <path d="M49 5c1.3 4.8 4.2 7.7 9 9-4.8 1.3-7.7 4.2-9 9-1.3-4.8-4.2-7.7-9-9 4.8-1.3 7.7-4.2 9-9Z"></path>
            </svg>
            <strong>AI</strong>
            <span>Improve rough notes with AI help.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="28" cy="28" r="16"></circle>
              <path d="m40 40 12 12"></path>
            </svg>
            <strong>Search</strong>
            <span>Find pages, topics and details.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M14 14h12v38H14z"></path>
              <path d="M28 14h12v38H28z"></path>
              <path d="M42 18h8l6 32-8 2z"></path>
              <path d="M18 24h4"></path>
              <path d="M32 24h4"></path>
            </svg>
            <strong>Library</strong>
            <span>Keep notebooks ready.</span>
          </div>
          <div class="demo-feature">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="22" r="11"></circle>
              <path d="M14 54c3.5-12 12-18 18-18s14.5 6 18 18"></path>
            </svg>
            <strong>Login</strong>
            <span>Sign in and keep work synced.</span>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- PRICING -->
  <section class="section pricing" id="pricing">
    <div class="container">
      <div class="section-heading center">
        <span class="eyebrow">Start simple. Upgrade when AI becomes useful.</span>
      </div>

      <div class="pricing-grid">
        <aside class="pricing-cta">
          <h3>Your notebook should do more than store pages.</h3>
          <p>Write freely. Think visually. Let AI make it clearer.</p>
          @include('marketing.partials.cta-button', ['class' => 'btn btn-primary'])
          <ul class="price-features">
            <li>No credit card required.</li>
            <li>Limited pages</li>
            <li>Basic AI tools</li>
            <li>Import PDF (up to 3, 2MB each)</li>
            <li>Export JPG</li>
          </ul>
        </aside>

        <article class="price-card highlighted">
          <span class="popular-badge">Most popular</span>
          <h3>Pro</h3>
          <p class="price-desc">AI cleanup, summaries, explanations, export, unlimited notebooks.</p>
          <p class="price"><span class="amount">{{ $premiumPrice['symbol'] }}{{ number_format($premiumPrice['amount'], 2) }}</span><span class="period">/month</span></p>
          <form method="POST" action="{{ route('billing.checkout') }}">
            @csrf
            <button type="submit" class="btn btn-primary btn-block">Start Pro</button>
          </form>
          <ul class="price-features">
            <li>All Free features</li>
            <li>Advanced AI tools</li>
            <li>Unlimited notebooks</li>
            <li>Import PDF (unlimited, up to 20MB each)</li>
            <li>Export PDF &amp; JPG</li>
            <li>Priority support</li>
          </ul>
        </article>

        <article class="price-card">
          <h3>Teams / Schools</h3>
          <p class="price-desc">For classrooms, tutoring and shared workspaces.</p>
          <p class="price"><span class="amount amount-custom">Custom pricing</span></p>
          <a href="#contact" class="btn btn-outline btn-block">Contact us</a>
          <ul class="price-features">
            <li>Everything in Pro</li>
            <li>Team folders</li>
            <li>User management</li>
            <li>Priority support</li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- NEWSLETTER -->
  <section class="newsletter">
    <div class="container newsletter-inner">
      <div class="newsletter-text">
        <h2>Get product updates first</h2>
        <p>New AI tools, notebook templates and product news — sent straight to your inbox, no spam.</p>
      </div>

      <form class="newsletter-form" action="#" method="post">
        <label class="newsletter-label" for="newsletter-email">Email address</label>
        <div class="newsletter-field">
          <input type="email" id="newsletter-email" name="email" placeholder="you@email.com" required />
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </div>
      </form>
    </div>

    <p class="newsletter-disclaimer">By subscribing, you allow Notelevel to email you product updates. Unsubscribe whenever you like. Read our <a href="{{ url('/privacy') }}">Privacy Policy</a>.</p>
  </section>

</main>

@include('marketing.partials.footer')

</body>
</html>
