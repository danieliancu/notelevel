<?php

namespace Database\Seeders;

use App\Models\CurrencyRate;
use Illuminate\Database\Seeder;

class CurrencyRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            ['code' => 'GBP', 'symbol' => '£', 'rate_to_gbp' => 1.0],
            ['code' => 'EUR', 'symbol' => '€', 'rate_to_gbp' => 1.17],
            ['code' => 'USD', 'symbol' => '$', 'rate_to_gbp' => 1.27],
            ['code' => 'AUD', 'symbol' => 'A$', 'rate_to_gbp' => 1.93],
            ['code' => 'CAD', 'symbol' => 'C$', 'rate_to_gbp' => 1.74],
        ];

        foreach ($rates as $rate) {
            CurrencyRate::updateOrCreate(['code' => $rate['code']], $rate);
        }
    }
}
