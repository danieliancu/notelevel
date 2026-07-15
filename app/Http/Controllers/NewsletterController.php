<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterSubscriptionMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            // Honeypot: a field real visitors never see or fill (hidden via
            // CSS in home.blade.php's newsletter form) — anything other than
            // empty means an automated submission.
            'website' => ['prohibited'],
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(['email' => $data['email']]);

        if ($subscriber->wasRecentlyCreated) {
            Mail::to(config('app.contact_form_recipient'))->send(
                new NewsletterSubscriptionMail(subscriberEmail: $data['email'])
            );
        }

        return back()->with('status', 'Thanks for subscribing! We\'ll be in touch.');
    }
}
