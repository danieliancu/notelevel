<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
            // Honeypot: a field real visitors never see or fill (hidden via
            // CSS in contact.blade.php), so anything other than empty means
            // an automated submission — reject it the same as any other
            // validation failure.
            'website' => ['prohibited'],
        ];
    }
}
