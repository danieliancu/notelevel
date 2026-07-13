<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class BillingClaimTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_valid_signed_link_logs_the_user_in_and_shows_the_claim_form(): void
    {
        $user = User::factory()->create();
        $url = URL::temporarySignedRoute('billing.claim', now()->addMinutes(30), ['user' => $user->id]);

        $this->get($url)->assertOk()->assertSee('Set password');
        $this->assertTrue(Auth::check());
        $this->assertSame($user->id, Auth::id());
    }

    public function test_an_expired_link_is_rejected(): void
    {
        $user = User::factory()->create();
        $url = URL::temporarySignedRoute('billing.claim', now()->subMinute(), ['user' => $user->id]);

        $this->get($url)->assertForbidden();
        $this->assertFalse(Auth::check());
    }

    public function test_a_tampered_link_is_rejected(): void
    {
        $user = User::factory()->create();
        $url = URL::temporarySignedRoute('billing.claim', now()->addMinutes(30), ['user' => $user->id]);

        $this->get($url.'&tampered=1')->assertForbidden();
    }

    public function test_setting_a_password_through_the_claim_flow_logs_it_in_and_updates_the_plan_page(): void
    {
        $user = User::factory()->create();
        $url = URL::temporarySignedRoute('billing.claim', now()->addMinutes(30), ['user' => $user->id]);
        $this->get($url);

        $this->post(route('billing.claim.store', ['user' => $user->id]), [
            'password' => 'a-strong-new-password',
            'password_confirmation' => 'a-strong-new-password',
        ])->assertRedirect(route('account'));

        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('a-strong-new-password', $user->fresh()->password));
    }

    public function test_a_user_cannot_claim_someone_elses_account_from_their_own_session(): void
    {
        $victim = User::factory()->create();
        $attacker = User::factory()->create();

        $this->actingAs($attacker)->post(route('billing.claim.store', ['user' => $victim->id]), [
            'password' => 'whatever-password-123',
            'password_confirmation' => 'whatever-password-123',
        ])->assertForbidden();
    }
}
