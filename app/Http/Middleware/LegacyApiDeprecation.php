<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LegacyApiDeprecation
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('Deprecation', 'true');
        $response->headers->set('Sunset', (string) config('app.legacy_api_sunset'));
        $response->headers->set('Link', '</documents>; rel="successor-version"');

        return $response;
    }
}
