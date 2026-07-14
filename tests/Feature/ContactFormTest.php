<?php

namespace Tests\Feature;

use App\Mail\ContactFormMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_loads(): void
    {
        $this->get('/contact')->assertOk()->assertSee('Contact us');
    }

    public function test_valid_submission_sends_email_to_configured_recipient(): void
    {
        Mail::fake();

        config(['app.contact_form_recipient' => 'dani.iancu@yahoo.com']);

        $response = $this->post('/contact', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'phone' => '0712345678',
            'email' => 'jane@example.com',
            'message' => 'Hello, interested in a school plan.',
        ]);

        $response->assertRedirect(route('contact'));
        $response->assertSessionHas('status');

        Mail::assertSent(ContactFormMail::class, function (ContactFormMail $mail) {
            return $mail->hasTo('dani.iancu@yahoo.com')
                && $mail->firstName === 'Jane'
                && $mail->lastName === 'Doe'
                && $mail->email === 'jane@example.com';
        });
    }

    public function test_missing_required_fields_are_rejected(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'phone' => '0712345678',
        ]);

        $response->assertSessionHasErrors(['first_name', 'last_name', 'email']);
        Mail::assertNothingSent();
    }

    public function test_optional_fields_can_be_omitted(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
        ]);

        $response->assertRedirect(route('contact'));
        Mail::assertSent(ContactFormMail::class);
    }
}
