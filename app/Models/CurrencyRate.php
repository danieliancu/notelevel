<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CurrencyRate extends Model
{
    protected $fillable = [
        'code',
        'symbol',
        'rate_to_gbp',
    ];

    protected function casts(): array
    {
        return [
            'rate_to_gbp' => 'float',
        ];
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('currency_rates'));
        static::deleted(fn () => Cache::forget('currency_rates'));
    }
}
