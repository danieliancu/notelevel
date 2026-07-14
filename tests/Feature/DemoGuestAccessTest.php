<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoGuestAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_creates_a_pre_verified_guest_account(): void
    {
        $this->get('/demo')->assertOk();

        $guest = User::where('role', 'guest')->firstOrFail();

        $this->assertNotNull($guest->email_verified_at);
        $this->assertTrue($guest->hasVerifiedEmail());
    }

    public function test_guest_can_reach_dashboard_without_being_bounced_to_email_verification(): void
    {
        $this->get('/demo')->assertOk();

        $this->get('/dashboard')->assertOk();
    }

    public function test_dashboard_renders_in_demo_mode_for_guest_accounts(): void
    {
        $this->get('/demo')->assertOk();

        $this->get('/dashboard')->assertOk()->assertViewHas('isDemo', true);
    }
}
