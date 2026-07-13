<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'plan_id',
        'role',
        'ip_address',
        'max_canvas_pages_override',
        'max_pdfs_override',
        'ai_monthly_cost_cap_gbp_override',
        'ai_usage_reset_at',
        'stripe_customer_id',
        'stripe_subscription_id',
        'stripe_subscription_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'ai_usage_reset_at' => 'datetime',
            'ai_monthly_cost_cap_gbp_override' => 'float',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $user) {
            if (empty($user->plan_id)) {
                $user->plan_id = Plan::where('is_default', true)->value('id');
            }
        });
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function aiUsages(): HasMany
    {
        return $this->hasMany(AiUsage::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    public function isGuest(): bool
    {
        return $this->role === 'guest';
    }

    public function effectiveMaxCanvasPages(): ?int
    {
        return $this->max_canvas_pages_override ?? $this->plan?->max_canvas_pages;
    }

    public function effectiveMaxPdfs(): ?int
    {
        return $this->max_pdfs_override ?? $this->plan?->max_pdfs;
    }

    public function effectiveMaxFavourites(): ?int
    {
        return $this->plan?->max_favourites;
    }

    public function effectiveMaxPdfSizeBytes(): ?int
    {
        return $this->plan?->max_pdf_size_bytes;
    }

    public function effectivePdfExportAllowed(): bool
    {
        return (bool) ($this->plan?->pdf_export_allowed ?? true);
    }

    public function effectiveAiMonthlyCostCapGbp(): ?float
    {
        return $this->ai_monthly_cost_cap_gbp_override ?? $this->plan?->ai_monthly_cost_cap_gbp;
    }

    /**
     * Start of the user's current monthly AI usage cycle, anchored to
     * ai_usage_reset_at (admin override, e.g. to force an immediate reset)
     * or their signup date otherwise - not the calendar month.
     */
    public function currentAiUsageCycleStart(): Carbon
    {
        $cycleStart = ($this->ai_usage_reset_at ?? $this->created_at)->copy();

        while ($cycleStart->copy()->addMonthNoOverflow()->lte(now())) {
            $cycleStart = $cycleStart->addMonthNoOverflow();
        }

        return $cycleStart;
    }

    public function nextAiUsageResetAt(): Carbon
    {
        return $this->currentAiUsageCycleStart()->copy()->addMonthNoOverflow();
    }
}
