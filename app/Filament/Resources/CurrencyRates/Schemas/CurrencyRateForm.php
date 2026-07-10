<?php

namespace App\Filament\Resources\CurrencyRates\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CurrencyRateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->label('Currency code')
                    ->disabled()
                    ->dehydrated(false),
                TextInput::make('symbol')
                    ->required(),
                TextInput::make('rate_to_gbp')
                    ->label('Rate (units per 1 GBP)')
                    ->helperText('Example: if 1 GBP = 1.17 EUR, enter 1.17.')
                    ->required()
                    ->numeric()
                    ->step(0.000001),
            ]);
    }
}
