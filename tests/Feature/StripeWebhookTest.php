<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const WEBHOOK_SECRET = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.stripe.webhook_secret', self::WEBHOOK_SECRET);
        $this->seed(PlanSeeder::class);
    }

    private function postSignedWebhook(array $event): \Illuminate\Testing\TestResponse
    {
        $payload = json_encode($event, JSON_THROW_ON_ERROR);
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", self::WEBHOOK_SECRET);

        return $this->call(
            'POST',
            '/stripe/webhook',
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Stripe-Signature' => "t={$timestamp},v1={$signature}",
            ],
            $payload,
        );
    }

    public function test_checkout_completed_activates_premium_plan(): void
    {
        $user = User::factory()->create();
        $freePlan = Plan::where('is_default', true)->firstOrFail();
        $this->assertSame($freePlan->id, $user->plan_id);

        $this->postSignedWebhook([
            'id' => 'evt_test_1',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => ['object' => [
                'id' => 'cs_test_1',
                'object' => 'checkout.session',
                'client_reference_id' => (string) $user->id,
                'customer' => 'cus_test_1',
                'subscription' => 'sub_test_1',
            ]],
        ])->assertOk();

        $user->refresh();
        $premiumPlan = Plan::where('name', 'premium')->firstOrFail();
        $this->assertSame($premiumPlan->id, $user->plan_id);
        $this->assertSame('cus_test_1', $user->stripe_customer_id);
        $this->assertSame('sub_test_1', $user->stripe_subscription_id);
        $this->assertSame('active', $user->stripe_subscription_status);
    }

    public function test_subscription_deleted_downgrades_to_free_plan(): void
    {
        $premiumPlan = Plan::where('name', 'premium')->firstOrFail();
        $user = User::factory()->create([
            'plan_id' => $premiumPlan->id,
            'stripe_customer_id' => 'cus_test_2',
            'stripe_subscription_id' => 'sub_test_2',
            'stripe_subscription_status' => 'active',
        ]);

        $this->postSignedWebhook([
            'id' => 'evt_test_2',
            'object' => 'event',
            'type' => 'customer.subscription.deleted',
            'data' => ['object' => [
                'id' => 'sub_test_2',
                'object' => 'subscription',
                'status' => 'canceled',
            ]],
        ])->assertOk();

        $user->refresh();
        $freePlan = Plan::where('is_default', true)->firstOrFail();
        $this->assertSame($freePlan->id, $user->plan_id);
        $this->assertSame('canceled', $user->stripe_subscription_status);
    }

    public function test_invalid_signature_is_rejected(): void
    {
        $payload = json_encode(['id' => 'evt_test_3', 'type' => 'checkout.session.completed'], JSON_THROW_ON_ERROR);

        $this->call(
            'POST',
            '/stripe/webhook',
            [],
            [],
            [],
            ['CONTENT_TYPE' => 'application/json', 'HTTP_Stripe-Signature' => 't=1,v1=not-a-valid-signature'],
            $payload,
        )->assertStatus(400);
    }
}
