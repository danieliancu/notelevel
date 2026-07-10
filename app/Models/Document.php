<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'user_id',
        'folder_id',
        'title',
        'content',
        'guide_mode',
        'guides_visible',
        'page_background_color',
        'page_count',
        'version',
        'last_autosave_key',
        'last_autosave_version',
        'last_autosave_hash',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'guides_visible' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
}
