<?php

namespace App\Http\Controllers;

class LegalController extends Controller
{
    public function privacy()
    {
        $contact = (string) config('app.legal_contact_email', 'privacy@notelevel.com');

        return view('marketing.legal', [
            'title' => 'Privacy Policy',
            'description' => 'How Notelevel collects, uses and protects your data.',
            'updatedAt' => 'July 10, 2026',
            'paragraphs' => [
                "Notelevel's operator is the controller of personal data processed through this service. Privacy requests and questions can be sent to {$contact}.",
                'We process account data (name, email address, password hash, plan and account dates), security data (IP address, session and authentication records), notebook content, imported PDFs, favourites, and technical usage records required to operate limits and diagnose failures.',
                'When you choose an AI feature, the relevant text, instructions, page context or image is sent to our configured AI provider to produce the requested result. Do not submit highly sensitive personal data unless it is necessary and you are authorised to do so. AI usage metadata, token counts and estimated cost are retained for limits and operational accounting.',
                'We use this information to provide the service and fulfil our contract with you, secure and prevent abuse of the service, comply with legal obligations, and pursue legitimate interests such as reliability and product improvement. Where consent is legally required, we will request it separately.',
                'Service providers may process data for hosting, storage, infrastructure, error monitoring and AI processing. Some providers may process data outside your country. We use appropriate contractual and organisational safeguards where required and do not sell personal data.',
                'Account content is retained while the account is active. Deleting the account initiates deletion of tenant records and stored files, subject to short-lived backups, security records and information that must be retained by law. Demo accounts are temporary and are periodically removed.',
                'Depending on your location, you may have rights to access, correct, delete, restrict or object to processing, receive a portable copy, withdraw consent and complain to a supervisory authority. We may need to verify your identity before fulfilling a request.',
                'Email verification and password recovery are temporarily disabled. Email addresses are still required as account identifiers but are not currently confirmed as belonging to the registrant. We will update this notice when those services are enabled.',
                'We use reasonable technical and organisational safeguards, but no online system is risk-free. We will update this notice when processing materially changes and will publish the revised date on this page.',
            ],
        ]);
    }

    public function terms()
    {
        return view('marketing.legal', [
            'title' => 'Terms of Service',
            'description' => 'The terms that govern your use of Notelevel.',
            'updatedAt' => 'July 10, 2026',
            'paragraphs' => [
                'These Terms of Service govern your access to and use of Notelevel. By creating an account or using the product, you agree to these terms. If you do not agree with them, please do not use the service.',
                'You must provide accurate registration information, protect your password and notify us if you believe the account has been compromised. Email verification and password recovery are temporarily unavailable, so a forgotten password may make the account inaccessible.',
                'You retain ownership of your content and grant Notelevel the limited rights required to host, process, back up, transform and transmit it solely to provide features you request, including AI processing. You confirm that you have the rights needed to upload and process that content.',
                'You must not use the service unlawfully, infringe others\' rights, upload malicious material, attempt unauthorised access, evade quotas, automate abusive requests or disrupt the service. We may restrict or terminate access needed to protect users and infrastructure.',
                'Plans, limits and available features may change. AI output can be inaccurate and must not be treated as professional, legal, medical or financial advice. You are responsible for reviewing output before relying on or sharing it.',
                'You may delete your account from the account page. Deletion is intended to be permanent, subject to limited backups, security records and legal retention requirements. Export important content before deletion.',
                'The service is provided on an as-available basis to the extent permitted by law. We do not promise uninterrupted operation or that all content can always be recovered. Nothing in these terms excludes rights or liabilities that cannot legally be excluded.',
                'We may update these terms as the product evolves. Material changes will be presented through the service or another available channel. Continued use after the effective date constitutes acceptance where permitted by law.',
            ],
        ]);
    }

    public function cookies()
    {
        return view('marketing.legal', [
            'title' => 'Cookie Policy',
            'description' => 'How Notelevel uses cookies and similar technologies.',
            'updatedAt' => 'July 10, 2026',
            'paragraphs' => [
                'Notelevel currently uses essential cookies and equivalent browser storage required for sessions, security, CSRF protection and interface preferences. These technologies are necessary for the requested service to function.',
                'We do not currently set advertising cookies or optional third-party analytics cookies in the application covered by this policy. If optional analytics or marketing technologies are introduced, this policy and any required consent controls will be updated before they are enabled.',
                'Session cookies may expire when the browser closes or after the configured inactivity period. Preference storage may remain longer until it is cleared or replaced. You can remove these items through browser settings, but blocking essential cookies will prevent login and other account features.',
                'We do not use cookies to sell personal data or create third-party advertising profiles. Questions about browser storage can be sent to privacy@notelevel.com.',
            ],
        ]);
    }
}
