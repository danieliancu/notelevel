<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Bounds a canvas document's `content` payload (see AUDIT.md VAL-01): total
 * serialized size, number of pages, and elements per page. Deliberately generous
 * — this is an anti-abuse ceiling, not a product quota (page-count quotas per
 * plan are enforced separately by PlanQuotaService) and it does not validate
 * individual element schemas, which remains a known gap.
 */
class CanvasDocumentContent implements ValidationRule
{
    public const MAX_BYTES = 20 * 1024 * 1024;

    public const MAX_PAGES = 10000;

    public const MAX_ELEMENTS_PER_PAGE = 3000;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            $fail('The :attribute must be a valid document structure.');

            return;
        }

        $encoded = json_encode($value);
        if ($encoded === false) {
            $fail('The :attribute could not be processed.');

            return;
        }

        if (strlen($encoded) > self::MAX_BYTES) {
            $fail('The :attribute is too large.');

            return;
        }

        $pages = $value['pages'] ?? null;
        if ($pages === null) {
            return;
        }

        if (! is_array($pages)) {
            $fail('The :attribute pages must be a list.');

            return;
        }

        if (count($pages) > self::MAX_PAGES) {
            $fail('The :attribute has too many pages.');

            return;
        }

        foreach ($pages as $page) {
            if (! is_array($page)) {
                continue;
            }

            $elements = $page['elements'] ?? null;
            if (is_array($elements) && count($elements) > self::MAX_ELEMENTS_PER_PAGE) {
                $fail('The :attribute has a page with too many elements.');

                return;
            }
        }
    }
}
