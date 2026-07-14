<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterSubscriptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subscriberEmail,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscriber from Notelevel',
            replyTo: [$this->subscriberEmail],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.newsletter-subscription',
        );
    }
}
