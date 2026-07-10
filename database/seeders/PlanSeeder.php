<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::updateOrCreate(['name' => 'free'], [
            'display_name' => 'Free',
            'price_cents' => 0,
            'billing_interval' => null,
            'max_canvas_pages' => 20,
            'max_pdfs' => 3,
            'max_pdf_size_bytes' => 2 * 1024 * 1024,
            'pdf_export_allowed' => false,
            'max_favourites' => 10,
            'ai_actions_allowed' => ['translate', 'chat', 'read'],
            'ai_monthly_cost_cap_gbp' => 0.10,
            'is_default' => true,
            'sort_order' => 0,
        ]);

        Plan::updateOrCreate(['name' => 'premium'], [
            'display_name' => 'Premium',
            'price_cents' => 699,
            'billing_interval' => 'month',
            'max_canvas_pages' => null,
            'max_pdfs' => null,
            'max_pdf_size_bytes' => 20 * 1024 * 1024,
            'pdf_export_allowed' => true,
            'max_favourites' => null,
            'ai_actions_allowed' => ['translate', 'chat', 'read'],
            'ai_monthly_cost_cap_gbp' => null,
            'is_default' => false,
            'sort_order' => 1,
        ]);

        // Ephemeral plan for anonymous "Try demo" visitors (see GuestSession).
        // Guest accounts are deleted and recreated per IP on each new demo
        // session (see DemoController), so this cap is effectively "per session"
        // rather than calendar-monthly like the other plans.
        Plan::updateOrCreate(['name' => 'guest'], [
            'display_name' => 'Demo',
            'price_cents' => 0,
            'billing_interval' => null,
            'max_canvas_pages' => 5,
            'max_pdfs' => 1,
            'max_pdf_size_bytes' => 2 * 1024 * 1024,
            'pdf_export_allowed' => true,
            'max_favourites' => 5,
            'ai_actions_allowed' => ['translate', 'chat', 'read'],
            'ai_monthly_cost_cap_gbp' => 0.05,
            'is_default' => false,
            'sort_order' => 2,
        ]);
    }
}
