<?php

return [
    'provider' => env('AI_PROVIDER', 'openai'),

    'api_key' => env('OPENAI_API_KEY'),

    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),

    'pricing' => [
        'gpt-4o-mini' => [
            'input_per_1m_usd' => 0.15,
            'output_per_1m_usd' => 0.60,
        ],
        'gpt-5.5' => [
            'input_per_1m_usd' => 5.00,
            'output_per_1m_usd' => 30.00,
        ],
        'gpt-5-nano' => [
            'input_per_1m_usd' => 0.05,
            'output_per_1m_usd' => 0.40,
        ],
    ],

    'usd_to_gbp' => (float) env('AI_USD_TO_GBP', 0.75),

    'timeout_seconds' => (int) env('AI_TIMEOUT_SECONDS', 45),

    'rate_limit_per_minute' => (int) env('AI_RATE_LIMIT_PER_MINUTE', 10),
    'reservation_ttl_seconds' => (int) env('AI_RESERVATION_TTL_SECONDS', 120),
    'reservation_gbp' => [
        'translate' => (float) env('AI_TRANSLATE_RESERVATION_GBP', 0.04),
        'chat' => (float) env('AI_CHAT_RESERVATION_GBP', 0.03),
        'read' => (float) env('AI_READ_RESERVATION_GBP', 0.04),
    ],
];
