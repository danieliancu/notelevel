<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiBudgetReservation extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $fillable = ['user_id', 'action', 'reserved_cost_gbp', 'expires_at'];

    protected function casts(): array
    {
        return [
            'reserved_cost_gbp' => 'float',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
