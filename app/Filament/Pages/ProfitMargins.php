<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Users\Schemas\UserForm;
use App\Models\User;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProfitMargins extends Page implements HasTable
{
    use InteractsWithTable;

    protected string $view = 'filament.pages.profit-margins';

    protected static ?string $navigationLabel = 'Users';

    protected static ?string $title = 'Users';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCurrencyPound;

    /** SQL expression for a user's plan price normalized to a monthly amount. */
    private const MONTHLY_REVENUE_SQL = <<<'SQL'
        CASE
            WHEN plans.billing_interval = 'year' THEN (plans.price_cents / 100) / 12
            WHEN plans.billing_interval IS NULL THEN 0
            ELSE (plans.price_cents / 100)
        END
        SQL;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::query()
                    ->where('users.role', '!=', 'guest')
                    ->leftJoin('plans', 'plans.id', '=', 'users.plan_id')
                    ->select('users.*')
                    ->selectRaw(self::MONTHLY_REVENUE_SQL.' as monthly_revenue')
                    ->with('plan')
                    ->withSum(['aiUsages as ai_cost_this_month' => function ($query) {
                        $query->where('created_at', '>=', now()->startOfMonth());
                    }], 'cost_gbp')
            )
            ->columns([
                TextColumn::make('name')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('users.name', 'like', "%{$search}%")
                            ->orWhere('users.email', 'like', "%{$search}%");
                    })
                    ->description(fn (User $record): string => $record->email),
                TextColumn::make('plan.display_name')
                    ->label('Plan'),
                TextColumn::make('monthly_revenue')
                    ->label('Monthly revenue')
                    ->money('GBP')
                    ->sortable()
                    ->summarize(Sum::make()->money('GBP')),
                TextColumn::make('ai_cost_this_month')
                    ->label('AI cost (this month)')
                    ->state(fn (User $record): float => (float) ($record->ai_cost_this_month ?? 0))
                    ->money('GBP')
                    ->sortable()
                    ->summarize(Sum::make()->money('GBP')),
                TextColumn::make('margin')
                    ->label('Margin')
                    ->state(function (User $record): float {
                        return (float) $record->monthly_revenue - (float) ($record->ai_cost_this_month ?? 0);
                    })
                    ->money('GBP')
                    ->color(fn (float $state): string => $state < 0 ? 'danger' : 'success')
                    ->weight('bold')
                    ->sortable(query: function (Builder $query, string $direction) {
                        $query->orderByRaw(
                            '(monthly_revenue - COALESCE(ai_cost_this_month, 0)) '.$direction
                        );
                    })
                    ->summarize(
                        Summarizer::make()
                            ->using(fn ($query) => $query->selectRaw(
                                'SUM(monthly_revenue - COALESCE(ai_cost_this_month, 0)) as total'
                            )->value('total'))
                            ->money('GBP')
                    ),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->options([
                        'user' => 'User',
                        'admin' => 'Admin',
                    ]),
            ])
            ->recordActions([
                EditAction::make()
                    ->schema(fn (Schema $schema): Schema => UserForm::configure($schema)),
            ])
            ->defaultSort(function (Builder $query, string $direction) {
                return $query->orderByRaw(
                    '(monthly_revenue - COALESCE(ai_cost_this_month, 0)) '.$direction
                );
            }, 'asc');
    }
}
