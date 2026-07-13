<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Services\StripeCheckoutFulfillment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Event;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __construct(private StripeCheckoutFulfillment $fulfillment) {}

    public function handle(Request $request): Response
    {
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
                (string) $secret,
            );
        } catch (UnexpectedValueException|SignatureVerificationException $exception) {
            Log::warning('stripe.webhook_signature_invalid', ['error' => $exception->getMessage()]);

            return response('Invalid signature.', 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->activateSubscription($event),
            'customer.subscription.updated' => $this->syncSubscriptionStatus($event),
            'customer.subscription.deleted' => $this->deactivateSubscription($event),
            default => Log::info('stripe.webhook_ignored', ['type' => $event->type]),
        };

        return response('OK', 200);
    }

    private function activateSubscription(Event $event): void
    {
        try {
            $this->fulfillment->fulfill($event->data->object);
        } catch (\RuntimeException $exception) {
            Log::warning('stripe.webhook_fulfillment_failed', ['session_id' => $event->data->object->id, 'error' => $exception->getMessage()]);
        }
    }

    private function syncSubscriptionStatus(Event $event): void
    {
        $subscription = $event->data->object;
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (! $user) {
            return;
        }

        $user->update(['stripe_subscription_status' => $subscription->status]);

        if (in_array($subscription->status, ['canceled', 'unpaid', 'incomplete_expired'], true)) {
            $this->downgradeToFreePlan($user);
        }
    }

    private function deactivateSubscription(Event $event): void
    {
        $subscription = $event->data->object;
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (! $user) {
            return;
        }

        $this->downgradeToFreePlan($user);
    }

    private function downgradeToFreePlan(User $user): void
    {
        $freePlan = Plan::where('is_default', true)->first();

        $user->update([
            'plan_id' => $freePlan?->id ?? $user->plan_id,
            'stripe_subscription_status' => 'canceled',
        ]);

        Log::info('stripe.subscription_downgraded', ['user_id' => $user->id]);
    }
}
