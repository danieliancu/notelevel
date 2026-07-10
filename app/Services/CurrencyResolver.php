<?php

namespace App\Services;

use App\Models\CurrencyRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Stevebauman\Location\Facades\Location;

class CurrencyResolver
{
    /** ISO 3166-1 alpha-2 codes for EU member states. */
    private const EU_COUNTRY_CODES = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ];

    private const DEFAULT_CURRENCY = 'USD';

    public function resolveCurrencyCode(Request $request): string
    {
        if ($request->session()->has('currency_code')) {
            return $request->session()->get('currency_code');
        }

        $code = $this->detectCurrencyCode($request);
        $request->session()->put('currency_code', $code);

        return $code;
    }

    private function detectCurrencyCode(Request $request): string
    {
        $position = Location::get($request->ip());

        if (! $position || empty($position->countryCode)) {
            return self::DEFAULT_CURRENCY;
        }

        return match (true) {
            $position->countryCode === 'GB' => 'GBP',
            in_array($position->countryCode, self::EU_COUNTRY_CODES, true) => 'EUR',
            $position->countryCode === 'US' => 'USD',
            $position->countryCode === 'AU' => 'AUD',
            $position->countryCode === 'CA' => 'CAD',
            default => self::DEFAULT_CURRENCY,
        };
    }

    /**
     * @return array{amount: float, symbol: string, code: string}
     */
    public function convert(int $priceCentsGbp, string $currencyCode): array
    {
        $rates = $this->rates();
        $rate = $rates[$currencyCode] ?? $rates[self::DEFAULT_CURRENCY] ?? null;

        if ($rate === null) {
            return ['amount' => $priceCentsGbp / 100, 'symbol' => '£', 'code' => 'GBP'];
        }

        return [
            'amount' => round(($priceCentsGbp / 100) * $rate['rate_to_gbp'], 2),
            'symbol' => $rate['symbol'],
            'code' => $rate['code'],
        ];
    }

    /**
     * @return array<string, array{code: string, symbol: string, rate_to_gbp: float}>
     */
    private function rates(): array
    {
        return Cache::remember('currency_rates', 3600, function () {
            return CurrencyRate::all()
                ->keyBy('code')
                ->map(fn (CurrencyRate $rate) => [
                    'code' => $rate->code,
                    'symbol' => $rate->symbol,
                    'rate_to_gbp' => $rate->rate_to_gbp,
                ])
                ->all();
        });
    }
}
