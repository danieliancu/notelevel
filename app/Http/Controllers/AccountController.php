<?php

namespace App\Http\Controllers;

use App\Models\AiUsage;
use App\Models\Document;
use App\Models\Pdf;
use App\Services\CurrencyResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    public function index(Request $request, CurrencyResolver $currency)
    {
        $data = $this->summaryData();
        $user = $data['user'];
        $currencyCode = $currency->resolveCurrencyCode($request);
        $data['planPrice'] = $currency->convert($user->plan?->price_cents ?? 0, $currencyCode);

        return view('account.index', $data);
    }

    public function summary(Request $request, CurrencyResolver $currency)
    {
        $data = $this->summaryData();
        $user = $data['user'];
        $currencyCode = $currency->resolveCurrencyCode($request);
        $planPrice = $currency->convert($user->plan?->price_cents ?? 0, $currencyCode);

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'memberSince' => $user->created_at->format('d M Y'),
            'role' => $user->role,
            'plan' => [
                'name' => $user->plan?->display_name ?? 'Free',
                'isPremium' => ($user->plan?->name ?? 'free') === 'premium',
                'priceAmount' => $planPrice['amount'],
                'priceSymbol' => $planPrice['symbol'],
                'currencyCode' => $planPrice['code'],
                'billingInterval' => $user->plan?->billing_interval,
            ],
            'aiUsage' => [
                'tokensUsed' => $data['tokensUsed'],
                'pct' => $data['costPct'],
                'unlimited' => $data['costCap'] === null,
                'resetsOn' => $user->nextAiUsageResetAt()->format('d M'),
            ],
            'canvasPages' => [
                'used' => $data['pagesUsed'],
                'cap' => $data['pagesCap'],
            ],
            'pdfs' => [
                'used' => $data['pdfsUsed'],
                'cap' => $data['pdfsCap'],
                'sizeCapMb' => $data['pdfSizeCapBytes'] !== null ? round($data['pdfSizeCapBytes'] / (1024 * 1024), 1) : null,
            ],
        ]);
    }

    private function summaryData(): array
    {
        $user = auth()->user()->load('plan');

        $monthStart = $user->currentAiUsageCycleStart();

        $tokensUsed = (int) AiUsage::where('user_id', $user->id)
            ->where('created_at', '>=', $monthStart)
            ->sum(DB::raw('input_tokens + output_tokens'));

        $costCap = $user->effectiveAiMonthlyCostCapGbp();

        $costThisMonth = (float) AiUsage::where('user_id', $user->id)
            ->where('created_at', '>=', $monthStart)
            ->sum('cost_gbp');

        $costPct = $costCap ? min(100, round(($costThisMonth / max($costCap, 0.0001)) * 100)) : null;

        $usageByAction = AiUsage::where('user_id', $user->id)
            ->where('created_at', '>=', $monthStart)
            ->selectRaw('action, COUNT(*) as calls, SUM(input_tokens + output_tokens) as tokens')
            ->groupBy('action')
            ->get()
            ->keyBy('action');

        $pagesUsed = (int) Document::sum('page_count');
        $pagesCap = $user->effectiveMaxCanvasPages();

        $pdfsUsed = Pdf::count();
        $pdfsCap = $user->effectiveMaxPdfs();
        $pdfSizeCapBytes = $user->effectiveMaxPdfSizeBytes();

        return [
            'user' => $user,
            'tokensUsed' => $tokensUsed,
            'costCap' => $costCap,
            'costThisMonth' => $costThisMonth,
            'costPct' => $costPct,
            'usageByAction' => $usageByAction,
            'pagesUsed' => $pagesUsed,
            'pagesCap' => $pagesCap,
            'pdfsUsed' => $pdfsUsed,
            'pdfsCap' => $pdfsCap,
            'pdfSizeCapBytes' => $pdfSizeCapBytes,
        ];
    }
}
