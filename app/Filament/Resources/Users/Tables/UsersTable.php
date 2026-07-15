<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Stevebauman\Location\Facades\Location;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email address / IP')
                    ->getStateUsing(fn (User $record): string => $record->isGuest()
                        ? ($record->ip_address ?? '—')
                        : $record->email)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('email', 'like', "%{$search}%")
                            ->orWhere('ip_address', 'like', "%{$search}%");
                    }),
                TextColumn::make('location')
                    ->label('Location')
                    ->getStateUsing(fn (User $record): string => $record->isGuest() && $record->ip_address
                        ? self::resolveLocation($record->ip_address)
                        : '—'),
                TextColumn::make('role')
                    ->badge()
                    ->searchable(),
                TextColumn::make('plan.name')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('max_canvas_pages_override')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('max_pdfs_override')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('ai_monthly_cost_cap_gbp_override')
                    ->label('AI spend cap override')
                    ->formatStateUsing(fn (?float $state) => $state === null ? '—' : '£'.number_format($state, 2))
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('ai_usage_reset_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                //
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    /**
     * Looks up an IP's approximate location via the same stevebauman/location
     * package CurrencyResolver already uses for checkout currency detection.
     * Cached per IP for a week — this renders on every admin table page load,
     * and the underlying driver is a remote geolocation API call, not a free
     * local lookup, so caching keeps the page fast and avoids rate limits.
     */
    private static function resolveLocation(string $ip): string
    {
        if (in_array($ip, ['127.0.0.1', '::1'], true)) {
            return 'Local';
        }

        return Cache::remember("admin_users.geoip.{$ip}", now()->addWeek(), function () use ($ip) {
            try {
                $position = Location::get($ip);
            } catch (\Throwable) {
                return '—';
            }

            if (! $position || ! $position->countryName) {
                return '—';
            }

            return $position->cityName
                ? "{$position->cityName}, {$position->countryName}"
                : $position->countryName;
        });
    }
}
