<?php

namespace App\Filament\Resources\CurrencyRates\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CurrencyRatesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Currency')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('symbol'),
                TextColumn::make('rate_to_gbp')
                    ->label('1 GBP =')
                    ->formatStateUsing(fn (float $state, $record) => number_format($state, 4).' '.$record->code)
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Last updated'),
            ])
            ->defaultSort('code')
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
