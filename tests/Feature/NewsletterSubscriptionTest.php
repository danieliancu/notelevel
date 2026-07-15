<?php

namespace Tests\Feature;

use App\Mail\NewsletterSubscriptionMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NewsletterSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_email_sends_notification_to_configured_recipient(): void
    {
        Mail::fake();

        config(['app.contact_form_recipient' => 'dani.iancu@yahoo.com']);

        $response = $this->from('/')->post('/newsletter/subscribe', [
            'email' => 'reader@example.com',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHas('status');

        Mail::assertSent(NewsletterSubscriptionMail::class, function (NewsletterSubscriptionMail $mail) {
            return $mail->hasTo('dani.iancu@yahoo.com')
                && $mail->subscriberEmail === 'reader@example.com'
                && $mail->envelope()->subject === 'Subscriber from Notelevel';
        });
    }

    public function test_invalid_email_is_rejected(): void
    {
        Mail::fake();

        $response = $this->from('/')->post('/newsletter/subscribe', [
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors(['email']);
        Mail::assertNothingSent();
    }

    public function test_filled_honeypot_field_is_rejected(): void
    {
        Mail::fake();

        $response = $this->from('/')->post('/newsletter/subscribe', [
            'email' => 'reader@example.com',
            'website' => 'https://spammer.example.com',
        ]);

        $response->assertSessionHasErrors(['website']);
        Mail::assertNothingSent();
    }
}
