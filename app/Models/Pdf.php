<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pdf extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'user_id',
        'name',
        'page_count',
        'page_order',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'page_order' => 'array',
            'uploaded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function favourites(): HasMany
    {
        return $this->hasMany(Favourite::class, 'source_pdf_id');
    }

    public function pageImports(): HasMany
    {
        return $this->hasMany(PdfPageImport::class);
    }
}
