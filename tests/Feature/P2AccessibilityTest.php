<?php

namespace Tests\Feature;

use Tests\TestCase;

class P2AccessibilityTest extends TestCase
{
    public function test_canvas_has_dialog_and_live_region_semantics(): void
    {
        $view = file_get_contents(resource_path('views/canvas/show.blade.php'));

        $this->assertStringContainsString('role="dialog" aria-modal="true" aria-labelledby="slidePanelTitle"', $view);
        $this->assertStringContainsString('aria-live="polite"', $view);
    }

    public function test_canvas_supports_focus_trapping_restoration_and_reduced_motion(): void
    {
        $javascript = file_get_contents(resource_path('js/canvas.js'));
        $css = file_get_contents(resource_path('css/canvas.css'));

        $this->assertStringContainsString('slidePanel.returnFocus', $javascript);
        $this->assertStringContainsString("e.key === 'Tab'", $javascript);
        $this->assertStringContainsString('aria-selected', $javascript);
        $this->assertStringContainsString(':focus-visible', $css);
        $this->assertStringContainsString('prefers-reduced-motion: reduce', $css);
    }
}
