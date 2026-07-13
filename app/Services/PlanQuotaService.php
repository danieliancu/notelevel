<?php

namespace App\Services;

use App\Models\Favourite;
use App\Models\Pdf;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class PlanQuotaService
{
    public function assertPdfCapacity(User $user): void
    {
        $cap = $user->effectiveMaxPdfs();

        if ($cap !== null && Pdf::count() >= $cap) {
            throw ValidationException::withMessages([
                'file' => 'You have reached your plan\'s PDF limit.',
            ]);
        }
    }

    public function assertFavouriteCapacity(User $user): void
    {
        $cap = $user->effectiveMaxFavourites();

        if ($cap !== null && Favourite::count() >= $cap) {
            throw ValidationException::withMessages([
                'file' => 'You have reached your plan\'s favourites limit.',
            ]);
        }
    }

    public function assertFileSize(User $user, UploadedFile $upload): void
    {
        $cap = $user->effectiveMaxPdfSizeBytes();

        if ($cap !== null && $upload->getSize() > $cap) {
            throw ValidationException::withMessages([
                'file' => 'This file exceeds your plan\'s maximum PDF size.',
            ]);
        }
    }

    /**
     * Shared by CanvasApiController's legacy save action and DocumentController's
     * page-image endpoint so both count against the same plan cap consistently.
     */
    public function canvasPagesCapExceeded(User $user, int $currentTotalExcludingDocument, int $newPageCount): bool
    {
        $cap = $user->effectiveMaxCanvasPages();

        if ($cap === null) {
            return false;
        }

        return ($currentTotalExcludingDocument + $newPageCount) > $cap;
    }

    /** @return array<int, string> */
    public function pdfRules(User $user): array
    {
        $rules = ['required', 'file', 'mimes:pdf'];
        $cap = $user->effectiveMaxPdfSizeBytes();

        if ($cap !== null) {
            $rules[] = 'max:'.max(1, intdiv($cap, 1024));
        }

        return $rules;
    }
}
