<?php

return [
    // Autosave migration (see AUDIT.md "Migrare autosave", Etapa 4): gates both
    // the background autosave calls (documents/{document}/autosave + .../pages)
    // and the primary Save/Ctrl+S flow's REST path in canvas.js. Promoted to the
    // default (true) in Stage 4. Kept as a real env-driven kill switch rather
    // than hardcoded/removed: flipping it to false is an instant, code-free
    // rollback to the legacy /canvas/api save path, which is intentionally kept
    // in place (see CanvasApiController::save()) rather than deleted.
    'autosave_enabled' => (bool) env('CANVAS_AUTOSAVE_ENABLED', true),
];
