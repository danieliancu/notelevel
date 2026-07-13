<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PausedEmailFeaturesTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_sends_verification_email_and_blocks_dashboard_until_verified(): void
    {
        Notification::fake();

        $response = $this->post('/register', [
            'name' => 'Direct User',
            'email' => 'direct@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'direct@example.com')->firstOrFail();
        $this->assertNull($user->email_verified_at);
        Notification::assertSentTo($user, VerifyEmail::class);

        $response->assertRedirect('/dashboard');
        $this->get('/dashboard')->assertRedirect(route('verification.notice'));
    }

    public function test_email_verification_routes_are_enabled(): void
    {
        $this->assertTrue(Route::has('verification.notice'));
        $this->assertTrue(Route::has('verification.send'));

        $user = User::factory()->unverified()->create();
        $this->actingAs($user)->get('/verify-email')->assertOk();
    }

    public function test_password_reset_routes_are_disabled(): void
    {
        $this->assertFalse(Route::has('password.request'));
        $this->assertFalse(Route::has('password.email'));
        $this->assertFalse(Route::has('password.reset'));
        $this->assertFalse(Route::has('password.store'));
        $this->get('/forgot-password')->assertNotFound();
        $this->post('/forgot-password', ['email' => 'direct@example.com'])->assertNotFound();
    }
}
