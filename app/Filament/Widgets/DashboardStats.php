<?php

namespace App\Filament\Widgets;

use App\Models\AiUsage;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    /** SQL expression for a user's plan price normalized to a monthly amount. */
    private const MONTHLY_REVENUE_SQL = <<<'SQL'
        CASE
            WHEN plans.billing_interval = 'year' THEN (plans.price_cents / 100) / 12
            WHEN plans.billing_interval IS NULL THEN 0
            ELSE (plans.price_cents / 100)
        END
        SQL;

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $registeredUsers = User::where('role', '!=', 'guest')->count();

        $monthlyRevenue = (float) User::query()
            ->leftJoin('plans', 'plans.id', '=', 'users.plan_id')
            ->selectRaw('COALESCE(SUM('.self::MONTHLY_REVENUE_SQL.'), 0) as total')
            ->value('total');

        $monthlyExpenses = (float) AiUsage::query()
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('cost_gbp');

        $monthlyProfit = $monthlyRevenue - $monthlyExpenses;

        return [
            Stat::make('Total users', $totalUsers)
                ->description('All accounts, including guests')
                ->icon('heroicon-o-users')
                ->color('primary'),

            Stat::make('Registered users', $registeredUsers)
                ->description('Accounts that signed up (excludes guests)')
                ->icon('heroicon-o-user-plus')
                ->color('primary'),

            Stat::make('Revenue / month', '£'.number_format($monthlyRevenue, 2))
                ->description('Monthly recurring revenue from subscriptions')
                ->icon('heroicon-o-currency-pound')
                ->color('success'),

            Stat::make('Expenses / month', '£'.number_format($monthlyExpenses, 2))
                ->description('AI cost this month')
                ->icon('heroicon-o-banknotes')
                ->color('warning'),

            Stat::make('Margin / month', '£'.number_format($monthlyProfit, 2))
                ->description('Revenue minus expenses')
                ->icon('heroicon-o-chart-bar')
                ->color($monthlyProfit < 0 ? 'danger' : 'success'),
        ];
    }
}
