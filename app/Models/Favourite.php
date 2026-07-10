<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favourite extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'user_id',
        'name',
        'pdf_folder_id',
        'source_pdf_id',
        'source_page_index',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'added_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pdfFolder(): BelongsTo
    {
        return $this->belongsTo(PdfFolder::class);
    }

    public function sourcePdf(): BelongsTo
    {
        return $this->belongsTo(Pdf::class, 'source_pdf_id');
    }
}
