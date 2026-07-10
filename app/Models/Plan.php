<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'price_cents',
        'billing_interval',
        'max_canvas_pages',
        'max_pdfs',
        'max_pdf_size_bytes',
        'pdf_export_allowed',
        'max_favourites',
        'ai_actions_allowed',
        'ai_monthly_cost_cap_gbp',
        'is_default',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'ai_actions_allowed' => 'array',
            'is_default' => 'boolean',
            'pdf_export_allowed' => 'boolean',
            'ai_monthly_cost_cap_gbp' => 'float',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
