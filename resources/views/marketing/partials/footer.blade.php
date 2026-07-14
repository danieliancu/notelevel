<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a class="logo" href="{{ url('/') }}">
        <img class="logo-icon" src="{{ asset('marketing/favicon.svg') }}" width="20" height="20" alt="" />
        <span>note<span class="text-accent">level</span></span>
      </a>
      <p class="copyright">© 2026 Notelevel. All rights reserved.</p>
    </div>

    <nav class="footer-links">
      <a href="{{ url('/') }}#features">Features</a>
      <a href="{{ url('/') }}#ai-tools">AI Tools</a>
      <a href="{{ url('/') }}#templates">Compare</a>
      <a href="{{ url('/') }}#pricing">Pricing</a>
      <a href="{{ route('contact') }}">Contact us</a>
      <a href="{{ route('blog.index') }}">Blog</a>
      <a href="{{ url('/privacy') }}">Privacy</a>
      <a href="{{ url('/terms') }}">Terms</a>
      <a href="{{ url('/cookies') }}">Cookies</a>
    </nav>
  </div>
</footer>
