<?php

namespace App\Support;

use App\Rules\CanvasDocumentContent;

/**
 * Shared validation rules for the two parallel document-save surfaces
 * (DocumentController's REST endpoints and CanvasApiController's legacy
 * `/canvas/api` dispatcher — see AUDIT.md API-01), so a payload accepted by
 * one is bounded the same way as the other (see AUDIT.md VAL-01).
 */
class DocumentPayloadRules
{
    // Base64 is ~4/3 the size of the decoded bytes; this bounds the decoded
    // image to roughly 8MB.
    public const MAX_PAGE_IMAGE_BASE64_LENGTH = 10_920_000;

    public static function content(): array
    {
        return ['nullable', 'array', new CanvasDocumentContent];
    }

    public static function pageCount(): array
    {
        return ['nullable', 'integer', 'min:0', 'max:'.CanvasDocumentContent::MAX_PAGES];
    }

    public static function guideModeRest(): array
    {
        return ['nullable', 'in:none,lined,grid,dotted'];
    }

    public static function pageBackgroundColor(): array
    {
        return ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'];
    }

    public static function pageImage(): array
    {
        return ['required', 'string', 'max:'.self::MAX_PAGE_IMAGE_BASE64_LENGTH];
    }
}
