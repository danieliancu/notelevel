<?php

namespace Tests\Feature;

use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class P1SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_responses_include_baseline_security_headers(): void
    {
        $this->seed(PlanSeeder::class);

        $this->get('/')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Content-Security-Policy');
    }

    public function test_local_csp_allows_the_active_vite_development_origin(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        config(['app.vite_dev_origin' => 'http://[::1]:5173']);
        $this->seed(PlanSeeder::class);

        $response = $this->get('/');
        $policy = (string) $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString('http://[::1]:5173', $policy);
        $this->assertStringContainsString('ws://[::1]:5173', $policy);
    }

    public function test_account_template_escapes_user_controlled_values(): void
    {
        $source = file_get_contents(resource_path('js/canvas.js'));

        $this->assertStringContainsString('name: escapeHtml', $source);
        $this->assertStringContainsString('${safeAccount.name}', $source);
        $this->assertStringNotContainsString('${data.name}', $source);
        $this->assertStringNotContainsString('${data.email}', $source);
    }
}
