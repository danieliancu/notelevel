<?php

namespace App\Filament\Resources\Plans\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('display_name')
                    ->searchable(),
                TextColumn::make('price_cents')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('billing_interval')
                    ->searchable(),
                TextColumn::make('max_canvas_pages')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('max_pdfs')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('max_pdf_size_bytes')
                    ->label('Max PDF size')
                    ->formatStateUsing(fn (?int $state) => $state === null ? 'Unlimited' : round($state / (1024 * 1024), 1).' MB')
                    ->sortable(),
                IconColumn::make('pdf_export_allowed')
                    ->label('PDF export')
                    ->boolean(),
                TextColumn::make('max_favourites')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ai_monthly_cost_cap_gbp')
                    ->label('AI spend cap')
                    ->formatStateUsing(fn (?float $state) => $state === null ? 'Unlimited' : '£'.number_format($state, 2))
                    ->sortable(),
                IconColumn::make('is_default')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
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
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
