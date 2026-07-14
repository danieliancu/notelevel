<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="{{ url('/') }}">
      <img class="logo-icon" src="{{ asset('marketing/favicon.svg') }}" width="22" height="22" alt="" />
      <span>note<span class="text-accent">level</span></span>
    </a>

    <nav class="main-nav" id="main-nav">
      <a href="{{ url('/') }}#features">Features</a>
      <a href="{{ url('/') }}#ai-tools">AI Tools</a>
      <a href="{{ url('/') }}#templates">Compare</a>
      <a href="{{ url('/') }}#pricing">Pricing</a>
      <a href="{{ route('blog.index') }}">Blog</a>
    </nav>

    <div class="header-actions">
      @include('marketing.partials.cta-button', ['class' => 'btn btn-primary btn-sm'])
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
    </div>
  </div>

  <nav class="mobile-nav" id="mobile-nav">
    <a href="{{ url('/') }}#features">Features</a>
    <a href="{{ url('/') }}#ai-tools">AI Tools</a>
    <a href="{{ url('/') }}#templates">Templates</a>
    <a href="{{ url('/') }}#pricing">Pricing</a>
    <a href="{{ route('blog.index') }}">Blog</a>
    @include('marketing.partials.cta-button', ['class' => 'btn btn-primary'])
  </nav>
</header>
