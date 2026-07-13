<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\CurrencyResolver;
use App\Services\StripeCheckoutFulfillment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;
use Stripe\StripeClient;

class BillingController extends Controller
{
    public function checkout(Request $request, CurrencyResolver $currency): RedirectResponse
    {
        $user = $request->user();
        $stripe = new StripeClient(config('services.stripe.secret'));

        // Charge in the same currency the visitor already saw on the pricing
        // page (via CurrencyResolver), instead of letting Stripe's Adaptive
        // Pricing negotiate its own currency and show a switcher.
        $currencyCode = strtolower($currency->resolveCurrencyCode($request));

        $params = [
            'mode' => 'subscription',
            'currency' => $currencyCode,
            'adaptive_pricing' => ['enabled' => false],
            'line_items' => [[
                'price' => config('services.stripe.premium_price_id'),
                'quantity' => 1,
            ]],
            // {CHECKOUT_SESSION_ID} lets success() fetch the session back from
            // Stripe to find/create the account — required for guest checkout,
            // where there's no logged-in user to attach the purchase to yet.
            'success_url' => route('billing.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('billing.cancel'),
        ];

        if ($user) {
            if ($user->plan?->name === 'premium' && $user->stripe_subscription_status === 'active') {
                return redirect()->route('dashboard')->with('status', 'You already have an active Premium subscription.');
            }

            $customerId = $user->stripe_customer_id;
            if (! $customerId) {
                $customer = $stripe->customers->create([
                    'email' => $user->email,
                    'name' => $user->name,
                    'metadata' => ['user_id' => $user->id],
                ]);
                $customerId = $customer->id;
                $user->update(['stripe_customer_id' => $customerId]);
            }

            $params['customer'] = $customerId;
            $params['client_reference_id'] = (string) $user->id;
            $params['metadata'] = ['user_id' => $user->id];
        }
        // Guest (not authenticated): omit customer/client_reference_id entirely
        // and let Stripe Checkout collect the email itself — success()/the
        // webhook resolve the account afterward via StripeCheckoutFulfillment.

        $session = $stripe->checkout->sessions->create($params);

        return redirect()->away($session->url);
    }

    public function success(Request $request, StripeCheckoutFulfillment $fulfillment): RedirectResponse
    {
        $sessionId = (string) $request->query('session_id', '');
        if ($sessionId === '') {
            return redirect()->route('dashboard')->with('status', 'Payment received. Your plan will update within a few seconds.');
        }

        $stripe = new StripeClient(config('services.stripe.secret'));
        $session = $stripe->checkout->sessions->retrieve($sessionId, ['expand' => ['customer']]);

        if ($session->payment_status !== 'paid' && $session->status !== 'complete') {
            return redirect()->route('dashboard')->with('status', 'Payment is still processing. Your plan will update once it completes.');
        }

        try {
            $result = $fulfillment->fulfill($session);
        } catch (\RuntimeException) {
            return redirect()->route('dashboard')->with('status', 'Payment received, but we could not identify your account. Contact support if your plan does not update.');
        }

        if (! $result['isNewAccount']) {
            // Never auto-login onto a pre-existing account from a purchase
            // link — only brand-new accounts created by this exact checkout
            // get the one-time claim link below.
            if (Auth::check() && Auth::id() === $result['user']->id) {
                return redirect()->route('dashboard')->with('status', 'Payment received — your plan is now Premium.');
            }

            return redirect()->route('login')->with('status', 'Payment received. Log in to see your upgraded plan.');
        }

        $claimUrl = URL::temporarySignedRoute('billing.claim', now()->addMinutes(30), ['user' => $result['user']->id]);

        return redirect()->away($claimUrl);
    }

    public function cancel(): RedirectResponse
    {
        return redirect()->route('dashboard')->with('status', 'Checkout cancelled — no charge was made.');
    }

    public function claim(Request $request, User $user): View
    {
        Auth::login($user);

        return view('billing.claim');
    }

    public function claimStore(Request $request, User $user): RedirectResponse
    {
        abort_unless(Auth::id() === $user->id, 403);

        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update(['password' => bcrypt($request->string('password'))]);

        return redirect()->route('dashboard')->with('status', 'Welcome! Your password is set and your plan is Premium.');
    }
}
