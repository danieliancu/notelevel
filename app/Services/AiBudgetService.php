<?php

namespace App\Services;

use App\Models\AiBudgetReservation;
use App\Models\AiUsage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AiBudgetService
{
    public function reserve(User $user, string $action): AiBudgetReservation
    {
        return DB::transaction(function () use ($user, $action) {
            $lockedUser = User::query()->with('plan')->lockForUpdate()->findOrFail($user->id);
            AiBudgetReservation::where('user_id', $lockedUser->id)
                ->where('expires_at', '<=', now())
                ->delete();

            $reservation = (float) config("ai.reservation_gbp.{$action}", 0.05);
            $cap = $lockedUser->effectiveAiMonthlyCostCapGbp();

            if ($cap !== null) {
                $usage = AiUsage::where('user_id', $lockedUser->id);
                if (! $lockedUser->isGuest()) {
                    $usage->where('created_at', '>=', $lockedUser->currentAiUsageCycleStart());
                }

                $spent = (float) $usage->sum('cost_gbp');
                $reserved = (float) AiBudgetReservation::where('user_id', $lockedUser->id)
                    ->where('expires_at', '>', now())
                    ->sum('reserved_cost_gbp');

                if (($spent + $reserved + $reservation) > $cap) {
                    throw new RuntimeException(
                        $lockedUser->isGuest()
                            ? 'The AI limit has been reached. Please register.'
                            : 'There is not enough AI budget remaining for this request.'
                    );
                }
            } else {
                $reservation = 0.0;
            }

            return AiBudgetReservation::create([
                'user_id' => $lockedUser->id,
                'action' => $action,
                'reserved_cost_gbp' => $reservation,
                'expires_at' => now()->addSeconds((int) config('ai.reservation_ttl_seconds', 120)),
            ]);
        });
    }

    public function finalize(AiBudgetReservation $reservation, array $usage, array $cost): void
    {
        DB::transaction(function () use ($reservation, $usage, $cost) {
            User::query()->lockForUpdate()->findOrFail($reservation->user_id);

            AiUsage::create([
                'user_id' => $reservation->user_id,
                'action' => $reservation->action,
                'model' => (string) config('ai.model'),
                'input_tokens' => (int) ($usage['inputTokens'] ?? 0),
                'output_tokens' => (int) ($usage['outputTokens'] ?? 0),
                'cost_usd' => (float) ($cost['usd'] ?? 0),
                'cost_gbp' => (float) ($cost['gbp'] ?? 0),
            ]);

            $reservation->delete();

            Log::info('ai.usage_recorded', [
                'user_id' => $reservation->user_id,
                'action' => $reservation->action,
                'cost_gbp' => (float) ($cost['gbp'] ?? 0),
            ]);
        });
    }

    public function release(?AiBudgetReservation $reservation): void
    {
        $reservation?->delete();
    }
}
