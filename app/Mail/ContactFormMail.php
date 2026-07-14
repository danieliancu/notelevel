<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $firstName,
        public string $lastName,
        public string $email,
        public ?string $phone,
        public ?string $messageText,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Contact form: {$this->firstName} {$this->lastName}",
            replyTo: [$this->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-form',
        );
    }
}
