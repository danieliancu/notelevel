<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
    <meta name="color-scheme" content="light">
    <title>Notelevel - untitled</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/canvas.css'])
    <script>
        window.CANVAS_DEMO_MODE = {{ ($isDemo ?? false) ? 'true' : 'false' }};
        window.CANVAS_REGISTER_URL = "{{ route('demo.register') }}";
        window.CANVAS_HOME_URL = "{{ route('home') }}";
        window.CANVAS_ACCOUNT_SUMMARY_URL = "{{ route('account.summary') }}";
        window.CANVAS_ACCOUNT_URL = "{{ route('account') }}";
        window.CANVAS_LOGOUT_URL = "{{ route('logout') }}";
        window.CANVAS_PDF_EXPORT_ALLOWED = {{ (auth()->check() && auth()->user()->effectivePdfExportAllowed()) ? 'true' : 'false' }};
    </script>
    <script>
        window.MathJax = {
            loader: { load: ['[tex]/mhchem', '[tex]/braket', '[tex]/cancel'] },
            tex: {
                displayMath: [['$$', '$$']],
                packages: { '[+]': ['mhchem', 'braket', 'cancel'] }
            },
            svg: { fontCache: 'none' },
            startup: { typeset: false }
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" id="MathJax-script" async></script>
    <script type="module">
        import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.min.mjs';
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs';
        window.pdfjsLib = pdfjsLib;
    </script>
    <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
    <script type="module">
        import 'https://esm.run/mathlive';
    </script>
</head>
<body class="{{ ($isDemo ?? false) ? 'demo-mode' : '' }}">
    <canvas id="pad" aria-label="Writing surface"></canvas>
    <canvas id="guidePad" class="guide-canvas" aria-hidden="true"></canvas>
    <div class="text-layer" id="textLayer" aria-label="Text layer"></div>
    <div class="selection-rect" id="selectionRect" aria-hidden="true"></div>
    <div class="brush-cursor" id="brushCursor" aria-hidden="true"></div>
    <div class="virtual-keyboard" id="virtualKeyboard" aria-hidden="true">
        <div class="virtual-keyboard-keys" id="virtualKeyboardKeys"></div>
    </div>
    <div class="chat-thread" id="chatThread" aria-live="polite"></div>
    <div class="chat-bar" id="chatBar" aria-hidden="true">
        <button class="chat-mic-btn" id="chatMicBtn" type="button" aria-label="Dictate" title="Dictate">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/></svg>
        </button>
        <div class="chat-input-wrap" id="chatInputWrap">
            <button class="chat-slash-btn" id="chatSlashBtn" type="button" aria-label="Commands" title="Commands" aria-haspopup="true" aria-expanded="false">/</button>
            <div class="chat-input" id="chatInput" contenteditable="true" role="textbox" data-placeholder="Ask AI..." aria-label="Chat message"></div>
            <div class="chat-slash-menu" id="chatSlashMenu" role="menu" aria-hidden="true">
                <button type="button" class="chat-slash-item" data-command="create" role="menuitem">
                    <span class="chat-slash-item-name">/create</span>
                    <span class="chat-slash-item-desc">Create new elements (text, shape, table)</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="duplicate" role="menuitem">
                    <span class="chat-slash-item-name">/duplicate</span>
                    <span class="chat-slash-item-desc">Duplicate existing elements</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="align" role="menuitem">
                    <span class="chat-slash-item-name">/align</span>
                    <span class="chat-slash-item-desc">Align elements (left, center, right, top, middle, bottom)</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="distribute" role="menuitem">
                    <span class="chat-slash-item-name">/distribute</span>
                    <span class="chat-slash-item-desc">Distribute elements evenly</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="translate" role="menuitem">
                    <span class="chat-slash-item-name">/translate</span>
                    <span class="chat-slash-item-desc">Translate the selected text</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="summarize" role="menuitem">
                    <span class="chat-slash-item-name">/summarize</span>
                    <span class="chat-slash-item-desc">Summarize the page content</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="find" role="menuitem">
                    <span class="chat-slash-item-name">/find</span>
                    <span class="chat-slash-item-desc">Find elements by criteria</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="edit" role="menuitem">
                    <span class="chat-slash-item-name">/edit</span>
                    <span class="chat-slash-item-desc">Edit existing elements (color, position, size, text)</span>
                </button>
                <button type="button" class="chat-slash-item" data-command="transcribe" role="menuitem">
                    <span class="chat-slash-item-name">/transcribe</span>
                    <span class="chat-slash-item-desc">Turn handwriting (or an included PDF) into text</span>
                </button>
            </div>
        </div>
        <button class="chat-send-btn" id="chatSendBtn" type="button" aria-label="Send" title="Send">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-8-8 18-2-8-8-2Z"/></svg>
        </button>
    </div>
    <div class="orientation-overlay" id="orientationOverlay" aria-hidden="true">
        <div>Rotate your device to portrait</div>
    </div>
    <div class="saving-overlay" id="savingOverlay" aria-hidden="true">
        <div class="saving-spinner" aria-label="Saving"></div>
    </div>
    <div class="saving-overlay" id="documentLoadingOverlay" aria-hidden="true">
        <div class="saving-spinner" aria-label="Opening document"></div>
    </div>
    <div class="ai-translation-overlay" id="aiTranslationOverlay" aria-hidden="true">
        <div class="ai-translation-panel">
            <div class="saving-spinner" aria-label="Translating"></div>
            <span>Translating...</span>
        </div>
    </div>
    <div class="page-control" id="pageControl" aria-label="Page navigation">
        <button id="prevPageBtn" type="button" aria-label="Previous page">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg>
        </button>
        <span id="pageLabel">page 1</span>
        <button id="nextPageBtn" type="button" aria-label="Next page">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
        </button>
    </div>
    <button class="delete-page-float" id="deletePageBtn" type="button" aria-label="Delete current page">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
    </button>
    <div class="ai-cost-badge" id="aiCostBadge" aria-live="polite"></div>
    <div class="current-file-badge" id="currentFileBadge" aria-live="polite"></div>

    <nav class="toolbar" aria-label="Drawing tools">
        <button class="icon-button new-icon toolbar-trigger" id="newBtn" type="button" title="New" aria-label="New" aria-expanded="false" aria-controls="fileMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M32 12v40"/>
                <path d="M12 32h40"/>
            </svg>
        </button>
        <button class="icon-button undo-icon" id="undoBtn" type="button" title="Undo" aria-label="Undo" disabled>
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M27 18 13 32l14 14"/>
                <path d="M14 32h24c9 0 15 6 15 14"/>
            </svg>
        </button>
        <button class="icon-button redo-icon" id="redoBtn" type="button" title="Redo" aria-label="Redo" disabled>
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="m37 18 14 14-14 14"/>
                <path d="M50 32H26c-9 0-15 6-15 14"/>
            </svg>
        </button>
        <button class="icon-button pen-icon toolbar-trigger" id="penBtn" type="button" title="Pen" aria-label="Pen" aria-expanded="false" aria-controls="penMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M12 52 20 32 44 8l12 12-24 24-20 8Z"/>
                <path d="m39 13 12 12"/>
                <path d="m20 32 12 12"/>
            </svg>
        </button>
        <button class="icon-button eraser-icon toolbar-trigger" id="eraserBtn" type="button" title="Eraser" aria-label="Eraser" aria-expanded="false" aria-controls="eraserMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M42 9 55 22 29 48H14L8 42 42 9Z"/>
                <path d="M30 21 43 34"/>
                <path d="M14 48h36"/>
            </svg>
        </button>
        <button class="icon-button insert-icon toolbar-trigger" id="insertBtn" type="button" title="Insert" aria-label="Insert" aria-expanded="false" aria-controls="insertMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M16 16h32"/>
                <path d="M32 16v36"/>
                <path d="M24 52h16"/>
            </svg>
        </button>
        <button class="icon-button select-icon" id="selectBtn" type="button" title="Select" aria-label="Select">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <rect class="dashed-select-box" x="16" y="16" width="32" height="32" rx="3"/>
            </svg>
        </button>
        <button class="icon-button ai-icon" id="aiBtn" type="button" title="AI" aria-label="AI" aria-expanded="false" aria-controls="aiMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M32 6c3.9 14.1 11.9 22.1 26 26-14.1 3.9-22.1 11.9-26 26C28.1 43.9 20.1 35.9 6 32 20.1 28.1 28.1 20.1 32 6Z"/>
                <path d="M15 0c1.8 6.5 5.5 10.2 12 12-6.5 1.8-10.2 5.5-12 12C13.2 17.5 9.5 13.8 3 12c6.5-1.8 10.2-5.5 12-12Z"/>
                <path d="M49 5c1.3 4.8 4.2 7.7 9 9-4.8 1.3-7.7 4.2-9 9-1.3-4.8-4.2-7.7-9-9 4.8-1.3 7.7-4.2 9-9Z"/>
            </svg>
        </button>      
        <button class="icon-button settings-icon toolbar-trigger" id="settingsBtn" type="button" title="Settings" aria-label="Settings" aria-expanded="false" aria-controls="settingsMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M10 18h18"/>
                <path d="M40 18h14"/>
                <circle cx="34" cy="18" r="7"/>
                <path d="M10 32h8"/>
                <path d="M30 32h24"/>
                <circle cx="24" cy="32" r="7"/>
                <path d="M10 46h26"/>
                <path d="M48 46h6"/>
                <circle cx="42" cy="46" r="7"/>
            </svg>
        </button>
        <span class="toolbar-spacer" aria-hidden="true"></span>
        <button class="icon-button pending-more-icon" id="pendingMoreBtn" type="button" title="More actions" aria-label="More actions" aria-expanded="false" aria-controls="pendingActionsMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="20" r="4"/>
                <circle cx="32" cy="32" r="4"/>
                <circle cx="32" cy="44" r="4"/>
            </svg>
        </button>
        <button class="icon-button pending-action-icon search-icon" type="button" title="Search" aria-label="Search">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="28" cy="28" r="16"/>
                <path d="m40 40 12 12"/>
            </svg>
        </button>
        <button class="icon-button pending-action-icon library-icon" type="button" title="Library" aria-label="Library">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M14 14h12v38H14z"/>
                <path d="M28 14h12v38H28z"/>
                <path d="M42 18h8l6 32-8 2z"/>
                <path d="M18 24h4"/>
                <path d="M32 24h4"/>
            </svg>
        </button>
        <button class="icon-button pending-action-icon account-icon" type="button" title="Account" aria-label="Account">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="22" r="11"/>
                <path d="M14 54c3.5-12 12-18 18-18s14.5 6 18 18"/>
            </svg>
        </button>
        <button class="icon-button more-icon" id="moreBtn" type="button" title="More" aria-label="More" aria-expanded="false" aria-controls="overflowMenu">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="20" r="4"/>
                <circle cx="32" cy="32" r="4"/>
                <circle cx="32" cy="44" r="4"/>
            </svg>
        </button>
    </nav>

    <div class="toolbar-menu overflow-menu" id="overflowMenu" aria-hidden="true">
        <button class="icon-button select-icon" id="overflowSelectBtn" type="button" title="Select" aria-label="Select">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <rect class="dashed-select-box" x="16" y="16" width="32" height="32" rx="3"/>
            </svg>
        </button>
        <button class="icon-button settings-icon" id="overflowSettingsBtn" type="button" title="Settings" aria-label="Settings">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M10 18h18"/>
                <path d="M40 18h14"/>
                <circle cx="34" cy="18" r="7"/>
                <path d="M10 32h8"/>
                <path d="M30 32h24"/>
                <circle cx="24" cy="32" r="7"/>
                <path d="M10 46h26"/>
                <path d="M48 46h6"/>
                <circle cx="42" cy="46" r="7"/>
            </svg>
        </button>
    </div>

    <div class="slide-panel" id="slidePanel" role="dialog" aria-modal="true" aria-labelledby="slidePanelTitle" aria-hidden="true" tabindex="-1">
    <div class="slide-panel-inner">
        <div class="slide-panel-header">
        <span class="slide-panel-title" id="slidePanelTitle">Panel</span>
        <button class="slide-panel-close-btn" id="slidePanelCloseBtn" type="button" title="Close" aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        </div>
        <div class="slide-panel-input-row" id="slidePanelInputRow" style="display: none;">
        <svg class="slide-panel-input-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input class="slide-panel-input" id="slidePanelInput" type="text" placeholder="Search..." autocomplete="off" spellcheck="false">
        </div>
        <div class="slide-panel-body" id="slidePanelBody"></div>
    </div>
    </div>

    <div class="toolbar-menu pending-actions-menu" id="pendingActionsMenu" aria-hidden="true">
        <button class="icon-button search-icon" type="button" title="Search" aria-label="Search">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="28" cy="28" r="16"/>
                <path d="m40 40 12 12"/>
            </svg>
        </button>
        <button class="icon-button library-icon" type="button" title="Library" aria-label="Library">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M14 14h12v38H14z"/>
                <path d="M28 14h12v38H28z"/>
                <path d="M42 18h8l6 32-8 2z"/>
                <path d="M18 24h4"/>
                <path d="M32 24h4"/>
            </svg>
        </button>
        <button class="icon-button account-icon" type="button" title="Account" aria-label="Account">
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="22" r="11"/>
                <path d="M14 54c3.5-12 12-18 18-18s14.5 6 18 18"/>
            </svg>
        </button>
    </div>

    <div class="toolbar-menu" id="fileMenu" aria-hidden="true">
        <button id="fileNewBtn" type="button"><span>New</span></button>
        <button id="fileOpenBtn" type="button"><span>My Documents</span><kbd>Ctrl+O</kbd></button>
        <button id="fileSaveBtn" type="button"><span>Save</span><kbd>Ctrl+S</kbd></button>
        <button id="fileSaveAsBtn" type="button"><span>Save as</span></button>
        <button id="fileExportBtn" type="button"><span>Export</span></button>
    </div>

    <div class="toolbar-menu tool-settings-menu" id="penMenu" aria-hidden="true">
        <div class="colour-panel compact-panel">
            <div class="setting-label">Colour</div>
            <div class="recent-colours">
                <div class="recent-colour-row" id="recentColourRow"></div>
            </div>
            <input class="hidden-colour-input" id="colorInput" type="color" value="#111827">
        </div>
        <label class="setting-range">
            <span>Size</span>
            <strong id="penSizeLabel">4px</strong>
            <input id="penSizeInput" type="range" min="1" max="36" value="4">
        </label>
        <label class="setting-range">
            <span>Opacity</span>
            <strong id="penOpacityLabel">100%</strong>
            <input id="penOpacityInput" type="range" min="5" max="100" value="100">
        </label>
        <label class="setting-range">
            <span>Hardness</span>
            <strong id="penHardnessLabel">80%</strong>
            <input id="penHardnessInput" type="range" min="0" max="100" value="80">
        </label>
        <div class="setting-block">
            <div class="setting-label">Tip</div>
            <div class="tip-grid" data-tip-group="pen" aria-label="Pen tip">
                <button class="tip-button is-active" type="button" data-tool="pen" data-tip="round"><span class="tip-dot round-tip"></span></button>
                <button class="tip-button" type="button" data-tool="pen" data-tip="sharp"><span class="tip-dot sharp-tip"></span></button>
                <button class="tip-button" type="button" data-tool="pen" data-tip="square"><span class="tip-dot square-tip"></span></button>
                <button class="tip-button" type="button" data-tool="pen" data-tip="soft"><span class="tip-dot soft-tip"></span></button>
                <button class="tip-button" type="button" data-tool="pen" data-tip="highlighter" title="Highlighter" aria-label="Highlighter"><span class="tip-dot highlighter-tip"></span></button>
                <button class="tip-button" type="button" data-tool="pen" data-tip="brush" title="Brush" aria-label="Brush"><span class="tip-dot brush-tip"></span></button>
            </div>
        </div>
    </div>

    <div class="toolbar-menu tool-settings-menu" id="eraserMenu" aria-hidden="true">
        <label class="setting-range">
            <span>Size</span>
            <strong id="eraserSizeLabel">12px</strong>
            <input id="eraserSizeInput" type="range" min="1" max="56" value="12">
        </label>
        <label class="setting-range">
            <span>Opacity</span>
            <strong id="eraserOpacityLabel">100%</strong>
            <input id="eraserOpacityInput" type="range" min="5" max="100" value="100">
        </label>
        <label class="setting-range">
            <span>Hardness</span>
            <strong id="eraserHardnessLabel">60%</strong>
            <input id="eraserHardnessInput" type="range" min="0" max="100" value="60">
        </label>
        <div class="setting-block">
            <div class="setting-label">Tip</div>
            <div class="tip-grid" data-tip-group="eraser" aria-label="Eraser tip">
                <button class="tip-button is-active" type="button" data-tool="eraser" data-tip="round"><span class="tip-dot round-tip"></span></button>
                <button class="tip-button" type="button" data-tool="eraser" data-tip="sharp"><span class="tip-dot sharp-tip"></span></button>
                <button class="tip-button" type="button" data-tool="eraser" data-tip="square"><span class="tip-dot square-tip"></span></button>
                <button class="tip-button" type="button" data-tool="eraser" data-tip="soft"><span class="tip-dot soft-tip"></span></button>
            </div>
        </div>
    </div>

    <div class="toolbar-menu insert-menu" id="insertMenu" aria-hidden="true">
        <div class="menu-section text-insert-options" id="textOptionsPanel">
            <button class="insert-group-title" id="textToolBtn" type="button">
                <span>Text</span>
                <svg class="insert-group-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <label class="setting-range">
                <span>Size</span>
                <strong id="textSizeLabel">20px</strong>
                <input id="textSizeInput" type="range" min="8" max="96" value="20">
            </label>
            <div class="text-style-grid text-format-grid" role="group" aria-label="Text formatting">
                <button class="text-style-button" id="textBoldBtn" type="button"><strong>B</strong></button>
                <button class="text-style-button" id="textItalicBtn" type="button"><em>I</em></button>
                <button class="text-style-button" id="textUnderlineBtn" type="button"><u>U</u></button>
                <button class="text-style-button is-active" id="textAlignLeftBtn" type="button" title="Align left" aria-label="Align left">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M4 10h11"/><path d="M4 14h16"/><path d="M4 18h11"/></svg>
                </button>
                <button class="text-style-button" id="textAlignCenterBtn" type="button" title="Align center" aria-label="Align center">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M7 10h10"/><path d="M4 14h16"/><path d="M7 18h10"/></svg>
                </button>
                <button class="text-style-button" id="textAlignRightBtn" type="button" title="Align right" aria-label="Align right">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M9 10h11"/><path d="M4 14h16"/><path d="M9 18h11"/></svg>
                </button>
            </div>
            <div class="text-colour-field colour-panel compact-panel">
                <div class="setting-label">Colour</div>
                <div class="recent-colours">
                    <div class="recent-colour-row text-colour-row" id="textColourRow" aria-label="Text colours"></div>
                </div>
                <input class="hidden-colour-input" id="textColorInput" type="color" value="#111827">
            </div>
        </div>
        <div class="menu-section table-insert-options">
            <button class="insert-group-title" id="startTableBtn" type="button">
                <span>Table</span>
                <svg class="insert-group-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div class="number-grid">
                <label class="stepper-field">
                    <span>Rows</span>
                    <span class="stepper-control">
                        <button class="stepper-button" type="button" data-step-target="tableRowsInput" data-step="-1" aria-label="Decrease rows">-</button>
                        <input id="tableRowsInput" type="number" min="1" max="60" value="4" inputmode="numeric" style="width: 40px;" >
                        <button class="stepper-button" type="button" data-step-target="tableRowsInput" data-step="1" aria-label="Increase rows">+</button>
                    </span>
                </label>
                <label class="stepper-field">
                    <span>Columns</span>
                    <span class="stepper-control">
                        <button class="stepper-button" type="button" data-step-target="tableColsInput" data-step="-1" aria-label="Decrease columns">-</button>
                        <input id="tableColsInput" type="number" min="1" max="60" value="4" inputmode="numeric" style="width: 40px;" >
                        <button class="stepper-button" type="button" data-step-target="tableColsInput" data-step="1" aria-label="Increase columns">+</button>
                    </span>
                </label>
            </div>
        </div>
    </div>

    <div class="toolbar-menu settings-menu" id="settingsMenu" aria-hidden="true">
        <div class="menu-section paper-settings-section">
            <div class="paper-option-row">
                <button class="paper-option-button" id="blankPaperBtn" type="button">
                    <span class="input-mode-copy"><span>Blank</span><small>Blank Paper</small></span>
                    <svg class="input-mode-icon paper-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                    </svg>
                </button>
                <button class="paper-option-button is-active" id="ruledTabBtn" type="button">
                    <span class="input-mode-copy"><span>Ruled</span><small>Ruled guide</small></span>
                    <svg class="input-mode-icon paper-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                        <path d="M8 10h8" />
                        <path d="M8 14h8" />
                    </svg>
                </button>
                <button class="paper-option-button" id="gridTabBtn" type="button">
                    <span class="input-mode-copy"><span>Squared</span><small>Squared guide</small></span>
                    <svg class="input-mode-icon paper-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="input-panel">
            <div class="input-mode-grid" role="group" aria-label="Input mode">
                <button class="input-mode-card is-active" type="button" data-input-mode="auto">
                    <span class="input-mode-copy"><span>Auto</span><small>Detects tool</small></span>
                    <svg class="input-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 5h16" />
                        <path d="M4 12h10" />
                        <path d="M4 19h6" />
                        <path d="m17 15 3 3" />
                        <path d="m20 15-3 3" />
                    </svg>
                </button>
                <button class="input-mode-card" type="button" data-input-mode="stylus">
                    <span class="input-mode-copy"><span>Stylus</span><small>Uses pressure</small></span>
                    <svg class="input-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m4 20 3.5-.8L19.2 7.5a2.1 2.1 0 0 0-3-3L4.8 15.9Z" />
                        <path d="m13.8 6.8 3.4 3.4" />
                        <path d="m4.8 15.9 3.3 3.3" />
                    </svg>
                </button>
                <button class="input-mode-card" type="button" data-input-mode="finger">
                    <span class="input-mode-copy"><span>Finger</span><small>Smoother line</small></span>
                    <svg class="input-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 11V5.5a2 2 0 0 1 4 0V11" />
                        <path d="M12 10V4.5a2 2 0 0 1 4 0V12" />
                        <path d="M16 11.5V7a2 2 0 0 1 4 0v6.7a7.3 7.3 0 0 1-7.3 7.3h-1.2a6 6 0 0 1-4.2-1.8L3.6 15.6a2 2 0 0 1 2.8-2.8L8 14.4" />
                    </svg>
                </button>
                <button class="input-mode-card" type="button" data-input-mode="mouse">
                    <span class="input-mode-copy"><span>Mouse</span><small>Constant line</small></span>
                    <svg class="input-mode-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="6" y="3" width="12" height="18" rx="6" />
                        <path d="M12 3v7" />
                        <path d="M9 10h6" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div class="toolbar-menu ai-menu" id="aiMenu" aria-hidden="true">
        <div class="ai-menu-row" id="perfectShapeMenuBtn">
            <span class="ai-menu-label">
                <span class="ai-menu-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor"/></svg>
                </span>
                <span>Perfect Shape</span>
            </span>
            <span class="ai-perfect-shape-control">
                <label class="switch-control" aria-label="Perfect Shape">
                    <input id="perfectShapeAlwaysToggle" type="checkbox">
                    <span></span>
                </label>
            </span>
        </div>
        <div class="ai-menu-row{{ ($isDemo ?? false) ? ' is-disabled' : '' }}" id="chatMenuRow">
        <span class="ai-menu-label">
        <span class="ai-menu-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span>{{ ($isDemo ?? false) ? 'Chat (not logged in)' : 'Chat' }}</span>
        </span>
        <span class="ai-perfect-shape-control">
        <label class="switch-control" aria-label="Chat">
        <input id="chatToggle" type="checkbox" @if($isDemo ?? false) disabled @endif>
        <span></span>
        </label>
        </span>
        </div>
    </div>

    <div class="modal-backdrop" id="modalBackdrop" aria-hidden="true"></div>

    <section class="modal" id="saveModal" role="dialog" aria-modal="true" aria-labelledby="saveTitle">
        <h2 id="saveTitle">Save Drawing</h2>
        <label class="field">
            File name
            <input id="filenameInput" type="text" autocomplete="off" value="my drawing" placeholder="my drawing">
        </label>
        <div class="actions">
            <button class="button" id="confirmSaveBtn" type="button">Save</button>
            <button class="button secondary" data-close type="button">Close</button>
        </div>
        <div class="status" id="saveStatus" role="status"></div>
    </section>

    <section class="modal" id="overwriteModal" role="dialog" aria-modal="true" aria-labelledby="overwriteTitle">
        <h2 id="overwriteTitle">Overwrite File</h2>
        <p class="modal-copy" id="overwriteText"></p>
        <div class="actions">
            <button class="button danger" id="overwriteBtn" type="button">Overwrite</button>
            <button class="button secondary" id="cancelOverwriteBtn" type="button">Back to Save</button>
        </div>
        <div class="status" id="overwriteStatus" role="status"></div>
    </section>

    <section class="modal" id="newModal" role="dialog" aria-modal="true" aria-labelledby="newTitle">
        <h2 id="newTitle">New Drawing</h2>
        <p class="modal-copy">You have unsaved changes. Do you want to save before starting a new drawing?</p>
        <div class="actions">
            <button class="button" id="saveBeforeNewBtn" type="button">Save first</button>
            <button class="button danger" id="discardNewBtn" type="button">Discard</button>
            <button class="button secondary" data-close type="button">Cancel</button>
        </div>
        <div class="status" id="newStatus" role="status"></div>
    </section>

    <section class="modal" id="viewModal" role="dialog" aria-modal="true" aria-labelledby="viewTitle">
        <div class="saved-documents-header">
            <div>
                <h2 id="viewTitle">Saved Documents</h2>
                <p>Your notes, organized and always within reach.</p>
            </div>
            <button class="button create-folder-button" id="createFolderBtn" type="button"><span aria-hidden="true">+</span> New Folder</button>
        </div>
        <ul class="file-list" id="fileList"></ul>
        <div class="status" id="viewStatus" role="status"></div>
    </section>

    <section class="modal" id="deleteModal" role="dialog" aria-modal="true" aria-labelledby="deleteTitle">
        <h2 id="deleteTitle">Delete File</h2>
        <p class="modal-copy" id="deleteText"></p>
        <div class="actions">
            <button class="button danger" id="confirmDeleteBtn" type="button">Delete</button>
            <button class="button secondary" id="cancelDeleteBtn" type="button">Back to Files</button>
            <button class="button secondary" data-close type="button">Cancel</button>
        </div>
        <div class="status" id="deleteStatus" role="status"></div>
    </section>

    <section class="modal" id="deletePageModal" role="dialog" aria-modal="true" aria-labelledby="deletePageTitle">
        <h2 id="deletePageTitle">Delete Page</h2>
        <p class="modal-copy" id="deletePageText">Are you sure you want to delete this page?</p>
        <div class="actions">
            <button class="button danger" id="confirmDeletePageBtn" type="button">Delete</button>
            <button class="button secondary" data-close type="button">Cancel</button>
        </div>
    </section>

    <section class="modal" id="renameModal" role="dialog" aria-modal="true" aria-labelledby="renameTitle">
        <h2 id="renameTitle">Rename Document</h2>
        <label class="field">
            New name
            <input id="renameInput" type="text" autocomplete="off">
        </label>
        <div class="actions">
            <button class="button" id="confirmRenameBtn" type="button">Rename</button>
            <button class="button secondary" id="cancelRenameBtn" type="button">Back to Files</button>
            <button class="button secondary" data-close type="button">Cancel</button>
        </div>
        <div class="status" id="renameStatus" role="status"></div>
    </section>

    <section class="modal" id="tableInfoModal" role="dialog" aria-modal="true" aria-labelledby="tableInfoTitle">
        <h2 id="tableInfoTitle">Table Text Styles</h2>
        <div class="text-options-panel">
            <label class="setting-range">
                <span>Size</span>
                <strong id="tableTextSizeLabel">20px</strong>
                <input id="tableTextSizeInput" type="range" min="8" max="96" value="20">
            </label>
            <div class="text-style-grid text-format-grid" role="group" aria-label="Table cell text formatting">
                <button class="text-style-button" id="tableBoldBtn" type="button"><strong>B</strong></button>
                <button class="text-style-button" id="tableItalicBtn" type="button"><em>I</em></button>
                <button class="text-style-button" id="tableUnderlineBtn" type="button"><u>U</u></button>
                <button class="text-style-button is-active" id="tableAlignLeftBtn" type="button" title="Align left" aria-label="Align left">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M4 10h11"/><path d="M4 14h16"/><path d="M4 18h11"/></svg>
                </button>
                <button class="text-style-button" id="tableAlignCenterBtn" type="button" title="Align center" aria-label="Align center">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M7 10h10"/><path d="M4 14h16"/><path d="M7 18h10"/></svg>
                </button>
                <button class="text-style-button" id="tableAlignRightBtn" type="button" title="Align right" aria-label="Align right">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M9 10h11"/><path d="M4 14h16"/><path d="M9 18h11"/></svg>
                </button>
            </div>
            <div class="text-colour-field">
                <span>Colour</span>
                <div class="text-colour-row" id="tableColourRow" aria-label="Table cell text colours"></div>
                <button class="text-colour-add" id="tableAddColourBtn" type="button" title="Add colour" aria-label="Add table text colour">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
                <input class="hidden-colour-input" id="tableColorInput" type="color" value="#111827">
            </div>
        </div>
        <div class="actions">
            <button class="button secondary" data-close type="button">Close</button>
        </div>
    </section>



    @vite(['resources/js/canvas.js'])
</body>
</html>
