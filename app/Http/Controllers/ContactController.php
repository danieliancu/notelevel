<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactFormMail;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function show()
    {
        return view('marketing.contact');
    }

    public function send(ContactFormRequest $request)
    {
        $data = $request->validated();

        ContactMessage::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'message' => $data['message'] ?? null,
        ]);

        Mail::to(config('app.contact_form_recipient'))->send(new ContactFormMail(
            firstName: $data['first_name'],
            lastName: $data['last_name'],
            email: $data['email'],
            phone: $data['phone'] ?? null,
            messageText: $data['message'] ?? null,
        ));

        return redirect()->route('contact')->with('status', 'Your message has been sent. We\'ll get back to you soon.');
    }
}
