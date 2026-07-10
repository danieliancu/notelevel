<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

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
}
