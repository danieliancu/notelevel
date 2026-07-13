<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use App\Services\StripeCheckoutFulfillment;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Stripe\Checkout\Session;
use Tests\TestCase;

class StripeCheckoutFulfillmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    private function fakeCheckoutSession(array $attributes): Session
    {
        return Session::constructFrom(array_merge([
            'id' => 'cs_test_'.uniqid(),
            'object' => 'checkout.session',
            'client_reference_id' => null,
            'customer' => 'cus_test',
            'customer_email' => null,
            'customer_details' => null,
            'subscription' => 'sub_test',
        ], $attributes));
    }

    public function test_it_creates_a_new_account_for_a_guest_checkout(): void
    {
        $session = $this->fakeCheckoutSession([
            'customer_details' => ['email' => 'newcustomer@example.com'],
        ]);

        $result = app(StripeCheckoutFulfillment::class)->fulfill($session);

        $this->assertTrue($result['isNewAccount']);
        $this->assertSame('newcustomer@example.com', $result['user']->email);
        $this->assertSame('premium', $result['user']->plan->name);
        $this->assertSame('active', $result['user']->stripe_subscription_status);
    }

    public function test_it_attaches_to_an_existing_account_found_by_email_without_duplicating(): void
    {
        $existing = User::factory()->create(['email' => 'already-here@example.com']);
        $session = $this->fakeCheckoutSession([
            'customer_details' => ['email' => 'already-here@example.com'],
        ]);

        $result = app(StripeCheckoutFulfillment::class)->fulfill($session);

        $this->assertFalse($result['isNewAccount']);
        $this->assertSame($existing->id, $result['user']->id);
        $this->assertSame(1, User::where('email', 'already-here@example.com')->count());
        $this->assertSame('premium', $existing->fresh()->plan->name);
    }

    public function test_it_uses_client_reference_id_for_authenticated_checkouts(): void
    {
        $user = User::factory()->create();
        $session = $this->fakeCheckoutSession(['client_reference_id' => (string) $user->id]);

        $result = app(StripeCheckoutFulfillment::class)->fulfill($session);

        $this->assertFalse($result['isNewAccount']);
        $this->assertSame($user->id, $result['user']->id);
    }

    public function test_it_throws_when_no_user_can_be_identified(): void
    {
        $session = $this->fakeCheckoutSession([]);

        $this->expectException(\RuntimeException::class);
        app(StripeCheckoutFulfillment::class)->fulfill($session);
    }
}
