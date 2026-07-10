<?php

namespace Tests\Feature;

use App\Filament\Pages\ProfitMargins;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ProfitMarginsSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_load_the_profit_margins_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin);

        Livewire::test(ProfitMargins::class)->assertOk();
    }

    public function test_non_admin_cannot_access_the_profit_margins_route(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get('/admin/profit-margins')
            ->assertForbidden();
    }
}
