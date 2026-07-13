<?php

use App\Http\Middleware\LegacyApiDeprecation;
use App\Http\Middleware\NoIndex;
use App\Http\Middleware\RequestContext;
use App\Http\Middleware\SecurityHeaders;
use App\Services\OperationalAlert;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(RequestContext::class);
        $middleware->append(SecurityHeaders::class);

        $middleware->alias([
            'legacy.deprecated' => LegacyApiDeprecation::class,
            'noindex' => NoIndex::class,
        ]);

        // Stripe posts webhook events server-to-server with no session/CSRF
        // token; authenticity is verified separately via the signed
        // Stripe-Signature header in StripeWebhookController::handle().
        $middleware->validateCsrfTokens(except: [
            'stripe/webhook',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (Throwable $exception): void {
            app(OperationalAlert::class)->exception($exception);
        });
    })->create();
