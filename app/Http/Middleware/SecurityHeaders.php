<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $scriptSources = ["'self'", "'unsafe-inline'"];
        $styleSources = ["'self'", "'unsafe-inline'"];
        $connectSources = ["'self'"];

        // Filament's admin panel relies on Alpine.js/Livewire evaluating
        // expressions via `new Function()`, which requires 'unsafe-eval'.
        if ($request->is('admin') || $request->is('admin/*')) {
            $scriptSources[] = "'unsafe-eval'";
        }

        // Vite serves development assets and HMR from the origin recorded in
        // public/hot (often [::1]:5173), which is intentionally separate from
        // the application origin.
        if (app()->isLocal()) {
            $configuredViteOrigin = config('app.vite_dev_origin');
            $viteOrigin = is_string($configuredViteOrigin) && $configuredViteOrigin !== ''
                ? $configuredViteOrigin
                : (is_file(public_path('hot')) ? trim((string) file_get_contents(public_path('hot'))) : '');
            $viteOrigin = rtrim($viteOrigin, '/');

            if (filter_var($viteOrigin, FILTER_VALIDATE_URL)) {
                $scriptSources[] = $viteOrigin;
                $styleSources[] = $viteOrigin;
                $connectSources[] = $viteOrigin;
                $connectSources[] = preg_replace('/^http/', 'ws', $viteOrigin);
            }
        }

        $contentSecurityPolicy = implode('; ', [
            "default-src 'self'",
            'script-src '.implode(' ', $scriptSources),
            'style-src '.implode(' ', $styleSources),
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            'connect-src '.implode(' ', $connectSources),
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
            "form-action 'self'",
        ]).';';

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set(
            'Content-Security-Policy',
            $contentSecurityPolicy
        );

        return $response;
    }
}
