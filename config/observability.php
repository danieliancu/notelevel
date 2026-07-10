<?php

return [
    'alert_webhook_url' => env('ALERT_WEBHOOK_URL'),
    'alert_cooldown_seconds' => (int) env('ALERT_COOLDOWN_SECONDS', 300),
];
