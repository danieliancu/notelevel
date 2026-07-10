<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PausedEmailFeaturesTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_logs_user_in_without_email_verification(): void
    {
        $response = $this->post('/register', [
            'name' => 'Direct User',
            'email' => 'direct@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $this->assertNull(User::where('email', 'direct@example.com')->firstOrFail()->email_verified_at);
        $response->assertRedirect('/dashboard');

        $this->get('/dashboard')->assertOk();
    }

    public function test_email_verification_routes_are_disabled(): void
    {
        $this->assertFalse(Route::has('verification.notice'));
        $this->assertFalse(Route::has('verification.send'));
        $this->get('/verify-email')->assertNotFound();
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
