<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<x-seo-meta
    title="Contact us | Notelevel"
    description="Get in touch with the Notelevel team."
    :canonical="url()->current()"
/>
<meta name="robots" content="noindex, follow" />

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
      <span class="eyebrow">Contact</span>
      <h1>Contact us</h1>
      <p class="legal-subtitle">Have a question or want to talk about a team/school plan? Send us a message and we'll get back to you.</p>

      @if(session('status'))
        <div class="contact-status" role="status">{{ session('status') }}</div>
      @endif

      <form method="POST" action="{{ route('contact.send') }}" class="contact-form" novalidate>
        @csrf

        <div class="contact-form-row">
          <div class="contact-field">
            <label for="first_name">First name*</label>
            <input type="text" id="first_name" name="first_name" value="{{ old('first_name') }}" required maxlength="100" autocomplete="given-name" />
            @error('first_name')<span class="contact-field-error">{{ $message }}</span>@enderror
          </div>

          <div class="contact-field">
            <label for="last_name">Last name*</label>
            <input type="text" id="last_name" name="last_name" value="{{ old('last_name') }}" required maxlength="100" autocomplete="family-name" />
            @error('last_name')<span class="contact-field-error">{{ $message }}</span>@enderror
          </div>
        </div>

        <div class="contact-form-row">
          <div class="contact-field">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value="{{ old('phone') }}" maxlength="30" autocomplete="tel" />
            @error('phone')<span class="contact-field-error">{{ $message }}</span>@enderror
          </div>

          <div class="contact-field">
            <label for="email">Email*</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}" required maxlength="255" autocomplete="email" />
            @error('email')<span class="contact-field-error">{{ $message }}</span>@enderror
          </div>
        </div>

        <div class="contact-field">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="6" maxlength="5000">{{ old('message') }}</textarea>
          @error('message')<span class="contact-field-error">{{ $message }}</span>@enderror
        </div>

        <button type="submit" class="btn btn-primary btn-lg">Send message</button>
      </form>
    </div>
  </section>
</main>

@include('marketing.partials.footer')

</body>
</html>
