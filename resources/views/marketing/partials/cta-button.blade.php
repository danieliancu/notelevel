@auth
  <a class="{{ $class }}" href="{{ route('dashboard') }}">
    {{ Str::before(auth()->user()->name, ' ') }}'s Notebook
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </a>
@else
  <a class="{{ $class }}" href="{{ route('register') }}">Start writing free</a>
@endauth
