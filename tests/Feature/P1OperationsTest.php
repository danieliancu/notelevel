<?php

namespace Tests\Feature;

use App\Services\OperationalAlert;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class P1OperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_readiness_checks_database_cache_and_storage(): void
    {
        $this->getJson('/health/ready')
            ->assertOk()
            ->assertJsonPath('status', 'ready')
            ->assertJsonPath('checks.database', 'ok')
            ->assertJsonPath('checks.cache', 'ok')
            ->assertJsonPath('checks.storage', 'ok')
            ->assertHeader('X-Request-ID');
    }

    public function test_legal_pages_describe_ai_and_paused_email_features(): void
    {
        $this->seed(PlanSeeder::class);

        $this->get('/privacy')
            ->assertOk()
            ->assertSee('AI provider')
            ->assertSee('password recovery are temporarily disabled');

        $this->get('/cookies')
            ->assertOk()
            ->assertSee('essential cookies');
    }

    public function test_operational_exceptions_can_be_forwarded_to_an_alert_webhook(): void
    {
        Http::fake();
        config([
            'observability.alert_webhook_url' => 'https://alerts.example.test/hook',
            'observability.alert_cooldown_seconds' => 1,
        ]);

        app(OperationalAlert::class)->exception(new RuntimeException('Synthetic failure'));

        Http::assertSent(fn ($request) => $request->url() === 'https://alerts.example.test/hook'
            && $request['exception'] === RuntimeException::class
        );
    }
}
