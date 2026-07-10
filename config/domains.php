<?php

return [
    // Single domain serving both the public marketing pages and the
    // authenticated app (canvas/account/admin), the latter kept out of
    // search results via the `noindex` middleware rather than a subdomain.
    'marketing' => env('MARKETING_DOMAIN', 'notelevel.com'),
];
