<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoController extends Controller
{
    /** Max new guest accounts a single IP may create per hour. */
    private const MAX_NEW_GUESTS_PER_HOUR = 30;

    /**
     * Show the canvas for an anonymous "Try demo" visitor, creating a
     * throwaway guest account (reused across the browser session) so the
     * existing tenant-scoped models/storage work unchanged.
     */
    public function show(Request $request)
    {
        if (! auth()->check()) {
            $key = 'demo-guest-create:'.$request->ip();

            if (RateLimiter::tooManyAttempts($key, self::MAX_NEW_GUESTS_PER_HOUR)) {
                abort(429, 'Too many demo sessions started from this network. Please try again later.');
            }

            RateLimiter::hit($key, 3600);

            // Keep only one guest account per IP: drop any earlier ones before
            // creating the new session so the admin Users list doesn't fill up
            // with throwaway duplicates from repeat demo visits.
            $previousGuestIds = User::where('role', 'guest')
                ->where('ip_address', $request->ip())
                ->pluck('id');

            foreach ($previousGuestIds as $previousGuestId) {
                Storage::disk('tenants')->deleteDirectory((string) $previousGuestId);
            }

            User::whereIn('id', $previousGuestIds)->delete();

            $guest = User::create([
                'name' => 'Guest',
                'email' => 'guest-'.Str::uuid().'@demo.notelevel.local',
                'password' => Str::random(40),
                'role' => 'guest',
                'ip_address' => $request->ip(),
                'plan_id' => Plan::where('name', 'guest')->value('id'),
                'email_verified_at' => now(),
            ]);

            auth()->login($guest);
        }

        return view('canvas.show', ['isDemo' => auth()->user()->isGuest()]);
    }

    /**
     * Clear a silent guest session before handing off to the real
     * registration form, since Breeze's `guest` middleware would otherwise
     * bounce an already-authenticated (even guest-role) visitor away from it.
     */
    public function bounceToRegister(Request $request)
    {
        if (auth()->check() && auth()->user()->isGuest()) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return redirect()->route('register');
    }
}
