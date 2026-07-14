<x-mail::message>
# New contact form submission

**Name:** {{ $firstName }} {{ $lastName }}

**Email:** {{ $email }}

@if($phone)
**Phone:** {{ $phone }}

@endif
@if($messageText)
**Message:**

{{ $messageText }}
@else
No message was provided.
@endif

Reply directly to this email to respond to {{ $firstName }}.
</x-mail::message>
