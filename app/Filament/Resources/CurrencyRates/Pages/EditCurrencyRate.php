<?php

namespace App\Filament\Resources\CurrencyRates\Pages;

use App\Filament\Resources\CurrencyRates\CurrencyRateResource;
use Filament\Resources\Pages\EditRecord;

class EditCurrencyRate extends EditRecord
{
    protected static string $resource = CurrencyRateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}
