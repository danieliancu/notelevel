<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\Checkout\Session;

class StripeCheckoutFulfillment
{
    /**
     * Resolves the User a completed Checkout Session belongs to (finding or
     * creating one), and activates the Premium plan on it. Idempotent and
     * safe to call twice for the same session (from both the webhook and the
     * success-page redirect) — it only ever sets fields, never appends.
     *
     * @return array{user: User, isNewAccount: bool}
     */
    public function fulfill(Session $session): array
    {
        $userId = $session->client_reference_id ?: null;
        $user = $userId ? User::find($userId) : null;
        $isNewAccount = false;

        if (! $user) {
            $email = $session->customer_details->email ?? $session->customer_email ?? null;

            if (! $email) {
                Log::warning('stripe.webhook_no_identifiable_user', ['session_id' => $session->id]);
                throw new \RuntimeException('Checkout session has no client_reference_id or email.');
            }

            $user = User::where('email', $email)->first();

            if (! $user) {
                $user = User::create([
                    'name' => Str::before($email, '@'),
                    'email' => $email,
                    'password' => Hash::make(Str::random(40)),
                    'email_verified_at' => now(),
                ]);
                $isNewAccount = true;
            }
        }

        $premiumPlan = Plan::where('name', 'premium')->first();
        if (! $premiumPlan) {
            Log::warning('stripe.webhook_premium_plan_missing', ['user_id' => $user->id]);

            return ['user' => $user, 'isNewAccount' => $isNewAccount];
        }

        $user->update([
            'plan_id' => $premiumPlan->id,
            'stripe_customer_id' => $session->customer ?: $user->stripe_customer_id,
            'stripe_subscription_id' => $session->subscription ?: $user->stripe_subscription_id,
            'stripe_subscription_status' => 'active',
        ]);

        Log::info('stripe.subscription_activated', [
            'user_id' => $user->id,
            'subscription_id' => $session->subscription,
            'new_account' => $isNewAccount,
        ]);

        return ['user' => $user, 'isNewAccount' => $isNewAccount];
    }
}
