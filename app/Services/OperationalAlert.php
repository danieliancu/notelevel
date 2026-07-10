<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class OperationalAlert
{
    public function exception(Throwable $exception): void
    {
        $url = config('observability.alert_webhook_url');
        if (! is_string($url) || $url === '') {
            return;
        }

        $fingerprint = hash('sha256', $exception::class.'|'.$exception->getFile().'|'.$exception->getLine());
        $cacheKey = 'operational-alert:'.$fingerprint;

        if (! Cache::add($cacheKey, true, (int) config('observability.alert_cooldown_seconds', 300))) {
            return;
        }

        try {
            Http::timeout(3)->post($url, [
                'application' => config('app.name'),
                'environment' => app()->environment(),
                'exception' => $exception::class,
                'message' => mb_substr($exception->getMessage(), 0, 500),
                'request_id' => request()?->attributes->get('request_id'),
                'timestamp' => now()->toIso8601String(),
            ])->throw();
        } catch (Throwable $alertFailure) {
            Log::warning('operational_alert.delivery_failed', [
                'error' => $alertFailure->getMessage(),
            ]);
        }
    }
}
