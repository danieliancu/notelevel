<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PdfPageImport extends Model
{
    protected $fillable = [
        'pdf_id',
        'page_index',
        'document_id',
    ];

    public function pdf(): BelongsTo
    {
        return $this->belongsTo(Pdf::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
