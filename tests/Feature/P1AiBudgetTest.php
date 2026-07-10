<?php

namespace Tests\Feature;

use App\Models\AiUsage;
use App\Models\Plan;
use App\Models\User;
use App\Services\AiBudgetService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class P1AiBudgetTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_reservations_cannot_collectively_exceed_the_cap(): void
    {
        $plan = Plan::create([
            'name' => 'limited',
            'display_name' => 'Limited',
            'price_cents' => 0,
            'ai_actions_allowed' => ['chat'],
            'ai_monthly_cost_cap_gbp' => 0.05,
        ]);
        $user = User::factory()->create(['plan_id' => $plan->id]);
        $service = app(AiBudgetService::class);

        $service->reserve($user, 'chat');

        $this->expectException(RuntimeException::class);
        $service->reserve($user, 'chat');
    }

    public function test_finalizing_usage_releases_the_reservation_and_records_cost(): void
    {
        $plan = Plan::create([
            'name' => 'metered',
            'display_name' => 'Metered',
            'price_cents' => 0,
            'ai_actions_allowed' => ['chat'],
            'ai_monthly_cost_cap_gbp' => 1,
        ]);
        $user = User::factory()->create(['plan_id' => $plan->id]);
        $service = app(AiBudgetService::class);
        $reservation = $service->reserve($user, 'chat');

        $service->finalize(
            $reservation,
            ['inputTokens' => 10, 'outputTokens' => 5],
            ['usd' => 0.01, 'gbp' => 0.008],
        );

        $this->assertDatabaseCount('ai_budget_reservations', 0);
        $this->assertSame(15, AiUsage::firstOrFail()->input_tokens + AiUsage::firstOrFail()->output_tokens);
    }

    public function test_ai_endpoint_is_rate_limited_per_user(): void
    {
        config(['ai.rate_limit_per_minute' => 2]);
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/canvas/ai', ['action' => 'unsupported'])->assertStatus(400);
        $this->postJson('/canvas/ai', ['action' => 'unsupported'])->assertStatus(400);
        $this->postJson('/canvas/ai', ['action' => 'unsupported'])->assertStatus(429);
    }
}
