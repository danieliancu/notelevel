<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\CurrencyResolver;
use Illuminate\Http\Request;

class MarketingController extends Controller
{
    public function home(Request $request, CurrencyResolver $currency)
    {
        $premiumPlan = Plan::where('name', 'premium')->first();
        $currencyCode = $currency->resolveCurrencyCode($request);
        $premiumPrice = $currency->convert($premiumPlan->price_cents ?? 0, $currencyCode);

        return view('marketing.home', [
            'premiumPrice' => $premiumPrice,
            'isPremium' => auth()->check() && auth()->user()->plan?->name === 'premium',
        ]);
    }
}
