        const __csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        let canvas = document.getElementById('pad');
        let ctx = canvas.getContext('2d', { alpha: false });
        const guideCanvas = document.getElementById('guidePad');
        const guideCtx = guideCanvas.getContext('2d');
        const textLayer = document.getElementById('textLayer');
        const selectionRect = document.getElementById('selectionRect');
        const brushCursor = document.getElementById('brushCursor');
        const virtualKeyboard = document.getElementById('virtualKeyboard');
        const virtualKeyboardKeys = document.getElementById('virtualKeyboardKeys');
        const orientationOverlay = document.getElementById('orientationOverlay');
        const savingOverlay = document.getElementById('savingOverlay');
        const documentLoadingOverlay = document.getElementById('documentLoadingOverlay');
        const aiTranslationOverlay = document.getElementById('aiTranslationOverlay');
        const modals = [...document.querySelectorAll('.modal')];
        const backdrop = document.getElementById('modalBackdrop');
        const colorInput = document.getElementById('colorInput');
        const colorPreview = document.getElementById('colorPreview');
        const inputModeLabel = document.getElementById('inputModeLabel');
        const recentColourRow = document.getElementById('recentColourRow');
        const penHardnessInput = document.getElementById('penHardnessInput');
        const penHardnessLabel = document.getElementById('penHardnessLabel');
        const penOpacityInput = document.getElementById('penOpacityInput');
        const penOpacityLabel = document.getElementById('penOpacityLabel');
        const penSizeInput = document.getElementById('penSizeInput');
        const penSizeLabel = document.getElementById('penSizeLabel');
        const eraserHardnessInput = document.getElementById('eraserHardnessInput');
        const eraserHardnessLabel = document.getElementById('eraserHardnessLabel');
        const eraserOpacityInput = document.getElementById('eraserOpacityInput');
        const eraserOpacityLabel = document.getElementById('eraserOpacityLabel');
        const eraserSizeInput = document.getElementById('eraserSizeInput');
        const eraserSizeLabel = document.getElementById('eraserSizeLabel');
        const overwriteText = document.getElementById('overwriteText');
        const deleteText = document.getElementById('deleteText');
        const renameInput = document.getElementById('renameInput');
        const currentFileBadge = document.getElementById('currentFileBadge');
        const pageLabel = document.getElementById('pageLabel');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const deletePageBtn = document.getElementById('deletePageBtn');
        const toolbar = document.querySelector('.toolbar');
        const aiCostBadge = document.getElementById('aiCostBadge');
        const newBtn = document.getElementById('newBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const penBtn = document.getElementById('penBtn');
        const eraserBtn = document.getElementById('eraserBtn');
        const insertBtn = document.getElementById('insertBtn');
        const selectBtn = document.getElementById('selectBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const aiBtn = document.getElementById('aiBtn');
        const moreBtn = document.getElementById('moreBtn');
        const pendingMoreBtn = document.getElementById('pendingMoreBtn');
        const fileMenu = document.getElementById('fileMenu');
        const penMenu = document.getElementById('penMenu');
        const eraserMenu = document.getElementById('eraserMenu');
        const insertMenu = document.getElementById('insertMenu');
        const settingsMenu = document.getElementById('settingsMenu');
        const aiMenu = document.getElementById('aiMenu');
        const overflowMenu = document.getElementById('overflowMenu');
        const pendingActionsMenu = document.getElementById('pendingActionsMenu');
        const toolbarMenus = [fileMenu, penMenu, eraserMenu, insertMenu, settingsMenu, aiMenu, overflowMenu, pendingActionsMenu];
        const toolbarMenuButtons = [newBtn, undoBtn, redoBtn, penBtn, eraserBtn, insertBtn, aiBtn, selectBtn, settingsBtn, moreBtn, pendingMoreBtn];
        const toolbarOverflowButtons = [newBtn, undoBtn, redoBtn, penBtn, eraserBtn, insertBtn, selectBtn, aiBtn, settingsBtn]
            .concat(Array.from(document.querySelectorAll('.toolbar > .pending-action-icon')));
        const pendingActionButtons = Array.from(document.querySelectorAll('.toolbar > .pending-action-icon'));
        const perfectShapeMenuBtn = document.getElementById('perfectShapeMenuBtn');
        const perfectShapeAlwaysToggle = document.getElementById('perfectShapeAlwaysToggle');
        const chatToggle = document.getElementById('chatToggle');
        const chatMenuRow = document.getElementById('chatMenuRow');
        const chatBar = document.getElementById('chatBar');
        const chatThread = document.getElementById('chatThread');
        const chatInput = document.getElementById('chatInput');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatSlashBtn = document.getElementById('chatSlashBtn');
        const chatSlashMenu = document.getElementById('chatSlashMenu');
        const textToolBtn = document.getElementById('textToolBtn');
        const blankPaperBtn = document.getElementById('blankPaperBtn');
        const ruledTabBtn = document.getElementById('ruledTabBtn');
        const gridTabBtn = document.getElementById('gridTabBtn');
        const textSizeInput = document.getElementById('textSizeInput');
        const textSizeLabel = document.getElementById('textSizeLabel');
        const textBoldBtn = document.getElementById('textBoldBtn');
        const textItalicBtn = document.getElementById('textItalicBtn');
        const textUnderlineBtn = document.getElementById('textUnderlineBtn');
        const textAlignLeftBtn = document.getElementById('textAlignLeftBtn');
        const textAlignCenterBtn = document.getElementById('textAlignCenterBtn');
        const textAlignRightBtn = document.getElementById('textAlignRightBtn');
        const textColorInput = document.getElementById('textColorInput');
        const textColourRow = document.getElementById('textColourRow');
        const textAddColourBtn = document.getElementById('textAddColourBtn');
        const tableTextSizeInput = document.getElementById('tableTextSizeInput');
        const tableTextSizeLabel = document.getElementById('tableTextSizeLabel');
        const tableBoldBtn = document.getElementById('tableBoldBtn');
        const tableItalicBtn = document.getElementById('tableItalicBtn');
        const tableUnderlineBtn = document.getElementById('tableUnderlineBtn');
        const tableAlignLeftBtn = document.getElementById('tableAlignLeftBtn');
        const tableAlignCenterBtn = document.getElementById('tableAlignCenterBtn');
        const tableAlignRightBtn = document.getElementById('tableAlignRightBtn');
        const tableColorInput = document.getElementById('tableColorInput');
        const tableColourRow = document.getElementById('tableColourRow');
        const tableAddColourBtn = document.getElementById('tableAddColourBtn');
        const tableRowsInput = document.getElementById('tableRowsInput');
        const tableColsInput = document.getElementById('tableColsInput');
        const guideToggle = document.getElementById('guideToggle');
        let drawing = false;
        let lastPoint = null;
        let pendingOverwriteName = '';
        let pendingDeleteName = '';
        let pendingRenameName = '';
        let pendingNewAfterSave = false;
        let currentFilename = '';
        // Numeric id/version of the open document, for the REST-autosave migration
        // (see AUDIT.md "Migrare autosave") — used by both the background autosave
        // and the primary Save/Ctrl+S flow when window.CANVAS_AUTOSAVE_ENABLED is on.
        let currentDocumentId = null;
        let currentVersion = null;
        let inputMode = localStorage.getItem('fixbly.inputMode') || 'auto';
        let activePenPointerId = null;
        let lastPenActivityAt = 0;
        let activeTool = 'pen';
        let lastDrawingTool = 'pen';
        let barrelEraserActive = false;
        let perfectShapeMode = false;
        let currentRatio = Math.max(1, window.devicePixelRatio || 1);
        let resizeTimer = 0;
        let guideMode = 'ruled';
        let guidesVisible = true;
        let tableSelectionMode = false;
        let tableSelecting = false;
        let tableStart = null;
        let tableRows = 4;
        let tableCols = 4;
        let textSelectionMode = false;
        let textSelecting = false;
        let textStart = null;
        let drawingSelectionMode = false;
        let drawingSelecting = false;
        let drawingSelectionStart = null;
        let selectedStrokeIds = [];
        let drawingSelectionBounds = null;
        let drawingSelectionDragMode = '';
        let drawingSelectionDragHandle = '';
        let drawingSelectionPointerId = null;
        let drawingSelectionDragStart = null;
        let drawingSelectionOriginalBounds = null;
        let drawingSelectionOriginalPoints = null;
        let drawingSelectionRotateCenter = null;
        let drawingSelectionStartAngle = 0;
        let drawingSelectionRotationAngle = 0;
        let selectedTextId = '';
        let textDragMode = '';
        let textDragPointerId = null;
        let textDragStart = null;
        let textDragStartClient = null;
        let textDragOriginalBounds = null;
        let textDragOriginalDisplay = null;
        let textDragPending = false;
        let selectedTableId = '';
        let tableDragMode = '';
        let tableDragPointerId = null;
        let tableDragStart = null;
        let tableDragStartClient = null;
        let tableDragOriginalBounds = null;
        let tableDragOriginalDisplay = null;
        let textDragLastDelta = null;
        let tableDragLastDelta = null;
        let tableDragPending = false;
        let deferredViewportResize = false;
        let virtualKeyboardTarget = null;
        let virtualKeyboardLayout = 'letters';
        let virtualKeyboardShift = false;
        let virtualKeyboardCaret = 0;
        let workspaceOffsetY = 0;
        let interactionCooldownUntil = 0;
        let hasUnsavedChanges = false;
        let isLandscapeBlocked = false;
        const smartShapeConversionEnabled = true;
        const SMART_SHAPE_RULES = {
            autoConvertConfidence: 0.85,
            minStrokePoints: 6,
            minStrokeLength: 20,
            closeDistanceRatio: 0.18,
            simplifyTolerance: 3.5,
            lineMaxDeviationRatio: 0.08
        };
        const defaultToolSettings = {
            pen: { tip: 'round', hardness: 80, opacity: 100, size: 10 },
            eraser: { tip: 'round', hardness: 60, opacity: 100, size: 56 }
        };
        const defaultInkColor = '#111827';
        const defaultRecentColours = ['#000000', '#ffffff', '#ec4899', '#7c3aed', '#2563eb', '#3b82f6', '#65c466', '#f4c20d'];
        const defaultTextDefaults = {
            fontSize: 20,
            bold: false,
            italic: false,
            underline: false,
            align: 'left',
            color: defaultInkColor
        };
        let toolSettings = loadToolSettings();
        let textDefaults = loadTextDefaults();
        let tableDefaults = defaultCellStyles();
        let recentColours = loadRecentColours();
        let pages = new Map();
        let pageImageSizes = new Map();
        let pageModels = new Map();
        let failedPageLoads = new Set();
        let warnedMissingPages = new Set();
        let redoStacks = new Map();
        let forwardRedoStacks = new Map();
        let dirtyPages = new Set();
        let currentStroke = null;
        let currentPage = 1;
        let pageTransitioning = false;
        let aiCostTotalGbp = 0;
        let aiCostLastGbp = 0;
        let sessionRestoreInProgress = false;
        let sessionSaveTimer = 0;
        let savingSpinnerStartedAt = 0;
        let mainThreadLagCheckAt = 0;
        const sessionStorageKey = 'fixbly.session';
        const canvasBackgroundColor = '#f4f5f6';
        const canvasBackgroundHighlightColor = '#fbfbfc';
        const canvasBackgroundRgb = { r: 244, g: 245, b: 246 };
        const interactionCooldownMs = 450;
        const dragStartThreshold = 6;
        const virtualKeyboardLayouts = {
        letters: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
        ['numbers', 'paste', 'space', 'enter', 'done']
        ],
        numbers: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"', '%'],
        ['symbols', '.', ',', '?', '!', "'", 'backspace'],
        ['letters', 'paste', 'space', 'enter', 'done']
        ],
        symbols: [
        ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
        ['_', '\\', '|', '~', '<', '>', '`', '.', ',', '-'],
        ['numbers', '.', ',', '?', '!', "'", 'backspace'],
        ['letters', 'paste', 'space', 'enter', 'done']
        ]
        };

        function closeChat() {
        if (!chatToggle || !chatToggle.checked) return;
        
        // Oprește tastatura virtuală și dictarea dacă sunt active
        stopChatDictation();
        if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'chat') {
            closeVirtualKeyboard();
        }

        // Ascunde bara și resetează thread-ul
        chatToggle.checked = false;
        if (chatMenuRow) {
            chatMenuRow.classList.remove('is-active');
        }
        syncAiButtonState();
        chatBar.classList.remove('is-visible');
        chatBar.setAttribute('aria-hidden', 'true');

        if (chatThread) {
            chatThread.innerHTML = '';
            chatThread.classList.remove('has-messages');
            chatThread.style.bottom = ''; // FORȚEAZĂ resetarea poziției
        }

        // Repoziționează thread-ul imediat și după tranziția CSS
        positionChatThread();
        window.setTimeout(positionChatThread, 250);
        }        

        function resizeImageForAI(base64Image, maxWidth = 1024, quality = 0.7) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    
                    // Limitează AMBELE dimensiuni, nu doar width
                    if (width > maxWidth || height > maxWidth) {
                        const scale = Math.min(maxWidth / width, maxWidth / height);
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = base64Image;
            });
        }      

        function displayName(filename) {
            return filename.replace(/\\/g, '/').split('/').pop().replace(/\.(png|jpe?g)$/i, '');
        }

        function shortFileLabel(filename) {
            const label = displayName(filename);
            return label.length > 32 ? `${label.slice(0, 29)}...` : label;
        }

        function fileFolder(filename) {
            const parts = filename.replace(/\\/g, '/').split('/');
            return parts.length > 1 ? parts[0] : '';
        }

        function editedLabel(timestamp) {
            const modified = Number(timestamp || 0) * 1000;
            if (!modified) {
                return 'Edited recently';
            }
            const diff = Math.max(0, Date.now() - modified);
            const minutes = Math.floor(diff / 60000);
            if (minutes < 1) {
                return 'Edited just now';
            }
            if (minutes < 60) {
                return `Edited ${minutes}m ago`;
            }
            const hours = Math.floor(minutes / 60);
            if (hours < 24) {
                return `Edited ${hours}h ago`;
            }
            const days = Math.floor(hours / 24);
            if (days === 1) {
                return 'Edited yesterday';
            }
            if (days < 7) {
                return `Edited ${days}d ago`;
            }
            return `Edited ${new Date(modified).toLocaleDateString()}`;
        }

        function normalizeTip(tip) {
            return ['round', 'sharp', 'square', 'soft', 'highlighter', 'brush'].includes(tip) ? tip : 'round';
        }

        function normalizePercent(value, fallback) {
            const numeric = Number(value);
            return Math.max(0, Math.min(100, Number.isFinite(numeric) ? numeric : fallback));
        }

        function normalizeSize(value, fallback, max = 56) {
            const numeric = Number(value);
            return Math.max(1, Math.min(max, Number.isFinite(numeric) ? numeric : fallback));
        }

        function loadToolSettings() {
            try {
                const saved = JSON.parse(localStorage.getItem('fixbly.toolSettings') || '{}');
                return {
                    pen: {
                        tip: normalizeTip(saved.pen && saved.pen.tip),
                        hardness: normalizePercent(saved.pen && saved.pen.hardness, defaultToolSettings.pen.hardness),
                        opacity: Math.max(5, normalizePercent(saved.pen && saved.pen.opacity, defaultToolSettings.pen.opacity)),
                        size: normalizeSize(saved.pen && saved.pen.size, defaultToolSettings.pen.size, 36)
                    },
                    eraser: {
                        tip: normalizeTip(saved.eraser && saved.eraser.tip),
                        hardness: normalizePercent(saved.eraser && saved.eraser.hardness, defaultToolSettings.eraser.hardness),
                        opacity: Math.max(5, normalizePercent(saved.eraser && saved.eraser.opacity, defaultToolSettings.eraser.opacity)),
                        size: normalizeSize(saved.eraser && saved.eraser.size, defaultToolSettings.eraser.size, 56)
                    }
                };
            } catch (error) {
                return JSON.parse(JSON.stringify(defaultToolSettings));
            }
        }

        function saveToolSettings() {
            localStorage.setItem('fixbly.toolSettings', JSON.stringify(toolSettings));
        }

        function normalizeTextSize(value, fallback = 20) {
            const numeric = Number(value);
            return Math.max(8, Math.min(96, Number.isFinite(numeric) ? numeric : fallback));
        }

        function normalizeAlign(value) {
            return ['left', 'center', 'right'].includes(value) ? value : 'left';
        }

        function normalizeColor(value, fallback = '#111827') {
            return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback;
        }

        function loadTextDefaults() {
            try {
                const saved = JSON.parse(localStorage.getItem('fixbly.textDefaults') || '{}');
                return {
                    fontSize: normalizeTextSize(saved.fontSize, defaultTextDefaults.fontSize),
                    bold: Boolean(saved.bold),
                    italic: Boolean(saved.italic),
                    underline: Boolean(saved.underline),
                    align: normalizeAlign(saved.align),
                    color: normalizeColor(saved.color || colorInput.value, defaultTextDefaults.color)
                };
            } catch (error) {
                return { ...defaultTextDefaults, color: normalizeColor(colorInput.value, defaultTextDefaults.color) };
            }
        }

        function saveTextDefaults() {
            localStorage.setItem('fixbly.textDefaults', JSON.stringify(textDefaults));
        }

        function loadRecentColours() {
            try {
                const saved = JSON.parse(localStorage.getItem('fixbly.recentColours') || '[]');
                return Array.isArray(saved) && saved.length ? saved : [...defaultRecentColours];
            } catch (error) {
                return [...defaultRecentColours];
            }
        }

        function saveRecentColours() {
            localStorage.setItem('fixbly.recentColours', JSON.stringify(recentColours.slice(0, 8)));
        }

        function rememberColour(color) {
            const normalized = /^#[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : defaultInkColor;
            recentColours = [normalized, ...recentColours.filter((item) => item.toLowerCase() !== normalized)].slice(0, 8);
            saveRecentColours();
            renderRecentColours();
        }

        function resetOptionsToDefaults() {
            toolSettings = JSON.parse(JSON.stringify(defaultToolSettings));
            textDefaults = { ...defaultTextDefaults };
            tableDefaults = defaultCellStyles();
            recentColours = [...defaultRecentColours];
            colorInput.value = defaultInkColor;
            textColorInput.value = defaultInkColor;
            tableColorInput.value = defaultInkColor;
            saveToolSettings();
            saveTextDefaults();
            saveRecentColours();
            setInputMode('auto');
            updateOptionPreviews();
            renderTextColours();
            renderTableColours();
        }

        function renderRecentColours() {
            if (!recentColourRow) {
                return;
            }

            recentColourRow.innerHTML = '';
            for (const colour of recentColours.slice(0, 6)) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'text-colour-button';
                button.style.backgroundColor = colour;
                button.classList.toggle('is-light', colour.toLowerCase() === '#ffffff');
                button.classList.toggle('is-active', colour.toLowerCase() === colorInput.value.toLowerCase());
                button.setAttribute('aria-label', `Use ${colour}`);
                button.addEventListener('click', () => {
                    colorInput.value = colour;
                    updateOptionPreviews();
                });
                recentColourRow.appendChild(button);
            }

            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.className = 'text-colour-add';
            addButton.title = 'Add colour';
            addButton.setAttribute('aria-label', 'Add pen colour');
            addButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
            addButton.addEventListener('click', () => colorInput.click());
            recentColourRow.appendChild(addButton);
        }

        function renderTextColours() {
            if (!textColourRow) {
                return;
            }

            const activeColour = normalizeColor((selectedTextElement() || textDefaults).color || colorInput.value, '#111827');
            textColourRow.innerHTML = '';
            for (const colour of recentColours.slice(0, 6)) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'text-colour-button';
                button.style.backgroundColor = colour;
                button.classList.toggle('is-light', colour.toLowerCase() === '#ffffff');
                button.classList.toggle('is-active', colour.toLowerCase() === activeColour.toLowerCase());
                button.setAttribute('aria-label', `Use text colour ${colour}`);
                button.addEventListener('click', () => setTextDefaultOrSelected('color', colour));
                textColourRow.appendChild(button);
            }

            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.className = 'text-colour-add';
            addButton.title = 'Add colour';
            addButton.setAttribute('aria-label', 'Add text colour');
            addButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
            addButton.addEventListener('click', () => textColorInput.click());
            textColourRow.appendChild(addButton);
        }

        function highestFilledPage() {
            let max = 1;
            const candidates = new Set([...pageModels.keys(), ...pages.keys()]);
            for (const page of candidates) {
                if (pageHasContent(page)) {
                    max = Math.max(max, page);
                }
            }
            return Math.max(max, currentPage);
        }

        function updatePageControl() {
            pageLabel.textContent = `page ${currentPage} of ${highestFilledPage()}`;
            prevPageBtn.disabled = currentPage <= 1;
        }

        function createPageModel() {
            const size = cssSize();
            return {
                version: 1,
                baseWidth: size.width,
                baseHeight: size.height,
                perfectShapeEnabled: false,
                elements: []
            };
        }

        function createElementId() {
            return `el-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        }

        function ensureElementIds(model) {
            if (!model || !Array.isArray(model.elements)) {
                return;
            }

            for (const element of model.elements) {
                if (!element.id) {
                    element.id = createElementId();
                }
            }
        }

        function normalizeTextElement(element) {
            const bounds = element.bounds || {};
            return {
                ...element,
                id: element.id || createElementId(),
                type: 'text',
                bounds: {
                    x: Math.max(0, Number(bounds.x) || 0),
                    y: Math.max(0, Number(bounds.y) || 0),
                    width: Math.max(1, Number(bounds.width) || 180),
                    height: Math.max(1, Number(bounds.height) || 80)
                },
                text: typeof element.text === 'string' ? element.text : '',
                fontSize: normalizeTextSize(element.fontSize, 20),
                bold: Boolean(element.bold),
                italic: Boolean(element.italic),
                underline: Boolean(element.underline),
                align: normalizeAlign(element.align),
                color: normalizeColor(element.color || colorInput.value, '#111827')
            };
        }

        function defaultCellStyles() {
            return {
                fontSize: 20,
                bold: false,
                italic: false,
                underline: false,
                align: 'left',
                color: '#111827'
            };
        }

        function normalizeCellStyles(styles = {}) {
            const defaults = defaultCellStyles();
            return {
                fontSize: normalizeTextSize(styles.fontSize, defaults.fontSize),
                bold: Boolean(styles.bold),
                italic: Boolean(styles.italic),
                underline: Boolean(styles.underline),
                align: normalizeAlign(styles.align),
                color: normalizeColor(styles.color || defaults.color, defaults.color)
            };
        }

        function syncTextDefaultsFromElement(element) {
            if (!element) {
                return;
            }
            textDefaults = {
                fontSize: normalizeTextSize(element.fontSize, textDefaults.fontSize),
                bold: Boolean(element.bold),
                italic: Boolean(element.italic),
                underline: Boolean(element.underline),
                align: normalizeAlign(element.align),
                color: normalizeColor(element.color || textDefaults.color, '#111827')
            };
            saveTextDefaults();
        }

        function syncTableDefaultsFromStyles(styles) {
            tableDefaults = normalizeCellStyles(styles);
        }

        function normalizeTableElement(element) {
            const bounds = element.bounds || {};
            const rows = Math.max(1, Math.min(60, Number(element.rows) || 1));
            const cols = Math.max(1, Math.min(60, Number(element.cols) || 1));
            const cells = Array.isArray(element.cells) ? element.cells.map((cell) => ({
                row: Math.max(0, Math.min(rows - 1, Number(cell.row) || 0)),
                col: Math.max(0, Math.min(cols - 1, Number(cell.col) || 0)),
                text: typeof cell.text === 'string' ? cell.text : ''
            })).filter((cell) => cell.text !== '') : [];

            return {
                ...element,
                id: element.id || createElementId(),
                type: 'table',
                bounds: {
                    x: Math.max(0, Number(bounds.x) || 0),
                    y: Math.max(0, Number(bounds.y) || 0),
                    width: Math.max(1, Number(bounds.width) || 180),
                    height: Math.max(1, Number(bounds.height) || 120)
                },
                rows,
                cols,
                cellStyles: normalizeCellStyles(element.cellStyles),
                cells
            };
        }

        function normalizePagePoint(point, fallback = { x: 0, y: 0 }) {
            const source = point && typeof point === 'object' ? point : fallback;
            return {
                x: Number.isFinite(Number(source.x)) ? Number(source.x) : fallback.x,
                y: Number.isFinite(Number(source.y)) ? Number(source.y) : fallback.y
            };
        }

        function normalizePageBounds(bounds) {
            const source = bounds && typeof bounds === 'object' ? bounds : {};
            return {
                x: Math.max(0, Number(source.x) || 0),
                y: Math.max(0, Number(source.y) || 0),
                width: Math.max(1, Number(source.width) || 1),
                height: Math.max(1, Number(source.height) || 1)
            };
        }

        function strokeTipScale(tip) {
            const normalizedTip = normalizeTip(tip);
            return normalizedTip === 'sharp' ? 0.48 : (normalizedTip === 'highlighter' ? 1.9 : 1);
        }

        function normalizeSmartShapeStyle(style = {}) {
            const tip = normalizeTip(style.tip);
            const size = normalizeSize(style.size, defaultToolSettings.pen.size, 36);
            const explicitEffectiveSize = Number(style.effectiveSize);
            return {
                color: normalizeColor(style.color || colorInput.value, defaultInkColor),
                size,
                effectiveSize: Math.max(1, Number.isFinite(explicitEffectiveSize) ? explicitEffectiveSize : size * strokeTipScale(tip)),
                opacity: Math.max(5, normalizePercent(style.opacity, 100)),
                hardness: normalizePercent(style.hardness, defaultToolSettings.pen.hardness),
                tip
            };
        }

        function normalizeSmartShapeElement(element) {
            if (!element || typeof element !== 'object') {
                return null;
            }

            const shapeType = ['line', 'rectangle', 'circle', 'ellipse', 'arrow', 'triangle', 'rhombus'].includes(element.shapeType)
                ? element.shapeType
                : '';
            if (!shapeType) {
                return null;
            }

            const normalized = {
                id: element.id || createElementId(),
                type: 'smart-shape',
                shapeType,
                bounds: normalizePageBounds(element.bounds),
                rotation: Number.isFinite(Number(element.rotation)) ? Number(element.rotation) : 0,
                style: normalizeSmartShapeStyle(element.style || element),
                integrity: normalizeIntegrity(element.integrity, shapeType),
                createdFrom: element.createdFrom && typeof element.createdFrom === 'object'
                    ? { ...element.createdFrom }
                    : null
            };

            if (shapeType === 'line' || shapeType === 'arrow') {
                normalized.from = normalizePagePoint(element.from, {
                    x: normalized.bounds.x,
                    y: normalized.bounds.y
                });
                normalized.to = normalizePagePoint(element.to, {
                    x: normalized.bounds.x + normalized.bounds.width,
                    y: normalized.bounds.y + normalized.bounds.height
                });
                normalized.segments = normalizeSegmentList(element.segments, 1, [{ start: 0, end: 1 }]);
                if (shapeType === 'arrow') {
                    const arrowHead = element.arrowHead && typeof element.arrowHead === 'object' ? element.arrowHead : {};
                    normalized.arrowHead = {
                        position: arrowHead.position === 'start' ? 'start' : 'end',
                        size: Math.max(6, Math.min(48, Number(arrowHead.size) || 18)),
                        angle: Math.max(15, Math.min(60, Number(arrowHead.angle) || 35))
                    };
                }
            }

            if (shapeType === 'rectangle') {
                normalized.radius = Math.max(0, Math.min(32, Number(element.radius) || 8));
                normalized.segments = normalizeSegmentList(element.segments, 1, [{ start: 0, end: 1 }]);
            }

            if (shapeType === 'circle' || shapeType === 'ellipse') {
                normalized.cx = Number.isFinite(Number(element.cx))
                    ? Number(element.cx)
                    : normalized.bounds.x + normalized.bounds.width / 2;
                normalized.cy = Number.isFinite(Number(element.cy))
                    ? Number(element.cy)
                    : normalized.bounds.y + normalized.bounds.height / 2;
                normalized.rx = Math.max(1, Number(element.rx) || normalized.bounds.width / 2);
                normalized.ry = Math.max(1, Number(element.ry) || normalized.bounds.height / 2);
                normalized.arcs = normalizeSegmentList(element.arcs, Math.PI * 2, [{ start: 0, end: Math.PI * 2 }]);
            }

            if (shapeType === 'triangle' || shapeType === 'rhombus') {
                const requiredPoints = shapeType === 'triangle' ? 3 : 4;
                const sourcePoints = Array.isArray(element.points) ? element.points : [];
                const points = sourcePoints
                    .map((point) => normalizePagePoint(point))
                    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
                if (points.length >= requiredPoints) {
                    normalized.points = points.slice(0, requiredPoints);
                    normalized.bounds = normalizePageBounds(calculateStrokeBounds(normalized.points) || normalized.bounds);
                } else {
                    return null;
                }
                normalized.segments = normalizeSegmentList(element.segments, 1, [{ start: 0, end: 1 }]);
            }

            return normalized;
        }

        function normalizePageModel(model) {
            if (!model || typeof model !== 'object') {
                return null;
            }

            const normalized = {
                version: 1,
                baseWidth: Math.max(1, Number(model.baseWidth) || cssSize().width),
                baseHeight: Math.max(1, Number(model.baseHeight) || cssSize().height),
                fallbackImage: typeof model.fallbackImage === 'string' ? model.fallbackImage : '',
                sourcePdf: model.sourcePdf && typeof model.sourcePdf === 'object' && typeof model.sourcePdf.pdfId === 'string'
                    ? { pdfId: model.sourcePdf.pdfId, pageIndex: Math.max(0, Number(model.sourcePdf.pageIndex) || 0) }
                    : null,
                perfectShapeEnabled: Boolean(model.perfectShapeEnabled),
                elements: Array.isArray(model.elements) ? model.elements.map((element) => {
                    if (element && element.type === 'text') {
                        return normalizeTextElement(element);
                    }
                    if (element && element.type === 'table') {
                        return normalizeTableElement(element);
                    }
                    if (element && element.type === 'smart-shape') {
                        return normalizeSmartShapeElement(element);
                    }
                    return element && typeof element === 'object' ? { ...element, id: element.id || createElementId() } : element;
                }).filter(Boolean) : []
            };
            ensureElementIds(normalized);
            return normalized;
        }

        function currentPageModel() {
            if (!pageModels.has(currentPage)) {
                const model = createPageModel();
                if (pages.has(currentPage)) {
                    model.fallbackImage = canvas.toDataURL('image/jpeg', 0.92);
                }
                pageModels.set(currentPage, model);
            }

            const model = pageModels.get(currentPage);
            ensureElementIds(model);
            return model;
        }

        function isPerfectShapeActiveForCurrentPage() {
            return Boolean(perfectShapeMode);
        }

        function syncAiButtonState() {
            if (!aiBtn) {
                return;
            }
            const anyAiSliderOn = Boolean(perfectShapeMode)
                || Boolean(chatToggle && chatToggle.checked);
            aiBtn.classList.toggle('is-active', anyAiSliderOn);
        }

        function syncPerfectShapeControls() {
            if (perfectShapeMenuBtn) {
                perfectShapeMenuBtn.classList.toggle('is-active', perfectShapeMode);
            }
            if (perfectShapeAlwaysToggle) {
                perfectShapeAlwaysToggle.checked = perfectShapeMode;
            }
            syncAiButtonState();
        }

        function setPerfectShapeForCurrentDocument(enabled) {
            perfectShapeMode = Boolean(enabled);
            setTool('pen');
            syncPerfectShapeControls();
            scheduleSessionSave();
        }

        function pageHasContent(pageNumber) {
            const model = pageModels.get(pageNumber);
            if (model && ((Array.isArray(model.elements) && model.elements.length > 0) || model.fallbackImage)) {
                return true;
            }

            return pages.has(pageNumber);
        }

        function serializePagesMap(map) {
            return [...map.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([page, value]) => ({ page, value }));
        }

        function serializePageImageSizes() {
            return [...pageImageSizes.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([page, size]) => ({ page, size }));
        }

        function sessionModelPayload(model, includeHeavyData) {
            if (includeHeavyData || !model || typeof model !== 'object') {
                return model;
            }

            const payload = { ...model };
            if (payload.fallbackImage) {
                delete payload.fallbackImage;
                payload.hasUnsavedFallbackImage = true;
            }
            return payload;
        }

        function serializePageModels(includeHeavyData = false) {
            return [...pageModels.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([page, model]) => ({ page, model: sessionModelPayload(model, includeHeavyData) }));
        }

        function serializeRedoStacks() {
            return [...redoStacks.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([page, stack]) => ({ page, stack }));
        }

        function saveSessionNow(options = {}) {
            if (sessionRestoreInProgress) {
                return;
            }

            window.clearTimeout(sessionSaveTimer);
            sessionSaveTimer = 0;
            const includePages = Boolean(options.includePages);
            try {
                localStorage.setItem(sessionStorageKey, JSON.stringify({
                    version: 1,
                    currentFilename,
                    currentDocumentId,
                    currentVersion,
                    currentPage,
                    perfectShapeMode,
                    aiCostTotalGbp,
                    aiCostLastGbp,
                    hasUnsavedChanges,
                    pages: includePages ? serializePagesMap(pages) : [],
                    lightweight: !includePages,
                    pageImageSizes: serializePageImageSizes(),
                    pageModels: serializePageModels(includePages),
                    redoStacks: serializeRedoStacks(),
                    dirtyPages: [...dirtyPages],
                    paper: currentPaperMetadata()
                }));
            } catch (error) {}
        }

        function scheduleSessionSave() {
            if (sessionRestoreInProgress) {
                return;
            }

            window.clearTimeout(sessionSaveTimer);
            sessionSaveTimer = window.setTimeout(() => saveSessionNow({ includePages: false }), 2000);
            scheduleServerAutosave();
        }

        function clearSavedSession() {
            window.clearTimeout(sessionSaveTimer);
            localStorage.removeItem(sessionStorageKey);
        }

        // --- Autosave migration (see AUDIT.md "Migrare autosave") ---
        // Background durability autosave to documents/{id}/autosave, layered on top
        // of saveDrawing() (which, per Stage 3, also uses the REST path by default
        // now — see saveDrawingRest()). Gated by window.CANVAS_AUTOSAVE_ENABLED
        // (default true; false is an instant rollback to the legacy /canvas/api
        // path). Only runs once a document has a known numeric id/version. The
        // crash-recovery localStorage saving above is untouched by any of this.
        let serverAutosaveTimer = 0;
        let serverAutosaveInFlight = false;
        // Set on a 409 version_conflict; deliberately never auto-resolved (would
        // risk silently overwriting either side) until the user reloads.
        let serverAutosaveBlocked = false;

        function generateRequestId() {
            // crypto.randomUUID() requires a secure context (https or localhost) -
            // plain-http local/dev hosts (e.g. this project's notelevel.test) don't
            // qualify, so fall back to a manual RFC4122-ish v4 generator. Only needs
            // to be unique, not cryptographically strong (it's an idempotency key).
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                try {
                    return window.crypto.randomUUID();
                } catch (error) {
                    // fall through
                }
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
                const random = (Math.random() * 16) | 0;
                const value = char === 'x' ? random : (random & 0x3) | 0x8;
                return value.toString(16);
            });
        }

        function mapGuideModeForRest(mode) {
            if (mode === 'ruled' || mode === 'dictation') {
                return 'lined';
            }
            if (mode === 'grid') {
                return 'grid';
            }
            return 'none';
        }

        function canAttemptServerAutosave() {
            return Boolean(window.CANVAS_AUTOSAVE_ENABLED)
                && !serverAutosaveBlocked
                && Number.isInteger(currentDocumentId)
                && Number.isInteger(currentVersion);
        }

        function scheduleServerAutosave() {
            if (sessionRestoreInProgress || !canAttemptServerAutosave()) {
                return;
            }
            window.clearTimeout(serverAutosaveTimer);
            // Deliberately longer than the 2s local session-save debounce above:
            // this is a network call whose only job is durability (crash recovery
            // is already covered by localStorage), not a fast local snapshot.
            serverAutosaveTimer = window.setTimeout(performServerAutosave, 8000);
        }

        function showAutosaveConflictNotice() {
            const status = document.getElementById('saveStatus');
            if (status) {
                status.textContent = 'This document changed elsewhere. Reload the page to see the latest version before continuing.';
            }
        }

        async function uploadDirtyPagesToServer(pageNumbers) {
            const payloadPages = pageNumbers
                .filter((page) => pages.has(page))
                .map((page) => ({ page, image: pages.get(page) }));
            if (payloadPages.length === 0) {
                return;
            }
            try {
                const response = await fetch(`/documents/${currentDocumentId}/pages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': __csrfToken },
                    body: JSON.stringify({ pages: payloadPages })
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok && data.ok) {
                    for (const page of pageNumbers) {
                        dirtyPages.delete(page);
                    }
                }
            } catch (error) {
                // Fail silently: pages stay marked dirty and are retried on the next tick.
            }
        }

        async function performServerAutosave() {
            if (serverAutosaveInFlight || !canAttemptServerAutosave()) {
                return;
            }
            serverAutosaveInFlight = true;
            const requestId = generateRequestId();
            const contentPayload = buildDocumentContentPayload();
            const paperMetadata = currentPaperMetadata();
            const pagesToUpload = [...dirtyPages];

            try {
                const response = await fetch(`/documents/${currentDocumentId}/autosave`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': __csrfToken },
                    body: JSON.stringify({
                        request_id: requestId,
                        version: currentVersion,
                        content: contentPayload,
                        page_count: contentPayload.pages.length,
                        guideMode: mapGuideModeForRest(paperMetadata.guideMode),
                        guidesVisible: paperMetadata.guidesVisible
                    })
                });
                const data = await response.json().catch(() => ({}));

                if (response.status === 409) {
                    serverAutosaveBlocked = true;
                    showAutosaveConflictNotice();
                    return;
                }
                if (!response.ok || !data.ok) {
                    return;
                }

                currentVersion = data.version;
                if (pagesToUpload.length > 0) {
                    await uploadDirtyPagesToServer(pagesToUpload);
                }
            } catch (error) {
                // Network failure: fail silently. Local session save (localStorage)
                // remains the safety net; the next edit reschedules another attempt.
            } finally {
                serverAutosaveInFlight = false;
            }
        }

        function startMainThreadLagMonitor() {
            if (!window.performance || typeof window.performance.now !== 'function') {
                return;
            }

            const interval = 500;
            mainThreadLagCheckAt = window.performance.now();
            window.setInterval(() => {
                const now = window.performance.now();
                const lag = now - mainThreadLagCheckAt - interval;
                if (lag > 700) {
                    window.fixblyLastMainThreadLag = {
                        delay: Math.round(lag),
                        at: Date.now()
                    };
                }
                mainThreadLagCheckAt = now;
            }, interval);
        }

        function restoreSessionData(data) {
            if (!data || typeof data !== 'object') {
                return false;
            }

            sessionRestoreInProgress = true;
            pages = new Map();
            for (const entry of Array.isArray(data.pages) ? data.pages : []) {
                const pageNumber = Number(entry.page);
                if (pageNumber >= 1 && typeof entry.value === 'string') {
                    pages.set(pageNumber, entry.value);
                }
            }

            pageModels = new Map();
            pageImageSizes = new Map();
            for (const entry of Array.isArray(data.pageImageSizes) ? data.pageImageSizes : []) {
                const pageNumber = Number(entry.page);
                const size = entry.size || {};
                const width = Number(size.width);
                const height = Number(size.height);
                if (pageNumber >= 1 && width > 0 && height > 0) {
                    pageImageSizes.set(pageNumber, { width, height });
                }
            }

            for (const entry of Array.isArray(data.pageModels) ? data.pageModels : []) {
                const pageNumber = Number(entry.page);
                const model = normalizePageModel(entry.model);
                if (pageNumber >= 1 && model) {
                    pageModels.set(pageNumber, model);
                }
            }

            redoStacks = new Map();
            forwardRedoStacks = new Map();
            for (const entry of Array.isArray(data.redoStacks) ? data.redoStacks : []) {
                const pageNumber = Number(entry.page);
                if (pageNumber >= 1 && Array.isArray(entry.stack)) {
                    redoStacks.set(pageNumber, entry.stack);
                }
            }

            dirtyPages = new Set((Array.isArray(data.dirtyPages) ? data.dirtyPages : []).map(Number).filter((page) => page >= 1));
            currentStroke = null;
            currentPage = Math.max(1, Number(data.currentPage) || 1);
            perfectShapeMode = Boolean(data.perfectShapeMode);
            aiCostTotalGbp = normalizeCost(data.aiCostTotalGbp);
            aiCostLastGbp = normalizeCost(data.aiCostLastGbp);
            hasUnsavedChanges = Boolean(data.hasUnsavedChanges);
            setCurrentFile(typeof data.currentFilename === 'string' ? data.currentFilename : '');
            currentDocumentId = Number.isInteger(data.currentDocumentId) ? data.currentDocumentId : null;
            currentVersion = Number.isInteger(data.currentVersion) ? data.currentVersion : null;
            updateAiCostBadge();
            applyPaperMetadata(data.paper || {});
            sessionRestoreInProgress = false;
            return true;
        }

        async function restoreSavedSession() {
            const raw = localStorage.getItem(sessionStorageKey);
            if (!raw) {
                return false;
            }

            try {
                const data = JSON.parse(raw);
                if (!restoreSessionData(data)) {
                    return false;
                }
                await showPage(currentPage);
                saveSessionNow({ includePages: true });
                return true;
            } catch (error) {
                clearSavedSession();
                return false;
            }
        }

        function canvasHasContent() {
            const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            for (let i = 0; i < sample.length; i += 4) {
                if (
                    Math.abs(sample[i] - canvasBackgroundRgb.r) > 10 ||
                    Math.abs(sample[i + 1] - canvasBackgroundRgb.g) > 10 ||
                    Math.abs(sample[i + 2] - canvasBackgroundRgb.b) > 10
                ) {
                    return true;
                }
            }
            return false;
        }

        function rememberCurrentPage() {
            if (pageModels.has(currentPage)) {
                const model = pageModels.get(currentPage);
                if (!pageHasContent(currentPage)) {
                    pages.delete(currentPage);
                    pageModels.delete(currentPage);
                    dirtyPages.delete(currentPage);
                    renderTextLayer();
                    return;
                }

                drawTextElementsToCanvas(model);
                pages.set(currentPage, canvas.toDataURL('image/jpeg', 0.92));
                dirtyPages.delete(currentPage);
                renderCurrentPage().catch((error) => console.error(error));
                return;
            }

            if (pages.has(currentPage) && !dirtyPages.has(currentPage)) {
                return;
            }

            if (canvasHasContent()) {
                const size = cssSize();
                pages.set(currentPage, canvas.toDataURL('image/jpeg', 0.92));
                pageImageSizes.set(currentPage, { width: size.width, height: size.height });
                dirtyPages.delete(currentPage);
                return;
            }
            pages.delete(currentPage);
            pageImageSizes.delete(currentPage);
            dirtyPages.delete(currentPage);
        }

        function fitRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
            const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
            const width = sourceWidth * scale;
            const height = sourceHeight * scale;

            return {
                x: (targetWidth - width) / 2,
                y: (targetHeight - height) / 2,
                width,
                height,
                scale
            };
        }

        function pageDisplayRect(model) {
            const size = cssSize();
            return fitRect(model.baseWidth, model.baseHeight, size.width, size.height);
        }

        function currentPageBoundaryRect() {
            const size = cssSize();
            if (pageModels.has(currentPage)) {
                return pageDisplayRect(pageModels.get(currentPage));
            }

            const imageSize = pageImageSizes.get(currentPage);
            if (imageSize) {
                return fitRect(imageSize.width, imageSize.height, size.width, size.height);
            }

            return { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
        }

        function drawRoundedRect(context, x, y, width, height, radius) {
            const normalizedRadius = Math.min(radius, width / 2, height / 2);
            context.beginPath();
            context.moveTo(x + normalizedRadius, y);
            context.lineTo(x + width - normalizedRadius, y);
            context.quadraticCurveTo(x + width, y, x + width, y + normalizedRadius);
            context.lineTo(x + width, y + height - normalizedRadius);
            context.quadraticCurveTo(x + width, y + height, x + width - normalizedRadius, y + height);
            context.lineTo(x + normalizedRadius, y + height);
            context.quadraticCurveTo(x, y + height, x, y + height - normalizedRadius);
            context.lineTo(x, y + normalizedRadius);
            context.quadraticCurveTo(x, y, x + normalizedRadius, y);
        }

        function drawPageBoundary() {
            const size = cssSize();
            const rect = currentPageBoundaryRect();
            const hasVisibleMargin = Math.abs(rect.x) > 1 || Math.abs(rect.y) > 1 || Math.abs(size.width - rect.width) > 2 || Math.abs(size.height - rect.height) > 2;
            if (!hasVisibleMargin) {
                return;
            }

            guideCtx.save();
            guideCtx.strokeStyle = 'rgba(15, 118, 110, 0.22)';
            guideCtx.lineWidth = 1;
            guideCtx.setLineDash([5, 6]);
            drawRoundedRect(guideCtx, rect.x + 0.5, rect.y + 0.5, Math.max(1, rect.width - 1), Math.max(1, rect.height - 1), 12);
            guideCtx.stroke();
            guideCtx.restore();
        }

        function pagePointFromEvent(event) {
            const model = currentPageModel();
            const rect = pageDisplayRect(model);
            const canvasPoint = pointFromEvent(event);
            return {
                x: Math.max(0, Math.min(model.baseWidth, (canvasPoint.x - rect.x) / rect.scale)),
                y: Math.max(0, Math.min(model.baseHeight, (canvasPoint.y - rect.y) / rect.scale))
            };
        }

        function displayPointFromPage(point, model) {
            const rect = pageDisplayRect(model);
            return {
                x: rect.x + point.x * rect.scale,
                y: rect.y + point.y * rect.scale
            };
        }

        function drawPageSegment(from, to, options, model) {
            const start = displayPointFromPage(from, model);
            const end = displayPointFromPage(to, model);
            const pressure = Number(to.pressure) || 1;
            const tip = normalizeTip(options.tip);
            const hardness = normalizePercent(options.hardness, 100);
            const isEraser = options.tool === 'eraser';
            const opacity = tip === 'highlighter' && !isEraser
                ? Math.min(0.42, Math.max(0.12, normalizePercent(options.opacity, 100) / 100))
                : Math.max(5, normalizePercent(options.opacity, 100)) / 100;
            const size = cssSize();
            const strokeColor = isEraser ? canvasBackgroundFill(ctx, size.width, size.height) : (options.color || colorInput.value);
            const tipScale = strokeTipScale(tip);
            const lineWidth = (Number(options.size) || currentToolSize()) * pressure * tipScale * pageDisplayRect(model).scale;

            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (tip === 'square' || tip === 'highlighter') {
                ctx.lineCap = 'butt';
                ctx.lineJoin = 'miter';
            }
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            if (!isEraser && (tip === 'soft' || tip === 'brush' || hardness < 100)) {
                const softness = tip === 'brush'
                    ? Math.max(0.35, (120 - hardness) / 120)
                    : (tip === 'soft' ? Math.max(0.25, (100 - hardness) / 100) : (100 - hardness) / 100);
                ctx.shadowColor = strokeColor;
                ctx.shadowBlur = lineWidth * softness * 0.65;
            }
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.restore();
        }

        function renderStroke(element, model) {
            if (!Array.isArray(element.points) || element.points.length < 2) {
                return;
            }

            for (let i = 1; i < element.points.length; i += 1) {
                drawPageSegment(element.points[i - 1], element.points[i], element, model);
            }
        }

        function distanceBetweenPoints(a, b) {
            return Math.hypot((Number(b.x) || 0) - (Number(a.x) || 0), (Number(b.y) || 0) - (Number(a.y) || 0));
        }

        function angleBetweenPoints(a, b) {
            return Math.atan2((Number(b.y) || 0) - (Number(a.y) || 0), (Number(b.x) || 0) - (Number(a.x) || 0));
        }

        function calculateStrokeBounds(points) {
            if (!Array.isArray(points) || points.length === 0) {
                return null;
            }

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (const point of points) {
                minX = Math.min(minX, Number(point.x) || 0);
                minY = Math.min(minY, Number(point.y) || 0);
                maxX = Math.max(maxX, Number(point.x) || 0);
                maxY = Math.max(maxY, Number(point.y) || 0);
            }
            return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
        }

        function pointLineDistance(point, start, end) {
            const length = distanceBetweenPoints(start, end);
            if (length <= 0) {
                return distanceBetweenPoints(point, start);
            }

            return Math.abs(
                ((end.y - start.y) * point.x)
                - ((end.x - start.x) * point.y)
                + (end.x * start.y)
                - (end.y * start.x)
            ) / length;
        }

        function simplifyPoints(points, tolerance) {
            if (!Array.isArray(points) || points.length <= 2) {
                return Array.isArray(points) ? points.slice() : [];
            }

            let maxDistance = 0;
            let index = 0;
            const start = points[0];
            const end = points[points.length - 1];
            for (let i = 1; i < points.length - 1; i += 1) {
                const distance = pointLineDistance(points[i], start, end);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    index = i;
                }
            }

            if (maxDistance > tolerance) {
                const left = simplifyPoints(points.slice(0, index + 1), tolerance);
                const right = simplifyPoints(points.slice(index), tolerance);
                return left.slice(0, -1).concat(right);
            }

            return [start, end];
        }

        function isStrokeClosed(points, bounds) {
            if (!Array.isArray(points) || points.length < 3 || !bounds) {
                return false;
            }

            const closeDistance = distanceBetweenPoints(points[0], points[points.length - 1]);
            const diagonal = Math.hypot(bounds.width, bounds.height);
            return closeDistance <= Math.max(10, diagonal * SMART_SHAPE_RULES.closeDistanceRatio);
        }

        // Shared interval math for real (non-overlay) erasing of smart-shape outlines.
        // All remaining/erased geometry for a shape is expressed as {start,end} ranges within
        // a shape-local parametric space (radians for ellipse arcs, 0..1 fraction for everything
        // else), never in screen/page pixels, so resize/rotate never needs to touch these ranges.

        function clampIntervalToRange(interval, totalRange) {
            const start = Math.max(0, Math.min(totalRange, Number(interval && interval.start) || 0));
            const end = Math.max(0, Math.min(totalRange, Number(interval && interval.end) || 0));
            return { start: Math.min(start, end), end: Math.max(start, end) };
        }

        function splitWrappingInterval(start, end, totalRange) {
            if (totalRange <= 0) {
                return [];
            }
            const s = ((start % totalRange) + totalRange) % totalRange;
            const e = ((end % totalRange) + totalRange) % totalRange;
            if (s < e) {
                return [{ start: s, end: e }];
            }
            if (s > e) {
                return [{ start: s, end: totalRange }, { start: 0, end: e }];
            }
            return [{ start: 0, end: totalRange }];
        }

        function mergeIntervals(intervals) {
            const sorted = intervals
                .filter((interval) => interval.end - interval.start > 1e-6)
                .slice()
                .sort((a, b) => a.start - b.start);
            const merged = [];
            for (const interval of sorted) {
                const last = merged[merged.length - 1];
                if (last && interval.start <= last.end + 1e-6) {
                    last.end = Math.max(last.end, interval.end);
                } else {
                    merged.push({ start: interval.start, end: interval.end });
                }
            }
            return merged;
        }

        function subtractIntervalFromList(remaining, erased) {
            const result = [];
            for (const interval of remaining) {
                if (erased.end <= interval.start || erased.start >= interval.end) {
                    result.push(interval);
                    continue;
                }
                if (erased.start > interval.start) {
                    result.push({ start: interval.start, end: Math.min(erased.start, interval.end) });
                }
                if (erased.end < interval.end) {
                    result.push({ start: Math.max(erased.end, interval.start), end: interval.end });
                }
            }
            return result.filter((interval) => interval.end - interval.start > 1e-6);
        }

        // Subtracts every erasedIntervals range from remainingIntervals within [0,totalRange],
        // coalescing adjacent/overlapping remaining ranges and handling wraparound. Idempotent:
        // re-subtracting an already-erased range is a no-op. Returns the new remaining ranges
        // plus a 0-100 coveragePercent summary for the `integrity` field.
        function mergeAndSubtractIntervals(remainingIntervals, erasedIntervals, totalRange) {
            let remaining = mergeIntervals(
                (Array.isArray(remainingIntervals) ? remainingIntervals : [])
                    .map((interval) => clampIntervalToRange(interval, totalRange))
            );
            const erasedList = (Array.isArray(erasedIntervals) ? erasedIntervals : [])
                .flatMap((interval) => splitWrappingInterval(
                    Number(interval && interval.start) || 0,
                    Number(interval && interval.end) || 0,
                    totalRange
                ));
            for (const erased of erasedList) {
                remaining = subtractIntervalFromList(remaining, erased);
            }
            remaining = mergeIntervals(remaining);
            const remainingLength = remaining.reduce((sum, interval) => sum + (interval.end - interval.start), 0);
            const coveragePercent = totalRange > 0 ? Math.max(0, Math.min(100, (remainingLength / totalRange) * 100)) : 0;
            return { intervals: remaining, coveragePercent };
        }

        function normalizeSegmentList(raw, totalRange, fallback) {
            if (!Array.isArray(raw) || raw.length === 0) {
                return fallback;
            }
            const cleaned = raw
                .map((interval) => ({
                    start: Number(interval && interval.start),
                    end: Number(interval && interval.end)
                }))
                .filter((interval) => Number.isFinite(interval.start) && Number.isFinite(interval.end) && interval.end > interval.start)
                .map((interval) => clampIntervalToRange(interval, totalRange));
            const merged = mergeIntervals(cleaned);
            return merged.length > 0 ? merged : fallback;
        }

        function normalizeIntegrity(raw, shapeType) {
            const source = raw && typeof raw === 'object' ? raw : {};
            const coveragePercent = Number(source.coveragePercent);
            return {
                altered: Boolean(source.altered),
                coveragePercent: Number.isFinite(coveragePercent) ? Math.max(0, Math.min(100, coveragePercent)) : 100,
                originalShapeType: typeof source.originalShapeType === 'string' && source.originalShapeType
                    ? source.originalShapeType
                    : shapeType
            };
        }

        function normalizeStrokeForShapeDetection(stroke) {
            if (!stroke || stroke.type !== 'stroke' || stroke.tool === 'eraser' || !Array.isArray(stroke.points)) {
                return null;
            }

            if (stroke.points.length < 3) {
                return null;
            }

            const points = [];
            for (const point of stroke.points) {
                const normalizedPoint = {
                    x: Number(point.x) || 0,
                    y: Number(point.y) || 0,
                    pressure: Number(point.pressure) || 1
                };
                const previous = points[points.length - 1];
                if (!previous || distanceBetweenPoints(previous, normalizedPoint) > 0.75) {
                    points.push(normalizedPoint);
                }
            }

            if (points.length < 3) {
                return null;
            }

            const bounds = calculateStrokeBounds(points);
            let length = 0;
            for (let i = 1; i < points.length; i += 1) {
                length += distanceBetweenPoints(points[i - 1], points[i]);
            }

            if (length < SMART_SHAPE_RULES.minStrokeLength) {
                return null;
            }

            const simplified = simplifyPoints(points, SMART_SHAPE_RULES.simplifyTolerance);
            const start = points[0];
            const end = points[points.length - 1];
            return {
                points,
                simplified,
                bounds,
                width: bounds.width,
                height: bounds.height,
                length,
                start,
                end,
                closed: isStrokeClosed(points, bounds)
            };
        }

        function angleDifference(a, b) {
            let diff = Math.abs(a - b) % (Math.PI * 2);
            if (diff > Math.PI) {
                diff = Math.PI * 2 - diff;
            }
            return diff;
        }

        function pointSegmentDistance(point, start, end) {
            const dx = (Number(end.x) || 0) - (Number(start.x) || 0);
            const dy = (Number(end.y) || 0) - (Number(start.y) || 0);
            const lengthSquared = dx * dx + dy * dy;
            if (lengthSquared <= 0) {
                return distanceBetweenPoints(point, start);
            }

            const t = Math.max(0, Math.min(1, (((Number(point.x) || 0) - (Number(start.x) || 0)) * dx + ((Number(point.y) || 0) - (Number(start.y) || 0)) * dy) / lengthSquared));
            return distanceBetweenPoints(point, {
                x: (Number(start.x) || 0) + dx * t,
                y: (Number(start.y) || 0) + dy * t
            });
        }

        function polygonArea(points) {
            if (!Array.isArray(points) || points.length < 3) {
                return 0;
            }

            let area = 0;
            for (let i = 0; i < points.length; i += 1) {
                const next = points[(i + 1) % points.length];
                area += ((Number(points[i].x) || 0) * (Number(next.y) || 0)) - ((Number(next.x) || 0) * (Number(points[i].y) || 0));
            }
            return Math.abs(area) / 2;
        }

        function removeClosingDuplicate(points, threshold) {
            const source = Array.isArray(points) ? points.slice() : [];
            if (source.length > 2 && distanceBetweenPoints(source[0], source[source.length - 1]) <= threshold) {
                source.pop();
            }
            return source;
        }

        function segmentDeviationStats(points, start, end) {
            let total = 0;
            let max = 0;
            for (const point of points) {
                const deviation = pointSegmentDistance(point, start, end);
                total += deviation;
                max = Math.max(max, deviation);
            }
            return {
                average: points.length ? total / points.length : 0,
                max
            };
        }

        function polygonFitStats(points, vertices) {
            if (!Array.isArray(points) || !Array.isArray(vertices) || vertices.length < 3) {
                return { average: Infinity, max: Infinity };
            }

            let total = 0;
            let max = 0;
            for (const point of points) {
                let best = Infinity;
                for (let i = 0; i < vertices.length; i += 1) {
                    best = Math.min(best, pointSegmentDistance(point, vertices[i], vertices[(i + 1) % vertices.length]));
                }
                total += best;
                max = Math.max(max, best);
            }
            return {
                average: total / points.length,
                max
            };
        }

        function sideLengths(vertices) {
            if (!Array.isArray(vertices) || vertices.length < 2) {
                return [];
            }

            return vertices.map((point, index) => distanceBetweenPoints(point, vertices[(index + 1) % vertices.length]));
        }

        function analyzeStrokeGeometry(normalized) {
            const diagonal = Math.max(1, Math.hypot(normalized.width, normalized.height));
            const closeThreshold = Math.max(10, diagonal * SMART_SHAPE_RULES.closeDistanceRatio);
            const vertices = removeClosingDuplicate(normalized.simplified, closeThreshold);
            const closedVertices = normalized.closed ? vertices : normalized.simplified.slice();
            const vertexIndices = closedVertices.map((vertex) => {
                const directIndex = normalized.points.indexOf(vertex);
                if (directIndex >= 0) {
                    return directIndex;
                }

                let nearestIndex = 0;
                let nearestDistance = Infinity;
                for (let i = 0; i < normalized.points.length; i += 1) {
                    const pointDistance = distanceBetweenPoints(vertex, normalized.points[i]);
                    if (pointDistance < nearestDistance) {
                        nearestDistance = pointDistance;
                        nearestIndex = i;
                    }
                }
                return nearestIndex;
            });
            const cornerCandidates = [];

            if (normalized.closed && closedVertices.length >= 3) {
                for (let i = 0; i < closedVertices.length; i += 1) {
                    const previous = closedVertices[(i - 1 + closedVertices.length) % closedVertices.length];
                    const current = closedVertices[i];
                    const next = closedVertices[(i + 1) % closedVertices.length];
                    const turn = angleDifference(angleBetweenPoints(current, previous), angleBetweenPoints(current, next));
                    const deflection = Math.PI - turn;
                    if (deflection > 0.72 && deflection < 2.75) {
                        const before = distanceBetweenPoints(previous, current);
                        const after = distanceBetweenPoints(current, next);
                        const lengthScore = Math.min(1, Math.min(before, after) / Math.max(1, diagonal * 0.14));
                        cornerCandidates.push({
                            index: i,
                            point: current,
                            turn: deflection,
                            strength: Math.min(1, (deflection / 1.45) * 0.75 + lengthScore * 0.25)
                        });
                    }
                }
            }

            const straightEdges = [];
            const cornerIndexSet = new Set(cornerCandidates.map((corner) => corner.index));
            if (normalized.closed && closedVertices.length >= 3) {
                for (let i = 0; i < closedVertices.length; i += 1) {
                    const start = closedVertices[i];
                    const end = closedVertices[(i + 1) % closedVertices.length];
                    const startIndex = vertexIndices[i];
                    const endIndex = vertexIndices[(i + 1) % closedVertices.length];
                    const length = distanceBetweenPoints(start, end);
                    if (length >= diagonal * 0.12 && (cornerIndexSet.has(i) || cornerIndexSet.has((i + 1) % closedVertices.length))) {
                        const segmentPoints = startIndex <= endIndex
                            ? normalized.points.slice(startIndex, endIndex + 1)
                            : normalized.points.slice(startIndex).concat(normalized.points.slice(0, endIndex + 1));
                        const deviation = segmentDeviationStats(segmentPoints, start, end);
                        if (deviation.average <= Math.max(2, length * 0.075) && deviation.max <= Math.max(4, length * 0.18)) {
                            straightEdges.push({ start, end, length, angle: angleBetweenPoints(start, end), deviation });
                        }
                    }
                }
            }

            const totalStraightLength = straightEdges.reduce((sum, edge) => sum + edge.length, 0);
            return {
                diagonal,
                closeDistance: distanceBetweenPoints(normalized.start, normalized.end),
                closeThreshold,
                vertices: closedVertices,
                cornerCandidates,
                straightEdges,
                strongStraightEdgeCount: straightEdges.filter((edge) => edge.length >= diagonal * 0.16).length,
                straightEdgeRatio: totalStraightLength / Math.max(1, normalized.length),
                boundsRatio: Math.min(normalized.width, normalized.height) / Math.max(normalized.width, normalized.height),
                areaRatio: polygonArea(closedVertices) / Math.max(1, normalized.width * normalized.height)
            };
        }

        function selectPolygonCorners(geometry, count) {
            if (!geometry || geometry.cornerCandidates.length < count) {
                return null;
            }

            const selected = geometry.cornerCandidates
                .slice()
                .sort((a, b) => b.strength - a.strength)
                .slice(0, count)
                .sort((a, b) => a.index - b.index)
                .map((corner) => ({ x: corner.point.x, y: corner.point.y }));
            const lengths = sideLengths(selected);
            const minSide = Math.min(...lengths);
            if (!Number.isFinite(minSide) || minSide < geometry.diagonal * 0.12 || polygonArea(selected) < geometry.diagonal * geometry.diagonal * 0.025) {
                return null;
            }

            return selected;
        }

        function canonicalTrianglePoints(bounds) {
            const source = bounds || {};
            const x = Number(source.x) || 0;
            const y = Number(source.y) || 0;
            const width = Math.max(1, Number(source.width) || 1);
            const height = Math.max(1, Number(source.height) || 1);
            return [
                { x: x + width / 2, y },
                { x, y: y + height },
                { x: x + width, y: y + height }
            ];
        }

        function canonicalRhombusPoints(bounds) {
            const source = bounds || {};
            const x = Number(source.x) || 0;
            const y = Number(source.y) || 0;
            const width = Math.max(1, Number(source.width) || 1);
            const height = Math.max(1, Number(source.height) || 1);
            const cx = x + width / 2;
            const cy = y + height / 2;
            return [
                { x: cx, y },
                { x: x + width, y: cy },
                { x: cx, y: y + height },
                { x, y: cy }
            ];
        }

        function detectLineShape(normalized, geometry) {
            const distance = distanceBetweenPoints(normalized.start, normalized.end);
            if (distance < SMART_SHAPE_RULES.minStrokeLength || normalized.closed) {
                return null;
            }

            const maxAllowed = Math.max(2, distance * SMART_SHAPE_RULES.lineMaxDeviationRatio);
            const deviation = segmentDeviationStats(normalized.points, normalized.start, normalized.end);
            const maxDeviation = deviation.max;
            const averageDeviation = deviation.average;
            if (maxDeviation > maxAllowed * 1.8 || averageDeviation > maxAllowed * 0.75) {
                return null;
            }

            const confidence = Math.max(0, Math.min(0.98, 0.98 - (averageDeviation / maxAllowed) * 0.12 - (maxDeviation / (maxAllowed * 1.8)) * 0.1));
            return {
                type: 'line',
                confidence,
                data: {
                    from: { x: normalized.start.x, y: normalized.start.y },
                    to: { x: normalized.end.x, y: normalized.end.y },
                    bounds: calculateStrokeBounds([normalized.start, normalized.end])
                }
            };
        }

        function rectangleCornerCount(points) {
            const source = points.slice();
            if (source.length > 2 && distanceBetweenPoints(source[0], source[source.length - 1]) <= SMART_SHAPE_RULES.simplifyTolerance * 2) {
                source.pop();
            }
            if (source.length < 4) {
                return 0;
            }

            let corners = 0;
            for (let i = 0; i < source.length; i += 1) {
                const previous = source[(i - 1 + source.length) % source.length];
                const current = source[i];
                const next = source[(i + 1) % source.length];
                const turn = angleDifference(angleBetweenPoints(current, previous), angleBetweenPoints(current, next));
                if (turn > 0.55 && turn < 2.65) {
                    corners += 1;
                }
            }
            return corners;
        }

        function detectRectangleShape(normalized, geometry) {
            const bounds = normalized.bounds;
            if (!normalized.closed || bounds.width < 14 || bounds.height < 14) {
                return null;
            }

            const corners = geometry ? geometry.cornerCandidates.length : rectangleCornerCount(normalized.simplified);
            if ((corners < 4 || corners > 7) && (!geometry || geometry.strongStraightEdgeCount < 3)) {
                return null;
            }

            let edgeDistanceTotal = 0;
            let edgeDistanceMax = 0;
            for (const point of normalized.points) {
                const left = Math.abs(point.x - bounds.x) / bounds.width;
                const right = Math.abs(point.x - (bounds.x + bounds.width)) / bounds.width;
                const top = Math.abs(point.y - bounds.y) / bounds.height;
                const bottom = Math.abs(point.y - (bounds.y + bounds.height)) / bounds.height;
                const edgeDistance = Math.min(left, right, top, bottom);
                edgeDistanceTotal += edgeDistance;
                edgeDistanceMax = Math.max(edgeDistanceMax, edgeDistance);
            }

            const averageEdgeDistance = edgeDistanceTotal / normalized.points.length;
            if (averageEdgeDistance > 0.16 || edgeDistanceMax > 0.38) {
                return null;
            }

            const straightBonus = geometry && geometry.strongStraightEdgeCount >= 4 ? 0.02 : 0;
            const confidence = Math.max(0, Math.min(0.95, 0.94 + straightBonus - averageEdgeDistance * 0.75 - Math.max(0, corners - 4) * 0.015));
            return {
                type: 'rectangle',
                confidence,
                data: {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height,
                    radius: 8
                }
            };
        }

        function detectTriangleShape(normalized, geometry) {
            if (!normalized.closed || !geometry || normalized.width < 14 || normalized.height < 14) {
                return null;
            }

            const vertices = selectPolygonCorners(geometry, 3);
            if (!vertices || geometry.strongStraightEdgeCount < 3) {
                return null;
            }

            const stats = polygonFitStats(normalized.points, vertices);
            const averageRatio = stats.average / geometry.diagonal;
            const maxRatio = stats.max / geometry.diagonal;
            if (averageRatio > 0.085 || maxRatio > 0.26) {
                return null;
            }

            const confidence = Math.max(0, Math.min(0.95, 0.94 - averageRatio * 1.8 - maxRatio * 0.22 + Math.min(0.03, geometry.areaRatio * 0.04)));
            const bounds = calculateStrokeBounds(vertices);
            return {
                type: 'triangle',
                confidence,
                data: {
                    points: canonicalTrianglePoints(bounds),
                    bounds
                }
            };
        }

        function detectRhombusShape(normalized, geometry) {
            if (!normalized.closed || !geometry || normalized.width < 14 || normalized.height < 14) {
                return null;
            }

            const vertices = selectPolygonCorners(geometry, 4);
            if (!vertices || geometry.strongStraightEdgeCount < 4) {
                return null;
            }

            const lengths = sideLengths(vertices);
            const minLength = Math.min(...lengths);
            const maxLength = Math.max(...lengths);
            if (!Number.isFinite(minLength) || minLength / Math.max(1, maxLength) < 0.62) {
                return null;
            }

            const angles = vertices.map((point, index) => angleBetweenPoints(point, vertices[(index + 1) % vertices.length]));
            const oppositeParallelA = Math.min(angleDifference(angles[0], angles[2]), Math.abs(Math.PI - angleDifference(angles[0], angles[2])));
            const oppositeParallelB = Math.min(angleDifference(angles[1], angles[3]), Math.abs(Math.PI - angleDifference(angles[1], angles[3])));
            if (oppositeParallelA > 0.38 || oppositeParallelB > 0.38) {
                return null;
            }

            const stats = polygonFitStats(normalized.points, vertices);
            const averageRatio = stats.average / geometry.diagonal;
            const maxRatio = stats.max / geometry.diagonal;
            if (averageRatio > 0.075 || maxRatio > 0.24) {
                return null;
            }

            const confidence = Math.max(0, Math.min(0.95, 0.93 - averageRatio * 1.6 - maxRatio * 0.2 + (minLength / Math.max(1, maxLength)) * 0.03));
            const bounds = calculateStrokeBounds(vertices);
            return {
                type: 'rhombus',
                confidence,
                data: {
                    points: canonicalRhombusPoints(bounds),
                    bounds
                }
            };
        }

        function detectCircleShape(normalized, geometry) {
            const bounds = normalized.bounds;
            if (!normalized.closed || bounds.width < 14 || bounds.height < 14) {
                return null;
            }

            const corners = geometry ? geometry.cornerCandidates.length : rectangleCornerCount(normalized.simplified);
            if ((geometry && geometry.strongStraightEdgeCount >= 3) || (!geometry && corners >= 4 && normalized.simplified.length <= 8)) {
                return null;
            }

            const cx = bounds.x + bounds.width / 2;
            const cy = bounds.y + bounds.height / 2;
            const rx = bounds.width / 2;
            const ry = bounds.height / 2;
            let totalError = 0;
            let maxError = 0;
            const quadrants = [0, 0, 0, 0];
            for (const point of normalized.points) {
                const normalizedRadius = Math.hypot((point.x - cx) / rx, (point.y - cy) / ry);
                const error = Math.abs(normalizedRadius - 1);
                totalError += error;
                maxError = Math.max(maxError, error);
                const quadrant = (point.x >= cx ? 1 : 0) + (point.y >= cy ? 2 : 0);
                quadrants[quadrant] += 1;
            }

            const averageError = totalError / normalized.points.length;
            const minQuadrantPoints = Math.min(...quadrants);
            if (averageError > 0.22 || maxError > 0.58 || minQuadrantPoints < normalized.points.length * 0.08) {
                return null;
            }

            const ratio = Math.min(bounds.width, bounds.height) / Math.max(bounds.width, bounds.height);
            const type = ratio >= 0.82 ? 'circle' : 'ellipse';
            const straightPenalty = geometry ? Math.min(0.18, geometry.straightEdgeRatio * 0.12) : 0;
            const confidence = Math.max(0, Math.min(0.94, 0.94 - averageError * 0.35 - (1 - ratio) * 0.04 - straightPenalty));
            return {
                type,
                confidence,
                data: {
                    cx,
                    cy,
                    rx,
                    ry,
                    bounds: { ...bounds }
                }
            };
        }

        function detectArrowShape(normalized, geometry) {
            if (normalized.closed || normalized.points.length < SMART_SHAPE_RULES.minStrokePoints + 2) {
                return null;
            }

            let tipIndex = 0;
            let shaftLength = 0;
            for (let i = 1; i < normalized.points.length; i += 1) {
                const distance = distanceBetweenPoints(normalized.start, normalized.points[i]);
                if (distance > shaftLength) {
                    shaftLength = distance;
                    tipIndex = i;
                }
            }

            if (shaftLength < SMART_SHAPE_RULES.minStrokeLength * 1.6 || tipIndex < 2) {
                return null;
            }

            const from = normalized.start;
            const to = normalized.points[tipIndex];
            const shaftDeviation = segmentDeviationStats(normalized.points.slice(0, tipIndex + 1), from, to);
            if (shaftDeviation.average > Math.max(3, shaftLength * 0.08) || shaftDeviation.max > Math.max(6, shaftLength * 0.18)) {
                return null;
            }

            const reverseShaftAngle = angleBetweenPoints(to, from);
            const candidates = [];
            for (let i = tipIndex + 1; i < normalized.points.length; i += 1) {
                const point = normalized.points[i];
                const distance = distanceBetweenPoints(to, point);
                if (distance < shaftLength * 0.08 || distance > shaftLength * 0.55) {
                    continue;
                }
                const wingAngle = angleBetweenPoints(to, point);
                const spread = angleDifference(reverseShaftAngle, wingAngle);
                if (spread < 0.25 || spread > 1.45) {
                    continue;
                }
                const cross = ((from.x - to.x) * (point.y - to.y)) - ((from.y - to.y) * (point.x - to.x));
                if (Math.abs(cross) < shaftLength * distance * 0.02) {
                    continue;
                }
                const convergence = Math.max(0, 1 - (distanceBetweenPoints(point, to) / Math.max(1, shaftLength * 0.55)));
                candidates.push({ point, cross, spread, distance, convergence });
            }

            const leftCandidates = candidates.filter((item) => item.cross < 0);
            const rightCandidates = candidates.filter((item) => item.cross > 0);
            const bestWing = (items) => items
                .slice()
                .sort((a, b) => (b.distance * 0.7 + b.convergence * shaftLength * 0.3) - (a.distance * 0.7 + a.convergence * shaftLength * 0.3))[0];
            const leftWing = bestWing(leftCandidates);
            const rightWing = bestWing(rightCandidates);
            if (!leftWing || !rightWing || leftCandidates.length + rightCandidates.length < 3) {
                return null;
            }

            const leftLength = distanceBetweenPoints(to, leftWing.point);
            const rightLength = distanceBetweenPoints(to, rightWing.point);
            if (Math.min(leftLength, rightLength) / Math.max(leftLength, rightLength) < 0.28) {
                return null;
            }

            const headPoints = [leftWing.point, rightWing.point].concat(candidates.map((item) => item.point));
            const bounds = calculateStrokeBounds([from, to].concat(headPoints));
            const extraHeadBonus = Math.min(0.04, Math.max(0, candidates.length - 2) * 0.008);
            const confidence = Math.max(0, Math.min(0.95, 0.9 - (shaftDeviation.average / Math.max(1, shaftLength)) * 0.22 + Math.min(0.04, Math.min(leftLength, rightLength) / Math.max(1, shaftLength) * 0.12) + extraHeadBonus));
            return {
                type: 'arrow',
                confidence,
                data: {
                    from: { x: from.x, y: from.y },
                    to: { x: to.x, y: to.y },
                    arrowHead: {
                        position: 'end',
                        size: Math.max(10, Math.min(32, (leftLength + rightLength) / 2)),
                        angle: Math.max(18, Math.min(55, ((leftWing.spread + rightWing.spread) / 2) * 180 / Math.PI))
                    },
                    bounds
                }
            };
        }

        const smartShapeDetectors = [
            detectArrowShape,
            detectLineShape,
            detectRectangleShape,
            detectRhombusShape,
            detectTriangleShape,
            detectCircleShape
        ];

        function detectSmartShape(stroke) {
            const normalized = normalizeStrokeForShapeDetection(stroke);
            if (!normalized || normalized.points.length < SMART_SHAPE_RULES.minStrokePoints) {
                return null;
            }

            const geometry = analyzeStrokeGeometry(normalized);
            const candidates = smartShapeDetectors
                .map((detector) => detector(normalized, geometry))
                .filter(Boolean);

            if (candidates.length === 0) {
                return null;
            }

            candidates.sort((a, b) => b.confidence - a.confidence);
            return candidates[0];
        }

        function averageStrokePressure(stroke) {
            if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
                return 1;
            }

            let total = 0;
            let count = 0;
            for (const point of stroke.points) {
                const pressure = Number(point.pressure);
                if (Number.isFinite(pressure) && pressure > 0) {
                    total += pressure;
                    count += 1;
                }
            }

            return count > 0 ? Math.max(0.35, Math.min(1.65, total / count)) : 1;
        }

        function effectiveStrokeSize(stroke) {
            const size = normalizeSize(stroke && stroke.size, defaultToolSettings.pen.size, 36);
            return Math.max(1, size * averageStrokePressure(stroke) * strokeTipScale(stroke && stroke.tip));
        }

        function smartShapeStyleFromStroke(stroke) {
            return {
                color: normalizeColor(stroke.color || colorInput.value, defaultInkColor),
                size: normalizeSize(stroke.size, defaultToolSettings.pen.size, 36),
                effectiveSize: effectiveStrokeSize(stroke),
                opacity: Math.max(5, normalizePercent(stroke.opacity, 100)),
                hardness: normalizePercent(stroke.hardness, defaultToolSettings.pen.hardness),
                tip: normalizeTip(stroke.tip)
            };
        }

        function createSmartObjectFromDetection(detection, stroke) {
            if (!detection || !stroke) {
                return null;
            }

            const base = {
                id: createElementId(),
                type: 'smart-shape',
                shapeType: detection.type,
                rotation: 0,
                style: smartShapeStyleFromStroke(stroke),
                integrity: { altered: false, coveragePercent: 100, originalShapeType: detection.type },
                createdFrom: {
                    source: 'stroke',
                    strokeId: stroke.id || '',
                    confidence: detection.confidence
                }
            };

            if (detection.type === 'line') {
                return {
                    ...base,
                    from: detection.data.from,
                    to: detection.data.to,
                    bounds: detection.data.bounds,
                    segments: [{ start: 0, end: 1 }]
                };
            }

            if (detection.type === 'rectangle') {
                return {
                    ...base,
                    bounds: {
                        x: detection.data.x,
                        y: detection.data.y,
                        width: detection.data.width,
                        height: detection.data.height
                    },
                    radius: detection.data.radius,
                    segments: [{ start: 0, end: 1 }]
                };
            }

            if (detection.type === 'circle' || detection.type === 'ellipse') {
                return {
                    ...base,
                    cx: detection.data.cx,
                    cy: detection.data.cy,
                    rx: detection.data.rx,
                    ry: detection.data.ry,
                    bounds: detection.data.bounds,
                    arcs: [{ start: 0, end: Math.PI * 2 }]
                };
            }

            if (detection.type === 'triangle' || detection.type === 'rhombus') {
                return {
                    ...base,
                    points: detection.data.points,
                    bounds: detection.data.bounds,
                    segments: [{ start: 0, end: 1 }]
                };
            }

            if (detection.type === 'arrow') {
                return {
                    ...base,
                    from: detection.data.from,
                    to: detection.data.to,
                    arrowHead: detection.data.arrowHead,
                    bounds: detection.data.bounds,
                    segments: [{ start: 0, end: 1 }]
                };
            }

            return null;
        }

        function smartShapeRenderStyle(element) {
            return normalizeSmartShapeStyle(element.style || element);
        }

        function applySmartShapeStrokeStyle(element, model) {
            const rect = pageDisplayRect(model);
            const style = smartShapeRenderStyle(element);
            const opacity = Math.max(5, normalizePercent(style.opacity, 100)) / 100;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = style.color;
            ctx.lineWidth = Math.max(1, style.effectiveSize * rect.scale);
            ctx.lineCap = style.tip === 'square' ? 'butt' : 'round';
            ctx.lineJoin = style.tip === 'square' ? 'miter' : 'round';
            if (style.tip === 'soft' || style.tip === 'brush' || style.hardness < 100) {
                const softness = style.tip === 'brush'
                    ? Math.max(0.35, (120 - style.hardness) / 120)
                    : (style.tip === 'soft' ? Math.max(0.25, (100 - style.hardness) / 100) : (100 - style.hardness) / 100);
                ctx.shadowColor = style.color;
                ctx.shadowBlur = ctx.lineWidth * softness * 0.5;
            }
        }

        function lerpPagePoint(a, b, t) {
            return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        }

        function renderSmartLine(element, model) {
            const a = element.from || { x: 0, y: 0 };
            const b = element.to || { x: 0, y: 0 };
            const segments = Array.isArray(element.segments) && element.segments.length > 0
                ? element.segments
                : [{ start: 0, end: 1 }];
            ctx.beginPath();
            for (const segment of segments) {
                const start = displayPointFromPage(lerpPagePoint(a, b, segment.start), model);
                const end = displayPointFromPage(lerpPagePoint(a, b, segment.end), model);
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
            }
            ctx.stroke();
        }

        function renderSmartRectangle(element, model) {
            const rect = pageDisplayRect(model);
            const bounds = element.bounds || {};
            const boundsX = Number(bounds.x) || 0;
            const boundsY = Number(bounds.y) || 0;
            const boundsWidth = Math.max(1, Number(bounds.width) || 1);
            const boundsHeight = Math.max(1, Number(bounds.height) || 1);
            const cornerRadius = Math.max(0, Number(element.radius) || 0);
            const rotation = Number(element.rotation) || 0;
            const altered = Boolean(element.integrity && element.integrity.altered);

            if (!altered) {
                // Fast path for untouched rectangles: identical to the original single
                // full-perimeter draw call, no per-point sampling overhead.
                const x = rect.x + boundsX * rect.scale;
                const y = rect.y + boundsY * rect.scale;
                const width = boundsWidth * rect.scale;
                const height = boundsHeight * rect.scale;
                if (rotation) {
                    ctx.save();
                    ctx.translate(x + width / 2, y + height / 2);
                    ctx.rotate(rotation);
                    ctx.translate(-(x + width / 2), -(y + height / 2));
                }
                drawRoundedRect(ctx, x, y, width, height, cornerRadius * rect.scale);
                ctx.stroke();
                if (rotation) {
                    ctx.restore();
                }
                return;
            }

            const center = { x: boundsX + boundsWidth / 2, y: boundsY + boundsHeight / 2 };
            const cosFwd = Math.cos(rotation);
            const sinFwd = Math.sin(rotation);
            const segments = Array.isArray(element.segments) && element.segments.length > 0
                ? element.segments
                : [{ start: 0, end: 1 }];
            const samplesPerUnit = 160;
            for (const segment of segments) {
                const span = Math.max(0, segment.end - segment.start);
                const sampleCount = Math.max(2, Math.round(span * samplesPerUnit));
                ctx.beginPath();
                for (let i = 0; i <= sampleCount; i += 1) {
                    const t = segment.start + (span * i) / sampleCount;
                    const localPoint = rectPerimeterPointAtFraction(boundsX, boundsY, boundsWidth, boundsHeight, cornerRadius, t);
                    const pagePoint = rotation ? rotatePointAround(localPoint, center, cosFwd, sinFwd) : localPoint;
                    const displayPoint = displayPointFromPage(pagePoint, model);
                    if (i === 0) {
                        ctx.moveTo(displayPoint.x, displayPoint.y);
                    } else {
                        ctx.lineTo(displayPoint.x, displayPoint.y);
                    }
                }
                ctx.stroke();
            }
        }

        function renderSmartEllipse(element, model) {
            const rect = pageDisplayRect(model);
            const cx = rect.x + (Number(element.cx) || 0) * rect.scale;
            const cy = rect.y + (Number(element.cy) || 0) * rect.scale;
            const rx = Math.max(1, (Number(element.rx) || 1) * rect.scale);
            const ry = Math.max(1, (Number(element.ry) || 1) * rect.scale);
            const rotation = Number(element.rotation) || 0;
            const arcs = Array.isArray(element.arcs) && element.arcs.length > 0
                ? element.arcs
                : [{ start: 0, end: Math.PI * 2 }];
            // Each arc gets its own beginPath/stroke -- calling ctx.ellipse() more than once
            // inside a single path draws an unwanted connecting line from the previous arc's
            // end to the next arc's start, which would paper back over the erased gap.
            for (const arc of arcs) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, rotation, arc.start, arc.end);
                ctx.stroke();
            }
        }

        function renderSmartPolygon(element, model) {
            if (!Array.isArray(element.points) || element.points.length < 3) {
                return;
            }

            const altered = Boolean(element.integrity && element.integrity.altered);
            if (!altered) {
                const first = displayPointFromPage(element.points[0], model);
                ctx.beginPath();
                ctx.moveTo(first.x, first.y);
                for (let i = 1; i < element.points.length; i += 1) {
                    const point = displayPointFromPage(element.points[i], model);
                    ctx.lineTo(point.x, point.y);
                }
                ctx.closePath();
                ctx.stroke();
                return;
            }

            const segments = Array.isArray(element.segments) && element.segments.length > 0
                ? element.segments
                : [{ start: 0, end: 1 }];
            const samplesPerUnit = 160;
            for (const segment of segments) {
                const span = Math.max(0, segment.end - segment.start);
                const sampleCount = Math.max(2, Math.round(span * samplesPerUnit));
                ctx.beginPath();
                for (let i = 0; i <= sampleCount; i += 1) {
                    const t = segment.start + (span * i) / sampleCount;
                    const pagePoint = polygonPerimeterPointAtFraction(element.points, t);
                    const displayPoint = displayPointFromPage(pagePoint, model);
                    if (i === 0) {
                        ctx.moveTo(displayPoint.x, displayPoint.y);
                    } else {
                        ctx.lineTo(displayPoint.x, displayPoint.y);
                    }
                }
                ctx.stroke();
            }
        }

        function renderSmartArrow(element, model) {
            renderSmartLine(element, model);
            const segments = Array.isArray(element.segments) && element.segments.length > 0
                ? element.segments
                : [{ start: 0, end: 1 }];
            const tipIntact = segments.some((segment) => segment.end >= 1 - 1e-6);
            if (!tipIntact) {
                return;
            }
            const from = displayPointFromPage(element.from || { x: 0, y: 0 }, model);
            const to = displayPointFromPage(element.to || { x: 0, y: 0 }, model);
            const arrowHead = element.arrowHead || {};
            const size = Math.max(6, Number(arrowHead.size) || 18) * pageDisplayRect(model).scale;
            const spread = ((Number(arrowHead.angle) || 35) * Math.PI) / 180;
            const angle = Math.atan2(to.y - from.y, to.x - from.x);
            ctx.beginPath();
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - Math.cos(angle - spread) * size, to.y - Math.sin(angle - spread) * size);
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - Math.cos(angle + spread) * size, to.y - Math.sin(angle + spread) * size);
            ctx.stroke();
        }

        function renderSmartShape(element, model) {
            if (!element || element.type !== 'smart-shape') {
                return;
            }

            ctx.save();
            applySmartShapeStrokeStyle(element, model);
            if (element.shapeType === 'line') {
                renderSmartLine(element, model);
            } else if (element.shapeType === 'rectangle') {
                renderSmartRectangle(element, model);
            } else if (element.shapeType === 'circle' || element.shapeType === 'ellipse') {
                renderSmartEllipse(element, model);
            } else if (element.shapeType === 'triangle' || element.shapeType === 'rhombus') {
                renderSmartPolygon(element, model);
            } else if (element.shapeType === 'arrow') {
                renderSmartArrow(element, model);
            }
            ctx.restore();
        }

        function renderTable(element, model) {
            const rect = pageDisplayRect(model);
            const bounds = element.bounds || {};
            const rows = Math.max(1, Number(element.rows) || 1);
            const cols = Math.max(1, Number(element.cols) || 1);
            const x = rect.x + (Number(bounds.x) || 0) * rect.scale;
            const y = rect.y + (Number(bounds.y) || 0) * rect.scale;
            const width = (Number(bounds.width) || 0) * rect.scale;
            const height = (Number(bounds.height) || 0) * rect.scale;

            ctx.save();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(1, rect.scale);
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';

            for (let row = 0; row <= rows; row += 1) {
                const lineY = y + (height / rows) * row;
                ctx.beginPath();
                ctx.moveTo(x, lineY);
                ctx.lineTo(x + width, lineY);
                ctx.stroke();
            }

            for (let col = 0; col <= cols; col += 1) {
                const lineX = x + (width / cols) * col;
                ctx.beginPath();
                ctx.moveTo(lineX, y);
                ctx.lineTo(lineX, y + height);
                ctx.stroke();
            }

            ctx.restore();
        }

        function renderTableForeground(model) {
            if (!model || !Array.isArray(model.elements)) {
                return;
            }

            for (const element of model.elements) {
                if (element.type === 'table') {
                    renderTable(element, model);
                }
            }
        }

        function textDisplayBounds(element, model) {
            const rect = pageDisplayRect(model);
            const bounds = element.bounds || {};
            return {
                x: rect.x + (Number(bounds.x) || 0) * rect.scale,
                y: rect.y + (Number(bounds.y) || 0) * rect.scale,
                width: (Number(bounds.width) || 0) * rect.scale,
                height: (Number(bounds.height) || 0) * rect.scale,
                scale: rect.scale
            };
        }

        function tableDisplayBounds(element, model) {
            return textDisplayBounds(element, model);
        }

        function findTextElementById(id) {
            const model = pageModels.get(currentPage);
            if (!model || !Array.isArray(model.elements) || !id) {
                return null;
            }

            return model.elements.find((element) => (element.type === 'text' || element.type === 'formula') && element.id === id) || null;
        }

        function selectedTextElement() {
            return findTextElementById(selectedTextId);
        }

        function findTableElementById(id) {
            const model = pageModels.get(currentPage);
            if (!model || !Array.isArray(model.elements) || !id) {
                return null;
            }

            return model.elements.find((element) => element.type === 'table' && element.id === id) || null;
        }

        function selectedTableElement() {
            return findTableElementById(selectedTableId);
        }

        function findElementById(id) {
            const model = pageModels.get(currentPage);
            if (!model || !Array.isArray(model.elements) || !id) {
                return null;
            }
            return model.elements.find((element) => element.id === id) || null;
        }

        function cellKey(row, col) {
            return `${row}:${col}`;
        }

        function getTableCell(element, row, col) {
            if (!Array.isArray(element.cells)) {
                element.cells = [];
            }

            return element.cells.find((cell) => Number(cell.row) === row && Number(cell.col) === col) || null;
        }

        function setTableCellText(element, row, col, text) {
            if (!Array.isArray(element.cells)) {
                element.cells = [];
            }

            const value = typeof text === 'string' ? text : '';
            const existing = getTableCell(element, row, col);
            if (existing) {
                existing.text = value;
            } else if (value !== '') {
                element.cells.push({ row, col, text: value });
            }
            element.cells = element.cells.filter((cell) => cell.text !== '');
        }

        function logAiTranslation(message) {
            if (message) {
                console.info(message);
            }
        }

        function showAiTranslationOverlay() {
            if (!aiTranslationOverlay) {
                return;
            }
            aiTranslationOverlay.classList.add('is-visible');
            aiTranslationOverlay.setAttribute('aria-hidden', 'false');
        }

        function hideAiTranslationOverlay() {
            if (!aiTranslationOverlay) {
                return;
            }
            aiTranslationOverlay.classList.remove('is-visible');
            aiTranslationOverlay.setAttribute('aria-hidden', 'true');
        }

        function normalizeCost(value) {
            const amount = Number(value);
            return Number.isFinite(amount) && amount > 0 ? amount : 0;
        }

        function formatGbpCost(value) {
            const amount = normalizeCost(value);
            if (amount === 0) {
                return '£0.0000';
            }
            if (amount < 0.0001) {
                return '<£0.0001';
            }
            return `£${amount.toFixed(4)}`;
        }

        function updateAiCostBadge() {
            if (!aiCostBadge) {
                return;
            }
            aiCostBadge.textContent = '';
            aiCostBadge.classList.remove('is-visible');
        }

        function addAiCost(cost = {}) {
            const gbp = normalizeCost(cost.gbp);
            aiCostLastGbp = gbp;
            aiCostTotalGbp = normalizeCost(aiCostTotalGbp) + gbp;
            updateAiCostBadge();
            markUnsaved(false);
        }

        function applyTranslatedItems(model, items) {
            if (!model || !Array.isArray(model.elements) || !Array.isArray(items)) {
                return 0;
            }
            const translations = new Map();
            items.forEach((item) => {
                if (item && typeof item.id === 'string' && typeof item.text === 'string') {
                    translations.set(item.id, item.text);
                }
            });
            let changed = 0;
            for (const element of model.elements) {
                if (element.type !== 'text') {
                    continue;
                }
                const id = `text:${element.id}`;
                if (translations.has(id) && element.text !== translations.get(id)) {
                    element.text = translations.get(id);
                    changed += 1;
                }
            }
            return changed;
        }

        function approxPositionLabel(bounds, baseWidth, baseHeight) {
            const width = Math.max(1, Number(baseWidth) || 1);
            const height = Math.max(1, Number(baseHeight) || 1);
            const cx = bounds.x + bounds.width / 2;
            const cy = bounds.y + bounds.height / 2;
            const col = cx < width / 3 ? 'left' : (cx < (width * 2) / 3 ? 'center' : 'right');
            const row = cy < height / 3 ? 'top' : (cy < (height * 2) / 3 ? 'middle' : 'bottom');
            if (row === 'middle' && col === 'center') {
                return 'center';
            }
            return `${row}-${col}`;
        }

        function elementColorForCatalog(element) {
            if (element.type === 'table') {
                return normalizeCellStyles(element.cellStyles).color;
            }
            if (element.type === 'smart-shape') {
                return (element.style && element.style.color) || null;
            }
            return element.color || null;
        }

        function elementTextForCatalog(element) {
            if (element.type === 'text') {
                return (element.text || '').slice(0, 60) || null;
            }
            if (element.type === 'table') {
                const cellsText = (element.cells || []).map((cell) => cell.text).filter(Boolean).join(' ');
                return cellsText ? cellsText.slice(0, 60) : null;
            }
            if (element.type === 'formula') {
                return (element.latex || '').slice(0, 200) || null;
            }
            return null;
        }

        function buildCanvasCatalog(model) {
            if (!model || !Array.isArray(model.elements)) {
                return { catalog: [], truncated: false };
            }

            const maxEntries = 200;
            const catalog = [];
            let truncated = false;

            for (const element of model.elements) {
                if (catalog.length >= maxEntries) {
                    truncated = true;
                    break;
                }

                let kind = 'ink';
                let shape = null;
                let confidence = null;
                let bounds = element.bounds || null;

                if (element.type === 'text') {
                    kind = 'text';
                } else if (element.type === 'table') {
                    kind = 'table';
                } else if (element.type === 'smart-shape') {
                    kind = 'shape';
                    shape = element.shapeType || null;
                } else if (element.type === 'stroke') {
                    kind = 'ink';
                    bounds = calculateStrokeBounds(element.points) || null;
                    const detection = detectSmartShape(element);
                    if (detection && detection.confidence >= 0.6) {
                        shape = detection.type;
                        confidence = Math.round(detection.confidence * 100) / 100;
                    }
                } else if (element.type === 'formula') {
                    kind = 'formula';
                }

                if (!bounds) {
                    continue;
                }

                const roundedBounds = {
                    x: Math.round(bounds.x),
                    y: Math.round(bounds.y),
                    width: Math.round(bounds.width),
                    height: Math.round(bounds.height)
                };

                catalog.push({
                    id: element.id,
                    kind,
                    shape,
                    confidence,
                    color: elementColorForCatalog(element),
                    text: elementTextForCatalog(element),
                    bounds: roundedBounds,
                    approxPosition: approxPositionLabel(roundedBounds, model.baseWidth, model.baseHeight)
                });
            }

            return { catalog, truncated };
        }

        async function postToAi(payload) {
            const response = await fetch('/canvas/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': __csrfToken },
                body: JSON.stringify(payload)
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.ok) {
                throw new Error((data && data.error) || 'AI request failed.');
            }
            return data;
        }

        async function translateTextElement(element, targetLanguage) {
            if (!targetLanguage) {
                return;
            }
            const model = pageModels.get(currentPage);
            const text = typeof element.text === 'string' ? element.text : '';
            if (text.trim() === '') {
                return;
            }
            const items = [{ id: `text:${element.id}`, text }];

            showAiTranslationOverlay();
            logAiTranslation('Translating...');
            let notifyMessage = '';
            try {
                const data = await postToAi({ action: 'translate', targetLanguage, items });
                addAiCost(data.cost || {});
                const changed = applyTranslatedItems(model, data.items || []);
                if (changed > 0) {
                    markUnsaved();
                    renderTextLayer();
                    renderCurrentPage().catch((error) => console.error(error));
                    saveSessionNow({ includePages: false });
                    logAiTranslation('Translated.');
                } else {
                    logAiTranslation('Already translated.');
                }
            } catch (error) {
                notifyMessage = (error && error.message) || 'Translation failed.';
                logAiTranslation(notifyMessage);
            } finally {
                hideAiTranslationOverlay();
                if (notifyMessage) {
                    window.alert(notifyMessage);
                }
            }
        }

        function wrapTextLines(context, text, maxWidth) {
            const paragraphs = String(text || '').split('\n');
            const lines = [];
            for (const paragraph of paragraphs) {
                const words = paragraph.split(/\s+/).filter(Boolean);
                if (!words.length) {
                    lines.push('');
                    continue;
                }
                let line = '';
                for (const word of words) {
                    const candidate = line ? `${line} ${word}` : word;
                    if (context.measureText(candidate).width <= maxWidth || !line) {
                        line = candidate;
                    } else {
                        lines.push(line);
                        line = word;
                    }
                }
                lines.push(line);
            }
            return lines;
        }

        function drawTextElementToCanvas(element, model) {
            const display = textDisplayBounds(element, model);
            if (display.width < 1 || display.height < 1) {
                return;
            }

            const fontSize = normalizeTextSize(element.fontSize, 20) * display.scale;
            const padding = Math.max(2, 6 * display.scale);
            const lineHeight = fontSize * 1.25;
            const contentWidth = Math.max(1, display.width - padding * 2);
            const fontWeight = element.bold ? '700' : '400';
            const fontStyle = element.italic ? 'italic' : 'normal';
            const align = normalizeAlign(element.align);
            const x = align === 'left'
                ? display.x + padding
                : (align === 'center' ? display.x + display.width / 2 : display.x + display.width - padding);

            ctx.save();
            ctx.beginPath();
            ctx.rect(display.x, display.y, display.width, display.height);
            ctx.clip();
            ctx.fillStyle = normalizeColor(element.color || colorInput.value, '#111827');
            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial, Helvetica, sans-serif`;
            ctx.textAlign = align;
            ctx.textBaseline = 'top';

            const lines = wrapTextLines(ctx, element.text || '', contentWidth);
            let y = display.y + padding;
            for (const line of lines) {
                if (y + lineHeight > display.y + display.height) {
                    break;
                }
                ctx.fillText(line, x, y);
                if (element.underline && line) {
                    const metrics = ctx.measureText(line);
                    let underlineX = x;
                    if (align === 'center') {
                        underlineX = x - metrics.width / 2;
                    } else if (align === 'right') {
                        underlineX = x - metrics.width;
                    }
                    ctx.beginPath();
                    ctx.lineWidth = Math.max(1, fontSize / 14);
                    ctx.moveTo(underlineX, y + fontSize + 1);
                    ctx.lineTo(underlineX + metrics.width, y + fontSize + 1);
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.stroke();
                }
                y += lineHeight;
            }
            ctx.restore();
        }

        function drawTableCellTextToCanvas(table, model) {
            const display = tableDisplayBounds(table, model);
            const rows = Math.max(1, Number(table.rows) || 1);
            const cols = Math.max(1, Number(table.cols) || 1);
            const styles = normalizeCellStyles(table.cellStyles);
            const cellWidth = display.width / cols;
            const cellHeight = display.height / rows;

            for (const cell of Array.isArray(table.cells) ? table.cells : []) {
                const row = Math.max(0, Math.min(rows - 1, Number(cell.row) || 0));
                const col = Math.max(0, Math.min(cols - 1, Number(cell.col) || 0));
                const element = {
                    type: 'text',
                    bounds: {
                        x: (Number(table.bounds.x) || 0) + ((Number(table.bounds.width) || 0) / cols) * col,
                        y: (Number(table.bounds.y) || 0) + ((Number(table.bounds.height) || 0) / rows) * row,
                        width: (Number(table.bounds.width) || 0) / cols,
                        height: (Number(table.bounds.height) || 0) / rows
                    },
                    text: cell.text || '',
                    ...styles
                };
                drawTextElementToCanvas(element, model);
            }
        }

        function drawTextElementsToCanvas(model) {
            if (!model || !Array.isArray(model.elements)) {
                return;
            }

            for (const element of model.elements) {
                if (element.type === 'text') {
                    drawTextElementToCanvas(element, model);
                }
                if (element.type === 'table') {
                    drawTableCellTextToCanvas(element, model);
                }
                if (element.type === 'formula') {
                    drawFormulaElementToCanvas(element, model);
                }
            }
        }

        async function bakeAndSnapshotCurrentPage(model) {
            drawTextElementsToCanvas(model);
            pages.set(currentPage, canvas.toDataURL('image/jpeg', 0.92));
            await renderCurrentPage();
        }

        const formulaImageCache = new Map();

        let mathJaxReadyPromise = null;
        function ensureMathJaxReady() {
            if (!mathJaxReadyPromise) {
                mathJaxReadyPromise = new Promise((resolve) => {
                    const check = () => {
                        if (window.MathJax && typeof window.MathJax.tex2svg === 'function' && window.MathJax.startup && window.MathJax.startup.promise) {
                            window.MathJax.startup.promise.then(resolve);
                        } else {
                            window.setTimeout(check, 50);
                        }
                    };
                    check();
                });
            }
            return mathJaxReadyPromise;
        }

        async function ensureMathLiveReady() {
            if (window.customElements) {
                await customElements.whenDefined('math-field');
            }
        }

        function svgToSelfContainedImage(svg, widthPx, heightPx, color) {
            const clone = svg.cloneNode(true);
            clone.setAttribute('width', `${widthPx}`);
            clone.setAttribute('height', `${heightPx}`);
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clone.setAttribute('color', color || '#111827');
            clone.style.color = color || '#111827';
            const svgString = new XMLSerializer().serializeToString(clone);
            const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Could not rasterize formula.'));
                img.src = dataUrl;
            });
        }

        async function measureFormulaSvg(latex, fontSizePx) {
            await ensureMathJaxReady();
            const wrapper = MathJax.tex2svg(latex, { display: true });
            const svg = wrapper.querySelector('svg');
            if (!svg) {
                throw new Error('MathJax could not render this expression.');
            }
            const container = document.createElement('div');
            container.style.cssText = `position:fixed; left:-9999px; top:-9999px; visibility:hidden; font-size:${fontSizePx}px;`;
            container.appendChild(svg);
            document.body.appendChild(container);
            const rect = svg.getBoundingClientRect();
            const width = Math.max(1, rect.width);
            const height = Math.max(1, rect.height);
            document.body.removeChild(container);
            return { svg, width, height };
        }

        async function cacheFormulaImage(latex, fontSizePx, color) {
            const key = `${fontSizePx}::${color}::${latex}`;
            if (formulaImageCache.has(key)) {
                return formulaImageCache.get(key);
            }
            try {
                const { svg, width, height } = await measureFormulaSvg(latex, fontSizePx);
                const img = await svgToSelfContainedImage(svg, width, height, color);
                const entry = { img, width, height };
                formulaImageCache.set(key, entry);
                return entry;
            } catch (err) {
                return null;
            }
        }

        function drawFormulaElementToCanvas(element, model) {
            const latex = String(element.latex || '').trim();
            if (!latex) {
                return;
            }
            const fontSizePx = normalizeTextSize(element.fontSize, 26);
            const color = normalizeColor(element.color || colorInput.value, '#111827');
            const key = `${fontSizePx}::${color}::${latex}`;
            const cached = formulaImageCache.get(key);
            if (!cached) {
                cacheFormulaImage(latex, fontSizePx, color);
                return;
            }
            const display = textDisplayBounds(element, model);
            if (display.width < 1 || display.height < 1) {
                return;
            }
            const scale = Math.min(display.width / cached.width, display.height / cached.height);
            const drawWidth = cached.width * scale;
            const drawHeight = cached.height * scale;
            const drawX = display.x + (display.width - drawWidth) / 2;
            const drawY = display.y + (display.height - drawHeight) / 2;
            ctx.drawImage(cached.img, drawX, drawY, drawWidth, drawHeight);
        }

        function useVirtualKeyboard() {
            if (navigator.maxTouchPoints <= 0) {
                return false;
            }
            return Math.min(window.innerWidth, window.innerHeight) <= 900;
        }

        function setWorkspaceOffset(offset) {
            workspaceOffsetY = offset;
            document.documentElement.style.setProperty('--workspace-offset-y', `${offset}px`);
        }

        function resetWorkspaceOffset() {
            setWorkspaceOffset(0);
        }

        function renderVirtualTextNode(node, text, active = false, caretIndex = null) {
            if (!node) {
                return;
            }

            const safeText = text || '';
            node.textContent = '';
            node.classList.toggle('virtual-editing', active);
            if (active) {
                const index = Math.max(0, Math.min(caretIndex === null ? safeText.length : caretIndex, safeText.length));
                if (index > 0) {
                    node.appendChild(document.createTextNode(safeText.slice(0, index)));
                }
                const caret = document.createElement('span');
                caret.className = 'virtual-caret';
                caret.setAttribute('aria-hidden', 'true');
                node.appendChild(caret);
                if (index < safeText.length) {
                    node.appendChild(document.createTextNode(safeText.slice(index)));
                }
            } else {
                node.textContent = safeText;
            }
        }

        function virtualCaretIndexFromPoint(node, clientX, clientY) {
            if (!node) {
                return null;
            }

            let container = null;
            let offset = 0;
            if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(clientX, clientY);
                if (pos) {
                    container = pos.offsetNode;
                    offset = pos.offset;
                }
            } else if (document.caretRangeFromPoint) {
                const range = document.caretRangeFromPoint(clientX, clientY);
                if (range) {
                    container = range.startContainer;
                    offset = range.startOffset;
                }
            }

            if (!container || !node.contains(container)) {
                return null;
            }

            let index = 0;
            for (const child of node.childNodes) {
                if (child === container) {
                    return index + (child.nodeType === Node.TEXT_NODE ? offset : 0);
                }
                if (child.nodeType === Node.TEXT_NODE) {
                    index += child.textContent.length;
                } else if (child.contains && child.contains(container)) {
                    return index;
                }
            }

            return null;
        }

        function applyVirtualCaretFromPoint(clientX, clientY) {
            if (!virtualKeyboardTarget || !virtualKeyboardTarget.node) {
                return;
            }
            const index = virtualCaretIndexFromPoint(virtualKeyboardTarget.node, clientX, clientY);
            if (index === null) {
                return;
            }
            virtualKeyboardCaret = index;
            renderVirtualTextNode(virtualKeyboardTarget.node, virtualTargetText(), true, virtualKeyboardCaret);
        }

        function trackVirtualCaretDrag(event) {
            const pointerId = event.pointerId;
            window.requestAnimationFrame(() => applyVirtualCaretFromPoint(event.clientX, event.clientY));

            const onMove = (moveEvent) => {
                if (moveEvent.pointerId !== pointerId) {
                    return;
                }
                applyVirtualCaretFromPoint(moveEvent.clientX, moveEvent.clientY);
            };
            const onUp = (upEvent) => {
                if (upEvent.pointerId !== pointerId) {
                    return;
                }
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        }

        function virtualTargetText() {
            if (!virtualKeyboardTarget) {
                return '';
            }

            if (virtualKeyboardTarget.type === 'text') {
                return virtualKeyboardTarget.element.text || '';
            }
            if (virtualKeyboardTarget.type === 'chat') {
                return chatInput.textContent || '';
            }

            const cell = getTableCell(virtualKeyboardTarget.table, virtualKeyboardTarget.row, virtualKeyboardTarget.col);
            return cell ? cell.text || '' : '';
        }

        function setVirtualTargetText(text) {
            if (!virtualKeyboardTarget) {
                return;
            }

            if (virtualKeyboardTarget.type === 'text') {
                virtualKeyboardTarget.element.text = text;
            } else if (virtualKeyboardTarget.type === 'chat') {
                // no separate model: chatInput.textContent is re-rendered below
            } else {
                setTableCellText(virtualKeyboardTarget.table, virtualKeyboardTarget.row, virtualKeyboardTarget.col, text);
            }

            renderVirtualTextNode(virtualKeyboardTarget.node, text, true, virtualKeyboardCaret);
            if (virtualKeyboardTarget.type !== 'chat') {
                markUnsaved();
            }
            applyKeyboardAvoidance();
        }

        function insertAtVirtualCaret(value) {
            if (!virtualKeyboardTarget || !value) {
                return;
            }

            const text = virtualTargetText();
            const caret = Math.max(0, Math.min(virtualKeyboardCaret, text.length));
            virtualKeyboardCaret = caret + value.length;
            setVirtualTargetText(text.slice(0, caret) + value + text.slice(caret));
        }

        async function pasteVirtualKeyboardClipboard() {
            if (!virtualKeyboardTarget || !navigator.clipboard || !navigator.clipboard.readText) {
                return;
            }

            try {
                const clipText = await navigator.clipboard.readText();
                if (clipText && virtualKeyboardTarget) {
                    insertAtVirtualCaret(clipText);
                }
            } catch (err) {
                // Clipboard access unavailable or denied; ignore.
            }
        }

        function activeVirtualTargetElement() {
            if (!virtualKeyboardTarget || !virtualKeyboardTarget.node) {
                return null;
            }

            return virtualKeyboardTarget.node.closest('.text-box, .table-box');
        }

        function raiseChatBarAboveKeyboard() {
            if (!chatBar || !chatBar.classList.contains('is-visible')) {
                return;
            }
            window.requestAnimationFrame(() => {
                const keyboardHeight = virtualKeyboard.getBoundingClientRect().height;
                chatBar.style.bottom = `${Math.round(keyboardHeight) + 10}px`;
                positionChatThread();
            });
        }

        function applyKeyboardAvoidance() {
            if (!virtualKeyboardTarget || !virtualKeyboard.classList.contains('is-visible')) {
                resetWorkspaceOffset();
                if (chatBar) {
                    chatBar.style.bottom = '';
                }
                positionChatThread();
                return;
            }

            raiseChatBarAboveKeyboard();

            if (virtualKeyboardTarget.type === 'chat') {
                return;
            }

            window.requestAnimationFrame(() => {
                const activeBox = activeVirtualTargetElement();
                if (!activeBox) {
                    return;
                }

                const keyboardHeight = virtualKeyboard.getBoundingClientRect().height;
                const box = activeBox.getBoundingClientRect();
                const margin = 16;
                const visibleBottom = window.innerHeight - keyboardHeight - margin;
                const naturalBottom = box.bottom - workspaceOffsetY;
                const neededOffset = naturalBottom > visibleBottom ? Math.min(0, visibleBottom - naturalBottom) : 0;
                setWorkspaceOffset(Math.round(neededOffset));
            });
        }

        function keyLabel(key) {
            if (key === 'shift') return 'Shift';
            if (key === 'backspace') return 'Del';
            if (key === 'numbers') return '123';
            if (key === 'symbols') return '#+=';
            if (key === 'letters') return 'ABC';
            if (key === 'space') return 'space';
            if (key === 'enter') return 'return';
            if (key === 'done') return 'Done';
            if (key === 'left') return '‹';
            if (key === 'right') return '›';
            if (key === 'paste') return '';
            return virtualKeyboardShift && /^[a-z]$/.test(key) ? key.toUpperCase() : key;
        }

        function renderVirtualKeyboard() {
            if (!virtualKeyboardKeys) {
                return;
            }

            virtualKeyboardKeys.innerHTML = '';
            let layout = virtualKeyboardLayouts[virtualKeyboardLayout] || virtualKeyboardLayouts.letters;
            for (const rowKeys of layout) {
                const row = document.createElement('div');
                row.className = 'vk-row';
                for (const key of rowKeys) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'vk-key';
                    button.dataset.key = key;
                    if (key === 'paste') {
                        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6a1 1 0 0 1 1 1v1h1.5A1.5 1.5 0 0 1 19 7.5v12A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-12A1.5 1.5 0 0 1 6.5 6H8V5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4h6v2H9z" fill="currentColor"/></svg>';
                    } else {
                        button.textContent = keyLabel(key);
                    }
                    button.classList.toggle('is-active', key === 'shift' && virtualKeyboardShift);
                    button.classList.toggle('vk-key-wide', ['shift', 'backspace', 'numbers', 'symbols', 'letters', 'enter', 'done'].includes(key));
                    button.classList.toggle('vk-key-space', key === 'space');
                    button.classList.toggle('vk-key-done', key === 'done');
                    button.classList.toggle('vk-key-nav', key === 'left' || key === 'right');
                    button.classList.toggle('vk-key-paste', key === 'paste');
                    row.appendChild(button);
                }
                virtualKeyboardKeys.appendChild(row);
            }
        }

        function closeVirtualKeyboard(options = {}) {
            if (!virtualKeyboardTarget && !virtualKeyboard.classList.contains('is-visible')) {
                return;
            }

            const node = virtualKeyboardTarget ? virtualKeyboardTarget.node : null;
            if (node) {
                renderVirtualTextNode(node, virtualTargetText(), false);
            }
            virtualKeyboardTarget = null;
            virtualKeyboard.classList.remove('is-visible');
            virtualKeyboard.setAttribute('aria-hidden', 'true');
            resetWorkspaceOffset();
            if (chatBar) {
                chatBar.style.bottom = '';
            }
            if (options.render !== false) {
                renderTextLayer();
            }
        }

        function openVirtualKeyboard(target) {
            if (!useVirtualKeyboard()) {
                return;
            }

            virtualKeyboardTarget = target;
            virtualKeyboardLayout = 'letters';
            virtualKeyboardShift = false;
            virtualKeyboardCaret = virtualTargetText().length;
            renderVirtualKeyboard();
            renderVirtualTextNode(target.node, virtualTargetText(), true, virtualKeyboardCaret);
            virtualKeyboard.classList.add('is-visible');
            virtualKeyboard.setAttribute('aria-hidden', 'false');
            applyKeyboardAvoidance();
        }

        function startVirtualChatEditing() {
            openVirtualKeyboard({ type: 'chat', node: chatInput });
        }

        function syncChatInputEditableMode() {
            if (!chatInput) {
                return;
            }
            chatInput.contentEditable = useVirtualKeyboard() ? 'false' : 'true';
        }

        function startVirtualTextEditing(element) {
            clearDrawingSelectionForFrameActivation();
            selectedTextId = element.id;
            selectedTableId = '';
            renderTextLayer();
            window.requestAnimationFrame(() => {
                const node = textLayer.querySelector(`[data-text-id="${element.id}"] .text-box-content`);
                openVirtualKeyboard({ type: 'text', element, node });
            });
        }

        function startVirtualTableEditing(table, row, col) {
            clearDrawingSelectionForFrameActivation();
            selectedTableId = table.id;
            selectedTextId = '';
            renderTextLayer();
            window.requestAnimationFrame(() => {
                const node = textLayer.querySelector(`[data-table-id="${table.id}"] [data-cell="${cellKey(row, col)}"]`);
                openVirtualKeyboard({ type: 'table', table, row, col, node });
            });
        }

        function handleVirtualKey(key) {
            if (!virtualKeyboardTarget) {
                return;
            }

            if (key === 'done') {
                closeVirtualKeyboard();
                return;
            }
            if (key === 'shift') {
                virtualKeyboardShift = !virtualKeyboardShift;
                renderVirtualKeyboard();
                return;
            }
            if (key === 'numbers') {
                virtualKeyboardLayout = 'numbers';
                virtualKeyboardShift = false;
                renderVirtualKeyboard();
                return;
            }
            if (key === 'symbols') {
                virtualKeyboardLayout = 'symbols';
                virtualKeyboardShift = false;
                renderVirtualKeyboard();
                return;
            }
            if (key === 'letters') {
                virtualKeyboardLayout = 'letters';
                virtualKeyboardShift = false;
                renderVirtualKeyboard();
                return;
            }

            let text = virtualTargetText();
            const caret = Math.max(0, Math.min(virtualKeyboardCaret, text.length));

            if (key === 'left') {
                virtualKeyboardCaret = Math.max(0, caret - 1);
                renderVirtualTextNode(virtualKeyboardTarget.node, text, true, virtualKeyboardCaret);
                return;
            }
            if (key === 'right') {
                virtualKeyboardCaret = Math.min(text.length, caret + 1);
                renderVirtualTextNode(virtualKeyboardTarget.node, text, true, virtualKeyboardCaret);
                return;
            }
            if (key === 'paste') {
                pasteVirtualKeyboardClipboard();
                return;
            }
            if (key === 'backspace') {
                if (caret === 0) {
                    return;
                }
                virtualKeyboardCaret = caret - 1;
                setVirtualTargetText(text.slice(0, caret - 1) + text.slice(caret));
                return;
            }
            if (key === 'space') {
                insertAtVirtualCaret(' ');
                return;
            }
            if (key === 'enter') {
                if (virtualKeyboardTarget.type === 'chat') {
                    sendChatMessage();
                    return;
                }
                insertAtVirtualCaret('\n');
                return;
            }

            const value = virtualKeyboardShift && /^[a-z]$/.test(key) ? key.toUpperCase() : key;
            insertAtVirtualCaret(value);
            if (virtualKeyboardShift && virtualKeyboardLayout === 'letters') {
                virtualKeyboardShift = false;
                renderVirtualKeyboard();
            }
        }

        function isTextEditing() {
            const active = document.activeElement;
            if (!active) {
                return false;
            }
            if (active.tagName === 'MATH-FIELD') {
                return true;
            }
            return Boolean(active.classList) && (
                active.classList.contains('text-box-content') ||
                active.classList.contains('table-cell-content')
            );
        }

        function isFormFieldEditing() {
            const active = document.activeElement;
            if (!active) {
                return false;
            }

            return ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) || active.isContentEditable;
        }

        function clearFrameSelectionState(options = {}) {
            if (virtualKeyboardTarget) {
                closeVirtualKeyboard({ render: false });
            }
            if (!selectedTextId && !selectedTableId && !isTextEditing()) {
                return false;
            }

            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            selectedTextId = '';
            selectedTableId = '';
            if (options.render !== false) {
                renderTextLayer();
                applySelectedTextStylesToControls();
                applySelectedTableStylesToControls();
            }
            return true;
        }

        function clearActiveEditableSelection() {
            if (!clearFrameSelectionState({ render: false })) {
                return false;
            }

            setTool(lastDrawingTool || 'pen');
            renderTextLayer();
            applySelectedTextStylesToControls();
            applySelectedTableStylesToControls();
            return true;
        }

        function setInteractionCooldown(duration = interactionCooldownMs) {
            interactionCooldownUntil = Math.max(interactionCooldownUntil, Date.now() + duration);
        }

        function isInteractionCoolingDown() {
            return Date.now() < interactionCooldownUntil;
        }

        function isFrameDragActive() {
            return Boolean(textDragMode || tableDragMode || drawingSelectionDragMode);
        }

        function blurActiveEditableForDrag() {
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
                setInteractionCooldown();
            }
        }

        function flushDeferredViewportResize() {
            if (!deferredViewportResize || isFrameDragActive()) {
                return;
            }

            deferredViewportResize = false;
            scheduleResizeCanvas();
        }

        function dragDistanceFromStart(start, point) {
            if (!start || !point) {
                return 0;
            }
            return Math.hypot(point.x - start.x, point.y - start.y);
        }

        function dragClientDelta(start, event) {
            if (!start) {
                return { dx: 0, dy: 0, distance: 0, scale: 1 };
            }
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            return {
                dx,
                dy,
                distance: Math.hypot(dx, dy),
                scale: Math.max(0.001, Number(start.scale) || 1)
            };
        }

        function activeTextDomElement() {
            return selectedTextId ? textLayer.querySelector(`[data-text-id="${selectedTextId}"]`) : null;
        }

        function activeTableDomElement() {
            return selectedTableId ? textLayer.querySelector(`[data-table-id="${selectedTableId}"]`) : null;
        }

        function applyDragPreview(domElement, originalDisplay, mode, delta) {
            if (!domElement || !originalDisplay) {
                return;
            }

            if (mode === 'move') {
                domElement.style.left = `${originalDisplay.x + delta.dx}px`;
                domElement.style.top = `${originalDisplay.y + delta.dy}px`;
                domElement.style.transform = 'none';
                return;
            }

            if (mode === 'resize') {
                domElement.style.width = `${Math.max(24, originalDisplay.width + delta.dx)}px`;
                domElement.style.height = `${Math.max(20, originalDisplay.height + delta.dy)}px`;
            }
        }

        function boundsFromDrag(originalBounds, mode, delta, model, clampFn) {
            const dx = delta.dx / delta.scale;
            const dy = delta.dy / delta.scale;
            if (mode === 'move') {
                return clampFn({
                    ...originalBounds,
                    x: originalBounds.x + dx,
                    y: originalBounds.y + dy
                }, model);
            }

            return clampFn({
                ...originalBounds,
                width: originalBounds.width + dx,
                height: originalBounds.height + dy
            }, model);
        }

        const decodedPageImageCache = new Map();

        function getDecodedPageImage(source) {
            const cached = decodedPageImageCache.get(source);
            if (cached) {
                return cached;
            }

            const promise = new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = (error) => {
                    decodedPageImageCache.delete(source);
                    reject(error);
                };
                image.src = source;
            });
            decodedPageImageCache.set(source, promise);
            return promise;
        }

        async function drawPageImage(source) {
            const image = await getDecodedPageImage(source);
            clearCanvas();
            const size = cssSize();
            const fitted = fitRect(image.width, image.height, size.width, size.height);
            ctx.drawImage(image, 0, 0, image.width, image.height, fitted.x, fitted.y, fitted.width, fitted.height);
        }

        let renderGeneration = 0;

        async function renderPageModel(model) {
            const generation = ++renderGeneration;

            if (model.fallbackImage) {
                const image = await getDecodedPageImage(model.fallbackImage);
                if (generation !== renderGeneration) {
                    return;
                }
                clearCanvas();
                const size = cssSize();
                const fitted = fitRect(image.width, image.height, size.width, size.height);
                ctx.drawImage(image, 0, 0, image.width, image.height, fitted.x, fitted.y, fitted.width, fitted.height);
            } else {
                clearCanvas();
            }

            for (const element of model.elements) {
                if (element.type === 'stroke') {
                    renderStroke(element, model);
                } else if (element.type === 'smart-shape') {
                    renderSmartShape(element, model);
                }
            }
            renderTableForeground(model);
        }

        function renderElementsOnlyToTransparentDataUrl(model) {
            const size = cssSize();
            const ratio = currentRatio;
            const buffer = document.createElement('canvas');
            buffer.width = Math.max(1, Math.round(size.width * ratio));
            buffer.height = Math.max(1, Math.round(size.height * ratio));
            const bufferCtx = buffer.getContext('2d');

            const originalCanvas = canvas;
            const originalCtx = ctx;
            canvas = buffer;
            ctx = bufferCtx;
            try {
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                ctx.clearRect(0, 0, size.width, size.height);
                for (const element of model.elements) {
                    if (element.type === 'stroke') {
                        renderStroke(element, model);
                    } else if (element.type === 'smart-shape') {
                        renderSmartShape(element, model);
                    }
                }
                renderTableForeground(model);
                drawTextElementsToCanvas(model);
                return buffer.toDataURL('image/png');
            } finally {
                canvas = originalCanvas;
                ctx = originalCtx;
            }
        }

        function dataUrlToBytes(dataUrl) {
            // Deliberately not `fetch(dataUrl)`: browsers treat that as a network
            // request subject to CSP `connect-src`, and `connect-src 'self'` (no
            // `data:`) blocks it outright with no fallback — this is why PDF
            // export/download silently failed. Decoding the base64 payload
            // directly avoids the network stack entirely.
            const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        }

        function showCanvasToast(message) {
            const toast = document.createElement('div');
            toast.className = 'canvas-status-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('is-visible'), 10);
            setTimeout(() => {
                toast.classList.remove('is-visible');
                setTimeout(() => toast.remove(), 300);
            }, 6000);
        }

        async function exportDocumentAsPdf(pdfId, pdfName) {
            if (window.CANVAS_DEMO_MODE) {
                window.location.href = window.CANVAS_REGISTER_URL;
                return;
            }

            if (!window.CANVAS_PDF_EXPORT_ALLOWED) {
                window.alert('Exporting PDF is a Premium feature. Upgrade to unlock it.');
                return;
            }

            if (!window.PDFLib) {
                window.alert('The PDF export engine failed to load.');
                return;
            }

            try {
                await exportDocumentAsPdfUnsafe(pdfId, pdfName);
            } catch (error) {
                console.error('exportDocumentAsPdf failed', error);
                showCanvasToast('Could not download this PDF. Please try again.');
                await renderCurrentPage();
            }
        }

        async function exportDocumentAsPdfUnsafe(pdfId, pdfName) {
            const entries = [...pageModels.entries()]
                .filter(([, model]) => model.sourcePdf && model.sourcePdf.pdfId === pdfId
                    && Array.isArray(model.elements) && model.elements.length > 0)
                .sort((a, b) => a[0] - b[0]);

            rememberCurrentPage();

            const libraryEntries = await fetchPdfLibraryEntries();
            const libraryEntry = libraryEntries.find((item) => item.id === pdfId);
            const sourceUrl = libraryEntry ? libraryEntry.url : `/canvas/api?action=pdf_file&id=${encodeURIComponent(pdfId)}`;
            const sourceBytes = await getPdfSourceBytes(sourceUrl);
            const sourceDoc = await PDFLib.PDFDocument.load(sourceBytes);

            const pageOrder = libraryEntry && Array.isArray(libraryEntry.pageOrder) && libraryEntry.pageOrder.length > 0
                ? libraryEntry.pageOrder
                : Array.from({ length: sourceDoc.getPageCount() }, (_, i) => i);

            const outDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await outDoc.copyPages(sourceDoc, pageOrder);
            copiedPages.forEach((page) => outDoc.addPage(page));

            const size = cssSize();
            for (const [, model] of entries) {
                const sourceIndex = model.sourcePdf.pageIndex;
                const rect = pageDisplayRect(model);
                const scaleToPdf = 1 / rect.scale;

                const overlayDataUrl = renderElementsOnlyToTransparentDataUrl(model);
                const overlayBytes = dataUrlToBytes(overlayDataUrl);
                const overlayImage = await outDoc.embedPng(overlayBytes);

                pageOrder.forEach((slotSourceIndex, slot) => {
                    if (slotSourceIndex !== sourceIndex) {
                        return;
                    }
                    const outPage = outDoc.getPage(slot);
                    const { height: pageHeightPt } = outPage.getSize();
                    outPage.drawImage(overlayImage, {
                        x: -rect.x * scaleToPdf,
                        y: pageHeightPt - (size.height - rect.y) * scaleToPdf,
                        width: size.width * scaleToPdf,
                        height: size.height * scaleToPdf
                    });
                });
            }

            await renderCurrentPage();

            const outBytes = await outDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${pdfName || 'document'} (annotated).pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }

        async function renderCurrentPage() {
            if (pageModels.has(currentPage)) {
                await renderPageModel(pageModels.get(currentPage));
                if (!isTextEditing()) {
                    renderTextLayer();
                }
                return;
            }

            if (pages.has(currentPage)) {
                const pageToWarnAbout = currentPage;
                try {
                    await drawPageImage(pages.get(currentPage));
                } catch (error) {
                    console.error(error);
                    clearCanvas();
                    if (!warnedMissingPages.has(pageToWarnAbout)) {
                        warnedMissingPages.add(pageToWarnAbout);
                        showCanvasToast(`Page ${pageToWarnAbout} could not be displayed.`);
                    }
                }
                if (!isTextEditing()) {
                    renderTextLayer();
                }
                return;
            }

            clearCanvas();
            if (failedPageLoads.has(currentPage) && !warnedMissingPages.has(currentPage)) {
                warnedMissingPages.add(currentPage);
                showCanvasToast(`Page ${currentPage} could not be loaded and may be missing from storage.`);
            }
            if (!isTextEditing()) {
                renderTextLayer();
            }
        }

        function composeWorkspaceSnapshot() {
            const buffer = document.createElement('canvas');
            buffer.width = canvas.width;
            buffer.height = canvas.height;
            const bufferCtx = buffer.getContext('2d');
            bufferCtx.drawImage(canvas, 0, 0);
            bufferCtx.drawImage(guideCanvas, 0, 0);
            return buffer.toDataURL('image/png');
        }

        async function captureWorkspaceSnapshot() {
            const model = pageModels.get(currentPage);
            if (model && !isTextEditing()) {
                drawTextElementsToCanvas(model);
            }
            const snapshot = composeWorkspaceSnapshot();
            await renderCurrentPage();
            drawGuides();
            return snapshot;
        }

        function playPageSlideTransition(fromSnapshot, toSnapshot, direction) {
            const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion || !fromSnapshot || !toSnapshot) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                const fromImage = document.createElement('img');
                const toImage = document.createElement('img');
                const exitX = direction > 0 ? '-100%' : '100%';
                const enterX = direction > 0 ? '100%' : '-100%';
                let settled = false;

                overlay.className = 'page-slide-transition';
                fromImage.alt = '';
                toImage.alt = '';
                fromImage.src = fromSnapshot;
                toImage.src = toSnapshot;
                fromImage.style.setProperty('--slide-from', '0%');
                fromImage.style.setProperty('--slide-to', exitX);
                toImage.style.setProperty('--slide-from', enterX);
                toImage.style.setProperty('--slide-to', '0%');
                overlay.append(fromImage, toImage);
                document.body.appendChild(overlay);

                const finish = () => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    overlay.remove();
                    resolve();
                };

                toImage.addEventListener('transitionend', finish, { once: true });
                window.setTimeout(finish, 340);
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        overlay.classList.add('is-animating');
                    });
                });
            });
        }

        function currentUndoCount() {
            const model = pageModels.get(currentPage);
            const stack = redoStacks.get(currentPage) || [];
            const journaledActions = stack.filter((item) => item && (
                item.type === 'deleted-text'
                || item.type === 'deleted-table'
                || item.type === 'deleted-element'
                || item.type === 'transformed-drawables'
                || item.type === 'transformed-strokes'
                || item.type === 'erased-geometry'
            )).length;
            return (model && Array.isArray(model.elements) ? model.elements.length : 0) + journaledActions;
        }

        function updateUndoButton() {
            if (undoBtn) {
                undoBtn.disabled = currentUndoCount() === 0;
            }
            if (redoBtn) {
                const stack = forwardRedoStacks.get(currentPage) || [];
                redoBtn.disabled = stack.length === 0;
            }
        }

        function clearRedoForCurrentPage() {
            redoStacks.delete(currentPage);
            forwardRedoStacks.delete(currentPage);
        }

        async function undoCurrentPage() {
            const model = pageModels.get(currentPage) || currentPageModel();
            const stack = redoStacks.get(currentPage) || [];
            const forwardStack = forwardRedoStacks.get(currentPage) || [];
            const lastAction = stack[stack.length - 1];
            if (lastAction && lastAction.type === 'deleted-text') {
                stack.pop();
                redoStacks.set(currentPage, stack);
                forwardStack.push({ type: 'delete-again', action: lastAction });
                forwardRedoStacks.set(currentPage, forwardStack);
                const insertAt = Math.max(0, Math.min(Number(lastAction.index) || 0, model.elements.length));
                model.elements.splice(insertAt, 0, lastAction.element);
                selectedTextId = lastAction.element.id || '';
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                await bakeAndSnapshotCurrentPage(model);
                updateUndoButton();
                scheduleSessionSave();
                return;
            }
            if (lastAction && lastAction.type === 'deleted-table') {
                stack.pop();
                redoStacks.set(currentPage, stack);
                forwardStack.push({ type: 'delete-again', action: lastAction });
                forwardRedoStacks.set(currentPage, forwardStack);
                const insertAt = Math.max(0, Math.min(Number(lastAction.index) || 0, model.elements.length));
                model.elements.splice(insertAt, 0, lastAction.element);
                selectedTableId = lastAction.element.id || '';
                selectedTextId = '';
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                await bakeAndSnapshotCurrentPage(model);
                updateUndoButton();
                scheduleSessionSave();
                return;
            }
            if (lastAction && lastAction.type === 'deleted-element') {
                stack.pop();
                redoStacks.set(currentPage, stack);
                forwardStack.push({ type: 'delete-again', action: lastAction });
                forwardRedoStacks.set(currentPage, forwardStack);
                const insertAt = Math.max(0, Math.min(Number(lastAction.index) || 0, model.elements.length));
                model.elements.splice(insertAt, 0, lastAction.element);
                if (lastAction.element && lastAction.element.type !== 'text' && lastAction.element.type !== 'table') {
                    selectedStrokeIds = [lastAction.element.id];
                    drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
                }
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                await renderCurrentPage();
                renderDrawingSelection();
                await bakeAndSnapshotCurrentPage(model);
                renderDrawingSelection();
                updateUndoButton();
                scheduleSessionSave();
                return;
            }
            if (lastAction && lastAction.type === 'erased-geometry') {
                stack.pop();
                redoStacks.set(currentPage, stack);
                forwardStack.push({ type: 'redo-erased-geometry', action: lastAction });
                forwardRedoStacks.set(currentPage, forwardStack);
                for (const item of lastAction.items) {
                    for (const afterElement of item.after) {
                        const idx = model.elements.findIndex((element) => element.id === afterElement.id);
                        if (idx >= 0) {
                            model.elements.splice(idx, 1);
                        }
                    }
                    const insertAt = Math.max(0, Math.min(item.beforeIndex, model.elements.length));
                    model.elements.splice(insertAt, 0, cloneErasableElement(item.before));
                }
                selectedStrokeIds = lastAction.items.map((item) => item.id).filter(Boolean);
                drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                await renderCurrentPage();
                renderDrawingSelection();
                await bakeAndSnapshotCurrentPage(model);
                renderDrawingSelection();
                updateUndoButton();
                scheduleSessionSave();
                return;
            }
            if (lastAction && (lastAction.type === 'transformed-strokes' || lastAction.type === 'transformed-drawables')) {
                stack.pop();
                redoStacks.set(currentPage, stack);
                forwardStack.push({ type: 'redo-transformed-drawables', action: lastAction });
                forwardRedoStacks.set(currentPage, forwardStack);
                restoreStrokeTransform(lastAction, 'before');
                selectedStrokeIds = lastAction.items.map((item) => item.id).filter(Boolean);
                drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
                drawingSelectionRotationAngle = 0;
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                await renderCurrentPage();
                renderDrawingSelection();
                await bakeAndSnapshotCurrentPage(model);
                renderDrawingSelection();
                updateUndoButton();
                scheduleSessionSave();
                return;
            }

            if (!model || !Array.isArray(model.elements) || model.elements.length === 0) {
                updateUndoButton();
                return;
            }

            const removedElement = model.elements.pop();
            stack.push(removedElement);
            redoStacks.set(currentPage, stack);
            forwardStack.push({ type: 'restore-created', element: removedElement });
            forwardRedoStacks.set(currentPage, forwardStack);
            if (removedElement && removedElement.id === selectedTextId) {
                selectedTextId = '';
            }
            if (removedElement && removedElement.id === selectedTableId) {
                selectedTableId = '';
            }
            if (removedElement && selectedStrokeIds.includes(removedElement.id)) {
                clearDrawingSelection();
            }
            dirtyPages.add(currentPage);
            hasUnsavedChanges = true;
            await bakeAndSnapshotCurrentPage(model);
            updateUndoButton();
            scheduleSessionSave();
        }

        async function redoCurrentPage() {
            const model = pageModels.get(currentPage) || currentPageModel();
            const stack = redoStacks.get(currentPage) || [];
            const forwardStack = forwardRedoStacks.get(currentPage) || [];
            const action = forwardStack.pop();
            if (!action || !model || !Array.isArray(model.elements)) {
                updateUndoButton();
                return;
            }

            if (action.type === 'delete-again' && action.action && action.action.element) {
                const element = action.action.element;
                const index = model.elements.findIndex((item) => item.id === element.id);
                if (index >= 0) {
                    model.elements.splice(index, 1);
                }
                stack.push(action.action);
                redoStacks.set(currentPage, stack);
                forwardRedoStacks.set(currentPage, forwardStack);
                if (element.id === selectedTextId) {
                    selectedTextId = '';
                }
                if (element.id === selectedTableId) {
                    selectedTableId = '';
                }
            } else if (action.type === 'restore-created' && action.element) {
                const undone = stack[stack.length - 1];
                if (undone && undone.id === action.element.id) {
                    stack.pop();
                }
                model.elements.push(action.element);
                redoStacks.set(currentPage, stack);
                forwardRedoStacks.set(currentPage, forwardStack);
                selectedTextId = action.element.type === 'text' ? action.element.id || '' : '';
                selectedTableId = action.element.type === 'table' ? action.element.id || '' : '';
                if (action.element.type === 'stroke' || action.element.type === 'smart-shape') {
                    selectedStrokeIds = [action.element.id].filter(Boolean);
                    drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
                }
            } else if ((action.type === 'redo-transformed-strokes' || action.type === 'redo-transformed-drawables') && action.action) {
                restoreStrokeTransform(action.action, 'after');
                stack.push(action.action);
                redoStacks.set(currentPage, stack);
                forwardRedoStacks.set(currentPage, forwardStack);
                selectedStrokeIds = action.action.items.map((item) => item.id).filter(Boolean);
                drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
                drawingSelectionRotationAngle = 0;
            } else if (action.type === 'redo-erased-geometry' && action.action) {
                for (const item of action.action.items) {
                    const idx = model.elements.findIndex((element) => element.id === item.id);
                    if (idx >= 0) {
                        model.elements.splice(idx, 1);
                    }
                    const insertAt = Math.max(0, Math.min(item.beforeIndex, model.elements.length));
                    item.after.forEach((afterElement, offset) => {
                        model.elements.splice(insertAt + offset, 0, cloneErasableElement(afterElement));
                    });
                }
                stack.push(action.action);
                redoStacks.set(currentPage, stack);
                forwardRedoStacks.set(currentPage, forwardStack);
                selectedStrokeIds = action.action.items.flatMap((item) => item.after.map((element) => element.id)).filter(Boolean);
                drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
            } else {
                forwardRedoStacks.set(currentPage, forwardStack);
                updateUndoButton();
                return;
            }

            dirtyPages.add(currentPage);
            hasUnsavedChanges = true;
            await renderCurrentPage();
            renderDrawingSelection();
            await bakeAndSnapshotCurrentPage(model);
            renderDrawingSelection();
            updateUndoButton();
            scheduleSessionSave();
        }

        async function showPage(pageNumber) {
            currentPage = Math.max(1, pageNumber);
            selectedTextId = '';
            selectedTableId = '';
            clearDrawingSelection();
            await renderCurrentPage();
            drawGuides();
            updatePageControl();
            updateUndoButton();
            setTool('pen');
            scheduleSessionSave();
        }

        async function goToPage(pageNumber) {
            const targetPage = Math.max(1, pageNumber);
            if (pageTransitioning || targetPage === currentPage) {
                return;
            }

            pageTransitioning = true;
            const direction = targetPage > currentPage ? 1 : -1;
            try {
                if (document.activeElement && typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
                rememberCurrentPage();
                await renderCurrentPage();
                drawGuides();
                const fromSnapshot = await captureWorkspaceSnapshot();
                document.body.classList.add('workspace-slide-hidden');
                await showPage(targetPage);
                const toSnapshot = await captureWorkspaceSnapshot();
                await playPageSlideTransition(fromSnapshot, toSnapshot, direction);
            } catch (error) {
                await showPage(targetPage);
            } finally {
                document.body.classList.remove('workspace-slide-hidden');
                pageTransitioning = false;
            }
        }

        function shiftPageMapKeysDown(map, deletedPage) {
            const shifted = [...map.entries()]
                .filter(([page]) => page > deletedPage)
                .sort((a, b) => a[0] - b[0]);
            for (const [page] of shifted) {
                map.delete(page);
            }
            for (const [page, value] of shifted) {
                map.set(page - 1, value);
            }
        }

        function shiftPageSetKeysDown(set, deletedPage) {
            const shifted = [...set].filter((page) => page > deletedPage).sort((a, b) => a - b);
            for (const page of shifted) {
                set.delete(page);
            }
            for (const page of shifted) {
                set.add(page - 1);
            }
        }

        async function deleteCurrentPage() {
            const deletedPage = currentPage;
            const deletedModel = pageModels.get(deletedPage);
            if (deletedModel && deletedModel.sourcePdf) {
                unlockPdfPageOnServer(deletedModel.sourcePdf.pdfId, deletedModel.sourcePdf.pageIndex);
            }
            pages.delete(deletedPage);
            pageImageSizes.delete(deletedPage);
            pageModels.delete(deletedPage);
            redoStacks.delete(deletedPage);
            forwardRedoStacks.delete(deletedPage);
            dirtyPages.delete(deletedPage);

            // Close the gap left by the deleted page so later pages renumber down by one.
            shiftPageMapKeysDown(pages, deletedPage);
            shiftPageMapKeysDown(pageImageSizes, deletedPage);
            shiftPageMapKeysDown(pageModels, deletedPage);
            shiftPageMapKeysDown(redoStacks, deletedPage);
            shiftPageMapKeysDown(forwardRedoStacks, deletedPage);
            shiftPageSetKeysDown(dirtyPages, deletedPage);

            let newHighest = 1;
            for (const key of pageModels.keys()) newHighest = Math.max(newHighest, key);
            for (const key of pages.keys()) newHighest = Math.max(newHighest, key);
            if (currentPage > newHighest) {
                currentPage = newHighest;
            }

            selectedTextId = '';
            selectedTableId = '';
            clearDrawingSelection();
            textLayer.innerHTML = '';
            await renderCurrentPage();
            drawGuides();
            updatePageControl();
            updateUndoButton();
            markUnsaved(false);
            closeModals();
            scheduleSessionSave();
        }

        function askDeleteCurrentPage() {
            document.getElementById('deletePageText').textContent = `Are you sure you want to delete page ${currentPage}?`;
            openModal('deletePageModal');
        }

        function setCurrentFile(filename) {
            currentFilename = filename || '';
            document.title = `Notelevel - ${filename ? displayName(filename) : 'untitled'}`;
            if (!filename) {
                currentFileBadge.textContent = 'untitled';
                currentFileBadge.classList.add('is-visible');
                scheduleSessionSave();
                return;
            }

            currentFileBadge.textContent = displayName(filename);
            currentFileBadge.classList.add('is-visible');
            scheduleSessionSave();
        }

        function normalizeGuideMode(mode) {
            // 'lined' is the REST autosave vocabulary (see mapGuideModeForRest()
            // below and DocumentController's validation) — documents saved via
            // that path store guide_mode as 'lined', not 'ruled'. Without this
            // alias, reopening such a document always fell back to 'none'
            // (blank paper) regardless of what guide mode was actually saved.
            if (mode === 'dictation' || mode === 'lined') {
                return 'ruled';
            }

            return ['none', 'ruled', 'grid'].includes(mode) ? mode : 'none';
        }

        function guideModeLabel(mode) {
            if (mode === 'grid') {
                return 'Squared guide lines selected.';
            }
            if (mode === 'ruled') {
                return 'Ruled guide lines selected.';
            }
            return 'Blank paper selected.';
        }

        function currentPaperMetadata() {
            return {
                guideMode: normalizeGuideMode(guideMode),
                guidesVisible
            };
        }

        function applyPaperMetadata(metadata = {}) {
            const mode = normalizeGuideMode(metadata.guideMode || 'none');
            guideMode = mode;
            guidesVisible = Boolean(metadata.guidesVisible) && mode !== 'none';
            if (guideToggle) {
                guideToggle.checked = guidesVisible;
            }
            setPaperTab(mode);
            const guideModeText = document.getElementById('guideModeText');
            if (guideModeText) {
                guideModeText.textContent = guideModeLabel(mode);
            }
            drawGuides();
        }

        let canvasInsetLeft = 0;
        let canvasInsetTop = 0;

        function updateCanvasInset() {
            const toolbarRect = toolbar.getBoundingClientRect();
            const isMobileToolbar = window.innerWidth <= 560;
            if (isMobileToolbar) {
                canvasInsetLeft = 0;
                canvasInsetTop = Math.max(0, Math.round(toolbarRect.bottom + 20));
            } else {
                canvasInsetLeft = Math.max(0, Math.round(toolbarRect.right + 20));
                canvasInsetTop = 0;
            }
            document.documentElement.style.setProperty('--canvas-left', `${canvasInsetLeft}px`);
            document.documentElement.style.setProperty('--canvas-top', `${canvasInsetTop}px`);
        }

        const canvasInsetRight = 0;

        function cssSize() {
            const viewport = window.visualViewport;
            const totalWidth = Math.max(1, Math.round(viewport ? viewport.width : window.innerWidth));
            const totalHeight = Math.max(1, Math.round(viewport ? viewport.height : window.innerHeight));
            return {
                width: Math.max(1, totalWidth - canvasInsetLeft - canvasInsetRight),
                height: Math.max(1, totalHeight - canvasInsetTop)
            };
        }

        function resizeCanvas() {
            const ratio = Math.max(1, window.devicePixelRatio || 1);
            const size = cssSize();
            currentRatio = ratio;
            canvas.width = Math.round(size.width * ratio);
            canvas.height = Math.round(size.height * ratio);
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            renderCurrentPage().catch((error) => console.error(error));
        }

        function resizeGuideCanvas() {
            const ratio = Math.max(1, window.devicePixelRatio || 1);
            const size = cssSize();
            guideCanvas.width = Math.round(size.width * ratio);
            guideCanvas.height = Math.round(size.height * ratio);
            guideCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
            drawGuides();
        }

        function drawGuides() {
            const size = cssSize();
            guideCtx.clearRect(0, 0, size.width, size.height);
            if (!guidesVisible || guideMode === 'none') {
                drawPageBoundary();
                return;
            }

            guideCtx.save();
            guideCtx.strokeStyle = 'rgba(59, 130, 246, 0.14)';
            guideCtx.lineWidth = 1;

            if (guideMode === 'ruled') {
                for (let y = 42.5; y < size.height; y += 34) {
                    guideCtx.beginPath();
                    guideCtx.moveTo(0, y);
                    guideCtx.lineTo(size.width, y);
                    guideCtx.stroke();
                }
            }

            if (guideMode === 'grid') {
                for (let x = 0.5; x < size.width; x += 28) {
                    guideCtx.beginPath();
                    guideCtx.moveTo(x, 0);
                    guideCtx.lineTo(x, size.height);
                    guideCtx.stroke();
                }
                for (let y = 0.5; y < size.height; y += 28) {
                    guideCtx.beginPath();
                    guideCtx.moveTo(0, y);
                    guideCtx.lineTo(size.width, y);
                    guideCtx.stroke();
                }
            }

            guideCtx.restore();
            drawPageBoundary();
        }

        function scheduleResizeCanvas() {
            if (isFrameDragActive()) {
                deferredViewportResize = true;
                return;
            }
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resizeAllCanvases, 80);
        }

        function resizeAllCanvases() {
            if (isFrameDragActive()) {
                deferredViewportResize = true;
                return;
            }
            updateToolbarOverflow();
            updateOrientationOverlay();
            updateCanvasInset();
            if (isLandscapeBlocked) {
                return;
            }
            if (isTextEditing()) {
                return;
            }
            resizeCanvas();
            resizeGuideCanvas();
        }

        function isTouchViewport() {
            return navigator.maxTouchPoints > 0;
        }

        function isLandscapeViewport() {
            return window.innerWidth > window.innerHeight;
        }

        function isMobileLandscapeViewport() {
            const shortestSide = Math.min(window.innerWidth, window.innerHeight);
            return isTouchViewport() && isLandscapeViewport() && shortestSide < 600;
        }

        function updateOrientationOverlay() {
            isLandscapeBlocked = isMobileLandscapeViewport();
            orientationOverlay.classList.toggle('is-visible', isLandscapeBlocked);
            orientationOverlay.setAttribute('aria-hidden', isLandscapeBlocked ? 'false' : 'true');
            if (isLandscapeBlocked) {
                drawing = false;
                tableSelecting = false;
                textSelecting = false;
                textSelectionMode = false;
                textDragMode = '';
                tableDragMode = '';
                textDragPointerId = null;
                tableDragPointerId = null;
                textDragStart = null;
                tableDragStart = null;
                textDragPending = false;
                tableDragPending = false;
                textDragStartClient = null;
                tableDragStartClient = null;
                textDragOriginalBounds = null;
                tableDragOriginalBounds = null;
                textDragOriginalDisplay = null;
                tableDragOriginalDisplay = null;
                textDragLastDelta = null;
                tableDragLastDelta = null;
                deferredViewportResize = false;
                virtualKeyboardTarget = null;
                virtualKeyboard.classList.remove('is-visible');
                virtualKeyboard.setAttribute('aria-hidden', 'true');
                resetWorkspaceOffset();
                lastPoint = null;
                hideSelectionRect();
                hideBrushCursor();
            }
        }

        function requestPortraitLock() {
            if (!isMobileLandscapeViewport()) {
                return;
            }
            if (!screen.orientation || typeof screen.orientation.lock !== 'function') {
                return;
            }

            screen.orientation.lock('portrait').catch(() => {});
        }

        function pointFromEvent(event) {
            return { x: event.clientX - canvasInsetLeft, y: event.clientY - canvasInsetTop };
        }

        function normalizeInputMode(mode) {
            return ['auto', 'stylus', 'finger', 'mouse'].includes(mode) ? mode : 'auto';
        }

        function inputModeName(mode) {
            return {
                auto: 'Auto',
                stylus: 'Stylus',
                finger: 'Finger',
                mouse: 'Mouse'
            }[normalizeInputMode(mode)];
        }

        function effectiveInputMode(event) {
            const mode = normalizeInputMode(inputMode);
            if (mode !== 'auto') {
                return mode;
            }

            if (event.pointerType === 'pen') {
                return 'stylus';
            }
            if (event.pointerType === 'touch') {
                return 'finger';
            }

            return 'mouse';
        }

        function isPenBarrelButtonHeld(event) {
            return event.pointerType === 'pen' && Boolean(event.buttons & 2 || event.buttons & 32);
        }

        function isPalmRejectionCandidate(event) {
            if (event.pointerType !== 'touch') {
                return false;
            }
            return activePenPointerId !== null || (Date.now() - lastPenActivityAt) < 500;
        }

        function normalizedPressure(event) {
            if (effectiveInputMode(event) !== 'stylus') {
                return 1;
            }

            const pressure = Number(event.pressure);
            if (!Number.isFinite(pressure) || pressure <= 0) {
                return 1;
            }

            return Math.max(0.35, Math.min(1.65, pressure * 1.35));
        }

        function smoothPoint(from, to, event) {
            if (effectiveInputMode(event) !== 'finger') {
                return to;
            }

            return {
                x: from.x + (to.x - from.x) * 0.72,
                y: from.y + (to.y - from.y) * 0.72
            };
        }

        function setInputMode(mode) {
            inputMode = normalizeInputMode(mode);
            localStorage.setItem('fixbly.inputMode', inputMode);
            if (inputModeLabel) {
                inputModeLabel.textContent = inputModeName(inputMode);
            }
            document.querySelectorAll('[data-input-mode]').forEach((button) => {
                button.classList.toggle('is-active', button.dataset.inputMode === inputMode);
            });
        }

        function drawLine(from, to, event) {
            const model = currentPageModel();
            const smoothedTo = smoothPoint(from, to, event);
            const pressure = normalizedPressure(event);
            const nextPoint = { x: smoothedTo.x, y: smoothedTo.y, pressure };

            if (!currentStroke) {
                const settings = toolSettings[activeTool === 'eraser' ? 'eraser' : 'pen'];
                if (activeTool !== 'eraser') {
                    rememberColour(colorInput.value);
                }
                currentStroke = {
                    type: 'stroke',
                    id: createElementId(),
                    tool: activeTool,
                    color: colorInput.value,
                    tip: settings.tip,
                    hardness: settings.hardness,
                    opacity: settings.opacity,
                    size: settings.size,
                    points: [{ x: from.x, y: from.y, pressure }]
                };
                model.elements.push(currentStroke);
                clearRedoForCurrentPage();
            }

            currentStroke.points.push(nextPoint);
            drawPageSegment(from, nextPoint, currentStroke, model);
            markUnsaved();
            updateUndoButton();
            return nextPoint;
        }

        function brushDiameter() {
            return currentToolSize();
        }

        function currentToolSize() {
            return toolSettings[activeTool === 'eraser' ? 'eraser' : 'pen'].size;
        }

        function setCurrentToolSize(size) {
            const tool = activeTool === 'eraser' ? 'eraser' : 'pen';
            toolSettings[tool].size = normalizeSize(size, toolSettings[tool].size, tool === 'eraser' ? 56 : 36);
            saveToolSettings();
        }

        function shouldShowBrushCursor(event) {
            return effectiveInputMode(event) === 'mouse';
        }

        function updateBrushCursor(event) {
            if (activeTool === 'table' || activeTool === 'text' || activeTool === 'select') {
                hideBrushCursor();
                return;
            }

            if (!shouldShowBrushCursor(event)) {
                hideBrushCursor();
                return;
            }

            const diameter = Math.max(4, brushDiameter());
            brushCursor.style.width = `${diameter}px`;
            brushCursor.style.height = `${diameter}px`;
            brushCursor.style.left = `${event.clientX}px`;
            brushCursor.style.top = `${event.clientY}px`;
            brushCursor.classList.toggle('is-eraser', activeTool === 'eraser');
            brushCursor.classList.add('is-visible');
        }

        function hideBrushCursor() {
            brushCursor.classList.remove('is-visible');
        }

        function canvasBackgroundFill(targetCtx, width, height) {
            const gradient = targetCtx.createLinearGradient(0, height, width, 0);
            gradient.addColorStop(0, canvasBackgroundColor);
            gradient.addColorStop(0.68, '#f6f7f8');
            gradient.addColorStop(1, canvasBackgroundHighlightColor);
            return gradient;
        }

        function clearCanvas() {
            const size = cssSize();
            ctx.fillStyle = canvasBackgroundFill(ctx, size.width, size.height);
            ctx.fillRect(0, 0, size.width, size.height);
        }

        // --- Real geometric erasing --------------------------------------------------------
        // The eraser no longer paints background-colored ink over strokes; it removes/splits
        // the underlying points of freehand strokes directly. Smart-shape (clever object)
        // erasing is added in later phases; for now the eraser simply has no effect on them.

        function eraserRadiusInPageUnits() {
            const settings = toolSettings.eraser || {};
            const size = Math.max(1, Number(settings.size) || 56);
            const tip = normalizeTip(settings.tip);
            return Math.max(0.5, (size * strokeTipScale(tip)) / 2);
        }

        function distancePointToSegment(point, a, b) {
            const abx = b.x - a.x;
            const aby = b.y - a.y;
            const lengthSquared = abx * abx + aby * aby;
            if (lengthSquared <= 1e-9) {
                return distanceBetweenPoints(point, a);
            }
            let t = ((point.x - a.x) * abx + (point.y - a.y) * aby) / lengthSquared;
            t = Math.max(0, Math.min(1, t));
            const closest = { x: a.x + abx * t, y: a.y + aby * t };
            return distanceBetweenPoints(point, closest);
        }

        // Tracks, for the current eraser drag gesture (pointerdown -> pointerup), the original
        // "before" state of every stroke touched, plus the set of element ids that currently
        // represent it (a stroke may be trimmed in place, split into two, or removed entirely
        // as the drag continues). This lets finishEraseGesture() push exactly ONE undo entry
        // per gesture instead of flooding the undo stack per pointermove segment.
        let eraseGestureRoots = null;

        // Generic deep clone for erasable elements (stroke or smart-shape) -- both are plain
        // JSON-safe data, so this works for whichever type is being tracked by the gesture.
        function cloneErasableElement(element) {
            return JSON.parse(JSON.stringify(element));
        }

        function beginEraseGesture() {
            eraseGestureRoots = new Map();
        }

        function findEraseRootForId(id) {
            if (!eraseGestureRoots) {
                return null;
            }
            if (eraseGestureRoots.has(id)) {
                return eraseGestureRoots.get(id);
            }
            for (const root of eraseGestureRoots.values()) {
                if (root.liveIds.has(id)) {
                    return root;
                }
            }
            return null;
        }

        function trackErasedElementBefore(element, index) {
            if (!eraseGestureRoots || findEraseRootForId(element.id)) {
                return;
            }
            eraseGestureRoots.set(element.id, {
                before: cloneErasableElement(element),
                beforeIndex: index,
                liveIds: new Set([element.id])
            });
        }

        function registerErasedFragmentAdded(originalId, newId) {
            const root = findEraseRootForId(originalId);
            if (root) {
                root.liveIds.add(newId);
            }
        }

        function registerErasedFragmentRemoved(id) {
            const root = findEraseRootForId(id);
            if (root) {
                root.liveIds.delete(id);
            }
        }

        function finishEraseGesture() {
            if (!eraseGestureRoots || eraseGestureRoots.size === 0) {
                eraseGestureRoots = null;
                return;
            }
            const model = currentPageModel();
            const items = [];
            for (const [rootId, root] of eraseGestureRoots) {
                const liveElements = [...root.liveIds]
                    .map((id) => model.elements.find((element) => element.id === id))
                    .filter(Boolean)
                    .map((element) => cloneErasableElement(element));
                const unchanged = liveElements.length === 1
                    && liveElements[0].id === rootId
                    && JSON.stringify(liveElements[0]) === JSON.stringify(root.before);
                if (unchanged) {
                    continue;
                }
                items.push({
                    id: rootId,
                    before: root.before,
                    beforeIndex: root.beforeIndex,
                    after: liveElements
                });
            }
            eraseGestureRoots = null;
            if (items.length === 0) {
                return;
            }
            const stack = redoStacks.get(currentPage) || [];
            stack.push({ type: 'erased-geometry', items });
            redoStacks.set(currentPage, stack);
            forwardRedoStacks.delete(currentPage);
        }

        // Erases the portion of a freehand stroke covered by the eraser swath [from,to] (with
        // given radius, in page units). Mutates model.elements in place: trims the stroke's
        // points[] from either end, splits it into two sibling elements if the erased span is
        // in the middle, or removes the element entirely if nothing survives. Returns true if
        // anything changed.
        function erasePointsFromStroke(model, element, from, to, radius) {
            const points = element.points;
            if (!Array.isArray(points) || points.length === 0) {
                return false;
            }

            let minHit = -1;
            let maxHit = -1;
            for (let i = 0; i < points.length; i += 1) {
                if (distancePointToSegment(points[i], from, to) <= radius) {
                    if (minHit === -1) {
                        minHit = i;
                    }
                    maxHit = i;
                }
            }
            if (minHit === -1) {
                return false;
            }

            const index = model.elements.indexOf(element);
            trackErasedElementBefore(element, index >= 0 ? index : model.elements.length);

            const removeElement = () => {
                registerErasedFragmentRemoved(element.id);
                const currentIndex = model.elements.indexOf(element);
                if (currentIndex >= 0) {
                    model.elements.splice(currentIndex, 1);
                }
                if (selectedStrokeIds.includes(element.id)) {
                    selectedStrokeIds = selectedStrokeIds.filter((id) => id !== element.id);
                }
            };

            if (minHit === 0 && maxHit === points.length - 1) {
                removeElement();
                return true;
            }

            const prefix = points.slice(0, minHit);
            const suffix = points.slice(maxHit + 1);

            if (prefix.length >= 2 && suffix.length >= 2) {
                element.points = prefix;
                element.bounds = normalizePageBounds(calculateStrokeBounds(prefix) || element.bounds);
                const fragment = { ...element, id: createElementId(), points: suffix };
                fragment.bounds = normalizePageBounds(calculateStrokeBounds(suffix) || fragment.bounds);
                const currentIndex = model.elements.indexOf(element);
                if (currentIndex >= 0) {
                    model.elements.splice(currentIndex + 1, 0, fragment);
                } else {
                    model.elements.push(fragment);
                }
                registerErasedFragmentAdded(element.id, fragment.id);
            } else if (prefix.length >= 2) {
                element.points = prefix;
            } else if (suffix.length >= 2) {
                element.points = suffix;
            } else {
                removeElement();
            }
            return true;
        }

        // Finds every element under the eraser swath [from,to] and erases the covered portion.
        // Broad-phase filtered by bounding-box overlap before exact hit-testing (perf).
        function applyEraseSegment(from, to, radius, model) {
            const swathMinX = Math.min(from.x, to.x) - radius;
            const swathMaxX = Math.max(from.x, to.x) + radius;
            const swathMinY = Math.min(from.y, to.y) - radius;
            const swathMaxY = Math.max(from.y, to.y) + radius;
            const swathBbox = {
                x: swathMinX,
                y: swathMinY,
                width: Math.max(1, swathMaxX - swathMinX),
                height: Math.max(1, swathMaxY - swathMinY)
            };

            let changed = false;
            const candidates = model.elements
                .slice()
                .filter((element) => rectsIntersect(drawableBounds(element), swathBbox));
            for (const element of candidates) {
                if (element.type === 'stroke' && element.tool !== 'eraser') {
                    if (erasePointsFromStroke(model, element, from, to, radius)) {
                        changed = true;
                    }
                } else if (element.type === 'smart-shape') {
                    if (eraseSmartShapeSegment(model, element, from, to, radius)) {
                        changed = true;
                    }
                }
            }
            return changed;
        }

        // Computes the remaining-segments result of erasing the swath [from,to] out of a
        // line/arrow smart-shape's `from -> to` vector, in that shape's own local [0,1]
        // fraction space. Returns null if the swath doesn't actually touch the line (so callers
        // can tell "no hit" apart from "hit, but no change").
        function computeLineEraseResult(element, from, to, radius) {
            const a = element.from;
            const b = element.to;
            if (!a || !b) {
                return null;
            }
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const lengthSquared = dx * dx + dy * dy;
            if (lengthSquared <= 1e-6) {
                return null;
            }
            const length = Math.sqrt(lengthSquared);

            const projectAndCheck = (point) => {
                const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared;
                const clampedT = Math.max(0, Math.min(1, t));
                const closest = { x: a.x + dx * clampedT, y: a.y + dy * clampedT };
                return { t: clampedT, dist: distanceBetweenPoints(point, closest) };
            };

            const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
            const samples = [projectAndCheck(from), projectAndCheck(to), projectAndCheck(mid)];
            const hits = samples.filter((sample) => sample.dist <= radius);
            if (hits.length === 0) {
                return null;
            }

            const tMin = Math.max(0, Math.min(...hits.map((hit) => hit.t)) - radius / length);
            const tMax = Math.min(1, Math.max(...hits.map((hit) => hit.t)) + radius / length);
            if (tMax <= tMin) {
                return null;
            }

            const before = Array.isArray(element.segments) ? element.segments : [{ start: 0, end: 1 }];
            const result = mergeAndSubtractIntervals(before, [{ start: tMin, end: tMax }], 1);
            if (JSON.stringify(result.intervals) === JSON.stringify(before)) {
                return null;
            }
            return result;
        }

        // Dispatches real erasing for a smart-shape ("clever object") element under the eraser
        // swath. Mutates the SAME element (never a new id) and removes it from model.elements
        // entirely once coverage reaches 0%.
        function eraseSmartShapeSegment(model, element, from, to, radius) {
            let result = null;
            let field = null;
            if (element.shapeType === 'line' || element.shapeType === 'arrow') {
                field = 'segments';
                result = computeLineEraseResult(element, from, to, radius);
            } else if (element.shapeType === 'circle' || element.shapeType === 'ellipse') {
                field = 'arcs';
                result = computeEllipseEraseResult(element, from, to, radius);
            } else if (element.shapeType === 'rectangle') {
                field = 'segments';
                result = computeRectangleEraseResult(element, from, to, radius);
            } else if (element.shapeType === 'triangle' || element.shapeType === 'rhombus') {
                field = 'segments';
                result = computePolygonEraseResult(element, from, to, radius);
            }
            if (!result) {
                return false;
            }

            const index = model.elements.indexOf(element);
            trackErasedElementBefore(element, index >= 0 ? index : model.elements.length);

            element[field] = result.intervals;
            element.integrity = {
                altered: true,
                coveragePercent: result.coveragePercent,
                originalShapeType: (element.integrity && element.integrity.originalShapeType) || element.shapeType
            };

            if (result.coveragePercent <= 0) {
                registerErasedFragmentRemoved(element.id);
                const currentIndex = model.elements.indexOf(element);
                if (currentIndex >= 0) {
                    model.elements.splice(currentIndex, 1);
                }
                if (selectedStrokeIds.includes(element.id)) {
                    selectedStrokeIds = selectedStrokeIds.filter((id) => id !== element.id);
                }
            }
            return true;
        }

        // Computes the remaining-arcs result of erasing the swath [from,to] out of a
        // circle/ellipse's outline, in that shape's own local pre-rotation angle space
        // (radians, matching the ctx.ellipse(...,startAngle,endAngle) parametrization). A
        // sampled point only counts as a "hit" if it's near the actual curve, not merely
        // inside the ellipse's interior -- erasing removes drawn outline, not filled area.
        function computeEllipseEraseResult(element, from, to, radius) {
            const cx = Number(element.cx) || 0;
            const cy = Number(element.cy) || 0;
            const rx = Math.max(1, Number(element.rx) || 1);
            const ry = Math.max(1, Number(element.ry) || 1);
            const rotation = Number(element.rotation) || 0;
            const center = { x: cx, y: cy };
            const cosInv = Math.cos(-rotation);
            const sinInv = Math.sin(-rotation);
            const cosFwd = Math.cos(rotation);
            const sinFwd = Math.sin(rotation);

            const angleAndDistanceFor = (point) => {
                const local = rotatePointAround(point, center, cosInv, sinInv);
                // atan2 naturally returns (-pi, pi]; deliberately NOT normalized into [0, 2*pi)
                // here, because doing so would introduce a false discontinuity at angle 0 that
                // breaks min/max clustering below whenever an erase happens to straddle it.
                const angle = Math.atan2((local.y - cy) / ry, (local.x - cx) / rx);
                const curveLocal = { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
                const curvePoint = rotatePointAround(curveLocal, center, cosFwd, sinFwd);
                return { angle, dist: distanceBetweenPoints(point, curvePoint) };
            };

            const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
            const hits = [angleAndDistanceFor(from), angleAndDistanceFor(to), angleAndDistanceFor(mid)]
                .filter((sample) => sample.dist <= radius);
            if (hits.length === 0) {
                return null;
            }

            // Unwrap every hit angle relative to the first one so a swath that straddles the
            // +-pi (or 0/2*pi) seam still produces one small contiguous range instead of a
            // false near-full-circle span. mergeAndSubtractIntervals handles out-of-[0,2*pi)
            // values fine since it takes the erased range through modulo-based wraparound.
            const reference = hits[0].angle;
            const unwrapped = hits.map((hit) => {
                let delta = hit.angle - reference;
                delta -= Math.PI * 2 * Math.round(delta / (Math.PI * 2));
                return reference + delta;
            });

            const avgRadius = (rx + ry) / 2;
            const angularPad = Math.max(0.02, radius / Math.max(1, avgRadius));
            const angleMin = Math.min(...unwrapped) - angularPad;
            const angleMax = Math.max(...unwrapped) + angularPad;
            if (angleMax <= angleMin) {
                return null;
            }

            const before = Array.isArray(element.arcs) ? element.arcs : [{ start: 0, end: Math.PI * 2 }];
            const result = mergeAndSubtractIntervals(before, [{ start: angleMin, end: angleMax }], Math.PI * 2);
            if (JSON.stringify(result.intervals) === JSON.stringify(before)) {
                return null;
            }
            return result;
        }

        // Maps a fraction t in [0,1) to a point along a rounded rectangle's perimeter (in the
        // same LOCAL/unrotated bounds space as element.bounds), walking clockwise starting just
        // after the top-left corner. Corners are approximated as true quarter-circles (not the
        // exact quadraticCurveTo shape drawRoundedRect uses) -- an acceptable approximation for
        // a note-taking app's eraser, and it's the SAME function used by both hit-testing and
        // rendering so the two can never disagree with each other.
        function rectPerimeterPointAtFraction(x, y, width, height, radius, t) {
            const r = Math.max(0, Math.min(radius, width / 2, height / 2));
            const straightX = Math.max(0, width - 2 * r);
            const straightY = Math.max(0, height - 2 * r);
            const cornerLen = (Math.PI / 2) * r;
            const total = straightX * 2 + straightY * 2 + cornerLen * 4;
            if (total <= 0) {
                return { x, y };
            }
            let dist = (((t % 1) + 1) % 1) * total;

            if (dist <= straightX) {
                return { x: x + r + dist, y };
            }
            dist -= straightX;
            if (dist <= cornerLen) {
                const angle = -Math.PI / 2 + (dist / cornerLen) * (Math.PI / 2);
                return { x: x + width - r + r * Math.cos(angle), y: y + r + r * Math.sin(angle) };
            }
            dist -= cornerLen;
            if (dist <= straightY) {
                return { x: x + width, y: y + r + dist };
            }
            dist -= straightY;
            if (dist <= cornerLen) {
                const angle = 0 + (dist / cornerLen) * (Math.PI / 2);
                return { x: x + width - r + r * Math.cos(angle), y: y + height - r + r * Math.sin(angle) };
            }
            dist -= cornerLen;
            if (dist <= straightX) {
                return { x: x + width - r - dist, y: y + height };
            }
            dist -= straightX;
            if (dist <= cornerLen) {
                const angle = Math.PI / 2 + (dist / cornerLen) * (Math.PI / 2);
                return { x: x + r + r * Math.cos(angle), y: y + height - r + r * Math.sin(angle) };
            }
            dist -= cornerLen;
            if (dist <= straightY) {
                return { x, y: y + height - r - dist };
            }
            dist -= straightY;
            const angle = Math.PI + (dist / cornerLen) * (Math.PI / 2);
            return { x: x + r + r * Math.cos(angle), y: y + r + r * Math.sin(angle) };
        }

        // Maps a fraction t in [0,1) to a point along a polygon's (triangle/rhombus) perimeter,
        // walking through element.points in order. Shared by hit-testing and rendering.
        function polygonPerimeterPointAtFraction(points, t) {
            const n = points.length;
            const edgeLengths = points.map((point, i) => distanceBetweenPoints(point, points[(i + 1) % n]));
            const total = edgeLengths.reduce((sum, len) => sum + len, 0);
            if (total <= 0) {
                return { x: points[0].x, y: points[0].y };
            }
            let dist = (((t % 1) + 1) % 1) * total;
            for (let i = 0; i < n; i += 1) {
                if (dist <= edgeLengths[i]) {
                    const a = points[i];
                    const b = points[(i + 1) % n];
                    const frac = edgeLengths[i] > 0 ? dist / edgeLengths[i] : 0;
                    return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
                }
                dist -= edgeLengths[i];
            }
            return { x: points[0].x, y: points[0].y };
        }

        // Shared perimeter-sampling erase computation: scans `sampleCount` points around the
        // whole [0,1) perimeter loop (via the given pointAtFraction function), finds which ones
        // fall under the eraser swath, clusters hits into contiguous (circularly-aware) runs so
        // one erase touching multiple separate points of the perimeter at once is handled
        // correctly, then subtracts the padded runs from the shape's remaining segments.
        function computePerimeterEraseResult(pointAtFraction, before, from, to, radius, sampleCount) {
            const hitFractions = [];
            for (let i = 0; i < sampleCount; i += 1) {
                const t = i / sampleCount;
                const point = pointAtFraction(t);
                if (distancePointToSegment(point, from, to) <= radius) {
                    hitFractions.push(t);
                }
            }
            if (hitFractions.length === 0) {
                return null;
            }

            const gapThreshold = 1.5 / sampleCount;
            const erasedRanges = [];
            let rangeStart = hitFractions[0];
            let rangeEnd = hitFractions[0];
            for (let i = 1; i < hitFractions.length; i += 1) {
                if (hitFractions[i] - rangeEnd <= gapThreshold) {
                    rangeEnd = hitFractions[i];
                } else {
                    erasedRanges.push({ start: rangeStart, end: rangeEnd });
                    rangeStart = hitFractions[i];
                    rangeEnd = hitFractions[i];
                }
            }
            erasedRanges.push({ start: rangeStart, end: rangeEnd });
            if (erasedRanges.length > 1) {
                const first = erasedRanges[0];
                const last = erasedRanges[erasedRanges.length - 1];
                if (first.start <= gapThreshold && (1 - last.end) <= gapThreshold) {
                    erasedRanges.pop();
                    erasedRanges[0] = { start: last.start - 1, end: first.end };
                }
            }

            const pad = 1 / sampleCount;
            const paddedRanges = erasedRanges.map((range) => ({ start: range.start - pad, end: range.end + pad }));
            const result = mergeAndSubtractIntervals(before, paddedRanges, 1);
            if (JSON.stringify(result.intervals) === JSON.stringify(before)) {
                return null;
            }
            return result;
        }

        const PERIMETER_ERASE_SAMPLE_COUNT = 240;

        function computeRectangleEraseResult(element, from, to, radius) {
            const bounds = element.bounds || {};
            const width = Math.max(1, Number(bounds.width) || 1);
            const height = Math.max(1, Number(bounds.height) || 1);
            const x = Number(bounds.x) || 0;
            const y = Number(bounds.y) || 0;
            const cornerRadius = Math.max(0, Number(element.radius) || 0);
            const rotation = Number(element.rotation) || 0;
            const center = { x: x + width / 2, y: y + height / 2 };

            const localFrom = rotation ? rotatePointAround(from, center, Math.cos(-rotation), Math.sin(-rotation)) : from;
            const localTo = rotation ? rotatePointAround(to, center, Math.cos(-rotation), Math.sin(-rotation)) : to;

            const pointAtFraction = (t) => rectPerimeterPointAtFraction(x, y, width, height, cornerRadius, t);
            const before = Array.isArray(element.segments) ? element.segments : [{ start: 0, end: 1 }];
            return computePerimeterEraseResult(pointAtFraction, before, localFrom, localTo, radius, PERIMETER_ERASE_SAMPLE_COUNT);
        }

        function computePolygonEraseResult(element, from, to, radius) {
            const points = Array.isArray(element.points) ? element.points : [];
            if (points.length < 3) {
                return null;
            }
            const pointAtFraction = (t) => polygonPerimeterPointAtFraction(points, t);
            const before = Array.isArray(element.segments) ? element.segments : [{ start: 0, end: 1 }];
            return computePerimeterEraseResult(pointAtFraction, before, from, to, radius, PERIMETER_ERASE_SAMPLE_COUNT);
        }

        function markUnsaved(pageDirty = true) {
            hasUnsavedChanges = true;
            if (pageDirty) {
                dirtyPages.add(currentPage);
            }
            scheduleSessionSave();
        }

        function clearCurrentDocumentState(options = {}) {
            const closeOpenModals = Boolean(options.closeModals);
            sessionRestoreInProgress = true;
            clearSavedSession();
            clearCanvas();
            pages = new Map();
            pageImageSizes = new Map();
            pageModels = new Map();
            pageModels.set(1, createPageModel());
            redoStacks = new Map();
            forwardRedoStacks = new Map();
            dirtyPages = new Set();
            currentStroke = null;
            aiCostTotalGbp = 0;
            aiCostLastGbp = 0;
            selectedTextId = '';
            selectedTableId = '';
            tableDefaults = defaultCellStyles();
            perfectShapeMode = false;
            textSelectionMode = false;
            textSelecting = false;
            textStart = null;
            textDragMode = '';
            textDragPointerId = null;
            textDragStart = null;
            tableDragMode = '';
            tableDragPointerId = null;
            tableDragStart = null;
            textDragOriginalBounds = null;
            textDragOriginalDisplay = null;
            textDragStartClient = null;
            tableDragStartClient = null;
            tableDragOriginalDisplay = null;
            tableDragOriginalBounds = null;
            textDragLastDelta = null;
            tableDragLastDelta = null;
            deferredViewportResize = false;
            virtualKeyboardTarget = null;
            virtualKeyboard.classList.remove('is-visible');
            virtualKeyboard.setAttribute('aria-hidden', 'true');
            resetWorkspaceOffset();
            textDragPending = false;
            tableDragPending = false;
            textLayer.innerHTML = '';
            currentPage = 1;
            updatePageControl();
            updateUndoButton();
            drawGuides();
            setTool('pen');
            setCurrentFile('');
            currentDocumentId = null;
            currentVersion = null;
            serverAutosaveBlocked = false;
            updateAiCostBadge();
            hasUnsavedChanges = false;
            if (closeOpenModals) {
                closeModals();
            }
            sessionRestoreInProgress = false;
            saveSessionNow({ includePages: false });
        }

        function resetToNewDrawing() {
            resetOptionsToDefaults();
            clearCurrentDocumentState({ closeModals: true });
        }

        function requestNewDrawing() {
            if (hasUnsavedChanges) {
                document.getElementById('newStatus').textContent = '';
                openModal('newModal');
                return;
            }

            resetToNewDrawing();
        }

        function openSaveBeforeNewFlow() {
            pendingNewAfterSave = true;
            if (currentFilename) {
                saveDrawing(true, { filename: currentFilename, newAfterSave: true });
                return;
            }
            document.getElementById('saveStatus').textContent = '';
            openModal('saveModal');
        }

        function openModal(id) {
            closeToolbarMenus();
            closeVirtualKeyboard();
            modals.forEach((modal) => modal.classList.toggle('is-open', modal.id === id));
            backdrop.classList.add('is-open');
        }

        function showSavingSpinner() {
            savingSpinnerStartedAt = Date.now();
            savingOverlay.classList.add('is-visible');
            savingOverlay.setAttribute('aria-hidden', 'false');
        }

        function hideSavingSpinner() {
            const elapsed = Date.now() - savingSpinnerStartedAt;
            const delay = Math.max(0, 1500 - elapsed);
            window.setTimeout(() => {
                savingOverlay.classList.remove('is-visible');
                savingOverlay.setAttribute('aria-hidden', 'true');
            }, delay);
        }

        function hideSavingSpinnerNow() {
            savingOverlay.classList.remove('is-visible');
            savingOverlay.setAttribute('aria-hidden', 'true');
        }

        function showDocumentLoadingSpinner() {
            documentLoadingOverlay.classList.add('is-visible');
            documentLoadingOverlay.setAttribute('aria-hidden', 'false');
        }

        function hideDocumentLoadingSpinner() {
            documentLoadingOverlay.classList.remove('is-visible');
            documentLoadingOverlay.setAttribute('aria-hidden', 'true');
        }

        function closeModals() {
            modals.forEach((modal) => modal.classList.remove('is-open'));
            backdrop.classList.remove('is-open');
            closeToolbarMenus();
            pendingOverwriteName = '';
            pendingDeleteName = '';
            pendingRenameName = '';
            pendingNewAfterSave = false;
        }

        function closeToolbarMenus() {
            toolbarMenus.forEach((menu) => {
                menu.classList.remove('is-open');
                menu.setAttribute('aria-hidden', 'true');
                menu.style.left = '';
                menu.style.top = '';
                menu.style.maxHeight = '';
                menu.style.visibility = '';
            });
            toolbarMenuButtons.forEach((button) => {
                button.setAttribute('aria-expanded', 'false');
                button.classList.remove('is-menu-active');
            });
            document.body.classList.remove('has-transient-toolbar-menu');
        }

        function toolbarOverflowClone(button) {
            const clone = button.cloneNode(true);
            clone.removeAttribute('id');
            clone.classList.remove('is-active', 'is-menu-active', 'is-toolbar-overflowed');
            clone.disabled = button.disabled;
            clone.setAttribute('aria-expanded', 'false');
            clone.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                button.click();
            });
            return clone;
        }

        function populatePendingActionsMenu(buttons) {
            pendingActionsMenu.innerHTML = '';
            buttons.forEach((button) => {
                pendingActionsMenu.appendChild(toolbarOverflowClone(button));
            });
        }

        function resetToolbarOverflow() {
            toolbarOverflowButtons.forEach((button) => {
                button.classList.remove('is-toolbar-overflowed');
                button.style.order = '';
            });
            pendingMoreBtn.classList.remove('is-toolbar-overflowed');
            pendingMoreBtn.style.display = '';
            pendingMoreBtn.style.order = '';
            pendingMoreBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('has-toolbar-overflow');
        }

        function updateToolbarOverflow() {
            if (!toolbar) {
                return;
            }

            resetToolbarOverflow();
            if (window.innerWidth <= 560 || window.innerWidth <= window.innerHeight) {
                populatePendingActionsMenu([selectBtn, settingsBtn].concat(pendingActionButtons));
                return;
            }

            const styles = window.getComputedStyle(toolbar);
            const gap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
            const itemSize = toolbarOverflowButtons[0] ? toolbarOverflowButtons[0].getBoundingClientRect().height : 58;
            const slotSize = itemSize + gap;
            const spacerHeight = toolbar.querySelector('.toolbar-spacer')?.getBoundingClientRect().height || 0;
            const availableHeight = toolbar.clientHeight - spacerHeight + gap;
            const slotCount = Math.max(0, Math.floor(availableHeight / Math.max(1, slotSize)));

            if (toolbarOverflowButtons.length <= slotCount) {
                populatePendingActionsMenu(pendingActionButtons);
                return;
            }

            const pendingMarginBottom = Number.parseFloat(window.getComputedStyle(pendingMoreBtn).marginBottom) || 0;
            const visibleCount = Math.max(0, Math.floor((toolbar.clientHeight - itemSize - pendingMarginBottom) / Math.max(1, slotSize)));
            const overflowedButtons = toolbarOverflowButtons.slice(visibleCount);
            toolbarOverflowButtons.forEach((button, index) => {
                button.style.order = `${index}`;
                button.classList.toggle('is-toolbar-overflowed', index >= visibleCount);
            });
            pendingMoreBtn.style.order = `${visibleCount}`;
            pendingMoreBtn.style.display = 'inline-grid';
            populatePendingActionsMenu(overflowedButtons);
            document.body.classList.add('has-toolbar-overflow');
        }

        function hasOpenToolbarMenu() {
            return toolbarMenus.some((menu) => menu.classList.contains('is-open'));
        }

        function viewportRect() {
            if (window.visualViewport) {
                return {
                    left: window.visualViewport.offsetLeft,
                    top: window.visualViewport.offsetTop,
                    width: window.visualViewport.width,
                    height: window.visualViewport.height
                };
            }

            return {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

        function positionToolbarMenu(button, menu) {
            const viewport = viewportRect();
            const edgeGap = 14;

            if (window.innerWidth <= 560) {
                menu.style.left = '';
                menu.style.top = '';
                menu.style.maxHeight = `${Math.max(160, viewport.height - 65 - edgeGap)}px`;
                return;
            }

            const buttonRect = button.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const menuWidth = menuRect.width || 340;
            const menuHeight = menuRect.height || 0;
            const minLeft = viewport.left + edgeGap;
            const minTop = viewport.top + edgeGap;
            const maxLeft = viewport.left + viewport.width - menuWidth - edgeGap;
            const maxTop = viewport.top + viewport.height - menuHeight - edgeGap;
            const preferredLeft = buttonRect.right + edgeGap;
            const fallbackLeft = buttonRect.left - menuWidth - edgeGap;
            const preferredTop = buttonRect.top + buttonRect.height / 2 - menuHeight / 2;
            const nextLeft = Math.min(
                Math.max(preferredLeft > maxLeft ? fallbackLeft : preferredLeft, minLeft),
                Math.max(minLeft, maxLeft)
            );
            const nextTop = Math.min(
                Math.max(preferredTop, minTop),
                Math.max(minTop, maxTop)
            );

            menu.style.left = `${nextLeft}px`;
            menu.style.top = `${nextTop}px`;
            menu.style.maxHeight = `${Math.max(160, viewport.height - edgeGap * 2)}px`;
        }

        function toggleToolbarMenu(button, menu, options = {}) {
            const shouldOpen = !menu.classList.contains('is-open');
            closeToolbarMenus();
            if (!shouldOpen) {
                return;
            }

            menu.classList.add('is-open');
            menu.style.visibility = 'hidden';
            positionToolbarMenu(button, menu);
            menu.style.visibility = '';
            menu.setAttribute('aria-hidden', 'false');
            button.setAttribute('aria-expanded', 'true');
            button.classList.add('is-menu-active');
            document.body.classList.toggle('has-transient-toolbar-menu', Boolean(options.transient));
        }

        function setTool(tool) {
            activeTool = tool;
            if (tool === 'pen' || tool === 'eraser') {
                lastDrawingTool = tool;
            }
            tableSelectionMode = false;
            tableSelecting = false;
            textSelectionMode = false;
            textSelecting = false;
            drawingSelectionMode = false;
            drawingSelecting = false;
            if (tool !== 'select') {
                clearDrawingSelection();
            }
            penBtn.classList.toggle('is-active', tool === 'pen');
            eraserBtn.classList.toggle('is-active', tool === 'eraser');
            selectBtn.classList.toggle('is-active', tool === 'select');
            insertBtn.classList.remove('is-active');
            syncInsertFrameToolStates();
            syncPerfectShapeControls();
            textLayer.classList.toggle('is-erasing', tool === 'eraser');
            canvas.style.cursor = tool === 'eraser' ? 'cell' : (tool === 'select' ? 'default' : 'crosshair');
            updateOptionPreviews();
            if (brushCursor.classList.contains('is-visible')) {
                brushCursor.classList.toggle('is-eraser', tool === 'eraser');
                const diameter = Math.max(4, brushDiameter());
                brushCursor.style.width = `${diameter}px`;
                brushCursor.style.height = `${diameter}px`;
            }
        }

        function syncInsertFrameToolStates() {
            const frameToolActive = ['text', 'table'].includes(activeTool) || Boolean(selectedTextId || selectedTableId);
            insertBtn.classList.toggle('is-active', frameToolActive);
            if (frameToolActive) {
                penBtn.classList.remove('is-active');
                eraserBtn.classList.remove('is-active');
            }
            textToolBtn.classList.remove('is-active');
            startTableBtn.classList.remove('is-active');
        }

        function setGuideMode(mode) {
            guideMode = normalizeGuideMode(mode);
            if (guideMode === 'none') {
                guidesVisible = false;
            } else {
                guidesVisible = true;
            }
            if (guideToggle) {
                guideToggle.checked = guidesVisible;
            }
            setPaperTab(guideMode);
            const guideModeText = document.getElementById('guideModeText');
            if (guideModeText) {
                guideModeText.textContent = guideModeLabel(guideMode);
            }
            drawGuides();
            markUnsaved(false);
        }

        function setGuidesVisible(visible) {
            guidesVisible = visible;
            if (visible && guideMode === 'none') {
                guideMode = 'ruled';
            }
            if (guideToggle) {
                guideToggle.checked = guidesVisible;
            }
            setPaperTab(guideMode);
            const guideModeText = document.getElementById('guideModeText');
            if (guideModeText) {
                guideModeText.textContent = guideModeLabel(guideMode);
            }
            drawGuides();
            markUnsaved(false);
        }

        function startTableSelection() {
            tableRows = Math.max(1, Math.min(60, Number(tableRowsInput.value) || 1));
            tableCols = Math.max(1, Math.min(60, Number(tableColsInput.value) || 1));
            tableRowsInput.value = tableRows;
            tableColsInput.value = tableCols;
            activeTool = 'table';
            tableSelectionMode = true;
            textSelectionMode = false;
            drawingSelectionMode = false;
            clearDrawingSelection();
            insertBtn.classList.add('is-active');
            penBtn.classList.remove('is-active');
            eraserBtn.classList.remove('is-active');
            selectBtn.classList.remove('is-active');
            syncInsertFrameToolStates();
            syncPerfectShapeControls();
            canvas.style.cursor = 'crosshair';
            hideBrushCursor();
            closeToolbarMenus();
            closeModals();
        }

        function startTextSelection() {
            activeTool = 'text';
            textSelectionMode = true;
            tableSelectionMode = false;
            drawingSelectionMode = false;
            clearDrawingSelection();
            insertBtn.classList.add('is-active');
            penBtn.classList.remove('is-active');
            eraserBtn.classList.remove('is-active');
            selectBtn.classList.remove('is-active');
            syncInsertFrameToolStates();
            syncPerfectShapeControls();
            canvas.style.cursor = 'text';
            hideBrushCursor();
            closeToolbarMenus();
            closeModals();
        }

        function startDrawingSelectionMode() {
            setTool('select');
            drawingSelectionMode = true;
            closeToolbarMenus();
            closeModals();
            hideBrushCursor();
        }

        function selectionBounds(from, to) {
            return {
                x: Math.min(from.x, to.x),
                y: Math.min(from.y, to.y),
                width: Math.abs(to.x - from.x),
                height: Math.abs(to.y - from.y)
            };
        }

        function selectionDisplayBounds(from, to) {
            const model = currentPageModel();
            const bounds = selectionBounds(from, to);
            const rect = pageDisplayRect(model);

            return {
                x: rect.x + bounds.x * rect.scale,
                y: rect.y + bounds.y * rect.scale,
                width: bounds.width * rect.scale,
                height: bounds.height * rect.scale
            };
        }

        function displayBoundsFromPageBounds(bounds, model = currentPageModel()) {
            const rect = pageDisplayRect(model);
            return {
                x: rect.x + bounds.x * rect.scale,
                y: rect.y + bounds.y * rect.scale,
                width: Math.max(1, bounds.width * rect.scale),
                height: Math.max(1, bounds.height * rect.scale)
            };
        }

        let pendingCustomColour = null;

        function commitPendingCustomColour() {
            if (pendingCustomColour) {
                rememberColour(pendingCustomColour);
                pendingCustomColour = null;
            }
        }

        function showSelectionRect(bounds, options = {}) {
            selectionRect.style.left = `${bounds.x}px`;
            selectionRect.style.top = `${bounds.y}px`;
            selectionRect.style.width = `${bounds.width}px`;
            selectionRect.style.height = `${bounds.height}px`;
            selectionRect.style.setProperty('--selection-rotate', `${Number(options.rotate || 0)}rad`);
            selectionRect.classList.add('is-visible');
        }

        function hideSelectionRect() {
            commitPendingCustomColour();
            selectionRect.classList.remove('is-visible');
            selectionRect.classList.remove('is-editable');
            selectionRect.style.setProperty('--selection-rotate', '0rad');
            selectionRect.innerHTML = '';
        }

        function strokeBounds(element) {
            if (!element || !Array.isArray(element.points) || element.points.length === 0) {
                return null;
            }

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (const point of element.points) {
                minX = Math.min(minX, Number(point.x) || 0);
                minY = Math.min(minY, Number(point.y) || 0);
                maxX = Math.max(maxX, Number(point.x) || 0);
                maxY = Math.max(maxY, Number(point.y) || 0);
            }
            const padding = Math.max(2, (Number(element.size) || 1) * (element.tip === 'highlighter' ? 1.1 : 0.6));
            return { x: minX - padding, y: minY - padding, width: Math.max(1, maxX - minX + padding * 2), height: Math.max(1, maxY - minY + padding * 2) };
        }

        function smartShapeBounds(element) {
            if (!element || element.type !== 'smart-shape') {
                return null;
            }
            const style = smartShapeRenderStyle(element);
            const padding = Math.max(2, (Number(style.effectiveSize) || Number(style.size) || 1) * 0.6);
            let bounds = null;
            if (element.shapeType === 'line' || element.shapeType === 'arrow') {
                const points = [element.from, element.to].filter(Boolean);
                if (element.shapeType === 'arrow' && element.from && element.to) {
                    const arrowHead = element.arrowHead || {};
                    const size = Math.max(6, Number(arrowHead.size) || 18);
                    const spread = ((Number(arrowHead.angle) || 35) * Math.PI) / 180;
                    const angle = Math.atan2(element.to.y - element.from.y, element.to.x - element.from.x);
                    points.push(
                        { x: element.to.x - Math.cos(angle - spread) * size, y: element.to.y - Math.sin(angle - spread) * size },
                        { x: element.to.x - Math.cos(angle + spread) * size, y: element.to.y - Math.sin(angle + spread) * size }
                    );
                }
                bounds = calculateStrokeBounds(points);
            } else if (element.shapeType === 'rectangle') {
                const source = normalizePageBounds(element.bounds);
                const rotation = Number(element.rotation) || 0;
                if (rotation) {
                    const center = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
                    const cos = Math.cos(rotation);
                    const sin = Math.sin(rotation);
                    bounds = calculateStrokeBounds([
                        { x: source.x, y: source.y },
                        { x: source.x + source.width, y: source.y },
                        { x: source.x + source.width, y: source.y + source.height },
                        { x: source.x, y: source.y + source.height }
                    ].map((point) => rotatePointAround(point, center, cos, sin)));
                } else {
                    bounds = source;
                }
            } else if (element.shapeType === 'circle' || element.shapeType === 'ellipse') {
                const cx = Number(element.cx) || 0;
                const cy = Number(element.cy) || 0;
                const rx = Math.max(1, Number(element.rx) || 1);
                const ry = Math.max(1, Number(element.ry) || 1);
                const rotation = Number(element.rotation) || 0;
                if (rotation && element.shapeType === 'ellipse') {
                    const cos = Math.cos(rotation);
                    const sin = Math.sin(rotation);
                    const halfWidth = Math.sqrt((rx * cos) ** 2 + (ry * sin) ** 2);
                    const halfHeight = Math.sqrt((rx * sin) ** 2 + (ry * cos) ** 2);
                    bounds = { x: cx - halfWidth, y: cy - halfHeight, width: halfWidth * 2, height: halfHeight * 2 };
                } else {
                    bounds = { x: cx - rx, y: cy - ry, width: rx * 2, height: ry * 2 };
                }
            } else if (Array.isArray(element.points)) {
                bounds = calculateStrokeBounds(element.points);
            }
            if (!bounds) {
                return null;
            }
            return {
                x: bounds.x - padding,
                y: bounds.y - padding,
                width: Math.max(1, bounds.width + padding * 2),
                height: Math.max(1, bounds.height + padding * 2)
            };
        }

        function drawableBounds(element) {
            if (!element) {
                return null;
            }
            if (element.type === 'stroke') {
                return strokeBounds(element);
            }
            if (element.type === 'smart-shape') {
                return smartShapeBounds(element);
            }
            return null;
        }

        function rectsIntersect(a, b) {
            return a && b
                && a.x <= b.x + b.width
                && a.x + a.width >= b.x
                && a.y <= b.y + b.height
                && a.y + a.height >= b.y;
        }

        function selectableDrawingElements() {
            const model = currentPageModel();
            return Array.isArray(model.elements)
                ? model.elements.filter((element) => element && (element.type === 'stroke' || element.type === 'smart-shape') && element.id)
                : [];
        }

        function selectedStrokeElements() {
            const ids = new Set(selectedStrokeIds);
            return selectableDrawingElements().filter((element) => ids.has(element.id));
        }

        function combinedStrokeBounds(elements) {
            const bounds = elements.map(drawableBounds).filter(Boolean);
            if (bounds.length === 0) {
                return null;
            }
            const minX = Math.min(...bounds.map((item) => item.x));
            const minY = Math.min(...bounds.map((item) => item.y));
            const maxX = Math.max(...bounds.map((item) => item.x + item.width));
            const maxY = Math.max(...bounds.map((item) => item.y + item.height));
            return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
        }

        function renderDrawingSelection() {
            if (!drawingSelectionBounds || selectedStrokeIds.length === 0) {
            hideSelectionRect();
            return;
            }
            const displayBounds = drawingSelectionDragMode === 'rotate' && drawingSelectionOriginalBounds
            ? displayBoundsFromPageBounds(drawingSelectionOriginalBounds)
            : displayBoundsFromPageBounds(drawingSelectionBounds);
            showSelectionRect(displayBounds, { rotate: drawingSelectionRotationAngle });
            selectionRect.classList.add('is-editable');
            selectionRect.innerHTML = '<button class="selection-rotate" type="button" data-selection-rotate="1" aria-label="Rotate selection"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.35 5.65"/><path d="M20 5v6h-6"/></svg></button>'
            + '<button class="selection-duplicate" type="button" data-selection-duplicate="1" aria-label="Duplicate selection"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg></button>'
            + '<button class="selection-delete" type="button" data-selection-delete="1" aria-label="Delete selection"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/></svg></button>'
            + '<button class="selection-info" type="button" data-selection-info="1" aria-label="Selection info">i</button>'
            + '<div class="selection-color-popup" id="selectionColorPopup"><div class="selection-color-grid"></div></div>'
            + ['nw', 'ne', 'sw', 'se']
            .map((handle) => `<button class="selection-handle selection-handle-${handle}" type="button" data-selection-handle="${handle}" aria-label="Resize selection"></button>`)
            .join('');

            // Render color buttons in popup
            const colorPopup = selectionRect.querySelector('#selectionColorPopup');
            if (colorPopup) {
            renderSelectionColorGrid(colorPopup);
            }
        }

        function renderSelectionColorGrid(colorPopup) {
            const grid = colorPopup.querySelector('.selection-color-grid');
            grid.innerHTML = '';
            const baseColours = recentColours.slice(0, 7);
            const displayColours = pendingCustomColour
            ? [...baseColours.slice(0, 6), pendingCustomColour]
            : baseColours;
            for (const colour of displayColours) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'selection-color-button';
            button.style.backgroundColor = colour;
            button.classList.toggle('is-light', colour.toLowerCase() === '#ffffff');
            button.setAttribute('aria-label', `Change color to ${colour}`);
            button.addEventListener('click', (e) => {
            e.stopPropagation();
            changeSelectedStrokesColor(colour);
            commitPendingCustomColour();
            colorPopup.classList.remove('is-visible');
            });
            grid.appendChild(button);
            }

            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.className = 'selection-color-button selection-color-add';
            addButton.setAttribute('aria-label', 'Add new colour');
            addButton.textContent = '+';
            addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = pendingCustomColour || recentColours[0] || '#111827';
            picker.style.position = 'fixed';
            picker.style.left = '-9999px';
            picker.style.opacity = '0';
            document.body.appendChild(picker);
            picker.addEventListener('change', () => {
            pendingCustomColour = picker.value;
            changeSelectedStrokesColor(picker.value);
            renderSelectionColorGrid(colorPopup);
            picker.remove();
            });
            picker.addEventListener('blur', () => picker.remove());
            picker.click();
            });
            grid.appendChild(addButton);
        }

        function clearDrawingSelection() {
            selectedStrokeIds = [];
            drawingSelectionBounds = null;
            drawingSelecting = false;
            drawingSelectionStart = null;
            drawingSelectionDragMode = '';
            drawingSelectionDragHandle = '';
            drawingSelectionPointerId = null;
            drawingSelectionDragStart = null;
            drawingSelectionOriginalBounds = null;
            drawingSelectionOriginalPoints = null;
            drawingSelectionRotateCenter = null;
            drawingSelectionStartAngle = 0;
            drawingSelectionRotationAngle = 0;
            hideSelectionRect();
        }

        function clearDrawingSelectionForFrameActivation() {
            if (drawingSelectionMode || drawingSelecting || selectedStrokeIds.length > 0 || drawingSelectionBounds) {
                setTool(lastDrawingTool || 'pen');
                return;
            }
            drawingSelectionMode = false;
            drawingSelecting = false;
            clearDrawingSelection();
            selectBtn.classList.remove('is-active');
        }

        function selectStrokesInBounds(bounds) {
            const model = currentPageModel();
            ensureElementIds(model);
            const selected = selectableDrawingElements().filter((element) => rectsIntersect(drawableBounds(element), bounds));
            selectedStrokeIds = selected.map((element) => element.id).filter(Boolean);
            drawingSelectionBounds = combinedStrokeBounds(selected);
            renderDrawingSelection();
        }

        function cloneStrokePoints(points) {
            return Array.isArray(points) ? points.map((point) => ({ ...point })) : [];
        }

        function clonePagePoint(point) {
            return point ? { x: Number(point.x) || 0, y: Number(point.y) || 0 } : null;
        }

        function clonePageBoundsValue(bounds) {
            const source = bounds || {};
            return {
                x: Number(source.x) || 0,
                y: Number(source.y) || 0,
                width: Math.max(1, Number(source.width) || 1),
                height: Math.max(1, Number(source.height) || 1)
            };
        }

        function snapshotDrawable(element) {
            if (!element) {
                return null;
            }
            if (element.type === 'stroke') {
                return { type: 'stroke', points: cloneStrokePoints(element.points) };
            }
            if (element.type !== 'smart-shape') {
                return null;
            }
            const snapshot = {
                type: 'smart-shape',
                shapeType: element.shapeType,
                bounds: clonePageBoundsValue(element.bounds),
                rotation: Number(element.rotation) || 0
            };
            if (element.from) {
                snapshot.from = clonePagePoint(element.from);
            }
            if (element.to) {
                snapshot.to = clonePagePoint(element.to);
            }
            if (Array.isArray(element.points)) {
                snapshot.points = cloneStrokePoints(element.points);
            }
            if (element.shapeType === 'circle' || element.shapeType === 'ellipse') {
                snapshot.cx = Number(element.cx) || 0;
                snapshot.cy = Number(element.cy) || 0;
                snapshot.rx = Math.max(1, Number(element.rx) || 1);
                snapshot.ry = Math.max(1, Number(element.ry) || 1);
            }
            return snapshot;
        }

        function snapshotSelectedStrokePoints() {
            return selectedStrokeElements()
                .map((element) => ({ element, snapshot: snapshotDrawable(element) }))
                .filter((item) => item.snapshot);
        }

        function restoreDrawableSnapshot(element, snapshot) {
            if (!element || !snapshot) {
                return;
            }
            if (element.type === 'stroke' && Array.isArray(snapshot.points)) {
                element.points = cloneStrokePoints(snapshot.points);
                return;
            }
            if (element.type !== 'smart-shape') {
                return;
            }
            if (snapshot.bounds) {
                element.bounds = clonePageBoundsValue(snapshot.bounds);
            }
            element.rotation = Number(snapshot.rotation) || 0;
            if (snapshot.from) {
                element.from = clonePagePoint(snapshot.from);
            }
            if (snapshot.to) {
                element.to = clonePagePoint(snapshot.to);
            }
            if (Array.isArray(snapshot.points)) {
                element.points = cloneStrokePoints(snapshot.points);
                element.bounds = normalizePageBounds(calculateStrokeBounds(element.points) || element.bounds);
            }
            if (snapshot.type === 'smart-shape' && (snapshot.shapeType === 'circle' || snapshot.shapeType === 'ellipse')) {
                element.cx = Number(snapshot.cx) || 0;
                element.cy = Number(snapshot.cy) || 0;
                element.rx = Math.max(1, Number(snapshot.rx) || 1);
                element.ry = Math.max(1, Number(snapshot.ry) || 1);
                element.bounds = {
                    x: element.cx - element.rx,
                    y: element.cy - element.ry,
                    width: element.rx * 2,
                    height: element.ry * 2
                };
            }
        }

        function snapshotChanged(before, after) {
            return JSON.stringify(before) !== JSON.stringify(after);
        }

        function restoreStrokeTransform(action, key) {
            const model = currentPageModel();
            if (!action || !Array.isArray(action.items) || !Array.isArray(model.elements)) {
                return;
            }
            const elementsById = new Map(model.elements
                .filter((element) => element && (element.type === 'stroke' || element.type === 'smart-shape') && element.id)
                .map((element) => [element.id, element]));
            for (const item of action.items) {
                const element = elementsById.get(item.id);
                if (!element) {
                    continue;
                }
                if (item[key] && item[key].type) {
                    restoreDrawableSnapshot(element, item[key]);
                } else if (Array.isArray(item[key])) {
                    restoreDrawableSnapshot(element, { type: 'stroke', points: item[key] });
                }
            }
        }

        function recordDrawingSelectionTransformAction() {
            if (!Array.isArray(drawingSelectionOriginalPoints) || drawingSelectionOriginalPoints.length === 0) {
                return false;
            }
            const items = drawingSelectionOriginalPoints
                .map((item) => ({
                    id: item.element.id,
                    before: item.snapshot,
                    after: snapshotDrawable(item.element)
                }))
                .filter((item) => item.id && snapshotChanged(item.before, item.after));
            if (items.length === 0) {
                return false;
            }
            const stack = redoStacks.get(currentPage) || [];
            stack.push({ type: 'transformed-drawables', items });
            redoStacks.set(currentPage, stack);
            forwardRedoStacks.delete(currentPage);
            return true;
        }

        function resizedSelectionBounds(original, handle, point) {
            const minSize = 4;
            let left = original.x;
            let top = original.y;
            let right = original.x + original.width;
            let bottom = original.y + original.height;
            if (handle.includes('w')) {
                left = Math.min(point.x, right - minSize);
            }
            if (handle.includes('e')) {
                right = Math.max(point.x, left + minSize);
            }
            if (handle.includes('n')) {
                top = Math.min(point.y, bottom - minSize);
            }
            if (handle.includes('s')) {
                bottom = Math.max(point.y, top + minSize);
            }
            return { x: left, y: top, width: right - left, height: bottom - top };
        }

        function clampSelectionBoundsToPage(bounds, model) {
            const source = bounds || {};
            const pageWidth = Math.max(1, Number(model && model.baseWidth) || 1);
            const pageHeight = Math.max(1, Number(model && model.baseHeight) || 1);
            const width = Math.max(1, Math.min(Number(source.width) || 1, pageWidth));
            const height = Math.max(1, Math.min(Number(source.height) || 1, pageHeight));
            return {
                x: Math.max(0, Math.min(Number(source.x) || 0, pageWidth - width)),
                y: Math.max(0, Math.min(Number(source.y) || 0, pageHeight - height)),
                width,
                height
            };
        }

        function transformPointFromBounds(point, originalBounds, nextBounds) {
            const scaleX = nextBounds.width / Math.max(1, originalBounds.width);
            const scaleY = nextBounds.height / Math.max(1, originalBounds.height);
            return {
                ...point,
                x: nextBounds.x + ((Number(point.x) || 0) - originalBounds.x) * scaleX,
                y: nextBounds.y + ((Number(point.y) || 0) - originalBounds.y) * scaleY
            };
        }

        function rotatePointAround(point, center, cos, sin) {
            const dx = (Number(point.x) || 0) - center.x;
            const dy = (Number(point.y) || 0) - center.y;
            return {
                ...point,
                x: center.x + dx * cos - dy * sin,
                y: center.y + dx * sin + dy * cos
            };
        }

        function transformDrawable(element, snapshot, originalBounds, nextBounds) {
            if (!element || !snapshot) {
                return;
            }
            if (element.type === 'stroke' && Array.isArray(snapshot.points)) {
                element.points = snapshot.points.map((point) => transformPointFromBounds(point, originalBounds, nextBounds));
                return;
            }
            if (element.type !== 'smart-shape') {
                return;
            }
            if (snapshot.from) {
                element.from = transformPointFromBounds(snapshot.from, originalBounds, nextBounds);
            }
            if (snapshot.to) {
                element.to = transformPointFromBounds(snapshot.to, originalBounds, nextBounds);
            }
            if (snapshot.shapeType === 'line' || snapshot.shapeType === 'arrow') {
                element.bounds = normalizePageBounds(calculateStrokeBounds([element.from, element.to].filter(Boolean)) || element.bounds);
                element.rotation = Number(snapshot.rotation) || 0;
                return;
            }
            if (Array.isArray(snapshot.points)) {
                element.points = snapshot.points.map((point) => transformPointFromBounds(point, originalBounds, nextBounds));
                element.bounds = normalizePageBounds(calculateStrokeBounds(element.points) || element.bounds);
                return;
            }
            if (snapshot.shapeType === 'circle' || snapshot.shapeType === 'ellipse') {
                const center = transformPointFromBounds({ x: snapshot.cx, y: snapshot.cy }, originalBounds, nextBounds);
                const scaleX = nextBounds.width / Math.max(1, originalBounds.width);
                const scaleY = nextBounds.height / Math.max(1, originalBounds.height);
                element.cx = center.x;
                element.cy = center.y;
                element.rx = Math.max(1, snapshot.rx * Math.abs(scaleX));
                element.ry = Math.max(1, snapshot.ry * Math.abs(scaleY));
                element.bounds = { x: element.cx - element.rx, y: element.cy - element.ry, width: element.rx * 2, height: element.ry * 2 };
                element.rotation = Number(snapshot.rotation) || 0;
                return;
            }
            if (snapshot.bounds) {
                const topLeft = transformPointFromBounds({ x: snapshot.bounds.x, y: snapshot.bounds.y }, originalBounds, nextBounds);
                element.bounds = {
                    x: topLeft.x,
                    y: topLeft.y,
                    width: Math.max(1, snapshot.bounds.width * (nextBounds.width / Math.max(1, originalBounds.width))),
                    height: Math.max(1, snapshot.bounds.height * (nextBounds.height / Math.max(1, originalBounds.height)))
                };
                element.rotation = Number(snapshot.rotation) || 0;
            }
        }

        function rotateDrawable(element, snapshot, center, angle) {
            if (!element || !snapshot) {
                return;
            }
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            if (element.type === 'stroke' && Array.isArray(snapshot.points)) {
                element.points = snapshot.points.map((point) => rotatePointAround(point, center, cos, sin));
                return;
            }
            if (element.type !== 'smart-shape') {
                return;
            }
            if (snapshot.from) {
                element.from = rotatePointAround(snapshot.from, center, cos, sin);
            }
            if (snapshot.to) {
                element.to = rotatePointAround(snapshot.to, center, cos, sin);
            }
            if (snapshot.shapeType === 'line' || snapshot.shapeType === 'arrow') {
                element.bounds = normalizePageBounds(calculateStrokeBounds([element.from, element.to].filter(Boolean)) || element.bounds);
                element.rotation = Number(snapshot.rotation) || 0;
                return;
            }
            if (Array.isArray(snapshot.points)) {
                element.points = snapshot.points.map((point) => rotatePointAround(point, center, cos, sin));
                element.bounds = normalizePageBounds(calculateStrokeBounds(element.points) || element.bounds);
                return;
            }
            if (snapshot.shapeType === 'circle' || snapshot.shapeType === 'ellipse') {
                const rotatedCenter = rotatePointAround({ x: snapshot.cx, y: snapshot.cy }, center, cos, sin);
                element.cx = rotatedCenter.x;
                element.cy = rotatedCenter.y;
                element.rx = snapshot.rx;
                element.ry = snapshot.ry;
                element.rotation = snapshot.shapeType === 'ellipse' ? (Number(snapshot.rotation) || 0) + angle : Number(snapshot.rotation) || 0;
                element.bounds = { x: element.cx - element.rx, y: element.cy - element.ry, width: element.rx * 2, height: element.ry * 2 };
                return;
            }
            if (snapshot.bounds) {
                const centerPoint = {
                    x: snapshot.bounds.x + snapshot.bounds.width / 2,
                    y: snapshot.bounds.y + snapshot.bounds.height / 2
                };
                const rotatedCenter = rotatePointAround(centerPoint, center, cos, sin);
                element.bounds = {
                    x: rotatedCenter.x - snapshot.bounds.width / 2,
                    y: rotatedCenter.y - snapshot.bounds.height / 2,
                    width: snapshot.bounds.width,
                    height: snapshot.bounds.height
                };
                element.rotation = (Number(snapshot.rotation) || 0) + angle;
            }
        }

        function applyDrawingSelectionTransform(nextBounds) {
            if (!drawingSelectionOriginalBounds || !drawingSelectionOriginalPoints) {
                return;
            }
            const original = drawingSelectionOriginalBounds;
            for (const item of drawingSelectionOriginalPoints) {
                transformDrawable(item.element, item.snapshot, original, nextBounds);
            }
            drawingSelectionBounds = nextBounds;
            renderDrawingSelection();
        }

        function applyDrawingSelectionRotation(angle) {
            if (!drawingSelectionRotateCenter || !drawingSelectionOriginalPoints) {
                return;
            }
            drawingSelectionRotationAngle = angle;
            const center = drawingSelectionRotateCenter;
            for (const item of drawingSelectionOriginalPoints) {
                rotateDrawable(item.element, item.snapshot, center, angle);
            }
            drawingSelectionBounds = drawingSelectionOriginalBounds || combinedStrokeBounds(selectedStrokeElements());
            renderDrawingSelection();
        }

        function clampTextBounds(bounds, model) {
            const minWidth = 24;
            const minHeight = 20;
            const width = Math.max(minWidth, Math.min(Number(bounds.width) || minWidth, model.baseWidth));
            const height = Math.max(minHeight, Math.min(Number(bounds.height) || minHeight, model.baseHeight));
            return {
                x: Math.max(0, Math.min(Number(bounds.x) || 0, model.baseWidth - width)),
                y: Math.max(0, Math.min(Number(bounds.y) || 0, model.baseHeight - height)),
                width,
                height
            };
        }

        function applySelectedTextStylesToControls() {
            const element = selectedTextElement();
            const source = element || textDefaults;
            const fontSize = normalizeTextSize(source.fontSize, 20);
            const align = normalizeAlign(source.align);
            textSizeInput.value = fontSize;
            textSizeLabel.textContent = `${fontSize}px`;
            textBoldBtn.classList.toggle('is-active', Boolean(source.bold));
            textItalicBtn.classList.toggle('is-active', Boolean(source.italic));
            textUnderlineBtn.classList.toggle('is-active', Boolean(source.underline));
            textAlignLeftBtn.classList.toggle('is-active', align === 'left');
            textAlignCenterBtn.classList.toggle('is-active', align === 'center');
            textAlignRightBtn.classList.toggle('is-active', align === 'right');
            textColorInput.value = normalizeColor(source.color || colorInput.value, '#111827');
            renderTextColours();
        }

        function selectTextElement(id, options = {}) {
            clearDrawingSelectionForFrameActivation();
            const nextId = id || '';
            const alreadySelected = selectedTextId === nextId;
            selectedTextId = id || '';
            if (selectedTextId) {
                selectedTableId = '';
            }
            syncInsertFrameToolStates();
            if (!alreadySelected || options.forceRender) {
                renderTextLayer();
            }
            applySelectedTextStylesToControls();
            
            // 🔧 MODIFICARE: Doar dacă textul NU era deja selectat, setează cursorul la sfârșit
            // Dacă era deja selectat, lasă browser-ul să gestioneze poziția cursorului
            if (options.focus && !useVirtualKeyboard() && !alreadySelected) {
                window.setTimeout(() => {
                    const box = [...textLayer.querySelectorAll('.text-box')].find((item) => item.dataset.textId === selectedTextId);
                    const input = box ? box.querySelector('.text-box-content') : null;
                    if (input) {
                        input.focus();
                        const range = document.createRange();
                        range.selectNodeContents(input);
                        range.collapse(false);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }, 0);
            } else if (options.focus && !useVirtualKeyboard() && alreadySelected) {
                // 🔧 NOU: Dacă textul e deja selectat, doar dăm focus fără să resetăm cursorul
                window.setTimeout(() => {
                    const box = [...textLayer.querySelectorAll('.text-box')].find((item) => item.dataset.textId === selectedTextId);
                    const input = box ? box.querySelector('.text-box-content') : null;
                    if (input) {
                        input.focus();
                    }
                }, 0);
            }
        }

        function setTextDefaultOrSelected(key, value) {
            const element = selectedTextElement();
            if (element) {
                if (key === 'fontSize') {
                    element.fontSize = normalizeTextSize(value, element.fontSize);
                } else if (key === 'align') {
                    element.align = normalizeAlign(value);
                } else if (key === 'color') {
                    element.color = normalizeColor(value, element.color || '#111827');
                    textColorInput.value = element.color;
                } else {
                    element[key] = Boolean(value);
                }
                syncTextDefaultsFromElement(element);
                markUnsaved();
                renderTextLayer();
            } else {
                if (key === 'fontSize') {
                    textDefaults.fontSize = normalizeTextSize(value, textDefaults.fontSize);
                } else if (key === 'align') {
                    textDefaults.align = normalizeAlign(value);
                } else if (key === 'color') {
                    textDefaults.color = normalizeColor(value, textDefaults.color || '#111827');
                    textColorInput.value = textDefaults.color;
                } else {
                    textDefaults[key] = Boolean(value);
                }
                saveTextDefaults();
            }
            applySelectedTextStylesToControls();
        }

        function startTextDrag(event, element, mode) {
            event.preventDefault();
            event.stopPropagation();
            clearDrawingSelectionForFrameActivation();
            const rect = pageDisplayRect(currentPageModel());
            selectedTextId = element.id;
            selectedTableId = '';
            textDragMode = mode;
            textDragPointerId = event.pointerId;
            blurActiveEditableForDrag();
            textDragStart = pagePointFromEvent(event);
            textDragStartClient = { x: event.clientX, y: event.clientY, scale: rect.scale };
            textDragOriginalBounds = { ...element.bounds };
            textDragOriginalDisplay = textDisplayBounds(element, currentPageModel());
            textDragLastDelta = { dx: 0, dy: 0, distance: 0, scale: rect.scale };
            textDragPending = true;
            applySelectedTextStylesToControls();
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        function deleteTextElement(element) {
            if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'text' && virtualKeyboardTarget.element.id === element.id) {
                closeVirtualKeyboard({ render: false });
            }
            const model = currentPageModel();
            const index = model.elements.findIndex((item) => item.id === element.id);
            if (index < 0) {
                return;
            }
            model.elements.splice(index, 1);
            const stack = redoStacks.get(currentPage) || [];
            stack.push({ type: 'deleted-text', element, index });
            redoStacks.set(currentPage, stack);
            forwardRedoStacks.delete(currentPage);
            selectedTextId = '';
            syncInsertFrameToolStates();
            setTool(lastDrawingTool || 'pen');
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            renderTextLayer();
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
        }

        function duplicateElementBounds(bounds, model) {
            const source = bounds || {};
            const offset = 18;
            return {
                x: (Number(source.x) || 0) + offset,
                y: (Number(source.y) || 0) + offset,
                width: Math.max(1, Number(source.width) || 180),
                height: Math.max(1, Number(source.height) || 80)
            };
        }

        function duplicateTextElement(element) {
            if (!element) {
                return;
            }
            if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'text' && virtualKeyboardTarget.element.id === element.id) {
                closeVirtualKeyboard({ render: false });
            }
            const model = currentPageModel();
            const duplicate = normalizeTextElement({
                ...element,
                id: createElementId(),
                bounds: clampTextBounds(duplicateElementBounds(element.bounds, model), model)
            });
            model.elements.push(duplicate);
            selectedTextId = duplicate.id;
            selectedTableId = '';
            clearRedoForCurrentPage();
            syncInsertFrameToolStates();
            markUnsaved();
            updateUndoButton();
            renderTextLayer();
        }

        function clampTableBounds(bounds, model) {
            return clampTextBounds(bounds, model);
        }

        function duplicateTableElement(element) {
            if (!element) {
                return null;
            }
            const model = currentPageModel();
            const duplicate = {
                ...element,
                id: createElementId(),
                bounds: clampTableBounds(duplicateElementBounds(element.bounds, model), model),
                cells: Array.isArray(element.cells) ? element.cells.map((cell) => ({ ...cell })) : [],
                cellStyles: normalizeCellStyles(element.cellStyles)
            };
            model.elements.push(duplicate);
            selectedTableId = duplicate.id;
            selectedTextId = '';
            clearRedoForCurrentPage();
            markUnsaved();
            updateUndoButton();
            renderTable(duplicate, model);
            return duplicate;
        }

        function duplicateElementById(id) {
            const model = currentPageModel();
            const element = model.elements.find((el) => el.id === id);
            if (!element) {
                return false;
            }
            if (element.type === 'text') {
                duplicateTextElement(element);
                return true;
            }
            if (element.type === 'table') {
                return Boolean(duplicateTableElement(element));
            }
            if (element.type !== 'stroke' && element.type !== 'smart-shape') {
                return false;
            }
            const offset = 20;
            const clone = JSON.parse(JSON.stringify(element));
            clone.id = createElementId();
            if (clone.type === 'stroke' && Array.isArray(clone.points)) {
                clone.points = clone.points.map((p) => ({ ...p, x: p.x + offset, y: p.y + offset }));
                clone.bounds = calculateStrokeBounds(clone.points);
            } else if (clone.type === 'smart-shape') {
                if (clone.from) {
                    clone.from = { x: clone.from.x + offset, y: clone.from.y + offset };
                }
                if (clone.to) {
                    clone.to = { x: clone.to.x + offset, y: clone.to.y + offset };
                }
                if (Array.isArray(clone.points)) {
                    clone.points = clone.points.map((p) => ({ x: p.x + offset, y: p.y + offset }));
                }
                if (clone.bounds) {
                    clone.bounds = {
                        x: clone.bounds.x + offset,
                        y: clone.bounds.y + offset,
                        width: clone.bounds.width,
                        height: clone.bounds.height
                    };
                }
                if (Number.isFinite(clone.cx)) {
                    clone.cx += offset;
                    clone.cy += offset;
                }
            }
            model.elements.push(clone);
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function applySelectedTableStylesToControls() {
            const table = selectedTableElement();
            const styles = normalizeCellStyles(table ? table.cellStyles : tableDefaults);
            tableTextSizeInput.value = styles.fontSize;
            tableTextSizeLabel.textContent = `${styles.fontSize}px`;
            tableBoldBtn.classList.toggle('is-active', Boolean(styles.bold));
            tableItalicBtn.classList.toggle('is-active', Boolean(styles.italic));
            tableUnderlineBtn.classList.toggle('is-active', Boolean(styles.underline));
            tableAlignLeftBtn.classList.toggle('is-active', styles.align === 'left');
            tableAlignCenterBtn.classList.toggle('is-active', styles.align === 'center');
            tableAlignRightBtn.classList.toggle('is-active', styles.align === 'right');
            tableColorInput.value = styles.color;
            renderTableColours();
        }

        function setTableStyle(key, value) {
            const table = selectedTableElement();
            if (!table) {
                return;
            }
            table.cellStyles = normalizeCellStyles(table.cellStyles);
            if (key === 'fontSize') {
                table.cellStyles.fontSize = normalizeTextSize(value, table.cellStyles.fontSize);
            } else if (key === 'align') {
                table.cellStyles.align = normalizeAlign(value);
            } else if (key === 'color') {
                table.cellStyles.color = normalizeColor(value, table.cellStyles.color);
                tableColorInput.value = table.cellStyles.color;
            } else {
                table.cellStyles[key] = Boolean(value);
            }
            syncTableDefaultsFromStyles(table.cellStyles);
            markUnsaved();
            applySelectedTableStylesToControls();
            renderTextLayer();
        }

        function renderTableColours() {
            if (!tableColourRow) {
                return;
            }

            const table = selectedTableElement();
            const styles = normalizeCellStyles(table ? table.cellStyles : tableDefaults);
            tableColourRow.innerHTML = '';
            for (const colour of recentColours.slice(0, 8)) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'text-colour-button';
                button.style.backgroundColor = colour;
                button.classList.toggle('is-light', colour.toLowerCase() === '#ffffff');
                button.classList.toggle('is-active', colour.toLowerCase() === styles.color.toLowerCase());
                button.setAttribute('aria-label', `Use table text colour ${colour}`);
                button.addEventListener('click', () => setTableStyle('color', colour));
                tableColourRow.appendChild(button);
            }
        }

        function selectTableElement(id, options = {}) {
            clearDrawingSelectionForFrameActivation();
            const nextId = id || '';
            const alreadySelected = selectedTableId === nextId;
            selectedTableId = nextId;
            selectedTextId = '';
            syncInsertFrameToolStates();
            if (!alreadySelected || options.forceRender) {
                renderTextLayer();
            }
            applySelectedTableStylesToControls();
        }

        function startTableDrag(event, element, mode) {
            event.preventDefault();
            event.stopPropagation();
            clearDrawingSelectionForFrameActivation();
            const rect = pageDisplayRect(currentPageModel());
            selectedTableId = element.id;
            selectedTextId = '';
            syncInsertFrameToolStates();
            tableDragMode = mode;
            tableDragPointerId = event.pointerId;
            blurActiveEditableForDrag();
            tableDragStart = pagePointFromEvent(event);
            tableDragStartClient = { x: event.clientX, y: event.clientY, scale: rect.scale };
            tableDragOriginalBounds = { ...element.bounds };
            tableDragOriginalDisplay = tableDisplayBounds(element, currentPageModel());
            tableDragLastDelta = { dx: 0, dy: 0, distance: 0, scale: rect.scale };
            tableDragPending = true;
            applySelectedTableStylesToControls();
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        function deleteTableElement(element) {
            if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'table' && virtualKeyboardTarget.table.id === element.id) {
                closeVirtualKeyboard({ render: false });
            }
            const model = currentPageModel();
            const index = model.elements.findIndex((item) => item.id === element.id);
            if (index < 0) {
                return;
            }
            model.elements.splice(index, 1);
            const stack = redoStacks.get(currentPage) || [];
            stack.push({ type: 'deleted-table', element, index });
            redoStacks.set(currentPage, stack);
            forwardRedoStacks.delete(currentPage);
            selectedTableId = '';
            syncInsertFrameToolStates();
            setTool(lastDrawingTool || 'pen');
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            renderTextLayer();
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
        }

        function deleteElementById(id) {
            const element = findElementById(id);
            if (!element) {
                return false;
            }
            if (element.type === 'text') {
                deleteTextElement(element);
                return true;
            }
            if (element.type === 'table') {
                deleteTableElement(element);
                return true;
            }
            const model = currentPageModel();
            const index = model.elements.findIndex((item) => item.id === id);
            if (index < 0) {
                return false;
            }
            model.elements.splice(index, 1);
            const stack = redoStacks.get(currentPage) || [];
            stack.push({ type: 'deleted-element', element, index });
            redoStacks.set(currentPage, stack);
            forwardRedoStacks.delete(currentPage);
            if (selectedStrokeIds.includes(id)) {
                clearDrawingSelection();
            }
            renderTextLayer();
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function recolorElementById(id, color) {
            const element = findElementById(id);
            if (!element) {
                return false;
            }
            if (element.type === 'table') {
                element.cellStyles = normalizeCellStyles({ ...element.cellStyles, color });
            } else if (element.type === 'smart-shape') {
                element.style = { ...element.style, color: normalizeColor(color, element.style.color) };
            } else {
                element.color = normalizeColor(color, element.color || '#111827');
            }
            markUnsaved();
            renderTextLayer();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function moveElementById(id, dx, dy) {
            const element = findElementById(id);
            if (!element || element.type === 'stroke') {
                return false;
            }
            const model = currentPageModel();
            const offsetX = Number(dx) || 0;
            const offsetY = Number(dy) || 0;
            element.bounds = clampTextBounds({
                x: (element.bounds.x || 0) + offsetX,
                y: (element.bounds.y || 0) + offsetY,
                width: element.bounds.width,
                height: element.bounds.height
            }, model);
            if (element.type === 'smart-shape') {
                if (element.from && element.to) {
                    element.from = { x: element.from.x + offsetX, y: element.from.y + offsetY };
                    element.to = { x: element.to.x + offsetX, y: element.to.y + offsetY };
                }
                if (Number.isFinite(element.cx)) {
                    element.cx += offsetX;
                    element.cy += offsetY;
                }
                if (Array.isArray(element.points)) {
                    element.points = element.points.map((point) => ({ x: point.x + offsetX, y: point.y + offsetY }));
                }
            }
            markUnsaved();
            renderTextLayer();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function resizeElementById(id, width, height) {
            const element = findElementById(id);
            if (!element || element.type === 'stroke') {
                return false;
            }
            const supportedShapeTypes = ['rectangle', 'circle', 'ellipse'];
            if (element.type === 'smart-shape' && !supportedShapeTypes.includes(element.shapeType)) {
                return false;
            }
            const model = currentPageModel();
            const nextWidth = Number(width) > 0 ? Number(width) : element.bounds.width;
            const nextHeight = Number(height) > 0 ? Number(height) : element.bounds.height;
            element.bounds = clampTextBounds({
                x: element.bounds.x,
                y: element.bounds.y,
                width: nextWidth,
                height: nextHeight
            }, model);
            if (element.type === 'smart-shape' && (element.shapeType === 'circle' || element.shapeType === 'ellipse')) {
                element.cx = element.bounds.x + element.bounds.width / 2;
                element.cy = element.bounds.y + element.bounds.height / 2;
                element.rx = element.bounds.width / 2;
                element.ry = element.bounds.height / 2;
            }
            markUnsaved();
            renderTextLayer();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function getAlignableElementBounds(element) {
            if (!element) {
                return null;
            }
            if (element.type === 'text' || element.type === 'table') {
                return element.bounds || null;
            }
            if (element.type === 'smart-shape' && element.shapeType !== 'line' && element.shapeType !== 'arrow') {
                return element.bounds || null;
            }
            return null;
        }

        function alignableTargetsFromIds(ids) {
            const model = currentPageModel();
            return ids
                .map((id) => ({ id, element: model.elements.find((el) => el.id === id) }))
                .filter((target) => Boolean(getAlignableElementBounds(target.element)))
                .map((target) => ({ id: target.id, bounds: getAlignableElementBounds(target.element) }));
        }

        function alignElements(ids, edge) {
            const targets = alignableTargetsFromIds(Array.isArray(ids) ? ids : []);
            if (targets.length < 2) {
                return false;
            }
            let reference;
            if (edge === 'left') {
                reference = Math.min(...targets.map((t) => t.bounds.x));
            } else if (edge === 'right') {
                reference = Math.max(...targets.map((t) => t.bounds.x + t.bounds.width));
            } else if (edge === 'top') {
                reference = Math.min(...targets.map((t) => t.bounds.y));
            } else if (edge === 'bottom') {
                reference = Math.max(...targets.map((t) => t.bounds.y + t.bounds.height));
            } else if (edge === 'center') {
                reference = targets.reduce((sum, t) => sum + t.bounds.x + t.bounds.width / 2, 0) / targets.length;
            } else if (edge === 'middle') {
                reference = targets.reduce((sum, t) => sum + t.bounds.y + t.bounds.height / 2, 0) / targets.length;
            } else {
                return false;
            }

            let anyMoved = false;
            targets.forEach((target) => {
                let dx = 0;
                let dy = 0;
                if (edge === 'left') {
                    dx = reference - target.bounds.x;
                } else if (edge === 'right') {
                    dx = reference - (target.bounds.x + target.bounds.width);
                } else if (edge === 'center') {
                    dx = reference - (target.bounds.x + target.bounds.width / 2);
                } else if (edge === 'top') {
                    dy = reference - target.bounds.y;
                } else if (edge === 'bottom') {
                    dy = reference - (target.bounds.y + target.bounds.height);
                } else if (edge === 'middle') {
                    dy = reference - (target.bounds.y + target.bounds.height / 2);
                }
                if (dx !== 0 || dy !== 0) {
                    anyMoved = moveElementById(target.id, dx, dy) || anyMoved;
                } else {
                    anyMoved = true;
                }
            });
            return anyMoved;
        }

        function distributeElements(ids, axis) {
            const targets = alignableTargetsFromIds(Array.isArray(ids) ? ids : []);
            if (targets.length < 3) {
                return false;
            }
            let anyMoved = false;
            if (axis === 'horizontal') {
                targets.sort((a, b) => a.bounds.x - b.bounds.x);
                const first = targets[0].bounds;
                const last = targets[targets.length - 1].bounds;
                const totalSpan = (last.x + last.width) - first.x;
                const totalWidth = targets.reduce((sum, t) => sum + t.bounds.width, 0);
                const gap = (totalSpan - totalWidth) / (targets.length - 1);
                let cursor = first.x;
                targets.forEach((target) => {
                    const dx = cursor - target.bounds.x;
                    if (dx !== 0) {
                        anyMoved = moveElementById(target.id, dx, 0) || anyMoved;
                    } else {
                        anyMoved = true;
                    }
                    cursor += target.bounds.width + gap;
                });
            } else if (axis === 'vertical') {
                targets.sort((a, b) => a.bounds.y - b.bounds.y);
                const first = targets[0].bounds;
                const last = targets[targets.length - 1].bounds;
                const totalSpan = (last.y + last.height) - first.y;
                const totalHeight = targets.reduce((sum, t) => sum + t.bounds.height, 0);
                const gap = (totalSpan - totalHeight) / (targets.length - 1);
                let cursor = first.y;
                targets.forEach((target) => {
                    const dy = cursor - target.bounds.y;
                    if (dy !== 0) {
                        anyMoved = moveElementById(target.id, 0, dy) || anyMoved;
                    } else {
                        anyMoved = true;
                    }
                    cursor += target.bounds.height + gap;
                });
            } else {
                return false;
            }
            return anyMoved;
        }

        function highlightElementsByIds(ids) {
            const model = currentPageModel();
            const validIds = (Array.isArray(ids) ? ids : []).filter((id) => model.elements.some((el) => el.id === id));
            if (validIds.length === 0) {
                return false;
            }
            selectedStrokeIds = validIds.filter((id) => {
                const element = model.elements.find((el) => el.id === id);
                return element && (element.type === 'stroke' || element.type === 'smart-shape');
            });
            const firstText = model.elements.find((el) => validIds.includes(el.id) && el.type === 'text');
            const firstTable = model.elements.find((el) => validIds.includes(el.id) && el.type === 'table');
            if (firstText) {
                selectedTextId = firstText.id;
            }
            if (firstTable) {
                selectedTableId = firstTable.id;
            }
            drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
            renderDrawingSelection();
            renderTextLayer();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function editElementTextById(id, text, row, col) {
            const element = findElementById(id);
            if (!element) {
                return false;
            }
            if (element.type === 'text') {
                element.text = String(text || '');
            } else if (element.type === 'table') {
                const r = Number.isFinite(Number(row)) ? Number(row) : 0;
                const c = Number.isFinite(Number(col)) ? Number(col) : 0;
                setTableCellText(element, r, c, String(text || ''));
            } else {
                return false;
            }
            markUnsaved();
            renderTextLayer();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function renderTextLayer() {
            syncInsertFrameToolStates();
            textLayer.innerHTML = '';
            const model = pageModels.get(currentPage);
            if (!model || !Array.isArray(model.elements)) {
                return;
            }

            ensureElementIds(model);
            for (const rawElement of model.elements) {
                if (rawElement.type === 'table') {
                    renderTableOverlay(rawElement, model);
                    continue;
                }
                if (rawElement.type === 'formula') {
                    renderFormulaOverlay(rawElement, model);
                    continue;
                }
                if (rawElement.type !== 'text') {
                    continue;
                }
                const element = rawElement;
                const display = textDisplayBounds(element, model);
                const box = document.createElement('div');
                const content = document.createElement('div');
                const move = document.createElement('button');
                const remove = document.createElement('button');
                const resize = document.createElement('button');
                const info = document.createElement('button');
                const duplicate = document.createElement('button');
                const selected = element.id === selectedTextId;

                box.className = `text-box${selected ? ' is-selected' : ''}`;
                box.dataset.textId = element.id;
                box.style.left = `${display.x}px`;
                box.style.top = `${display.y}px`;
                box.style.width = `${display.width}px`;
                box.style.height = `${display.height}px`;

                content.className = 'text-box-content';
                content.contentEditable = selected && !useVirtualKeyboard() ? 'true' : 'false';
                content.spellcheck = false;
                content.textContent = element.text || '';
                content.style.fontSize = `${normalizeTextSize(element.fontSize, 20) * display.scale}px`;
                content.style.fontWeight = element.bold ? '700' : '400';
                content.style.fontStyle = element.italic ? 'italic' : 'normal';
                content.style.textDecoration = element.underline ? 'underline' : 'none';
                content.style.textAlign = normalizeAlign(element.align);
                content.style.color = normalizeColor(element.color || colorInput.value, '#111827');
                content.addEventListener('pointerdown', (event) => {
                    event.stopPropagation();
                    if (useVirtualKeyboard()) {
                        event.preventDefault();
                        const alreadyEditing = virtualKeyboardTarget
                            && virtualKeyboardTarget.type === 'text'
                            && virtualKeyboardTarget.element === element;
                        if (!alreadyEditing) {
                            startVirtualTextEditing(element);
                        }
                        trackVirtualCaretDrag(event);
                        return;
                    }
                    selectTextElement(element.id, { focus: true });
                });
                content.addEventListener('input', () => {
                    element.text = content.innerText.replace(/\n$/, '');
                    markUnsaved();
                });
                content.addEventListener('blur', () => {
                    element.text = content.innerText.replace(/\n$/, '');
                    setInteractionCooldown();
                    window.setTimeout(() => {
                        if (!isTextEditing()) {
                            if (isFrameDragActive()) {
                                deferredViewportResize = true;
                                return;
                            }
                            renderTextLayer();
                            scheduleResizeCanvas();
                        }
                    }, 0);
                });

                move.type = 'button';
                move.className = 'text-box-control text-box-move';
                move.title = 'Move';
                move.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m8 7 4-4 4 4"/><path d="m16 17-4 4-4-4"/></svg>';
                move.addEventListener('pointerdown', (event) => startTextDrag(event, element, 'move'));

                remove.type = 'button';
                remove.className = 'text-box-control text-box-delete';
                remove.title = 'Delete';
                remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>';
                remove.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    deleteTextElement(element);
                });
                remove.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });

                resize.type = 'button';
                resize.className = 'text-box-control text-box-resize';
                resize.title = 'Resize';
                resize.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12V8"/><path d="M12 20 20 12"/></svg>';
                resize.addEventListener('pointerdown', (event) => startTextDrag(event, element, 'resize'));

                info.type = 'button';
                info.className = 'text-box-control text-box-info';
                info.title = 'Text options';
                info.setAttribute('aria-label', 'Text options');
                info.textContent = 'i';
                info.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    selectTextElement(element.id);
                    applySelectedTextStylesToControls();
                    toggleToolbarMenu(insertBtn, insertMenu);
                });
                info.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });

                duplicate.type = 'button';
                duplicate.className = 'text-box-control text-box-duplicate';
                duplicate.title = 'Duplicate';
                duplicate.setAttribute('aria-label', 'Duplicate text');
                duplicate.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';
                duplicate.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    duplicateTextElement(element);
                });
                duplicate.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                });

                box.append(content, move, remove, resize, info, duplicate);
                textLayer.appendChild(box);
            }

            if (virtualKeyboardTarget && virtualKeyboardTarget.type !== 'chat') {
                if (virtualKeyboardTarget.type === 'text') {
                    virtualKeyboardTarget.node = textLayer.querySelector(`[data-text-id="${virtualKeyboardTarget.element.id}"] .text-box-content`);
                } else {
                    virtualKeyboardTarget.node = textLayer.querySelector(`[data-table-id="${virtualKeyboardTarget.table.id}"] [data-cell="${cellKey(virtualKeyboardTarget.row, virtualKeyboardTarget.col)}"]`);
                }
                renderVirtualTextNode(virtualKeyboardTarget.node, virtualTargetText(), true);
                applyKeyboardAvoidance();
            }
        }

        function renderFormulaOverlay(element, model) {
            const display = textDisplayBounds(element, model);
            const box = document.createElement('div');
            const content = document.createElement('div');
            const move = document.createElement('button');
            const remove = document.createElement('button');
            const resize = document.createElement('button');
            const selected = element.id === selectedTextId;
            const color = normalizeColor(element.color || colorInput.value, '#111827');

            box.className = `text-box formula-box${selected ? ' is-selected' : ''}`;
            box.dataset.textId = element.id;
            box.style.left = `${display.x}px`;
            box.style.top = `${display.y}px`;
            box.style.width = `${display.width}px`;
            box.style.height = `${display.height}px`;

            content.className = 'text-box-content formula-box-content';
            content.style.color = color;
            content.style.fontSize = `${normalizeTextSize(element.fontSize, 26) * display.scale}px`;

            const latex = String(element.latex || '');
            const field = document.createElement('math-field');
            field.className = 'formula-math-field';
            field.setAttribute('virtual-keyboard-mode', 'off');
            field.setAttribute('math-virtual-keyboard-policy', 'manual');
            if (!selected) {
                field.setAttribute('read-only', '');
            }
            field.addEventListener('pointerdown', (event) => {
                event.stopPropagation();
                if (!selected) {
                    selectTextElement(element.id);
                }
            });
            field.addEventListener('input', () => {
                element.latex = field.value;
                markUnsaved();
            });
            ensureMathLiveReady().then(() => {
                field.value = latex;
                field.menuItems = [];
                field.mathVirtualKeyboardPolicy = 'manual';
                if (selected) {
                    window.setTimeout(() => field.focus(), 0);
                }
            }).catch(() => {});
            content.appendChild(field);
            cacheFormulaImage(latex, normalizeTextSize(element.fontSize, 26), color);

            move.type = 'button';
            move.className = 'text-box-control text-box-move';
            move.title = 'Move';
            move.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m8 7 4-4 4 4"/><path d="m16 17-4 4-4-4"/></svg>';
            move.addEventListener('pointerdown', (event) => startTextDrag(event, element, 'move'));

            remove.type = 'button';
            remove.className = 'text-box-control text-box-delete';
            remove.title = 'Delete';
            remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>';
            remove.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteTextElement(element);
            });
            remove.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            resize.type = 'button';
            resize.className = 'text-box-control text-box-resize';
            resize.title = 'Resize';
            resize.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12V8"/><path d="M12 20 20 12"/></svg>';
            resize.addEventListener('pointerdown', (event) => startTextDrag(event, element, 'resize'));

            box.append(content, move, remove, resize);
            textLayer.appendChild(box);
        }

        function renderTableOverlay(element, model) {
            const display = tableDisplayBounds(element, model);
            const rows = Math.max(1, Number(element.rows) || 1);
            const cols = Math.max(1, Number(element.cols) || 1);
            const styles = normalizeCellStyles(element.cellStyles);
            const selected = element.id === selectedTableId;
            const box = document.createElement('div');
            const grid = document.createElement('div');
            const move = document.createElement('button');
            const remove = document.createElement('button');
            const resize = document.createElement('button');
            const info = document.createElement('button');

            box.className = `table-box${selected ? ' is-selected' : ''}`;
            box.dataset.tableId = element.id;
            box.style.left = `${display.x}px`;
            box.style.top = `${display.y}px`;
            box.style.width = `${display.width}px`;
            box.style.height = `${display.height}px`;
            box.addEventListener('pointerdown', (event) => {
                event.stopPropagation();
                selectTableElement(element.id);
            });

            grid.className = 'table-cell-grid';
            grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
            for (let row = 0; row < rows; row += 1) {
                for (let col = 0; col < cols; col += 1) {
                    const cell = document.createElement('div');
                    const data = getTableCell(element, row, col);
                    cell.className = 'table-cell-content';
                    cell.contentEditable = selected && !useVirtualKeyboard() ? 'true' : 'false';
                    cell.spellcheck = false;
                    cell.dataset.cell = cellKey(row, col);
                    cell.textContent = data ? data.text : '';
                    cell.style.fontSize = `${styles.fontSize * display.scale}px`;
                    cell.style.fontWeight = styles.bold ? '700' : '400';
                    cell.style.fontStyle = styles.italic ? 'italic' : 'normal';
                    cell.style.textDecoration = styles.underline ? 'underline' : 'none';
                    cell.style.textAlign = styles.align;
                    cell.style.color = styles.color;
                    cell.addEventListener('pointerdown', (event) => {
                        event.stopPropagation();
                        if (useVirtualKeyboard()) {
                            event.preventDefault();
                            const alreadyEditing = virtualKeyboardTarget
                                && virtualKeyboardTarget.type === 'table'
                                && virtualKeyboardTarget.table === element
                                && virtualKeyboardTarget.row === row
                                && virtualKeyboardTarget.col === col;
                            if (!alreadyEditing) {
                                startVirtualTableEditing(element, row, col);
                            }
                            trackVirtualCaretDrag(event);
                            return;
                        }
                        selectTableElement(element.id);
                        window.setTimeout(() => {
                            const activeCell = textLayer.querySelector(`[data-table-id="${element.id}"] [data-cell="${cellKey(row, col)}"]`);
                            if (activeCell) {
                                activeCell.focus();
                            }
                        }, 0);
                    });
                    cell.addEventListener('input', () => {
                        setTableCellText(element, row, col, cell.innerText.replace(/\n$/, ''));
                        markUnsaved();
                    });
                    cell.addEventListener('blur', () => {
                        setTableCellText(element, row, col, cell.innerText.replace(/\n$/, ''));
                        setInteractionCooldown();
                        window.setTimeout(() => {
                            if (!isTextEditing()) {
                                if (isFrameDragActive()) {
                                    deferredViewportResize = true;
                                    return;
                                }
                                scheduleResizeCanvas();
                            }
                        }, 0);
                    });
                    grid.appendChild(cell);
                }
            }

            move.type = 'button';
            move.className = 'text-box-control text-box-move';
            move.title = 'Move table';
            move.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m8 7 4-4 4 4"/><path d="m16 17-4 4-4-4"/></svg>';
            move.addEventListener('pointerdown', (event) => startTableDrag(event, element, 'move'));

            remove.type = 'button';
            remove.className = 'text-box-control text-box-delete';
            remove.title = 'Delete table';
            remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>';
            remove.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteTableElement(element);
            });
            remove.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            resize.type = 'button';
            resize.className = 'text-box-control text-box-resize';
            resize.title = 'Resize table';
            resize.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12V8"/><path d="M12 20 20 12"/></svg>';
            resize.addEventListener('pointerdown', (event) => startTableDrag(event, element, 'resize'));

            info.type = 'button';
            info.className = 'text-box-control text-box-info';
            info.title = 'Table cell options';
            info.setAttribute('aria-label', 'Table cell options');
            info.textContent = 'i';
            info.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                event.stopPropagation();
                selectTableElement(element.id);
                applySelectedTableStylesToControls();
                openModal('tableInfoModal');
            });
            info.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            box.append(grid, move, remove, resize, info);
            textLayer.appendChild(box);
        }

        function createTextBox(bounds, options = {}) {
            const model = currentPageModel();
            const rect = pageDisplayRect(model);
            if (bounds.width * rect.scale < 24 || bounds.height * rect.scale < 20) {
                return null;
            }

            const element = {
                type: 'text',
                id: createElementId(),
                bounds: clampTextBounds(bounds, model),
                text: '',
                fontSize: textDefaults.fontSize,
                bold: textDefaults.bold,
                italic: textDefaults.italic,
                underline: textDefaults.underline,
                align: textDefaults.align,
                color: normalizeColor(textDefaults.color || colorInput.value, '#111827')
            };
            model.elements.push(element);
            clearRedoForCurrentPage();
            markUnsaved();
            updateUndoButton();
            renderTextLayer();
            if (options.skipFocus) {
                // caller will handle content/selection itself (e.g. AI-created text)
            } else if (useVirtualKeyboard()) {
                startVirtualTextEditing(element);
            } else {
                selectTextElement(element.id, { focus: true });
            }
            return element;
        }

        function drawTable(bounds) {
            createTableAt(tableRows, tableCols, bounds);
        }

        function createTableAt(rows, cols, bounds) {
            const model = currentPageModel();
            const rect = pageDisplayRect(model);
            if (bounds.width * rect.scale < 8 || bounds.height * rect.scale < 8) {
                return null;
            }

            const element = {
                type: 'table',
                id: createElementId(),
                bounds,
                rows: Math.max(1, Number(rows) || 1),
                cols: Math.max(1, Number(cols) || 1),
                cellStyles: normalizeCellStyles(tableDefaults),
                cells: []
            };
            model.elements.push(element);
            clearRedoForCurrentPage();
            renderTable(element, model);
            selectTableElement(element.id);
            markUnsaved();
            updateUndoButton();
            return element;
        }

        function calculateResultForFormula(id, resultText) {
            const model = currentPageModel();
            const formula = model.elements.find((el) => el.id === id && el.type === 'formula');
            if (!formula || typeof resultText !== 'string' || !resultText.trim()) {
                return false;
            }
            const text = resultText.trim();
            const bounds = formula.bounds || { x: 0, y: 0, width: 200, height: 40 };
            const fontSize = defaultTextDefaults.fontSize;
            const padding = 12;
            const lineHeight = fontSize * 1.25;
            const maxWidth = Math.min(320, model.baseWidth * 0.5);

            ctx.save();
            ctx.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
            const lines = wrapTextLines(ctx, text, Math.max(1, maxWidth - padding * 2));
            const longestLineWidth = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 0);
            ctx.restore();

            const width = Math.max(60, Math.min(maxWidth, longestLineWidth + padding * 2));
            const height = Math.max(lineHeight + padding * 2, lines.length * lineHeight + padding * 2);

            const gap = 12;
            const newBounds = {
                x: bounds.x + bounds.width + gap,
                y: bounds.y,
                width,
                height
            };
            const element = createTextBox(newBounds, { skipFocus: true });
            if (!element) {
                return false;
            }
            element.text = text;
            element.fontSize = fontSize;
            renderTextLayer();
            saveSessionNow({ includePages: false });
            return true;
        }

        const SHAPE_LIBRARY = [
            { shapeType: 'line', label: 'Line' },
            { shapeType: 'arrow', label: 'Arrow' },
            { shapeType: 'rectangle', label: 'Rectangle' },
            { shapeType: 'rectangle', label: 'Square', square: true },
            { shapeType: 'circle', label: 'Circle' },
            { shapeType: 'ellipse', label: 'Ellipse' },
            { shapeType: 'triangle', label: 'Triangle' },
            { shapeType: 'rhombus', label: 'Rhombus' }
        ];

        const SHAPE_LIBRARY_ICONS = {
            line: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40 40 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
            arrow: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40 34 14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M20 14h14v14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            rectangle: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="13" width="34" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
            square: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="10" width="28" height="28" rx="2" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
            circle: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
            ellipse: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="24" rx="18" ry="12" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
            triangle: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 8 41 38H7Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
            rhombus: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7 41 24 24 41 7 24Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>'
        };

        function shapeLibraryIconKey(entry) {
            return entry.square ? 'square' : entry.shapeType;
        }

        function buildLibraryShapeDraft(entry, model) {
            const cx = model.baseWidth / 2;
            const cy = model.baseHeight / 2;
            const size = Math.max(24, Math.min(160, model.baseWidth * 0.4, model.baseHeight * 0.4));
            const half = size / 2;

            if (entry.shapeType === 'line' || entry.shapeType === 'arrow') {
                return {
                    shapeType: entry.shapeType,
                    from: { x: cx - half, y: cy },
                    to: { x: cx + half, y: cy }
                };
            }

            if (entry.shapeType === 'rectangle') {
                const width = entry.square ? size : size * 1.4;
                const height = size;
                return {
                    shapeType: 'rectangle',
                    bounds: { x: cx - width / 2, y: cy - height / 2, width, height }
                };
            }

            if (entry.shapeType === 'circle' || entry.shapeType === 'ellipse') {
                const width = entry.shapeType === 'ellipse' ? size * 1.4 : size;
                const height = size;
                return {
                    shapeType: entry.shapeType,
                    bounds: { x: cx - width / 2, y: cy - height / 2, width, height }
                };
            }

            if (entry.shapeType === 'triangle') {
                return {
                    shapeType: 'triangle',
                    points: [
                        { x: cx, y: cy - half },
                        { x: cx - half, y: cy + half },
                        { x: cx + half, y: cy + half }
                    ]
                };
            }

            if (entry.shapeType === 'rhombus') {
                return {
                    shapeType: 'rhombus',
                    points: [
                        { x: cx, y: cy - half },
                        { x: cx + half, y: cy },
                        { x: cx, y: cy + half },
                        { x: cx - half, y: cy }
                    ]
                };
            }

            return null;
        }

        function insertLibraryShape(entry) {
            const model = currentPageModel();
            const draft = buildLibraryShapeDraft(entry, model);
            const element = draft && normalizeSmartShapeElement(draft);
            if (!element) {
                return null;
            }

            model.elements.push(element);
            clearRedoForCurrentPage();
            markUnsaved();
            updateUndoButton();
            closeSlidePanel();
            renderCurrentPage().catch((error) => console.error(error));
            scheduleSessionSave();
            return element;
        }

        async function renderPdfPageForImport(pdfDoc, pageIndex) {
            const page = await pdfDoc.getPage(pageIndex + 1);
            const baseViewport = page.getViewport({ scale: 1 });
            // Cap the rendered size instead of a flat 2x scale, so a poster-sized page doesn't
            // produce an oversized raster and a small page isn't upscaled needlessly.
            const maxDimension = 2000;
            const scale = Math.min(2, maxDimension / Math.max(baseViewport.width, baseViewport.height));
            const renderViewport = page.getViewport({ scale });
            const buffer = document.createElement('canvas');
            buffer.width = Math.max(1, Math.round(renderViewport.width));
            buffer.height = Math.max(1, Math.round(renderViewport.height));
            const bufferCtx = buffer.getContext('2d');
            await page.render({ canvasContext: bufferCtx, viewport: renderViewport }).promise;
            return {
                dataUrl: buffer.toDataURL('image/jpeg', 0.85),
                baseWidth: baseViewport.width,
                baseHeight: baseViewport.height
            };
        }

        function highestKnownPageNumber() {
            let max = currentPage;
            for (const key of pageModels.keys()) {
                max = Math.max(max, key);
            }
            for (const key of pages.keys()) {
                max = Math.max(max, key);
            }
            return max;
        }

        async function lockPdfPageOnServer(pdfId, pageIndex) {
            const form = new FormData();
            form.append('action', 'lock_pdf_page');
            form.append('pdf_id', pdfId);
            form.append('page_index', String(pageIndex));
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            return response.ok;
        }

        async function unlockPdfPageOnServer(pdfId, pageIndex) {
            const form = new FormData();
            form.append('action', 'unlock_pdf_page');
            form.append('pdf_id', pdfId);
            form.append('page_index', String(pageIndex));
            try {
                await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            } catch (error) {
                console.error('unlockPdfPageOnServer failed', error);
            }
        }

        async function insertPdfPages(pdfId, pdfUrl, pageIndices, options = {}) {
            if (!window.pdfjsLib) {
                window.alert('The PDF import engine failed to load.');
                return;
            }

            // Lock each page on the server *before* inserting it, immediately —
            // not deferred to the next document save. A brand-new, never-saved
            // canvas has no server-side document yet, so background autosave
            // (which refuses to create new documents) would never run, and the
            // page would never actually become locked. This is the fix for that.
            // `skipLock` is for favourites uploaded directly (no source PDF
            // library entry to lock against — there's nothing to look up).
            let lockedIndices = pageIndices;
            if (!options.skipLock) {
                lockedIndices = [];
                let skippedCount = 0;
                for (const pageIndex of pageIndices) {
                    const locked = await lockPdfPageOnServer(pdfId, pageIndex);
                    if (locked) {
                        lockedIndices.push(pageIndex);
                    } else {
                        skippedCount += 1;
                    }
                }

                if (skippedCount > 0) {
                    showCanvasToast(skippedCount === 1
                        ? 'That page is already in a notebook and was skipped.'
                        : `${skippedCount} of the selected pages are already in a notebook and were skipped.`);
                }

                if (lockedIndices.length === 0) {
                    return;
                }
            }

            let pdfDoc;
            try {
                pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
            } catch (error) {
                console.error('insertPdfPages failed to load the PDF', error);
                if (!options.skipLock) {
                    for (const pageIndex of lockedIndices) {
                        await unlockPdfPageOnServer(pdfId, pageIndex);
                    }
                }
                showCanvasToast('Could not open this PDF. Please try again.');
                return;
            }

            rememberCurrentPage();

            let nextPageNumber = highestKnownPageNumber() + 1;
            let firstInserted = null;
            for (const pageIndex of lockedIndices) {
                try {
                    const rendered = await renderPdfPageForImport(pdfDoc, pageIndex);
                    const model = createPageModel();
                    model.baseWidth = rendered.baseWidth;
                    model.baseHeight = rendered.baseHeight;
                    model.fallbackImage = rendered.dataUrl;
                    // Only track sourcePdf (and thus the lock system) for pages
                    // that came from a real PDF library entry — a favourite
                    // uploaded directly (skipLock) has no such entry to reference.
                    if (!options.skipLock) {
                        model.sourcePdf = { pdfId, pageIndex };
                    }
                    ensureElementIds(model);
                    pageModels.set(nextPageNumber, model);
                    if (firstInserted === null) {
                        firstInserted = nextPageNumber;
                    }
                    nextPageNumber += 1;
                } catch (error) {
                    console.error('insertPdfPages failed for page', pageIndex, error);
                    if (!options.skipLock) {
                        await unlockPdfPageOnServer(pdfId, pageIndex);
                    }
                }
            }

            markUnsaved();
            scheduleSessionSave();
            closeSlidePanel();
            if (firstInserted !== null) {
                await goToPage(firstInserted);
            }
        }

        function setPaperTab(tab) {
            const normalizedTab = normalizeGuideMode(tab);
            blankPaperBtn.classList.toggle('is-active', normalizedTab === 'none');
            ruledTabBtn.classList.toggle('is-active', normalizedTab === 'ruled');
            gridTabBtn.classList.toggle('is-active', normalizedTab === 'grid');
        }

        function updateOptionPreviews() {
            if (colorPreview) {
                colorPreview.style.color = colorInput.value;
            }
            penHardnessInput.value = toolSettings.pen.hardness;
            penHardnessLabel.textContent = `${toolSettings.pen.hardness}%`;
            penOpacityInput.value = toolSettings.pen.opacity;
            penOpacityLabel.textContent = `${toolSettings.pen.opacity}%`;
            penSizeInput.value = toolSettings.pen.size;
            penSizeLabel.textContent = `${toolSettings.pen.size}px`;
            eraserHardnessInput.value = toolSettings.eraser.hardness;
            eraserHardnessLabel.textContent = `${toolSettings.eraser.hardness}%`;
            eraserOpacityInput.value = toolSettings.eraser.opacity;
            eraserOpacityLabel.textContent = `${toolSettings.eraser.opacity}%`;
            eraserSizeInput.value = toolSettings.eraser.size;
            eraserSizeLabel.textContent = `${toolSettings.eraser.size}px`;
            document.querySelectorAll('[data-tool][data-tip]').forEach((button) => {
                const tool = button.dataset.tool;
                button.classList.toggle('is-active', toolSettings[tool].tip === button.dataset.tip);
            });
            brushCursor.style.borderColor = activeTool === 'eraser' ? 'rgba(102, 112, 133, 0.75)' : colorInput.value;
            const diameter = Math.max(4, brushDiameter());
            brushCursor.style.width = `${diameter}px`;
            brushCursor.style.height = `${diameter}px`;
            renderRecentColours();
            applySelectedTextStylesToControls();
        }

        function isNearFloatingControl(event) {
            const buffer = 10;
            const controls = document.querySelectorAll('.toolbar, .page-control, .delete-page-float');
            for (const el of controls) {
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) {
                    continue;
                }
                if (
                    event.clientX >= rect.left - buffer &&
                    event.clientX <= rect.right + buffer &&
                    event.clientY >= rect.top - buffer &&
                    event.clientY <= rect.bottom + buffer
                ) {
                    return true;
                }
            }
            return false;
        }

        canvas.addEventListener('pointerdown', (event) => {
            if (isNearFloatingControl(event)) {
                return;
            }
            event.preventDefault();
            if (isInteractionCoolingDown()) {
                hideBrushCursor();
                return;
            }
            if (isLandscapeBlocked) {
                hideBrushCursor();
                return;
            }
            if (event.pointerType === 'pen') {
                activePenPointerId = event.pointerId;
                lastPenActivityAt = Date.now();
            }
            if (isPalmRejectionCandidate(event) || (drawing && event.pointerType === 'touch')) {
                return;
            }
            updateBrushCursor(event);
            canvas.setPointerCapture(event.pointerId);
            if (drawingSelectionMode) {
                clearFrameSelectionState();
                clearDrawingSelection();
                drawingSelectionMode = true;
                drawingSelecting = true;
                drawingSelectionStart = pagePointFromEvent(event);
                showSelectionRect(selectionDisplayBounds(drawingSelectionStart, drawingSelectionStart));
                return;
            }
            if (textSelectionMode) {
                clearFrameSelectionState();
                textSelecting = true;
                textStart = pagePointFromEvent(event);
                showSelectionRect(selectionDisplayBounds(textStart, textStart));
                return;
            }
            if (tableSelectionMode) {
                clearFrameSelectionState();
                tableSelecting = true;
                tableStart = pagePointFromEvent(event);
                showSelectionRect(selectionDisplayBounds(tableStart, tableStart));
                return;
            }
            if (clearActiveEditableSelection()) {
                hideBrushCursor();
                return;
            }
            drawing = true;
            lastPoint = pagePointFromEvent(event);
            currentStroke = null;
            if (activeTool === 'pen' && isPenBarrelButtonHeld(event)) {
                barrelEraserActive = true;
                setTool('eraser');
            }
            if (activeTool === 'eraser') {
                beginEraseGesture();
            }
        });

        canvas.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'pen') {
                lastPenActivityAt = Date.now();
            }
            if (isLandscapeBlocked) {
                hideBrushCursor();
                return;
            }
            updateBrushCursor(event);
            if (textSelecting && textStart) {
                event.preventDefault();
                showSelectionRect(selectionDisplayBounds(textStart, pagePointFromEvent(event)));
                return;
            }

            if (tableSelecting && tableStart) {
                event.preventDefault();
                showSelectionRect(selectionDisplayBounds(tableStart, pagePointFromEvent(event)));
                return;
            }

            if (drawingSelecting && drawingSelectionStart) {
                event.preventDefault();
                showSelectionRect(selectionDisplayBounds(drawingSelectionStart, pagePointFromEvent(event)));
                return;
            }

            if (!drawing || !lastPoint) return;
            event.preventDefault();
            const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];

            if (activeTool === 'eraser') {
                const model = currentPageModel();
                const radius = eraserRadiusInPageUnits();
                let changed = false;
                for (const pointerEvent of events) {
                    const nextPoint = pagePointFromEvent(pointerEvent);
                    if (applyEraseSegment(lastPoint, nextPoint, radius, model)) {
                        changed = true;
                    }
                    lastPoint = nextPoint;
                }
                if (changed) {
                    markUnsaved();
                    updateUndoButton();
                    renderCurrentPage().catch((error) => console.error(error));
                }
                return;
            }

            for (const pointerEvent of events) {
                const nextPoint = pagePointFromEvent(pointerEvent);
                lastPoint = drawLine(lastPoint, nextPoint, pointerEvent);
            }
        });

        function moveSelectedTextByPointer(event) {
            if (!textDragMode || !selectedTextId || event.pointerId !== textDragPointerId) {
                return;
            }

            const element = selectedTextElement();
            if (!element || !textDragStart || !textDragOriginalBounds) {
                return;
            }

            event.preventDefault();
            const delta = dragClientDelta(textDragStartClient, event);
            textDragLastDelta = delta;
            if (textDragPending) {
                if (delta.distance < dragStartThreshold) {
                    return;
                }
                textDragPending = false;
            }
            applyDragPreview(activeTextDomElement(), textDragOriginalDisplay, textDragMode, delta);
        }

        function stopTextDrag(event) {
            if (!textDragMode || event.pointerId !== textDragPointerId) {
                return;
            }

            const element = selectedTextElement();
            const model = currentPageModel();
            if (element && textDragOriginalBounds && textDragStartClient && !textDragPending) {
                const delta = textDragLastDelta || dragClientDelta(textDragStartClient, event);
                element.bounds = boundsFromDrag(textDragOriginalBounds, textDragMode, delta, model, clampTextBounds);
            }

            textDragMode = '';
            textDragPointerId = null;
            textDragStart = null;
            textDragStartClient = null;
            textDragOriginalBounds = null;
            textDragOriginalDisplay = null;
            textDragLastDelta = null;
            if (!textDragPending) {
                markUnsaved();
                renderTextLayer();
            }
            textDragPending = false;
            flushDeferredViewportResize();
        }

        function moveSelectedTableByPointer(event) {
            if (!tableDragMode || !selectedTableId || event.pointerId !== tableDragPointerId) {
                return;
            }

            const element = selectedTableElement();
            if (!element || !tableDragStart || !tableDragOriginalBounds) {
                return;
            }

            event.preventDefault();
            const delta = dragClientDelta(tableDragStartClient, event);
            tableDragLastDelta = delta;
            if (tableDragPending) {
                if (delta.distance < dragStartThreshold) {
                    return;
                }
                tableDragPending = false;
            }
            applyDragPreview(activeTableDomElement(), tableDragOriginalDisplay, tableDragMode, delta);
        }

        function stopTableDrag(event) {
            if (!tableDragMode || event.pointerId !== tableDragPointerId) {
                return;
            }

            const element = selectedTableElement();
            const model = currentPageModel();
            if (element && tableDragOriginalBounds && tableDragStartClient && !tableDragPending) {
                const delta = tableDragLastDelta || dragClientDelta(tableDragStartClient, event);
                element.bounds = boundsFromDrag(tableDragOriginalBounds, tableDragMode, delta, model, clampTableBounds);
            }

            tableDragMode = '';
            tableDragPointerId = null;
            tableDragStart = null;
            tableDragStartClient = null;
            tableDragOriginalBounds = null;
            tableDragOriginalDisplay = null;
            tableDragLastDelta = null;
            if (!tableDragPending) {
                markUnsaved();
                renderCurrentPage().catch((error) => console.error(error));
            }
            tableDragPending = false;
            flushDeferredViewportResize();
        }

        function startDrawingSelectionDrag(event) {
            if (!drawingSelectionBounds || selectedStrokeIds.length === 0) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            const rotateTarget = event.target && event.target.closest('[data-selection-rotate]');
            const handleTarget = event.target && event.target.closest('[data-selection-handle]');
            drawingSelectionDragMode = rotateTarget
                ? 'rotate'
                : (handleTarget ? 'resize' : 'move');
            drawingSelectionDragHandle = handleTarget ? handleTarget.dataset.selectionHandle : '';
            drawingSelectionPointerId = event.pointerId;
            drawingSelectionDragStart = pagePointFromEvent(event);
            drawingSelectionOriginalBounds = { ...drawingSelectionBounds };
            drawingSelectionOriginalPoints = snapshotSelectedStrokePoints();
            drawingSelectionRotateCenter = {
                x: drawingSelectionBounds.x + drawingSelectionBounds.width / 2,
                y: drawingSelectionBounds.y + drawingSelectionBounds.height / 2
            };
            drawingSelectionStartAngle = Math.atan2(drawingSelectionDragStart.y - drawingSelectionRotateCenter.y, drawingSelectionDragStart.x - drawingSelectionRotateCenter.x);
            selectionRect.setPointerCapture(event.pointerId);
        }

        function moveDrawingSelectionByPointer(event) {
            if (!drawingSelectionDragMode || event.pointerId !== drawingSelectionPointerId || !drawingSelectionOriginalBounds) {
                return;
            }

            event.preventDefault();
            const point = pagePointFromEvent(event);
            const model = currentPageModel();
            let nextBounds = drawingSelectionOriginalBounds;
            if (drawingSelectionDragMode === 'rotate') {
                const angle = Math.atan2(point.y - drawingSelectionRotateCenter.y, point.x - drawingSelectionRotateCenter.x);
                applyDrawingSelectionRotation(angle - drawingSelectionStartAngle);
                renderCurrentPage().catch((error) => console.error(error));
                return;
            }
            if (drawingSelectionDragMode === 'move') {
                nextBounds = {
                    ...drawingSelectionOriginalBounds,
                    x: drawingSelectionOriginalBounds.x + point.x - drawingSelectionDragStart.x,
                    y: drawingSelectionOriginalBounds.y + point.y - drawingSelectionDragStart.y
                };
            } else {
                nextBounds = resizedSelectionBounds(drawingSelectionOriginalBounds, drawingSelectionDragHandle, point);
            }
            nextBounds = clampSelectionBoundsToPage(nextBounds, model);
            applyDrawingSelectionTransform(nextBounds);
            renderCurrentPage().catch((error) => console.error(error));
        }

        function stopDrawingSelectionDrag(event) {
            if (!drawingSelectionDragMode || event.pointerId !== drawingSelectionPointerId) {
                return;
            }

            const changed = recordDrawingSelectionTransformAction();
            drawingSelectionDragMode = '';
            drawingSelectionDragHandle = '';
            drawingSelectionPointerId = null;
            drawingSelectionDragStart = null;
            drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
            drawingSelectionRotationAngle = 0;
            drawingSelectionOriginalBounds = null;
            drawingSelectionOriginalPoints = null;
            drawingSelectionRotateCenter = null;
            drawingSelectionStartAngle = 0;
            if (changed) {
                dirtyPages.add(currentPage);
                hasUnsavedChanges = true;
                rememberCurrentPage();
                updateUndoButton();
                scheduleSessionSave();
            }
            renderDrawingSelection();
            if (event && selectionRect.hasPointerCapture(event.pointerId)) {
                selectionRect.releasePointerCapture(event.pointerId);
            }
        }

        function duplicateSelectedStrokes() {
            if (selectedStrokeIds.length === 0) return;
            const model = currentPageModel();
            const newIds = [];
            const offset = 20;

            for (const id of selectedStrokeIds) {
                const element = model.elements.find(el => el.id === id);
                if (!element) continue;

                const clone = JSON.parse(JSON.stringify(element));
                clone.id = createElementId();

                if (clone.type === 'stroke' && Array.isArray(clone.points)) {
                clone.points = clone.points.map(p => ({
                ...p,
                x: p.x + offset,
                y: p.y + offset
            }));
            clone.bounds = calculateStrokeBounds(clone.points);
            } else if (clone.type === 'smart-shape') {
            if (clone.from) {
                clone.from = { x: clone.from.x + offset, y: clone.from.y + offset };
            }
            if (clone.to) {
                clone.to = { x: clone.to.x + offset, y: clone.to.y + offset };
            }
            if (Array.isArray(clone.points)) {
                clone.points = clone.points.map(p => ({
                x: p.x + offset,
                y: p.y + offset
                }));
            }
            if (clone.bounds) {
                clone.bounds = {
                x: clone.bounds.x + offset,
                y: clone.bounds.y + offset,
                width: clone.bounds.width,
                height: clone.bounds.height
            };
            }
            if (Number.isFinite(clone.cx)) {
                clone.cx += offset;
                clone.cy += offset;
                }
            }

                model.elements.push(clone);
                newIds.push(clone.id);
            }

            selectedStrokeIds = newIds;
            drawingSelectionBounds = combinedStrokeBounds(selectedStrokeElements());
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
            renderDrawingSelection();
            }

            function deleteSelectedStrokes() {
                if (selectedStrokeIds.length === 0) return;
                const model = currentPageModel();

                for (const id of selectedStrokeIds) {
                    const index = model.elements.findIndex(el => el.id === id);
                    if (index >= 0) {
                        model.elements.splice(index, 1);
                    }
                }

                clearDrawingSelection();
                markUnsaved();
                updateUndoButton();
                renderCurrentPage().catch((error) => console.error(error));
            }   
            
            

            function changeSelectedStrokesColor(color) {
                if (selectedStrokeIds.length === 0) return;
                const model = currentPageModel();

                for (const id of selectedStrokeIds) {
                const element = model.elements.find(el => el.id === id);
                if (!element) continue;

                if (element.type === 'stroke') {
                element.color = normalizeColor(color, element.color || '#111827');
                } else if (element.type === 'smart-shape') {
                if (element.style) {
                element.style.color = normalizeColor(color, element.style.color || '#111827');
                }
                }
                }

                markUnsaved();
                renderCurrentPage().catch((error) => console.error(error));
            }



            function positionSelectionColorPopup(popup) {
                const edgeGap = 12;
                const rectBox = selectionRect.getBoundingClientRect();
                const popupBox = popup.getBoundingClientRect();
                const desiredLeft = rectBox.left - 104;
                const desiredTop = rectBox.bottom + 180 - popupBox.height;
                const maxLeft = window.innerWidth - popupBox.width - edgeGap;
                const maxTop = window.innerHeight - popupBox.height - edgeGap;
                const clampedLeft = Math.min(Math.max(desiredLeft, edgeGap), Math.max(edgeGap, maxLeft));
                const clampedTop = Math.min(Math.max(desiredTop, edgeGap), Math.max(edgeGap, maxTop));
                popup.style.left = `${clampedLeft - rectBox.left}px`;
                popup.style.top = `${clampedTop - rectBox.top}px`;
                popup.style.bottom = 'auto';
            }

            selectionRect.addEventListener('pointerdown', (event) => {
                const duplicateTarget = event.target && event.target.closest('[data-selection-duplicate]');
                const deleteTarget = event.target && event.target.closest('[data-selection-delete]');
                const infoTarget = event.target && event.target.closest('[data-selection-info]');
                const colorPopup = document.getElementById('selectionColorPopup');

                if (duplicateTarget) {
                event.preventDefault();
                event.stopPropagation();
                duplicateSelectedStrokes();
                return;
                }

                if (deleteTarget) {
                event.preventDefault();
                event.stopPropagation();
                deleteSelectedStrokes();
                return;
                }

                if (infoTarget) {
                event.preventDefault();
                event.stopPropagation();
                if (colorPopup) {
                const willShow = !colorPopup.classList.contains('is-visible');
                if (willShow) {
                colorPopup.classList.add('is-visible');
                positionSelectionColorPopup(colorPopup);
                } else {
                commitPendingCustomColour();
                colorPopup.classList.remove('is-visible');
                }
                }
                return;
                }

                if (event.target && event.target.closest('.selection-color-popup')) {
                return;
                }

                // Close color popup if clicking elsewhere
                if (colorPopup && colorPopup.classList.contains('is-visible')) {
                commitPendingCustomColour();
                colorPopup.classList.remove('is-visible');
                }

                startDrawingSelectionDrag(event);
            });

        document.addEventListener('pointermove', moveSelectedTextByPointer);
        document.addEventListener('pointermove', moveSelectedTableByPointer);
        document.addEventListener('pointermove', moveDrawingSelectionByPointer);
        document.addEventListener('pointerup', stopTextDrag);
        document.addEventListener('pointerup', stopTableDrag);
        document.addEventListener('pointerup', stopDrawingSelectionDrag);
        document.addEventListener('pointercancel', stopTextDrag);
        document.addEventListener('pointercancel', stopTableDrag);
        document.addEventListener('pointercancel', stopDrawingSelectionDrag);

        function maybeConvertCurrentStrokeToSmartShape() {
            if (!smartShapeConversionEnabled || !isPerfectShapeActiveForCurrentPage() || activeTool !== 'pen') {
                return false;
            }
            if (textSelectionMode || textSelecting || tableSelectionMode || tableSelecting || drawingSelectionMode || drawingSelecting) {
                return false;
            }

            const model = currentPageModel();
            const stroke = currentStroke;
            if (!stroke || stroke.type !== 'stroke' || stroke.tool === 'eraser' || !Array.isArray(stroke.points)) {
                return false;
            }
            if (stroke.points.length < SMART_SHAPE_RULES.minStrokePoints || !Array.isArray(model.elements) || model.elements.length === 0) {
                return false;
            }

            const lastIndex = model.elements.length - 1;
            const lastElement = model.elements[lastIndex];
            if (lastElement !== stroke && (!lastElement || lastElement.id !== stroke.id)) {
                return false;
            }

            const detection = detectSmartShape(stroke);
            if (!detection || detection.confidence < SMART_SHAPE_RULES.autoConvertConfidence) {
                return false;
            }

            const smartObject = createSmartObjectFromDetection(detection, stroke);
            if (!smartObject) {
                return false;
            }

            model.elements.splice(lastIndex, 1, smartObject);
            markUnsaved();
            updateUndoButton();
            renderCurrentPage().catch((error) => console.error(error));
            return true;
        }

        function stopDrawing(event) {
            if (event && event.pointerType === 'pen' && event.pointerId === activePenPointerId) {
                activePenPointerId = null;
                lastPenActivityAt = Date.now();
            }
            if (isLandscapeBlocked) {
                drawing = false;
                tableSelecting = false;
                textSelecting = false;
                lastPoint = null;
                currentStroke = null;
                eraseGestureRoots = null;
                hideSelectionRect();
                hideBrushCursor();
                if (barrelEraserActive) {
                    barrelEraserActive = false;
                    setTool('pen');
                }
                if (event && canvas.hasPointerCapture(event.pointerId)) {
                    canvas.releasePointerCapture(event.pointerId);
                }
                return;
            }

            if (textSelecting && textStart) {
                const bounds = selectionBounds(textStart, pagePointFromEvent(event));
                createTextBox(bounds);
                hideSelectionRect();
                textSelecting = false;
                textSelectionMode = false;
                textStart = null;
                setTool(lastDrawingTool || 'pen');
                if (event && canvas.hasPointerCapture(event.pointerId)) {
                    canvas.releasePointerCapture(event.pointerId);
                }
                return;
            }

            if (tableSelecting && tableStart) {
                const bounds = selectionBounds(tableStart, pagePointFromEvent(event));
                drawTable(bounds);
                hideSelectionRect();
                tableSelecting = false;
                tableSelectionMode = false;
                tableStart = null;
                setTool(lastDrawingTool || 'pen');
                if (event && canvas.hasPointerCapture(event.pointerId)) {
                    canvas.releasePointerCapture(event.pointerId);
                }
                return;
            }

            if (drawingSelecting && drawingSelectionStart) {
                const bounds = selectionBounds(drawingSelectionStart, pagePointFromEvent(event));
                drawingSelecting = false;
                drawingSelectionStart = null;
                if (bounds.width >= 3 && bounds.height >= 3) {
                    selectStrokesInBounds(bounds);
                } else {
                    clearDrawingSelection();
                    drawingSelectionMode = true;
                }
                if (event && canvas.hasPointerCapture(event.pointerId)) {
                    canvas.releasePointerCapture(event.pointerId);
                }
                return;
            }

            if (activeTool === 'eraser') {
                finishEraseGesture();
                updateUndoButton();
                scheduleSessionSave();
            } else {
                maybeConvertCurrentStrokeToSmartShape();
            }
            if (barrelEraserActive) {
                barrelEraserActive = false;
                setTool('pen');
            }
            drawing = false;
            lastPoint = null;
            currentStroke = null;
            if (event && canvas.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        }

        // Shared by the legacy saveDrawing() form-post and the Stage 2 REST
        // autosave call, so both send the exact same vector/element snapshot.
        function buildDocumentContentPayload() {
            return {
                version: 1,
                aiCostTotalGbp: normalizeCost(aiCostTotalGbp),
                pages: [...pageModels.entries()]
                    .filter(([page]) => pageHasContent(page))
                    .sort((a, b) => a[0] - b[0])
                    .map(([page, model]) => ({ page, ...model }))
            };
        }

        // Stage 3 of the autosave migration (see AUDIT.md "Migrare autosave"):
        // dispatches to the new REST-based save path when the flag is on, keeping
        // the legacy /canvas/api path fully intact (and just a flag flip away)
        // for instant fallback.
        async function saveDrawing(overwrite = false, options = {}) {
            if (window.CANVAS_AUTOSAVE_ENABLED) {
                return saveDrawingRest(overwrite, options);
            }
            return saveDrawingLegacy(overwrite, options);
        }

        async function saveDrawingLegacy(overwrite = false, options = {}) {
            const newAfterSave = Boolean(options.newAfterSave);
            const filename = options.filename || '';
            const status = document.getElementById('saveStatus');
            const form = new FormData();
            rememberCurrentPage();
            const documentPayload = buildDocumentContentPayload();
            const pagePayload = [...pages.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([page, image]) => ({ page, image }));
            form.append('action', 'save');
            const filenameInput = document.getElementById('filenameInput');
            form.append('filename', filename || filenameInput.value.trim() || filenameInput.placeholder);
            form.append('pages', JSON.stringify(pagePayload));
            form.append('document', JSON.stringify(documentPayload));
            form.append('overwrite', overwrite ? '1' : '0');
            const paperMetadata = currentPaperMetadata();
            form.append('guideMode', paperMetadata.guideMode);
            form.append('guidesVisible', paperMetadata.guidesVisible ? '1' : '0');
            const overwriteStatus = document.getElementById('overwriteStatus');
            status.textContent = overwrite ? '' : 'Saving...';
            overwriteStatus.textContent = overwrite ? 'Overwriting...' : '';
            showSavingSpinner();

            try {
                const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
                const data = await response.json();

                if (data.exists) {
                    pendingOverwriteName = data.file;
                    pendingNewAfterSave = newAfterSave;
                    overwriteText.textContent = `"${displayName(data.file)}" already exists. Do you want to overwrite it?`;
                    status.textContent = '';
                    overwriteStatus.textContent = '';
                    openModal('overwriteModal');
                    return;
                }

                if (data.ok) {
                    status.textContent = `Saved: ${displayName(data.file)}`;
                    overwriteStatus.textContent = `Saved: ${displayName(data.file)}`;
                    setCurrentFile(data.file);
                    currentDocumentId = Number.isInteger(data.id) ? data.id : currentDocumentId;
                    currentVersion = Number.isInteger(data.version) ? data.version : currentVersion;
                    hasUnsavedChanges = false;
                    dirtyPages.clear();
                    saveSessionNow({ includePages: true });
                    if (newAfterSave) {
                        resetToNewDrawing();
                        return;
                    }
                    closeModals();
                    return;
                }

                const message = data.error || 'Save failed.';
                status.textContent = message;
                overwriteStatus.textContent = message;
            } catch (error) {
                status.textContent = 'Save failed.';
                document.getElementById('overwriteStatus').textContent = 'Save failed.';
            } finally {
                hideSavingSpinner();
            }
        }

        // Resolves (creating or overwriting as needed) the numeric document row
        // for a target "folder/title" filename via the REST endpoints, mirroring
        // the legacy dispatcher's create-if-missing + overwrite-confirm semantics.
        // Returns { conflict: true } on an unconfirmed name collision, otherwise
        // { id, version }.
        async function resolveDocumentForSave(targetFilename, overwrite, contentPayload, paperMetadata) {
            const folderName = fileFolder(targetFilename);
            const title = displayName(targetFilename);
            const response = await fetch('/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': __csrfToken },
                body: JSON.stringify({
                    title,
                    folder: folderName || undefined,
                    overwrite: Boolean(overwrite),
                    content: contentPayload,
                    page_count: contentPayload.pages.length,
                    guideMode: mapGuideModeForRest(paperMetadata.guideMode),
                    guidesVisible: paperMetadata.guidesVisible
                })
            });
            if (response.status === 409) {
                return { conflict: true };
            }
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !Number.isInteger(data.id)) {
                throw new Error(data.error || 'Save failed.');
            }
            return { id: data.id, version: data.version };
        }

        async function saveDrawingRest(overwrite = false, options = {}) {
            const newAfterSave = Boolean(options.newAfterSave);
            const filename = options.filename || '';
            const status = document.getElementById('saveStatus');
            const overwriteStatus = document.getElementById('overwriteStatus');
            rememberCurrentPage();
            const contentPayload = buildDocumentContentPayload();
            const paperMetadata = currentPaperMetadata();
            const filenameInput = document.getElementById('filenameInput');
            const targetFilename = filename || filenameInput.value.trim() || filenameInput.placeholder;

            status.textContent = overwrite ? '' : 'Saving...';
            overwriteStatus.textContent = overwrite ? 'Overwriting...' : '';
            showSavingSpinner();

            try {
                let documentId = currentDocumentId;
                let version = currentVersion;

                // Only need to resolve/create a document row via POST /documents when
                // we don't already know which one is open, or the user is saving
                // under a different name (Save As) than the currently open document.
                if (!Number.isInteger(documentId) || targetFilename !== currentFilename) {
                    const resolved = await resolveDocumentForSave(targetFilename, overwrite, contentPayload, paperMetadata);
                    if (resolved.conflict) {
                        pendingOverwriteName = targetFilename;
                        pendingNewAfterSave = newAfterSave;
                        overwriteText.textContent = `"${displayName(targetFilename)}" already exists. Do you want to overwrite it?`;
                        status.textContent = '';
                        overwriteStatus.textContent = '';
                        openModal('overwriteModal');
                        return;
                    }
                    documentId = resolved.id;
                    version = resolved.version;
                }

                const requestId = generateRequestId();
                const response = await fetch(`/documents/${documentId}/autosave`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': __csrfToken },
                    body: JSON.stringify({
                        request_id: requestId,
                        version,
                        content: contentPayload,
                        page_count: contentPayload.pages.length,
                        guideMode: mapGuideModeForRest(paperMetadata.guideMode),
                        guidesVisible: paperMetadata.guidesVisible
                    })
                });
                const data = await response.json().catch(() => ({}));

                if (response.status === 409) {
                    const message = 'This document changed elsewhere. Reload the page to see the latest version before continuing.';
                    status.textContent = message;
                    overwriteStatus.textContent = message;
                    return;
                }
                if (!response.ok || !data.ok) {
                    const message = data.error || 'Save failed.';
                    status.textContent = message;
                    overwriteStatus.textContent = message;
                    return;
                }

                currentDocumentId = documentId;
                currentVersion = data.version;
                serverAutosaveBlocked = false;
                setCurrentFile(targetFilename);
                status.textContent = `Saved: ${displayName(targetFilename)}`;
                overwriteStatus.textContent = `Saved: ${displayName(targetFilename)}`;
                hasUnsavedChanges = false;
                const pagesToUpload = [...dirtyPages];
                dirtyPages.clear();
                saveSessionNow({ includePages: true });
                if (pagesToUpload.length > 0) {
                    await uploadDirtyPagesToServer(pagesToUpload);
                }
                if (newAfterSave) {
                    resetToNewDrawing();
                    return;
                }
                closeModals();
            } catch (error) {
                status.textContent = 'Save failed.';
                overwriteStatus.textContent = 'Save failed.';
            } finally {
                hideSavingSpinner();
            }
        }

        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointercancel', stopDrawing);
        canvas.addEventListener('pointerleave', hideBrushCursor);
        document.addEventListener('pointerdown', requestPortraitLock, { once: true });
        document.addEventListener('keydown', (event) => {
            const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
            if (!isShortcut || isFormFieldEditing()) {
                return;
            }

            const key = event.key.toLowerCase();
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault();
                undoCurrentPage();
                return;
            }
            if ((key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey)) {
                event.preventDefault();
                redoCurrentPage();
                return;
            }
            if (event.shiftKey) {
                return;
            }
            if (key === 'o') {
                event.preventDefault();
                closeToolbarMenus();
                loadFileList();
                return;
            }
            if (key === 's') {
                event.preventDefault();
                runSaveAction();
            }
        });
        window.addEventListener('resize', scheduleResizeCanvas);
        window.addEventListener('orientationchange', () => window.setTimeout(() => {
            resizeAllCanvases();
            if (virtualKeyboardTarget) {
                renderVirtualKeyboard();
            }
            if (chatToggle && chatToggle.checked) {
                syncChatInputEditableMode();
            }
            positionChatThread();
        }, 150));
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                setInteractionCooldown();
                scheduleResizeCanvas();
                positionChatThread();
            });
        }
        window.addEventListener('beforeunload', () => {
            rememberCurrentPage();
            saveSessionNow({ includePages: true });
        });
        backdrop.addEventListener('click', closeModals);

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
        nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
        deletePageBtn.addEventListener('click', askDeleteCurrentPage);
        document.getElementById('confirmDeletePageBtn').addEventListener('click', deleteCurrentPage);

        if (undoBtn) {
            undoBtn.addEventListener('click', undoCurrentPage);
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', redoCurrentPage);
        }

        function runSaveAction() {
            closeToolbarMenus();
            if (window.CANVAS_DEMO_MODE) {
                window.location.href = window.CANVAS_REGISTER_URL;
                return;
            }
            pendingNewAfterSave = false;
            if (currentFilename) {
                saveDrawing(true, { filename: currentFilename });
                return;
            }
            openModal('saveModal');
        }

        function runSaveAsAction() {
            closeToolbarMenus();
            if (window.CANVAS_DEMO_MODE) {
                window.location.href = window.CANVAS_REGISTER_URL;
                return;
            }
            pendingNewAfterSave = false;
            const filenameInput = document.getElementById('filenameInput');
            filenameInput.value = currentFilename ? `${displayName(currentFilename)} copy` : (filenameInput.value.trim() || filenameInput.placeholder);
            document.getElementById('saveStatus').textContent = '';
            openModal('saveModal');
            filenameInput.focus();
            filenameInput.select();
        }

        function runExportAction() {
            closeToolbarMenus();
            if (window.CANVAS_DEMO_MODE) {
                window.location.href = window.CANVAS_REGISTER_URL;
                return;
            }
            rememberCurrentPage();
            const image = pages.get(currentPage);
            if (!image) {
                window.alert('There is no saved JPG to export.');
                return;
            }

            const baseName = currentFilename ? displayName(currentFilename) : 'untitled';
            const pageSuffix = currentPage > 1 ? `-page-${currentPage}` : '';
            const link = document.createElement('a');
            link.href = image;
            link.download = `${baseName}${pageSuffix}.jpg`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        newBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleToolbarMenu(newBtn, fileMenu, { transient: true });
        });
        penBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const clearedFrameSelection = clearFrameSelectionState({ render: false });
            if (activeTool !== 'pen' || clearedFrameSelection) {
                setTool('pen');
                if (clearedFrameSelection) {
                    renderTextLayer();
                    applySelectedTextStylesToControls();
                    applySelectedTableStylesToControls();
                }
                closeToolbarMenus();
                return;
            }
            toggleToolbarMenu(penBtn, penMenu);
        });
        perfectShapeAlwaysToggle.addEventListener('change', () => {
            const clearedFrameSelection = clearFrameSelectionState({ render: false });
            setPerfectShapeForCurrentDocument(perfectShapeAlwaysToggle.checked);
            if (clearedFrameSelection) {
                renderTextLayer();
                applySelectedTextStylesToControls();
                applySelectedTableStylesToControls();
            }
        });
        if (chatToggle && chatBar) {
        chatToggle.addEventListener('change', () => {
            if (chatMenuRow) {
            chatMenuRow.classList.toggle('is-active', chatToggle.checked);
            }
            syncAiButtonState();
            chatBar.classList.toggle('is-visible', chatToggle.checked);
            chatBar.setAttribute('aria-hidden', chatToggle.checked ? 'false' : 'true');
            if (chatToggle.checked) {
            syncChatInputEditableMode();
            openChatSlashMenu();
            if (useVirtualKeyboard()) {
                startVirtualChatEditing();
            } else {
                chatInput.focus();
            }
            } else {
            stopChatDictation();
            if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'chat') {
                closeVirtualKeyboard();
            }
            if (chatThread) {
                chatThread.innerHTML = '';
                chatThread.classList.remove('has-messages');
                chatThread.style.bottom = '';
            }
            closeChatSlashMenu();
            }
            // Toggling chat closes the AI-tools dropdown (ai-menu) instead of
            // reopening it, so the chat panel isn't left competing with the
            // dropdown for the user's attention right after opening/closing it.
            closeToolbarMenus();
            positionChatThread();
            window.setTimeout(positionChatThread, 200);
        });
        }
        function openChatSlashMenu() {
            if (!chatSlashMenu) {
                return;
            }
            chatSlashMenu.classList.add('is-open');
            chatSlashMenu.setAttribute('aria-hidden', 'false');
            if (chatSlashBtn) {
                chatSlashBtn.classList.add('is-active');
                chatSlashBtn.setAttribute('aria-expanded', 'true');
            }
        }
        function closeChatSlashMenu() {
            if (!chatSlashMenu) {
                return;
            }
            chatSlashMenu.classList.remove('is-open');
            chatSlashMenu.setAttribute('aria-hidden', 'true');
            if (chatSlashBtn) {
                chatSlashBtn.classList.remove('is-active');
                chatSlashBtn.setAttribute('aria-expanded', 'false');
            }
        }
        function setChatInputText(value) {
            if (!chatInput) {
                return;
            }
            chatInput.textContent = value;
            if (useVirtualKeyboard()) {
                renderVirtualTextNode(chatInput, value, true, value.length);
            } else {
                chatInput.focus();
                const range = document.createRange();
                range.selectNodeContents(chatInput);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        if (chatSlashBtn && chatSlashMenu) {
            chatSlashBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (chatSlashMenu.classList.contains('is-open')) {
                    closeChatSlashMenu();
                } else {
                    openChatSlashMenu();
                }
            });
            chatSlashMenu.querySelectorAll('.chat-slash-item').forEach((item) => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const command = item.dataset.command;
                    setChatInputText(`/${command} `);
                    closeChatSlashMenu();
                    if (!useVirtualKeyboard()) {
                        chatInput.focus();
                    }
                });
            });
            document.addEventListener('pointerdown', (event) => {
                if (!chatSlashMenu.classList.contains('is-open')) {
                    return;
                }
                if (chatSlashMenu.contains(event.target) || event.target === chatSlashBtn) {
                    return;
                }
                closeChatSlashMenu();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && chatSlashMenu.classList.contains('is-open')) {
                    closeChatSlashMenu();
                }
            });
        }
        if (chatInput) {
            chatInput.addEventListener('pointerdown', (event) => {
                if (useVirtualKeyboard()) {
                    event.preventDefault();
                    startVirtualChatEditing();
                }
            });
        }
        function stopChatDictation() {}
        if (chatCloseBtn) {
            chatCloseBtn.addEventListener('click', () => {
                closeChat();
            });
        }
        function positionChatThread() {
            if (!chatThread || !chatBar) {
                return;
            }
            if (!chatBar.classList.contains('is-visible')) {
                chatThread.style.bottom = '';
                return;
            }
            const barRect = chatBar.getBoundingClientRect();
            const gap = 10;
            chatThread.style.bottom = `${Math.max(0, Math.round(window.innerHeight - barRect.top) + gap)}px`;
        }

        function appendChatMessage(role, text, options = {}) {
            if (!chatThread) {
                return null;
            }
            const bubble = document.createElement('div');
            bubble.className = `chat-msg is-${role}`;
            if (options.typing) {
                bubble.classList.add('is-typing');
            }
            const textEl = document.createElement('div');
            textEl.textContent = text;
            bubble.appendChild(textEl);
            chatThread.appendChild(bubble);
            chatThread.classList.add('has-messages');
            chatThread.scrollTop = chatThread.scrollHeight;
            positionChatThread();
            return bubble;
        }

        function removeChatMessage(bubble) {
            if (bubble && bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }

        function appendChatConfirmCard(text, onConfirm, onCancel) {
            const bubble = appendChatMessage('ai', text);
            if (!bubble) {
                return;
            }
            const actions = document.createElement('div');
            actions.className = 'chat-msg-actions';
            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = 'chat-msg-confirm';
            confirmBtn.textContent = 'Confirm';
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            confirmBtn.addEventListener('click', () => {
                actions.remove();
                onConfirm();
            });
            cancelBtn.addEventListener('click', () => {
                actions.remove();
                onCancel();
            });
            actions.append(confirmBtn, cancelBtn);
            bubble.appendChild(actions);
            chatThread.scrollTop = chatThread.scrollHeight;
        }

        function appendChatClarifyChips(options) {
            if (!chatThread || !Array.isArray(options) || options.length === 0) {
                return;
            }
            const bubble = chatThread.lastElementChild;
            if (!bubble) {
                return;
            }
            const chips = document.createElement('div');
            chips.className = 'chat-msg-chips';
            options.slice(0, 5).forEach((label) => {
                if (typeof label !== 'string' || !label) {
                    return;
                }
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'chat-msg-chip';
                chip.textContent = label;
                chip.addEventListener('click', () => {
                    chatInput.textContent = label;
                    if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'chat') {
                        virtualKeyboardCaret = label.length;
                        renderVirtualTextNode(chatInput, label, true, virtualKeyboardCaret);
                    }
                });
                chips.appendChild(chip);
            });
            bubble.appendChild(chips);
        }

        const AI_ACTION_REQUIRES_CONFIRMATION = {
            recolor: false,
            editText: false,
            move: false,
            resize: false,
            delete: true,
            create: false,
            duplicate: false,
            align: false,
            distribute: false,
            translateText: false,
            highlight: false,
            calculate: false
        };

        async function executeCreateAction(params) {
            const model = currentPageModel();
            const elementType = params.elementType;
            if (elementType === 'text') {
                const width = Math.min(model.baseWidth * 0.5, 320);
                const height = 60;
                const bounds = {
                    x: (model.baseWidth - width) / 2,
                    y: (model.baseHeight - height) / 2,
                    width,
                    height
                };
                const element = createTextBox(bounds, { skipFocus: true });
                if (element && typeof params.text === 'string' && params.text) {
                    element.text = params.text;
                    renderTextLayer();
                    saveSessionNow({ includePages: false });
                }
                if (element && params.color) {
                    recolorElementById(element.id, params.color);
                }
                return Boolean(element);
            }
            if (elementType === 'table') {
                const rows = Math.max(1, Math.min(20, Number(params.rows) || 3));
                const cols = Math.max(1, Math.min(20, Number(params.cols) || 3));
                const width = Math.min(model.baseWidth * 0.6, cols * 90);
                const height = Math.min(model.baseHeight * 0.4, rows * 40);
                const bounds = {
                    x: (model.baseWidth - width) / 2,
                    y: (model.baseHeight - height) / 2,
                    width,
                    height
                };
                const element = createTableAt(rows, cols, bounds);
                if (element && params.color) {
                    recolorElementById(element.id, params.color);
                }
                return Boolean(element);
            }
            if (elementType === 'shape') {
                const entry = SHAPE_LIBRARY.find((s) => s.shapeType === params.shapeType)
                    || SHAPE_LIBRARY.find((s) => s.shapeType === 'rectangle');
                const element = insertLibraryShape(entry);
                if (element && params.color) {
                    // insertLibraryShape() already kicked off its own renderCurrentPage()
                    // without awaiting it; wait for that paint to settle before recoloring,
                    // otherwise the two renders race and the slower one (often the pre-recolor
                    // paint) can overwrite the canvas with the old color.
                    await renderCurrentPage();
                    recolorElementById(element.id, params.color);
                }
                return Boolean(element);
            }
            return false;
        }

        async function executeAiAction(action) {
            const params = action.params || {};
            if (action.type === 'align') {
                return alignElements(action.targetIds, params.edge);
            }
            if (action.type === 'distribute') {
                return distributeElements(action.targetIds, params.axis);
            }
            if (action.type === 'highlight') {
                return highlightElementsByIds(action.targetIds);
            }
            let anySucceeded = false;
            for (const id of action.targetIds) {
                let ok = false;
                if (action.type === 'recolor') {
                    ok = recolorElementById(id, params.color);
                } else if (action.type === 'delete') {
                    ok = deleteElementById(id);
                } else if (action.type === 'move') {
                    ok = moveElementById(id, params.dx, params.dy);
                } else if (action.type === 'resize') {
                    ok = resizeElementById(id, params.width, params.height);
                } else if (action.type === 'editText') {
                    ok = editElementTextById(id, params.text, params.row, params.col);
                } else if (action.type === 'duplicate') {
                    ok = duplicateElementById(id);
                } else if (action.type === 'translateText') {
                    const element = findElementById(id);
                    if (element && element.type === 'text') {
                        await translateTextElement(element, params.targetLanguage);
                        ok = true;
                    }
                } else if (action.type === 'calculate') {
                    ok = calculateResultForFormula(id, params.text);
                }
                anySucceeded = anySucceeded || ok;
            }
            return anySucceeded;
        }

        async function sendChatMessage() {
            const message = (chatInput.textContent || '').trim();
            if (!message) {
                return;
            }
            chatInput.textContent = '';
            if (virtualKeyboardTarget && virtualKeyboardTarget.type === 'chat') {
                virtualKeyboardCaret = 0;
                renderVirtualTextNode(chatInput, '', true, 0);
            }

            appendChatMessage('user', message);

            const model = currentPageModel();
            const { catalog, truncated } = buildCanvasCatalog(model);
            const outgoingMessage = truncated
                ? `${message}\n\n(Note: the page has more elements than what was sent to you.)`
                : message;

            const slashMatch = message.match(/^\/(\w+)\b\s*/);
            const slashCommand = slashMatch ? slashMatch[1].toLowerCase() : '';

            if (slashCommand === 'transcribe') {
                const typingBubble = appendChatMessage('ai', 'Reading the page...', { typing: true });
                const result = await readCanvasHandwriting();
                removeChatMessage(typingBubble);
                appendChatMessage('ai', result.message);
                return;
            }

            const selectedIds = Array.from(new Set([
                ...selectedStrokeIds,
                selectedTextId,
                selectedTableId
            ].filter(Boolean)));
            const requestBody = { action: 'chat', message: outgoingMessage, catalog };
            if (slashCommand) {
                requestBody.slashCommand = slashCommand;
            }
            if (selectedIds.length > 0) {
                requestBody.selectedIds = selectedIds;
            }
            if (slashCommand === 'summarize') {
                requestBody.pageText = model.elements
                    .filter((element) => element.type === 'text' && typeof element.text === 'string' && element.text.trim() !== '')
                    .map((element) => element.text.trim())
                    .join('\n\n');
            }

            const typingBubble = appendChatMessage('ai', 'Thinking...', { typing: true });

            let data = null;
            try {
                data = await postToAi(requestBody);
            } catch (error) {
                removeChatMessage(typingBubble);
                appendChatMessage('ai', (error && error.message) || 'Something went wrong.');
                return;
            }

            removeChatMessage(typingBubble);
            addAiCost(data.cost || {});

            if (data.kind === 'answer' || data.kind === 'refuse') {
                const targetCommands = ['align', 'duplicate', 'distribute', 'translate', 'edit'];
                let notice = '';
                if (slashCommand && targetCommands.includes(slashCommand) && selectedIds.length === 0) {
                    notice = `Nothing was changed on the canvas — no elements are selected, and I could not clearly tell which ones you mean from your message. Select the elements first, or describe them more specifically, then try /${slashCommand} again.\n\n`;
                } else if (slashCommand) {
                    notice = `Nothing was changed on the canvas — I could not carry out /${slashCommand} as a single action for this request.\n\n`;
                }
                appendChatMessage('ai', notice + (data.message || ''));
                return;
            }

            if (data.kind === 'clarify') {
                appendChatMessage('ai', data.message || '');
                appendChatClarifyChips(data.clarifyOptions);
                return;
            }

            if (data.kind === 'action' && data.action && data.action.type === 'create') {
                const ok = await executeCreateAction(data.action.params || {});
                appendChatMessage('ai', ok ? (data.message || 'Done.') : 'I could not create that element.');
                return;
            }

            if (data.kind === 'action' && data.action && Array.isArray(data.action.targetIds) && data.action.targetIds.length > 0) {
                const currentModel = currentPageModel();
                const validIds = data.action.targetIds.filter((id) => currentModel.elements.some((element) => element.id === id));
                if (validIds.length === 0) {
                    appendChatMessage('ai', 'The element I was referring to no longer exists on the page.');
                    return;
                }
                const action = { ...data.action, targetIds: validIds };
                const needsConfirm = AI_ACTION_REQUIRES_CONFIRMATION[action.type] !== false;
                if (needsConfirm) {
                    appendChatConfirmCard(data.message || 'Confirm this action?', async () => {
                        const ok = await executeAiAction(action);
                        appendChatMessage('ai', ok ? 'Done.' : 'I could not carry out that action.');
                    }, () => {
                        appendChatMessage('ai', 'Cancelled.');
                    });
                } else {
                    const ok = await executeAiAction(action);
                    appendChatMessage('ai', ok ? (data.message || 'Done.') : 'I could not carry out that action.');
                }
                return;
            }

            appendChatMessage('ai', data.message || 'I did not understand that request.');
        }




async function readCanvasHandwriting() {
const model = currentPageModel();
if (!model) {
return { ok: false, message: 'No active page.' };
}
// Nu bakez elementele de text/tabel/formula pe canvas inainte de screenshot - vrem sa
// trimitem la OCR doar cerneala scrisa de mana, nu si continutul deja existent in
// frame-urile de text/tabel (altfel AI-ul le re-recunoaste si le dubleaza).
// Alte fluxuri (undo/redo, schimbarea paginii) bakeaza temporar text pe canvas ca sa
// genereze thumbnail-uri, apoi il curata printr-un renderCurrentPage() separat - daca acel
// re-render nu a apucat inca sa ruleze, canvas-ul ar putea fi surprins cu text bakeat. Facem
// un renderCurrentPage() garantat aici, chiar inainte de screenshot, ca sa fim siguri ca
// pornim mereu de la o stare curata (doar cerneala + fundal), indiferent ce s-a intamplat inainte.
await renderCurrentPage();
const originalImage = canvas.toDataURL('image/jpeg', 0.85);
const imageBase64 = await resizeImageForAI(originalImage, 1024, 0.7);
closeToolbarMenus();

// Arată overlay-ul cu spinner
const aiTranslationOverlay = document.getElementById('aiTranslationOverlay');
if (aiTranslationOverlay) {
aiTranslationOverlay.classList.add('is-visible');
aiTranslationOverlay.setAttribute('aria-hidden', 'false');
}

try {
const data = await postToAi({
action: 'read',
image: imageBase64,
instruction: 'Priority 1: transcribe all handwritten and printed text exactly and completely, preserving line breaks and structure. Priority 2: only for clear math/physics/chemistry notation (fractions, radicals, exponents, vectors, chemical formulas/reactions), mark it as a single LaTeX formula segment - even if it visually spans multiple rows (e.g. a fraction), keep it as ONE formula segment, never split across rows. When unsure whether something is a formula, keep it as plain text.'
});

// Ascunde overlay-ul
if (aiTranslationOverlay) {
aiTranslationOverlay.classList.remove('is-visible');
aiTranslationOverlay.setAttribute('aria-hidden', 'true');
}

addAiCost(data.cost || {});
let segments = Array.isArray(data.data && data.data.segments) ? data.data.segments : null;
const fullText = (data.data && data.data.fullText) || '';
if (!segments || segments.length === 0) {
if (!fullText.trim()) {
return { ok: false, message: 'No text detected in the drawing.' };
}
segments = [{ type: 'text', content: fullText }];
}

const pageWidth = Math.max(1, Number(model.baseWidth) || 1);
const pageHeight = Math.max(1, Number(model.baseHeight) || 1);
const blockWidth = Math.min(600, Math.max(200, pageWidth * 0.7));
const fontSize = 20;
const formulaFontSize = 26;
const lineHeight = fontSize * 1.4;
const padding = 16;
const gap = 10;

const normalizeForCompare = (value) => String(value || '')
.replace(/\\[a-zA-Z]+/g, '')
.replace(/[{}\\$\s]+/g, '')
.toLowerCase();

const blocks = [];
for (let i = 0; i < segments.length; i += 1) {
const seg = segments[i];
if (!seg || typeof seg !== 'object') {
continue;
}
if (seg.type === 'formula' && typeof seg.latex === 'string' && seg.latex.trim()) {
const latex = seg.latex.trim();
try {
const measured = await measureFormulaSvg(latex, formulaFontSize);
const width = Math.min(blockWidth, measured.width);
const height = measured.height;
const img = await svgToSelfContainedImage(measured.svg, measured.width, measured.height, '#111827');
formulaImageCache.set(`${formulaFontSize}::#111827::${latex}`, { img, width: measured.width, height: measured.height });
blocks.push({ kind: 'formula', latex, width, height });
} catch (err) {
blocks.push({ kind: 'text', content: latex, height: Math.max(1, latex.split('\n').length) * lineHeight + padding });
}
} else {
const content = String(seg.content || seg.text || '');
if (content.trim() === '') {
continue;
}
// AI-ul poate emite, uneori, aceeasi expresie o data ca text brut si o data ca formula LaTeX - le compar normalizate si o sar pe cea duplicata.
const normalizedContent = normalizeForCompare(content);
const prevSeg = segments[i - 1];
const nextSeg = segments[i + 1];
const isDuplicateOfAdjacentFormula = [prevSeg, nextSeg].some((adjacent) => {
return adjacent && adjacent.type === 'formula' && typeof adjacent.latex === 'string'
&& normalizedContent.length > 0
&& normalizedContent === normalizeForCompare(adjacent.latex);
});
if (isDuplicateOfAdjacentFormula) {
continue;
}
const lineCount = Math.max(1, content.split('\n').length);
blocks.push({ kind: 'text', content, height: lineCount * lineHeight + padding });
}
}

if (blocks.length === 0) {
return { ok: false, message: 'No text detected in the drawing.' };
}

// Clamp doar pe orizontala (ca sa incapa in latimea paginii); pe verticala nu forteaza
// blocul sa incapa sub baseHeight, ca sa nu strice ordinea/stivuirea cand textul+formulele
// depasesc impreuna inaltimea paginii (clampTextBounds ar impinge fiecare bloc independent
// spre marginea de jos, suprapunandu-le).
const clampReadBlockBounds = (bounds, pageModel) => {
const minWidth = 24;
const minHeight = 20;
const width = Math.max(minWidth, Math.min(Number(bounds.width) || minWidth, pageModel.baseWidth));
const height = Math.max(minHeight, Number(bounds.height) || minHeight);
return {
x: Math.max(0, Math.min(Number(bounds.x) || 0, pageModel.baseWidth - width)),
y: Math.max(0, Number(bounds.y) || 0),
width,
height
};
};

const totalHeight = blocks.reduce((sum, block) => sum + block.height + gap, -gap) + padding * 2;
let y = Math.max(0, (pageHeight - totalHeight) / 2);
const x = (pageWidth - blockWidth) / 2;
let lastElement = null;

for (const block of blocks) {
if (block.kind === 'text') {
const element = {
type: 'text',
id: createElementId(),
bounds: clampReadBlockBounds({ x, y, width: blockWidth, height: block.height }, model),
text: block.content,
fontSize: fontSize,
bold: false,
italic: false,
underline: false,
align: 'left',
color: '#111827'
};
model.elements.push(element);
lastElement = element;
} else {
const element = {
type: 'formula',
id: createElementId(),
bounds: clampReadBlockBounds({
x: x + (blockWidth - block.width) / 2,
y,
width: block.width,
height: block.height
}, model),
latex: block.latex,
fontSize: formulaFontSize,
color: '#111827'
};
model.elements.push(element);
lastElement = element;
}
y += block.height + gap;
}

clearRedoForCurrentPage();
markUnsaved();
updateUndoButton();

selectedTextId = lastElement ? lastElement.id : '';
selectedTableId = '';
syncInsertFrameToolStates();
renderTextLayer();
await bakeAndSnapshotCurrentPage(model);

scheduleSessionSave();
return { ok: true, message: `Transcribed ${blocks.length} block${blocks.length === 1 ? '' : 's'} of text onto the page.` };
} catch (err) {
// Ascunde overlay-ul în caz de eroare
if (aiTranslationOverlay) {
aiTranslationOverlay.classList.remove('is-visible');
aiTranslationOverlay.setAttribute('aria-hidden', 'true');
}
return { ok: false, message: (err && err.message) || 'Network error while reading.' };
}
}

        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', sendChatMessage);
        }
        if (chatInput) {
            chatInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    sendChatMessage();
                }
            });
        }
        eraserBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const clearedFrameSelection = clearFrameSelectionState({ render: false });
            if (activeTool !== 'eraser' || clearedFrameSelection) {
                setTool('eraser');
                if (clearedFrameSelection) {
                    renderTextLayer();
                    applySelectedTextStylesToControls();
                    applySelectedTableStylesToControls();
                }
                closeToolbarMenus();
                return;
            }
            toggleToolbarMenu(eraserBtn, eraserMenu);
        });
        insertBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const frameToolActive = ['text', 'table'].includes(activeTool) || Boolean(selectedTextId || selectedTableId);
            toggleToolbarMenu(insertBtn, insertMenu, { transient: !frameToolActive });
        });
        selectBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            startDrawingSelectionMode();
        });
        settingsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleToolbarMenu(settingsBtn, settingsMenu, { transient: true });
        });
        aiBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleToolbarMenu(aiBtn, aiMenu);
        });
        moreBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleToolbarMenu(moreBtn, overflowMenu, { transient: true });
        });
        pendingMoreBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleToolbarMenu(pendingMoreBtn, pendingActionsMenu, { transient: true });
        });
        document.getElementById('overflowSelectBtn').addEventListener('click', () => {
            startDrawingSelectionMode();
        });
        document.getElementById('overflowSettingsBtn').addEventListener('click', () => {
            toggleToolbarMenu(moreBtn, settingsMenu, { transient: true });
        });

        document.getElementById('fileNewBtn').addEventListener('click', () => {
            closeToolbarMenus();
            requestNewDrawing();
        });
        document.getElementById('fileOpenBtn').addEventListener('click', () => {
            closeToolbarMenus();
            loadFileList();
        });
        document.getElementById('fileSaveBtn').addEventListener('click', runSaveAction);
        document.getElementById('fileSaveAsBtn').addEventListener('click', runSaveAsAction);
        document.getElementById('fileExportBtn').addEventListener('click', runExportAction);
        document.getElementById('fileHomeBtn').addEventListener('click', () => {
            window.location.href = window.CANVAS_HOME_URL;
        });
        document.getElementById('createFolderBtn').addEventListener('click', createFolder);
        textToolBtn.addEventListener('click', startTextSelection);
        document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closeModals));
        document.addEventListener('pointerdown', (event) => {
            const clickedMenu = toolbarMenus.some((menu) => menu.contains(event.target));
            const clickedButton = toolbarMenuButtons.some((button) => button.contains(event.target));
            if (!clickedMenu && !clickedButton) {
                if (hasOpenToolbarMenu()) {
                    setInteractionCooldown();
                }
                closeToolbarMenus();
            }
        }, true);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeToolbarMenus();
                closeVirtualKeyboard();
            }
        });
        virtualKeyboard.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const keyButton = event.target.closest('[data-key]');
            if (keyButton) {
                handleVirtualKey(keyButton.dataset.key);
            }
        });

        colorInput.addEventListener('input', () => {
            updateOptionPreviews();
        });
        colorInput.addEventListener('change', () => {
            rememberColour(colorInput.value);
            updateOptionPreviews();
        });
        textSizeInput.addEventListener('input', () => setTextDefaultOrSelected('fontSize', textSizeInput.value));
        textBoldBtn.addEventListener('click', () => setTextDefaultOrSelected('bold', !Boolean((selectedTextElement() || textDefaults).bold)));
        textItalicBtn.addEventListener('click', () => setTextDefaultOrSelected('italic', !Boolean((selectedTextElement() || textDefaults).italic)));
        textUnderlineBtn.addEventListener('click', () => setTextDefaultOrSelected('underline', !Boolean((selectedTextElement() || textDefaults).underline)));
        textAlignLeftBtn.addEventListener('click', () => setTextDefaultOrSelected('align', 'left'));
        textAlignCenterBtn.addEventListener('click', () => setTextDefaultOrSelected('align', 'center'));
        textAlignRightBtn.addEventListener('click', () => setTextDefaultOrSelected('align', 'right'));
        if (textAddColourBtn) {
            textAddColourBtn.addEventListener('click', () => {
                textColorInput.value = normalizeColor((selectedTextElement() || textDefaults).color || recentColours[0], '#111827');
                textColorInput.click();
            });
        }
        textColorInput.addEventListener('input', () => {
            const colour = normalizeColor(textColorInput.value, '#111827');
            setTextDefaultOrSelected('color', colour);
        });
        textColorInput.addEventListener('change', () => {
            rememberColour(textColorInput.value);
            renderTextColours();
            renderTableColours();
        });
        tableTextSizeInput.addEventListener('input', () => setTableStyle('fontSize', tableTextSizeInput.value));
        tableBoldBtn.addEventListener('click', () => {
            const styles = normalizeCellStyles((selectedTableElement() || {}).cellStyles);
            setTableStyle('bold', !styles.bold);
        });
        tableItalicBtn.addEventListener('click', () => {
            const styles = normalizeCellStyles((selectedTableElement() || {}).cellStyles);
            setTableStyle('italic', !styles.italic);
        });
        tableUnderlineBtn.addEventListener('click', () => {
            const styles = normalizeCellStyles((selectedTableElement() || {}).cellStyles);
            setTableStyle('underline', !styles.underline);
        });
        tableAlignLeftBtn.addEventListener('click', () => setTableStyle('align', 'left'));
        tableAlignCenterBtn.addEventListener('click', () => setTableStyle('align', 'center'));
        tableAlignRightBtn.addEventListener('click', () => setTableStyle('align', 'right'));
        tableAddColourBtn.addEventListener('click', () => {
            const styles = normalizeCellStyles((selectedTableElement() || {}).cellStyles);
            tableColorInput.value = styles.color;
            tableColorInput.click();
        });
        tableColorInput.addEventListener('input', () => {
            const colour = normalizeColor(tableColorInput.value, '#111827');
            setTableStyle('color', colour);
        });
        tableColorInput.addEventListener('change', () => {
            rememberColour(tableColorInput.value);
            renderTextColours();
            renderTableColours();
        });
        document.querySelectorAll('[data-input-mode]').forEach((button) => {
            button.addEventListener('click', () => setInputMode(button.dataset.inputMode));
        });
        document.querySelectorAll('[data-tool][data-tip]').forEach((button) => {
            button.addEventListener('click', () => {
                toolSettings[button.dataset.tool].tip = normalizeTip(button.dataset.tip);
                saveToolSettings();
                updateOptionPreviews();
            });
        });
        [
            [penHardnessInput, 'pen', 'hardness', penHardnessLabel, '%', 100],
            [penOpacityInput, 'pen', 'opacity', penOpacityLabel, '%', 100],
            [penSizeInput, 'pen', 'size', penSizeLabel, 'px', 36],
            [eraserHardnessInput, 'eraser', 'hardness', eraserHardnessLabel, '%', 100],
            [eraserOpacityInput, 'eraser', 'opacity', eraserOpacityLabel, '%', 100],
            [eraserSizeInput, 'eraser', 'size', eraserSizeLabel, 'px', 56]
        ].forEach(([input, tool, key, label, suffix, max]) => {
            input.addEventListener('input', () => {
                toolSettings[tool][key] = key === 'size'
                    ? normalizeSize(input.value, toolSettings[tool][key], max)
                    : Math.max(key === 'opacity' ? 5 : 0, normalizePercent(input.value, toolSettings[tool][key]));
                label.textContent = `${toolSettings[tool][key]}${suffix}`;
                saveToolSettings();
                updateOptionPreviews();
            });
        });

        document.getElementById('confirmSaveBtn').addEventListener('click', () => saveDrawing(false, { newAfterSave: pendingNewAfterSave }));
        document.getElementById('overwriteBtn').addEventListener('click', () => saveDrawing(true, { newAfterSave: pendingNewAfterSave }));
        document.getElementById('cancelOverwriteBtn').addEventListener('click', () => {
            pendingOverwriteName = '';
            pendingNewAfterSave = false;
            openModal('saveModal');
            document.getElementById('saveStatus').textContent = 'Overwrite canceled.';
        });

        document.getElementById('saveBeforeNewBtn').addEventListener('click', openSaveBeforeNewFlow);
        document.getElementById('discardNewBtn').addEventListener('click', resetToNewDrawing);

        blankPaperBtn.addEventListener('click', () => setGuideMode('none'));
        document.getElementById('ruledTabBtn').addEventListener('click', () => {
            setGuideMode('ruled');
        });
        document.getElementById('gridTabBtn').addEventListener('click', () => {
            setGuideMode('grid');
        });
        document.getElementById('startTableBtn').addEventListener('click', startTableSelection);
        document.querySelectorAll('[data-step-target]').forEach((button) => {
            button.addEventListener('click', () => {
                const input = document.getElementById(button.dataset.stepTarget);
                if (!input) {
                    return;
                }
                const min = Number(input.min) || 1;
                const max = Number(input.max) || 60;
                const step = Number(button.dataset.step) || 0;
                const value = Number(input.value) || min;
                input.value = Math.max(min, Math.min(max, value + step));
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
        if (guideToggle) {
            guideToggle.addEventListener('change', () => setGuidesVisible(guideToggle.checked));
        }

        async function fetchAllLegacyPages(action, collectionKey) {
            let cursor = 0;
            let result = null;
            const collected = [];

            do {
                const params = new URLSearchParams({ action, cursor: String(cursor), limit: '100', t: String(Date.now()) });
                const response = await fetch(`/canvas/api?${params.toString()}`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Could not load ${action}.`);
                }

                const page = await response.json();
                result = result || page;
                collected.push(...(Array.isArray(page[collectionKey]) ? page[collectionKey] : []));
                cursor = Number.isInteger(page.nextCursor) ? page.nextCursor : null;
            } while (cursor !== null);

            return { ...(result || { ok: false }), [collectionKey]: collected };
        }

        async function loadFileList(options = {}) {
            if (options.open !== false) {
                openModal('viewModal');
            }
            const list = document.getElementById('fileList');
            const status = document.getElementById('viewStatus');
            list.innerHTML = '';
            status.textContent = options.loadingText || 'Loading files...';

            try {
                const data = await fetchAllLegacyPages('list', 'files');
                const files = Array.isArray(data.files) ? data.files : [];
                const folders = Array.isArray(data.folders) ? data.folders : [];
                if (!data.ok || (!files.length && !folders.length)) {
                    status.textContent = options.emptyText || 'No saved files yet.';
                    return 0;
                }

                status.textContent = '';
                const folderNames = folders.map((folder) => folder.name);
                const collapsed = JSON.parse(localStorage.getItem('fixbly.collapsedFolders') || '{}');
                const appendFileRow = (file, target = list, nested = false) => {
                    const row = document.createElement('div');
                    const item = document.createElement('button');
                    const thumbWrap = document.createElement('span');
                    const thumb = document.createElement('img');
                    const text = document.createElement('span');
                    const name = document.createElement('span');
                    const meta = document.createElement('span');
                    const renameButton = document.createElement('button');
                    const duplicateButton = document.createElement('button');
                    const deleteButton = document.createElement('button');
                    const moveSelect = document.createElement('select');
                    const actionsMenu = document.createElement('details');
                    const actionsToggle = document.createElement('summary');
                    item.type = 'button';
                    item.className = 'file-item';
                    thumbWrap.className = 'file-thumb';
                    thumb.alt = '';
                    thumb.src = file.url;
                    text.className = 'file-item-text';
                    name.textContent = shortFileLabel(file.name);
                    name.title = displayName(file.name);
                    meta.textContent = nested ? editedLabel(file.modified) : (file.folder || 'No folder');
                    text.append(name, meta);
                    thumbWrap.appendChild(thumb);
                    item.append(thumbWrap, text);
                    item.addEventListener('click', () => loadDocument(file));
                    renameButton.type = 'button';
                    renameButton.className = 'file-action-button';
                    renameButton.title = `Rename ${displayName(file.name)}`;
                    renameButton.setAttribute('aria-label', `Rename ${displayName(file.name)}`);
                    renameButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>';
                    renameButton.addEventListener('click', () => askRenameFile(file.name));
                    duplicateButton.type = 'button';
                    duplicateButton.className = 'file-action-button';
                    duplicateButton.title = `Duplicate ${displayName(file.name)}`;
                    duplicateButton.setAttribute('aria-label', `Duplicate ${displayName(file.name)}`);
                    duplicateButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';
                    duplicateButton.addEventListener('click', () => duplicateFile(file.name));
                    deleteButton.type = 'button';
                    deleteButton.className = 'file-action-button danger-action';
                    deleteButton.title = `Delete ${displayName(file.name)}`;
                    deleteButton.setAttribute('aria-label', `Delete ${displayName(file.name)}`);
                    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>';
                    deleteButton.addEventListener('click', () => askDeleteFile(file.name));
                    row.className = folderNames.length > 0
                        ? (nested ? 'file-row nested-file-row has-folder-select' : 'file-row has-folder-select')
                        : (nested ? 'file-row nested-file-row' : 'file-row');
                    row.appendChild(item);
                    actionsMenu.className = 'file-actions-menu';
                    actionsToggle.setAttribute('aria-label', `Actions for ${displayName(file.name)}`);
                    actionsToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
                    actionsMenu.append(actionsToggle, renameButton, duplicateButton, deleteButton);
                    row.appendChild(actionsMenu);
                    if (folderNames.length > 0) {
                        moveSelect.className = 'file-folder-select';
                        moveSelect.title = 'Move to folder';
                        const noFolderOption = document.createElement('option');
                        noFolderOption.value = '';
                        noFolderOption.textContent = 'No folder';
                        moveSelect.appendChild(noFolderOption);
                        for (const folder of folderNames) {
                            const option = document.createElement('option');
                            option.value = folder;
                            option.textContent = folder;
                            moveSelect.appendChild(option);
                        }
                        moveSelect.value = file.folder || '';
                        moveSelect.addEventListener('change', () => moveDocumentToFolder(file.name, moveSelect.value));
                        row.appendChild(moveSelect);
                    }
                    const li = document.createElement('li');
                    li.appendChild(row);
                    target.appendChild(li);
                };

                files.filter((file) => !file.folder).forEach((file) => appendFileRow(file));
                for (const folder of folders) {
                    const li = document.createElement('li');
                    const folderCard = document.createElement('div');
                    const header = document.createElement('div');
                    const toggle = document.createElement('button');
                    const folderIcon = document.createElement('span');
                    const folderName = document.createElement('span');
                    const folderCount = document.createElement('small');
                    const caret = document.createElement('button');
                    const rename = document.createElement('button');
                    const remove = document.createElement('button');
                    const children = document.createElement('ul');
                    const folderFiles = files.filter((file) => file.folder === folder.name);
                    folderCard.className = 'folder-card';
                    header.className = 'folder-row';
                    toggle.type = 'button';
                    toggle.className = 'folder-toggle';
                    folderIcon.className = 'folder-icon';
                    folderIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.2l2 2H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"/></svg>';
                    folderName.textContent = folder.name;
                    folderCount.textContent = folderFiles.length;
                    toggle.append(folderIcon, folderName, folderCount);
                    const toggleFolder = () => {
                        collapsed[folder.name] = !collapsed[folder.name];
                        localStorage.setItem('fixbly.collapsedFolders', JSON.stringify(collapsed));
                        loadFileList({ open: false, loadingText: '' });
                    };
                    toggle.addEventListener('click', toggleFolder);
                    caret.type = 'button';
                    caret.className = collapsed[folder.name] ? 'folder-caret is-collapsed' : 'folder-caret';
                    caret.setAttribute('aria-label', `${collapsed[folder.name] ? 'Expand' : 'Collapse'} ${folder.name}`);
                    caret.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
                    caret.addEventListener('click', toggleFolder);
                    rename.type = 'button';
                    rename.className = 'file-action-button';
                    rename.title = `Rename ${folder.name}`;
                    rename.setAttribute('aria-label', `Rename ${folder.name}`);
                    rename.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>';
                    rename.addEventListener('click', () => renameFolder(folder.name));
                    remove.type = 'button';
                    remove.className = 'file-action-button danger-action';
                    remove.title = `Delete ${folder.name}`;
                    remove.setAttribute('aria-label', `Delete ${folder.name}`);
                    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>';
                    remove.addEventListener('click', () => deleteFolder(folder.name));
                    header.append(toggle, caret, rename, remove);
                    children.className = 'folder-files';
                    folderCard.appendChild(header);
                    li.appendChild(folderCard);
                    list.appendChild(li);
                    if (!collapsed[folder.name]) {
                        folderFiles.forEach((file) => appendFileRow(file, children, true));
                        folderCard.appendChild(children);
                    }
                }
                return files.length;
            } catch (error) {
                status.textContent = 'The file list cannot be loaded.';
                return 0;
            }
        }

        async function postFolderAction(action, fields) {
            const form = new FormData();
            form.append('action', action);
            Object.entries(fields).forEach(([key, value]) => form.append(key, value));
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            return response.json();
        }

        async function createFolder() {
            const name = window.prompt('Folder name');
            if (!name) {
                return;
            }
            const data = await postFolderAction('create_folder', { folder: name });
            document.getElementById('viewStatus').textContent = data.ok ? `Folder created: ${data.folder}` : (data.error || 'Folder cannot be created.');
            await loadFileList({ open: false, loadingText: '' });
        }

        async function renameFolder(folder) {
            const name = window.prompt('New folder name', folder);
            if (!name || name === folder) {
                return;
            }
            const data = await postFolderAction('rename_folder', { folder, newFolder: name });
            if (currentFilename.startsWith(`${folder}/`) && data.ok) {
                setCurrentFile(`${data.folder}/${displayName(currentFilename)}`);
            }
            document.getElementById('viewStatus').textContent = data.ok ? `Folder renamed: ${data.folder}` : (data.error || 'Folder cannot be renamed.');
            await loadFileList({ open: false, loadingText: '' });
        }

        async function deleteFolder(folder) {
            if (!window.confirm(`Delete folder "${folder}" and its documents?`)) {
                return;
            }
            const data = await postFolderAction('delete_folder', { folder });
            if (currentFilename.startsWith(`${folder}/`) && data.ok) {
                clearCurrentDocumentState({ closeModals: false });
            }
            document.getElementById('viewStatus').textContent = data.ok ? `Folder deleted: ${folder}` : (data.error || 'Folder cannot be deleted.');
            await loadFileList({ open: false, loadingText: '' });
        }

        async function moveDocumentToFolder(filename, folder) {
            const data = await postFolderAction('move_document', { filename, folder });
            document.getElementById('viewStatus').textContent = data.ok ? 'Document moved.' : (data.error || 'Document cannot be moved.');
            if (currentFilename === filename && data.ok) {
                setCurrentFile(data.file);
            }
            await loadFileList({ open: false, loadingText: '' });
        }
        function askDeleteFile(filename) {
            pendingDeleteName = filename;
            deleteText.textContent = `Are you sure you want to delete "${displayName(filename)}"?`;
            document.getElementById('deleteStatus').textContent = '';
            openModal('deleteModal');
        }

        async function deleteFile(filename) {
            const status = document.getElementById('viewStatus');
            const deleteStatus = document.getElementById('deleteStatus');
            const form = new FormData();
            form.append('action', 'delete');
            form.append('filename', filename);
            status.textContent = '';
            deleteStatus.textContent = 'Deleting...';

            try {
                const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
                const data = await response.json();
                if (!data.ok) {
                    deleteStatus.textContent = data.error || 'Delete failed.';
                    return;
                }
                const deletedCurrentDocument = currentFilename === data.file;
                if (deletedCurrentDocument) {
                    clearCurrentDocumentState({ closeModals: false });
                }
                const remainingFiles = await loadFileList({
                    open: true,
                    loadingText: '',
                    emptyText: `Deleted: ${displayName(data.file)}. No saved files yet.`
                });
                if (remainingFiles > 0) {
                    document.getElementById('viewStatus').textContent = `Deleted: ${displayName(data.file)}`;
                } else {
                    closeModals();
                }
                if (!deletedCurrentDocument) {
                    saveSessionNow({ includePages: false });
                }
            } catch (error) {
                deleteStatus.textContent = 'Delete failed.';
            }
        }

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            if (pendingDeleteName) {
                deleteFile(pendingDeleteName);
            }
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            pendingDeleteName = '';
            openModal('viewModal');
        });

        function askRenameFile(filename) {
            pendingRenameName = filename;
            renameInput.value = displayName(filename);
            document.getElementById('renameStatus').textContent = '';
            openModal('renameModal');
            renameInput.focus();
            renameInput.select();
        }

        async function renameFile(filename, newFilename) {
            const renameStatus = document.getElementById('renameStatus');
            const form = new FormData();
            form.append('action', 'rename');
            form.append('filename', filename);
            form.append('newFilename', newFilename);
            renameStatus.textContent = 'Renaming...';

            try {
                const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
                const data = await response.json();
                if (!data.ok) {
                    renameStatus.textContent = data.error || 'Rename failed.';
                    return;
                }

                if (currentFilename === filename) {
                    setCurrentFile(data.file);
                    saveSessionNow({ includePages: false });
                }

                await loadFileList({
                    open: true,
                    loadingText: '',
                    emptyText: 'No saved files yet.'
                });
                document.getElementById('viewStatus').textContent = `Renamed: ${displayName(data.file)}`;
            } catch (error) {
                renameStatus.textContent = 'Rename failed.';
            }
        }

        async function duplicateFile(filename) {
            const status = document.getElementById('viewStatus');
            const form = new FormData();
            form.append('action', 'duplicate');
            form.append('filename', filename);
            status.textContent = 'Duplicating...';

            try {
                const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
                const data = await response.json();
                if (!data.ok) {
                    status.textContent = data.error || 'Duplicate failed.';
                    return;
                }

                await loadFileList({
                    open: true,
                    loadingText: '',
                    emptyText: 'No saved files yet.'
                });
                document.getElementById('viewStatus').textContent = `Duplicated: ${displayName(data.file)}`;
            } catch (error) {
                status.textContent = 'Duplicate failed.';
            }
        }

        document.getElementById('confirmRenameBtn').addEventListener('click', () => {
            if (pendingRenameName) {
                renameFile(pendingRenameName, renameInput.value.trim());
            }
        });

        renameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && pendingRenameName) {
                renameFile(pendingRenameName, renameInput.value.trim());
            }
        });

        document.getElementById('cancelRenameBtn').addEventListener('click', () => {
            pendingRenameName = '';
            openModal('viewModal');
        });

        function imageToDataUrl(url) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    const buffer = document.createElement('canvas');
                    buffer.width = image.width;
                    buffer.height = image.height;
                    const bufferCtx = buffer.getContext('2d');
                    bufferCtx.fillStyle = canvasBackgroundFill(bufferCtx, buffer.width, buffer.height);
                    bufferCtx.fillRect(0, 0, buffer.width, buffer.height);
                    bufferCtx.drawImage(image, 0, 0);
                    resolve({
                        dataUrl: buffer.toDataURL('image/jpeg', 0.92),
                        width: image.width,
                        height: image.height
                    });
                };
                image.onerror = reject;
                image.src = `${url}?t=${Date.now()}`;
            });
        }

        async function loadDocumentData(url) {
            if (!url) {
                return null;
            }

            const response = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Failed to load document data: ${response.status}`);
            }

            const data = await response.json();
            return data && Array.isArray(data.pages) ? data : null;
        }

        async function loadDocument(file) {
            showDocumentLoadingSpinner();
            try {
                const loadedPages = new Map();
                const loadedPageImageSizes = new Map();
                const loadedModels = new Map();
                const loadedFailedPages = new Set();
                const pageNumbers = Array.isArray(file.pages) ? file.pages : [];
                for (const pageNumber of pageNumbers) {
                    const url = file.pageUrls && file.pageUrls[String(pageNumber)];
                    if (url) {
                        try {
                            const imageData = await imageToDataUrl(url);
                            loadedPages.set(Number(pageNumber), imageData.dataUrl);
                            loadedPageImageSizes.set(Number(pageNumber), { width: imageData.width, height: imageData.height });
                        } catch (error) {
                            // One missing/corrupt page image used to abort the whole
                            // document open (via the outer catch) — now the rest of
                            // the document still opens, and this page is flagged so
                            // renderCurrentPage() can show it as unavailable instead
                            // of silently rendering a blank canvas.
                            console.error(error);
                            loadedFailedPages.add(Number(pageNumber));
                        }
                    } else {
                        // No page_image URL at all for this page (the server
                        // only advertises one when the file actually exists) —
                        // same "nothing to show" outcome as a failed fetch,
                        // unless a vector model covers it instead (checked
                        // once loadedModels is populated, below).
                        loadedFailedPages.add(Number(pageNumber));
                    }
                }

                const documentData = await loadDocumentData(file.documentUrl);
                if (documentData) {
                    for (const pageData of documentData.pages) {
                        const pageNumber = Number(pageData.page);
                        const model = normalizePageModel(pageData);
                        if (pageNumber >= 1 && model) {
                            loadedModels.set(pageNumber, model);
                        }
                    }
                }
                currentVersion = documentData && Number.isInteger(documentData.version) ? documentData.version : null;
                const idMatch = typeof file.documentUrl === 'string' && file.documentUrl.match(/[?&]id=(\d+)/);
                currentDocumentId = idMatch ? Number(idMatch[1]) : null;

                pages = loadedPages;
                pageImageSizes = loadedPageImageSizes;
                pageModels = loadedModels;
                failedPageLoads = loadedFailedPages;
                warnedMissingPages = new Set();
                redoStacks = new Map();
                forwardRedoStacks = new Map();
                dirtyPages = new Set();
                currentStroke = null;
                tableDefaults = defaultCellStyles();
                perfectShapeMode = false;
                aiCostTotalGbp = normalizeCost(documentData && documentData.aiCostTotalGbp);
                aiCostLastGbp = 0;
                currentPage = 1;
                applyPaperMetadata(file.metadata);
                await showPage(1);
                setCurrentFile(file.name);
                updateAiCostBadge();
                hasUnsavedChanges = false;
                closeModals();
                saveSessionNow({ includePages: true });

                const pagesWithoutFallback = [...loadedFailedPages].filter((pageNumber) => !loadedModels.has(pageNumber));
                if (pagesWithoutFallback.length > 0) {
                    pagesWithoutFallback.sort((a, b) => a - b);
                    showCanvasToast(pagesWithoutFallback.length === 1
                        ? `Page ${pagesWithoutFallback[0]} could not be loaded and may be missing from storage.`
                        : `${pagesWithoutFallback.length} pages could not be loaded and may be missing from storage.`);
                }
            } catch (error) {
                console.error(error);
                showCanvasToast('Could not open this document. Please try again.');
            } finally {
                hideDocumentLoadingSpinner();
            }
        }

        async function initializeApp() {
            startMainThreadLagMonitor();
            resizeAllCanvases();
            requestPortraitLock();
            setTool('pen');
            setInputMode(inputMode);
            const restored = await restoreSavedSession();
            if (!restored) {
                setCurrentFile('');
                updatePageControl();
                updateUndoButton();
                saveSessionNow({ includePages: false });
            }
            updateOptionPreviews();
        }

        initializeApp();

        if (window.CANVAS_STATUS_MESSAGE) {
            showCanvasToast(window.CANVAS_STATUS_MESSAGE);
        }

        /* ===== SLIDE PANEL SYSTEM (generic, reutilizabil) ===== */
        const slidePanel = {
        element: document.getElementById('slidePanel'),
        title: document.getElementById('slidePanelTitle'),
        closeBtn: document.getElementById('slidePanelCloseBtn'),
        inputRow: document.getElementById('slidePanelInputRow'),
        input: document.getElementById('slidePanelInput'),
        body: document.getElementById('slidePanelBody'),
        currentConfig: null,
        searchTimer: null,
        returnFocus: null
        };

        function openSlidePanel(config) {
        slidePanel.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        slidePanel.currentConfig = config;
        slidePanel.title.textContent = config.title || 'Panel';
        
        if (config.showInput) {
            slidePanel.inputRow.style.display = 'flex';
            slidePanel.input.placeholder = config.inputPlaceholder || 'Search...';
            slidePanel.input.value = '';
        } else {
            slidePanel.inputRow.style.display = 'none';
        }
        
        slidePanel.body.innerHTML = '';
        if (config.renderContent) {
            config.renderContent(slidePanel.body);
        }
        
        slidePanel.element.classList.add('is-open');
        slidePanel.element.setAttribute('aria-hidden', 'false');
        
        if (config.showInput) {
            setTimeout(() => {
            slidePanel.input.focus();
            }, 300);
        } else {
            slidePanel.closeBtn.focus();
        }
        }

        function closeSlidePanel() {
        slidePanel.element.classList.remove('is-open');
        slidePanel.element.setAttribute('aria-hidden', 'true');
        slidePanel.currentConfig = null;
        if (slidePanel.returnFocus && document.contains(slidePanel.returnFocus)) {
            slidePanel.returnFocus.focus();
        }
        slidePanel.returnFocus = null;
        }

        slidePanel.closeBtn.addEventListener('click', closeSlidePanel);

        slidePanel.input.addEventListener('input', () => {
        if (slidePanel.currentConfig && slidePanel.currentConfig.onInput) {
            slidePanel.currentConfig.onInput(slidePanel.input.value);
        }
        });

        document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && slidePanel.element.classList.contains('is-open')) {
            closeSlidePanel();
            return;
        }
        if (e.key === 'Tab' && slidePanel.element.classList.contains('is-open')) {
            const focusable = Array.from(slidePanel.element.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
                .filter((element) => element.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        });

        /* ===== SEARCH PANEL ===== */
        function openSearchPanel() {
        if (window.CANVAS_DEMO_MODE) {
            window.location.href = window.CANVAS_REGISTER_URL;
            return;
        }
        openSlidePanel({
            title: 'Search',
            showInput: true,
            inputPlaceholder: 'Search files, folders, and text...',
            onInput: (value) => {
            if (slidePanel.searchTimer) clearTimeout(slidePanel.searchTimer);
            slidePanel.searchTimer = setTimeout(() => {
                performSearch(value);
            }, 80);
            },
            renderContent: (body) => {
            body.innerHTML = '<div class="slide-placeholder"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><h3>Start typing to search</h3><p>Search in files, folders, and text content</p></div>';
            }
        });
        }

        function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function highlightMatch(text, query) {
        if (!query) return escapeHtml(text);
        const escaped = escapeHtml(text);
        const queryEscaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('(' + queryEscaped + ')', 'gi');
        return escaped.replace(regex, '<mark>$1</mark>');
        }

        function getFileList() {
        try {
            const raw = localStorage.getItem('notepad_files_v2');
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
        }

        function getTextElementsFromAllPages() {
        const items = [];
        pageModels.forEach((model, pageIndex) => {
            if (!model || !Array.isArray(model.elements)) return;
            model.elements.forEach((el) => {
            if (el.type === 'text' && el.text && el.text.trim()) {
                items.push({
                page: pageIndex,
                elementId: el.id,
                text: el.text.trim()
                });
            }
            });
        });
        return items;
        }

        function performSearch(query) {
        const body = slidePanel.body;
        const q = query.trim().toLowerCase();
        
        if (q.length < 1) {
            body.innerHTML = '<div class="slide-placeholder"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><h3>Start typing to search</h3><p>Search in files, folders, and text content</p></div>';
            return;
        }
        
        const folderResults = [];
        const fileResults = [];
        const textResults = [];
        
        // Caută în foldere
        fetchAllLegacyPages('list', 'files')
            .then(data => {
            const folders = Array.isArray(data.folders) ? data.folders : [];
            const files = Array.isArray(data.files) ? data.files : [];
            
            folders.forEach((folder) => {
                if (folder.name.toLowerCase().includes(q)) {
                folderResults.push(folder);
                }
            });
            
            files.forEach((file) => {
                const name = (file.name || '').toLowerCase();
                if (name.includes(q)) {
                fileResults.push(file);
                }
            });
            
            const textElements = getTextElementsFromAllPages();
            textElements.forEach((item) => {
                if (item.text.toLowerCase().includes(q)) {
                textResults.push(item);
                }
            });
            
            if (folderResults.length === 0 && fileResults.length === 0 && textResults.length === 0) {
                body.innerHTML = '<div class="slide-empty"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><p>No results found</p></div>';
                return;
            }
            
            let html = '';
            
            // Foldere
            if (folderResults.length > 0) {
                html += '<div class="slide-section-title">Folders (' + folderResults.length + ')</div>';
                folderResults.forEach((folder) => {
                html += '<div class="slide-result-item" data-action="open-folder" data-folder-name="' + escapeHtml(folder.name) + '">'
                    + '<div class="slide-result-icon folder-icon"><svg viewBox="0 0 24 24"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.2l2 2H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" fill="currentColor"/></svg></div>'
                    + '<div class="slide-result-body">'
                    + '<div class="slide-result-title">' + highlightMatch(folder.name, query.trim()) + '</div>'
                    + '<div class="slide-result-meta">' + folder.count + ' files</div>'
                    + '</div></div>';
                });
            }
            
            // Fișiere
            if (fileResults.length > 0) {
                html += '<div class="slide-section-title">Files (' + fileResults.length + ')</div>';
                fileResults.forEach((file) => {
                const displayName = file.name || 'Untitled';
                const modified = file.modified ? new Date(file.modified).toLocaleDateString() : '';
                html += '<div class="slide-result-item" data-action="open-file" data-file-name="' + escapeHtml(file.name || '') + '">'
                    + '<div class="slide-result-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>'
                    + '<div class="slide-result-body">'
                    + '<div class="slide-result-title">' + highlightMatch(displayName, query.trim()) + '</div>'
                    + (modified ? '<div class="search-result-meta">' + escapeHtml(modified) + '</div>' : '')
                    + '</div></div>';
                });
            }
            
            // Text
            if (textResults.length > 0) {
                html += '<div class="slide-section-title">Text (' + textResults.length + ')</div>';
                textResults.forEach((item) => {
                const snippet = item.text.length > 120 ? item.text.substring(0, 120) + '...' : item.text;
                html += '<div class="slide-result-item" data-action="go-to-text" data-page="' + item.page + '" data-element-id="' + escapeHtml(item.elementId) + '">'
                    + '<div class="slide-result-icon"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>'
                    + '<div class="slide-result-body">'
                    + '<div class="slide-result-snippet">' + highlightMatch(snippet, query.trim()) + '</div>'
                    + '<div class="slide-result-meta">Page ' + (item.page + 1) + '</div>'
                    + '</div></div>';
                });
            }
            
            body.innerHTML = html;
            
            // Click handlers
            body.querySelectorAll('.slide-result-item').forEach((el) => {
                el.addEventListener('click', () => {
                const action = el.dataset.action;
                if (action === 'open-folder') {
                    const folderName = el.dataset.folderName;
                    closeSlidePanel();
                    loadFileList({ open: true, folder: folderName });
                } else if (action === 'open-file') {
                    const fileName = el.dataset.fileName;
                    const file = fileResults.find((f) => f.name === fileName);
                    closeSlidePanel();
                    if (file) {
                    loadDocument(file);
                    }
                } else if (action === 'go-to-text') {
                    const page = parseInt(el.dataset.page, 10);
                    const elementId = el.dataset.elementId;
                    closeSlidePanel();
                    if (!isNaN(page)) {
                    goToPage(page);
                    setTimeout(() => {
                        selectTextElement(elementId, { focus: true });
                    }, 100);
                    }
                }
                });
            });
            })
            .catch(() => {
            body.innerHTML = '<div class="slide-empty"><p>Search failed</p></div>';
            });
        }

        /* ===== LIBRARY PANEL ===== */
        const LIBRARY_TABS = [
            { id: 'pdfs', label: "PDF's" },
            { id: 'shapes', label: 'Shapes' },
            { id: 'infographics', label: 'Infographics' }
        ];

        function renderLibraryPlaceholderTab(container, label) {
            container.innerHTML = '<div class="slide-placeholder"><svg viewBox="0 0 24 24"><path d="M14 14h12v38H14z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M28 14h12v38H28z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M42 18h8l6 32-8 2z" fill="none" stroke="currentColor" stroke-width="2"/></svg><h3>' + escapeHtml(label) + '</h3><p>Coming soon</p></div>';
        }

        function renderLibraryShapesTab(container) {
            container.innerHTML = '<div class="library-shape-grid"></div>';
            const grid = container.querySelector('.library-shape-grid');
            SHAPE_LIBRARY.forEach((entry) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'library-shape-item';
                item.innerHTML = '<span class="library-shape-icon">' + SHAPE_LIBRARY_ICONS[shapeLibraryIconKey(entry)] + '</span><span class="library-shape-label">' + escapeHtml(entry.label) + '</span>';
                item.addEventListener('click', () => insertLibraryShape(entry));
                grid.appendChild(item);
            });
        }

        async function fetchPdfLibraryEntries() {
            try {
                const data = await fetchAllLegacyPages('list_pdfs', 'items');
                return Array.isArray(data.items) ? data.items : [];
            } catch (error) {
                return [];
            }
        }

        async function uploadPdfToLibrary(file) {
            const arrayBuffer = await file.arrayBuffer();
            let pageCount = 0;
            try {
                const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
                pageCount = pdfDoc.numPages;
            } catch (error) {
                window.alert('This file could not be read as a PDF.');
                return null;
            }

            const form = new FormData();
            form.append('action', 'upload_pdf');
            form.append('name', file.name);
            form.append('pageCount', String(pageCount));
            form.append('pdf', file);
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            const data = await response.json().catch(() => ({}));
            if (!data.ok) {
                window.alert(data.error || 'The PDF could not be uploaded.');
                return null;
            }
            return data;
        }

        const libraryPdfLastPageIndex = new Map();
        let libraryPdfSelectedId = '';
        const pdfDocCache = new Map();
        const pdfThumbnailCache = new Map();
        const pdfBytesCache = new Map();
        let libraryPdfView = { mode: 'list' };
        let activeLibraryPdfContainer = null;

        function goToLibraryPdfView(view) {
            libraryPdfView = view;
            if (activeLibraryPdfContainer) {
                renderLibraryPdfsTab(activeLibraryPdfContainer);
            }
        }

        function getPdfDocument(entry) {
            if (!pdfDocCache.has(entry.id)) {
                pdfDocCache.set(entry.id, pdfjsLib.getDocument(entry.url).promise);
            }
            return pdfDocCache.get(entry.id);
        }

        async function getPdfSourceBytes(url) {
            if (!pdfBytesCache.has(url)) {
                const request = (async () => {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch PDF (${response.status}) from ${url}`);
                    }
                    return response.arrayBuffer();
                })();
                request.catch(() => pdfBytesCache.delete(url));
                pdfBytesCache.set(url, request);
            }
            return pdfBytesCache.get(url);
        }

        async function getPdfPageThumbnail(entry, pageIndex, targetWidth) {
            let cache = pdfThumbnailCache.get(entry.id);
            if (!cache) {
                cache = new Map();
                pdfThumbnailCache.set(entry.id, cache);
            }
            if (cache.has(pageIndex)) {
                return cache.get(pageIndex);
            }

            const pdfDoc = await getPdfDocument(entry);
            const page = await pdfDoc.getPage(pageIndex + 1);
            const unscaled = page.getViewport({ scale: 1 });
            const scale = targetWidth / unscaled.width;
            const viewport = page.getViewport({ scale });
            const buffer = document.createElement('canvas');
            buffer.width = Math.max(1, Math.round(viewport.width));
            buffer.height = Math.max(1, Math.round(viewport.height));
            const bufferCtx = buffer.getContext('2d');
            await page.render({ canvasContext: bufferCtx, viewport }).promise;
            const dataUrl = buffer.toDataURL('image/jpeg', 0.85);
            cache.set(pageIndex, dataUrl);
            return dataUrl;
        }

        async function fetchPdfFavourites() {
            try {
                const data = await fetchAllLegacyPages('list_favourites', 'items');
                return { folders: data.folders || [], items: data.items || [] };
            } catch (error) {
                return { folders: [], items: [] };
            }
        }

        async function createPdfFavouriteFolder(name) {
            const form = new FormData();
            form.append('action', 'create_pdf_folder');
            form.append('name', name);
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            const data = await response.json().catch(() => ({}));
            return data.ok ? data.folders : null;
        }

        async function deletePdfFavouriteFolder(name) {
            const form = new FormData();
            form.append('action', 'delete_pdf_folder');
            form.append('name', name);
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            const data = await response.json().catch(() => ({}));
            return data.ok ? data.folders : null;
        }

        async function uploadPdfFavourite(blob, name, folder, sourcePdfId, sourcePageIndex) {
            const form = new FormData();
            form.append('action', 'upload_favourite');
            form.append('name', name);
            form.append('folder', folder || '');
            if (sourcePdfId) {
                form.append('sourcePdfId', sourcePdfId);
            }
            if (Number.isInteger(sourcePageIndex)) {
                form.append('sourcePageIndex', String(sourcePageIndex));
            }
            form.append('pdf', blob, 'page.pdf');
            const response = await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
            const data = await response.json().catch(() => ({}));
            return data.ok ? data : null;
        }

        async function deletePdfFavourite(id) {
            const form = new FormData();
            form.append('action', 'delete_favourite');
            form.append('id', id);
            await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
        }

        async function updatePdfPageOrder(pdfId, pageOrder) {
            const form = new FormData();
            form.append('action', 'update_pdf_page_order');
            form.append('id', pdfId);
            form.append('pageOrder', JSON.stringify(pageOrder));
            await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
        }

        async function addPdfPageToFavourites(entry, pageIndex, folder) {
            const bytes = await getPdfSourceBytes(entry.url);
            const sourceDoc = await PDFLib.PDFDocument.load(bytes);
            const newDoc = await PDFLib.PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageIndex]);
            newDoc.addPage(copiedPage);
            const outBytes = await newDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            await uploadPdfFavourite(blob, `${entry.name} - p${pageIndex + 1}`, folder, entry.id, pageIndex);
        }

        async function openAddToFavouritesModal(entry, pageIndices) {
            const { folders } = await fetchPdfFavourites();
            let selectedFolder = '';

            const overlay = document.createElement('div');
            overlay.className = 'library-modal-overlay';
            overlay.innerHTML = ''
                + '<div class="library-modal">'
                + '<h4>Add to Favourites</h4>'
                + '<div class="library-modal-folders"></div>'
                + '<input type="text" class="library-modal-new-folder-input" placeholder="New folder name">'
                + '<div class="library-modal-actions">'
                + '<button type="button" class="library-modal-cancel">Cancel</button>'
                + '<button type="button" class="library-modal-save">Save</button>'
                + '</div>'
                + '</div>';
            document.body.appendChild(overlay);

            const foldersEl = overlay.querySelector('.library-modal-folders');
            const renderFolderOptions = () => {
                foldersEl.innerHTML = '';
                const options = [{ label: 'No folder', value: '' }, ...folders.map((name) => ({ label: name, value: name }))];
                options.forEach((option) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'library-modal-folder-option' + (selectedFolder === option.value ? ' is-selected' : '');
                    btn.textContent = option.label;
                    btn.addEventListener('click', () => {
                        selectedFolder = option.value;
                        renderFolderOptions();
                    });
                    foldersEl.appendChild(btn);
                });
            };
            renderFolderOptions();

            const close = () => overlay.remove();
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    close();
                }
            });
            overlay.querySelector('.library-modal-cancel').addEventListener('click', close);
            overlay.querySelector('.library-modal-save').addEventListener('click', async () => {
                const newFolderInput = overlay.querySelector('.library-modal-new-folder-input');
                const newFolderName = newFolderInput.value.trim();
                const saveBtn = overlay.querySelector('.library-modal-save');
                saveBtn.disabled = true;
                try {
                    let folder = selectedFolder;
                    if (newFolderName) {
                        await createPdfFavouriteFolder(newFolderName);
                        folder = newFolderName;
                    }
                    for (const pageIndex of pageIndices) {
                        await addPdfPageToFavourites(entry, pageIndex, folder);
                    }
                    close();
                } catch (error) {
                    window.alert('The page could not be added to favourites.');
                    saveBtn.disabled = false;
                }
            });
        }

        function buildPdfPageSlotCard(entry, sourceIndex, label, isSelected, handlers, isFavourited, isImported) {
            const card = document.createElement('div');
            card.className = 'library-page-slot-card' + (isImported ? ' is-imported' : '');
            card.innerHTML = ''
                + '<div class="library-pdf-page"><span class="library-pdf-page-status">Loading...</span></div>'
                + '<div class="library-pdf-name-row">'
                + `<input type="checkbox" class="library-page-select-checkbox" aria-label="Select ${escapeHtml(label)}"${isSelected ? ' checked' : ''}>`
                + `<span class="library-pdf-name">${escapeHtml(label)}</span>`
                + (isFavourited
                    ? '<svg class="library-page-fav-star" viewBox="0 0 24 24" aria-label="In favourites"><path d="M12 3.5l2.47 5.4 5.93.63-4.45 4.02 1.24 5.83L12 16.7l-5.19 2.68 1.24-5.83-4.45-4.02 5.93-.63z" fill="currentColor"/></svg>'
                    : '')
                + (isImported
                    ? '<svg class="library-page-lock-icon" viewBox="0 0 24 24" aria-label="Already imported"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
                    : '')
                + '</div>';

            const pageEl = card.querySelector('.library-pdf-page');
            getPdfPageThumbnail(entry, sourceIndex, 220).then((dataUrl) => {
                pageEl.innerHTML = `<img src="${dataUrl}" alt="${escapeHtml(label)}">`;
            }).catch(() => {
                pageEl.innerHTML = '<span class="library-pdf-page-status">Preview unavailable</span>';
            });

            card.querySelector('.library-page-select-checkbox').addEventListener('change', (event) => {
                handlers.onToggleSelect(event.target.checked);
            });

            return card;
        }

        function renderLibraryPdfPagesView(container, entry, bulkSelect, selectAllCheckbox) {
            container.innerHTML = '<div class="library-pdf-list"></div>';
            const list = container.querySelector('.library-pdf-list');
            let pageOrder = Array.isArray(entry.pageOrder) && entry.pageOrder.length > 0
                ? entry.pageOrder.slice()
                : Array.from({ length: entry.pageCount }, (_, i) => i);
            let selectedSlots = new Set();
            let favouritedPageIndices = new Set();
            // A page duplicated in pageOrder can be imported once per
            // occurrence — entry.importedPageIndices is a multiset (one
            // entry per lock), so count occurrences per source page rather
            // than treating it as a plain set of "locked" indices.
            const importedCounts = new Map();
            (entry.importedPageIndices || []).forEach((sourceIndex) => {
                importedCounts.set(sourceIndex, (importedCounts.get(sourceIndex) || 0) + 1);
            });

            // Per current pageOrder, which slots are locked — consumes the
            // multiset in slot order so only as many occurrences as are
            // actually locked show as locked, leaving the rest importable.
            const computeSlotLocked = () => {
                const consumed = new Map();
                return pageOrder.map((sourceIndex) => {
                    const used = consumed.get(sourceIndex) || 0;
                    const locked = used < (importedCounts.get(sourceIndex) || 0);
                    if (locked) {
                        consumed.set(sourceIndex, used + 1);
                    }
                    return locked;
                });
            };

            const refreshFavouritedPages = async () => {
                const { items } = await fetchPdfFavourites();
                favouritedPageIndices = new Set(
                    items
                        .filter((item) => item.sourcePdfId === entry.id && Number.isInteger(item.sourcePageIndex))
                        .map((item) => item.sourcePageIndex)
                );
            };

            const syncSelectAllState = () => {
                if (!selectAllCheckbox) return;
                // Locked pages are still selectable (for favourite/delete/duplicate —
                // the lock only blocks re-inserting into canvas), so "select all"
                // counts every page, not just unlocked ones.
                selectAllCheckbox.checked = pageOrder.length > 0 && selectedSlots.size === pageOrder.length;
                selectAllCheckbox.indeterminate = selectedSlots.size > 0 && selectedSlots.size < pageOrder.length;
            };

            const renderGrid = () => {
                list.innerHTML = '';
                const occurrenceCount = new Map();
                const slotLocked = computeSlotLocked();
                pageOrder.forEach((sourceIndex, slot) => {
                    const seen = occurrenceCount.get(sourceIndex) || 0;
                    occurrenceCount.set(sourceIndex, seen + 1);
                    const label = seen === 0
                        ? `Page ${sourceIndex + 1}`
                        : `Page ${sourceIndex + 1} (copy${seen > 1 ? ' ' + seen : ''})`;
                    list.appendChild(buildPdfPageSlotCard(entry, sourceIndex, label, selectedSlots.has(slot), {
                        onToggleSelect: (checked) => {
                            if (checked) {
                                selectedSlots.add(slot);
                            } else {
                                selectedSlots.delete(slot);
                            }
                            syncSelectAllState();
                        }
                    }, favouritedPageIndices.has(sourceIndex), slotLocked[slot]));
                });
                if (pageOrder.length === 0) {
                    list.innerHTML = '<p class="library-pdf-status">No pages left in this PDF.</p>';
                }
                syncSelectAllState();
            };

            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', () => {
                    selectedSlots = selectAllCheckbox.checked
                        ? new Set(pageOrder.map((_, slot) => slot))
                        : new Set();
                    renderGrid();
                });
            }

            refreshFavouritedPages().then(renderGrid);

            if (bulkSelect) {
                bulkSelect.addEventListener('change', async () => {
                    const action = bulkSelect.value;
                    bulkSelect.value = '';
                    if (!action || selectedSlots.size === 0) {
                        return;
                    }

                    if (action === 'delete') {
                        pageOrder = pageOrder.filter((_, slot) => !selectedSlots.has(slot));
                    } else if (action === 'duplicate') {
                        const newOrder = [];
                        pageOrder.forEach((sourceIndex, slot) => {
                            newOrder.push(sourceIndex);
                            if (selectedSlots.has(slot)) {
                                newOrder.push(sourceIndex);
                            }
                        });
                        pageOrder = newOrder;
                    } else if (action === 'import') {
                        const slotLocked = computeSlotLocked();
                        const sourceIndices = pageOrder.filter((sourceIndex, slot) => selectedSlots.has(slot) && !slotLocked[slot]);
                        const skippedCount = pageOrder.filter((sourceIndex, slot) => selectedSlots.has(slot) && slotLocked[slot]).length;
                        if (sourceIndices.length > 0) {
                            await insertPdfPages(entry.id, entry.url, sourceIndices);
                        }
                        if (skippedCount > 0) {
                            showCanvasToast(skippedCount === 1
                                ? 'One selected page is already imported and was skipped.'
                                : `${skippedCount} selected pages are already imported and were skipped.`);
                        }
                    } else if (action === 'favourite') {
                        const sourceIndices = pageOrder.filter((_, slot) => selectedSlots.has(slot));
                        await openAddToFavouritesModal(entry, sourceIndices);
                    }

                    if (action === 'delete' || action === 'duplicate') {
                        updatePdfPageOrder(entry.id, pageOrder);
                    }
                    if (action === 'favourite') {
                        await refreshFavouritedPages();
                    }
                    selectedSlots = new Set();
                    renderGrid();
                });
            }
        }

        function buildFolderCard(name) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'library-folder-card';
            card.innerHTML = ''
                + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
                + `<span>${escapeHtml(name)}</span>`;
            card.addEventListener('click', () => {
                goToLibraryPdfView({ mode: 'favouritesFolder', folder: name });
            });
            return card;
        }

        function buildFavouritePageCard(item, onDeleted, isSelected, onToggleSelect) {
            const card = document.createElement('div');
            card.className = 'library-pdf-card' + (item.isImported ? ' is-imported' : '');
            card.innerHTML = ''
                + '<div class="library-pdf-main">'
                + '<div class="library-pdf-name-row">'
                + `<input type="checkbox" class="library-page-select-checkbox library-fav-select-checkbox" aria-label="Select ${escapeHtml(item.name)}"${isSelected ? ' checked' : ''}>`
                + `<div class="library-pdf-name">${escapeHtml(item.name)}</div>`
                + '</div>'
                + '<div class="library-pdf-page"><span class="library-pdf-page-status">Loading...</span></div>'
                + '</div>'
                + '<div class="library-pdf-icons">'
                + `<button type="button" class="library-pdf-icon-btn library-fav-import" aria-label="${item.isImported ? 'Already imported' : 'Import page into document'}"${item.isImported ? ' disabled title="Already imported"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg></button>`
                + '<button type="button" class="library-pdf-icon-btn library-fav-delete" aria-label="Remove from favourites"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/><path d="M10 11v5"/><path d="M14 11v5"/></svg></button>'
                + '</div>';

            const pageEl = card.querySelector('.library-pdf-page');
            getPdfPageThumbnail(item, 0, 220).then((dataUrl) => {
                pageEl.innerHTML = `<img src="${dataUrl}" alt="${escapeHtml(item.name)}">`;
            }).catch(() => {
                pageEl.innerHTML = '<span class="library-pdf-page-status">Preview unavailable</span>';
            });

            card.querySelector('.library-fav-select-checkbox').addEventListener('change', (event) => {
                if (typeof onToggleSelect === 'function') {
                    onToggleSelect(event.target.checked);
                }
            });

            if (!item.isImported) {
                card.querySelector('.library-fav-import').addEventListener('click', async () => {
                    // Import via the *original* PDF's identity when this favourite was
                    // cut from one, so the lock is tied to the real (pdfId, pageIndex)
                    // and collides correctly with the same page imported any other way.
                    if (item.sourcePdfId && Number.isInteger(item.sourcePageIndex)) {
                        const sourceUrl = `/canvas/api?action=pdf_file&id=${encodeURIComponent(item.sourcePdfId)}`;
                        await insertPdfPages(item.sourcePdfId, sourceUrl, [item.sourcePageIndex]);
                    } else {
                        await insertPdfPages(item.id, item.url, [0], { skipLock: true });
                    }
                });
            }
            card.querySelector('.library-fav-delete').addEventListener('click', async () => {
                if (!window.confirm(`Remove "${item.name}" from Favourites?`)) {
                    return;
                }
                await deletePdfFavourite(item.id);
                pdfDocCache.delete(item.id);
                pdfThumbnailCache.delete(item.id);
                if (typeof onDeleted === 'function') {
                    await onDeleted();
                }
            });

            return card;
        }

        async function fetchDocumentContentForEdit(documentId) {
            try {
                const response = await fetch(`/canvas/api?action=get_document&id=${encodeURIComponent(documentId)}`, { cache: 'no-store' });
                if (!response.ok) return null;
                return await response.json();
            } catch (error) {
                console.error('fetchDocumentContentForEdit failed', error);
                return null;
            }
        }

        function findPageWithSourcePdf(content, pdfId, pageIndex) {
            const pages = Array.isArray(content && content.pages) ? content.pages : [];
            return pages.find((page) => page.sourcePdf
                && String(page.sourcePdf.pdfId) === String(pdfId)
                && page.sourcePdf.pageIndex === pageIndex) || null;
        }

        async function downloadSelectedFavouritesAsPdf(selectedFavourites) {
            if (window.CANVAS_DEMO_MODE) {
                window.location.href = window.CANVAS_REGISTER_URL;
                return;
            }
            if (!window.CANVAS_PDF_EXPORT_ALLOWED) {
                window.alert('Downloading favourites as PDF is a Premium feature. Upgrade to unlock it.');
                return;
            }
            if (!window.PDFLib) {
                window.alert('The PDF export engine failed to load.');
                return;
            }
            if (!selectedFavourites.length) {
                return;
            }

            try {
                const outDoc = await PDFLib.PDFDocument.create();
                for (const item of selectedFavourites) {
                    const bytes = await getPdfSourceBytes(item.url);
                    const sourceDoc = await PDFLib.PDFDocument.load(bytes);
                    const copiedPages = await outDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
                    copiedPages.forEach((page) => outDoc.addPage(page));

                    // If this favourite's exact source page is currently sitting
                    // (edited) inside a canvas document, stamp those edits onto
                    // the page before it's merged in — otherwise the download
                    // would silently contain the original, un-annotated PDF page.
                    if (item.editedDocumentId) {
                        const content = await fetchDocumentContentForEdit(item.editedDocumentId);
                        const editedPage = content && findPageWithSourcePdf(content, item.sourcePdfId, item.sourcePageIndex);
                        if (editedPage && Array.isArray(editedPage.elements) && editedPage.elements.length > 0) {
                            const tempModel = {
                                baseWidth: editedPage.baseWidth,
                                baseHeight: editedPage.baseHeight,
                                elements: editedPage.elements,
                            };
                            const overlayDataUrl = renderElementsOnlyToTransparentDataUrl(tempModel);
                            const overlayBytes = dataUrlToBytes(overlayDataUrl);
                            const overlayImage = await outDoc.embedPng(overlayBytes);
                            const rect = pageDisplayRect(tempModel);
                            const scaleToPdf = 1 / rect.scale;
                            const size = cssSize();
                            const outPage = copiedPages[0];
                            const { height: pageHeightPt } = outPage.getSize();
                            outPage.drawImage(overlayImage, {
                                x: -rect.x * scaleToPdf,
                                y: pageHeightPt - (size.height - rect.y) * scaleToPdf,
                                width: size.width * scaleToPdf,
                                height: size.height * scaleToPdf,
                            });
                        }
                    }
                }
                const outBytes = await outDoc.save();
                const blob = new Blob([outBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = selectedFavourites.length === 1
                    ? `${selectedFavourites[0].name || 'favourite'}.pdf`
                    : 'favourites.pdf';
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('downloadSelectedFavouritesAsPdf failed', error);
                showCanvasToast('Could not build the merged PDF. Please try again.');
            }
        }

        async function renderLibraryFavouritesView(container, folder, bulkSelect, selectAllCheckbox) {
            container.innerHTML = '<p class="library-pdf-status">Loading...</p>';
            const { folders, items } = await fetchPdfFavourites();
            container.innerHTML = '<div class="library-pdf-list"></div>';
            const list = container.querySelector('.library-pdf-list');

            const refresh = () => renderLibraryPdfsTab(activeLibraryPdfContainer);
            const visibleItems = items.filter((item) => (item.folder || '') === (folder || ''));
            let selectedFavouriteIds = new Set();

            const syncSelectAllState = () => {
                if (!selectAllCheckbox) return;
                selectAllCheckbox.checked = visibleItems.length > 0 && selectedFavouriteIds.size === visibleItems.length;
                selectAllCheckbox.indeterminate = selectedFavouriteIds.size > 0 && selectedFavouriteIds.size < visibleItems.length;
            };

            const renderList = () => {
                list.innerHTML = '';
                if (!folder) {
                    folders.forEach((name) => list.appendChild(buildFolderCard(name)));
                }
                visibleItems.forEach((item) => {
                    list.appendChild(buildFavouritePageCard(item, refresh, selectedFavouriteIds.has(item.id), (checked) => {
                        if (checked) {
                            selectedFavouriteIds.add(item.id);
                        } else {
                            selectedFavouriteIds.delete(item.id);
                        }
                        syncSelectAllState();
                    }));
                });
                if ((!folder && folders.length === 0) && visibleItems.length === 0) {
                    list.innerHTML = '<p class="library-pdf-status">No favourites yet.</p>';
                }
                syncSelectAllState();
            };

            renderList();

            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', () => {
                    selectedFavouriteIds = selectAllCheckbox.checked
                        ? new Set(visibleItems.map((item) => item.id))
                        : new Set();
                    renderList();
                });
            }

            if (bulkSelect) {
                bulkSelect.addEventListener('change', async () => {
                    const action = bulkSelect.value;
                    bulkSelect.value = '';
                    if (!action || selectedFavouriteIds.size === 0) {
                        return;
                    }

                    const selected = visibleItems.filter((item) => selectedFavouriteIds.has(item.id));

                    if (action === 'download') {
                        await downloadSelectedFavouritesAsPdf(selected);
                    } else if (action === 'delete') {
                        if (!window.confirm(`Remove ${selected.length} favourite${selected.length === 1 ? '' : 's'}?`)) {
                            return;
                        }
                        for (const item of selected) {
                            await deletePdfFavourite(item.id);
                            pdfDocCache.delete(item.id);
                            pdfThumbnailCache.delete(item.id);
                        }
                        await refresh();
                        return;
                    }

                    selectedFavouriteIds = new Set();
                    renderList();
                });
            }
        }

        let libraryPdfMenuOutsideClickHandlerAttached = false;
        function ensureLibraryPdfMenuOutsideClickHandler() {
            if (libraryPdfMenuOutsideClickHandlerAttached) return;
            libraryPdfMenuOutsideClickHandlerAttached = true;
            document.addEventListener('click', (event) => {
                if (event.target.closest('.library-pdf-name-row')) return;
                document.querySelectorAll('.library-pdf-menu.is-open').forEach((menu) => menu.classList.remove('is-open'));
            });
        }

        function buildLibraryPdfCard(entry, onDeleted) {
            const card = document.createElement('div');
            card.className = 'library-pdf-card' + (libraryPdfSelectedId === entry.id ? ' is-selected' : '');
            const exportDisabled = !window.CANVAS_PDF_EXPORT_ALLOWED;
            // A page duplicated in pageOrder can be imported once per
            // occurrence — entry.importedPageIndices is a multiset (one
            // entry per lock), counted per source page below.
            const importedCounts = new Map();
            (entry.importedPageIndices || []).forEach((sourceIndex) => {
                importedCounts.set(sourceIndex, (importedCounts.get(sourceIndex) || 0) + 1);
            });
            card.innerHTML = ''
                + '<div class="library-pdf-main">'
                + '<div class="library-pdf-name-row">'
                + `<div class="library-pdf-name">${escapeHtml(entry.name)}</div>`
                + '<button type="button" class="library-pdf-menu-btn" aria-label="More options" aria-haspopup="true"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="19" r="1.8" fill="currentColor"/></svg></button>'
                + '<div class="library-pdf-menu" role="menu">'
                + '<button type="button" class="library-pdf-menu-item library-pdf-eye" role="menuitem">View pages</button>'
                + '<button type="button" class="library-pdf-menu-item library-pdf-import" role="menuitem">Insert page into canvas</button>'
                + `<button type="button" class="library-pdf-menu-item library-pdf-export" role="menuitem"${exportDisabled ? ' disabled' : ''}>Download PDF${exportDisabled ? '<span class="library-pdf-menu-badge">Premium</span>' : ''}</button>`
                + '<button type="button" class="library-pdf-menu-item library-pdf-delete is-danger" role="menuitem">Delete</button>'
                + '</div>'
                + '</div>'
                + '<div class="library-pdf-page"><span class="library-pdf-page-status">Loading...</span></div>'
                + '<div class="library-pdf-nav">'
                + '<button type="button" class="library-pdf-prev" aria-label="Previous page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg></button>'
                + '<span class="library-pdf-page-label"></span>'
                + '<button type="button" class="library-pdf-next" aria-label="Next page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>'
                + '</div>'
                + '</div>';

            const pageEl = card.querySelector('.library-pdf-page');
            const label = card.querySelector('.library-pdf-page-label');
            const prevBtn = card.querySelector('.library-pdf-prev');
            const nextBtn = card.querySelector('.library-pdf-next');
            const importMenuItem = card.querySelector('.library-pdf-import');
            // Navigate by slot in pageOrder (not raw PDF page index), so a
            // duplicated page counts as its own entry in current/total.
            const pageOrder = Array.isArray(entry.pageOrder) && entry.pageOrder.length > 0
                ? entry.pageOrder.slice()
                : Array.from({ length: entry.pageCount }, (_, i) => i);
            let slot = Math.max(0, Math.min(pageOrder.length - 1, libraryPdfLastPageIndex.get(entry.id) || 0));

            // Which slots are locked, consuming the multiset in slot order —
            // so only as many occurrences as are actually locked show locked.
            const slotLocked = (() => {
                const consumed = new Map();
                return pageOrder.map((sourceIndex) => {
                    const used = consumed.get(sourceIndex) || 0;
                    const locked = used < (importedCounts.get(sourceIndex) || 0);
                    if (locked) {
                        consumed.set(sourceIndex, used + 1);
                    }
                    return locked;
                });
            })();

            const updateImportState = () => {
                const isImported = slotLocked[slot];
                importMenuItem.disabled = isImported;
                importMenuItem.textContent = isImported ? 'Already imported' : 'Insert page into canvas';
            };

            const updateNavState = () => {
                prevBtn.disabled = slot <= 0;
                nextBtn.disabled = slot >= pageOrder.length - 1;
                label.textContent = `${slot + 1} / ${pageOrder.length}`;
                updateImportState();
            };

            const showPage = async (index) => {
                slot = Math.max(0, Math.min(pageOrder.length - 1, index));
                libraryPdfLastPageIndex.set(entry.id, slot);
                updateNavState();
                const requestedSlot = slot;
                const requestedIndex = pageOrder[requestedSlot];
                pageEl.classList.add('is-loading');
                try {
                    const dataUrl = await getPdfPageThumbnail(entry, requestedIndex, 220);
                    if (requestedSlot !== slot) {
                        return;
                    }
                    pageEl.innerHTML = `<img src="${dataUrl}" alt="Page ${requestedIndex + 1}">`;
                } catch (error) {
                    if (requestedSlot === slot) {
                        pageEl.innerHTML = '<span class="library-pdf-page-status">Preview unavailable</span>';
                    }
                } finally {
                    if (requestedSlot === slot) {
                        pageEl.classList.remove('is-loading');
                    }
                }
            };

            const selectCard = () => {
                libraryPdfSelectedId = entry.id;
                if (card.parentElement) {
                    card.parentElement.querySelectorAll('.library-pdf-card.is-selected').forEach((el) => {
                        el.classList.remove('is-selected');
                    });
                }
                card.classList.add('is-selected');
            };

            const menuBtn = card.querySelector('.library-pdf-menu-btn');
            const menu = card.querySelector('.library-pdf-menu');
            ensureLibraryPdfMenuOutsideClickHandler();
            menuBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const willOpen = !menu.classList.contains('is-open');
                document.querySelectorAll('.library-pdf-menu.is-open').forEach((el) => el.classList.remove('is-open'));
                menu.classList.toggle('is-open', willOpen);
            });

            pageEl.addEventListener('click', selectCard);
            prevBtn.addEventListener('click', (event) => { event.stopPropagation(); selectCard(); showPage(slot - 1); });
            nextBtn.addEventListener('click', (event) => { event.stopPropagation(); selectCard(); showPage(slot + 1); });
            card.querySelector('.library-pdf-eye').addEventListener('click', () => {
                menu.classList.remove('is-open');
                goToLibraryPdfView({ mode: 'pages', entry });
            });
            card.querySelector('.library-pdf-import').addEventListener('click', async () => {
                menu.classList.remove('is-open');
                const sourceIndex = pageOrder[slot];
                if (slotLocked[slot]) {
                    return;
                }
                await insertPdfPages(entry.id, entry.url, [sourceIndex]);
            });
            card.querySelector('.library-pdf-export').addEventListener('click', async () => {
                menu.classList.remove('is-open');
                await exportDocumentAsPdf(entry.id, entry.name);
            });
            card.querySelector('.library-pdf-delete').addEventListener('click', async () => {
                menu.classList.remove('is-open');
                if (!window.confirm(`Delete "${entry.name}" from the library? This cannot be undone.`)) {
                    return;
                }
                const form = new FormData();
                form.append('action', 'delete_pdf');
                form.append('id', entry.id);
                await fetch('/canvas/api', { method: 'POST', headers: { 'X-CSRF-TOKEN': __csrfToken }, body: form });
                libraryPdfLastPageIndex.delete(entry.id);
                pdfDocCache.delete(entry.id);
                pdfThumbnailCache.delete(entry.id);
                if (libraryPdfSelectedId === entry.id) {
                    libraryPdfSelectedId = '';
                }
                if (typeof onDeleted === 'function') {
                    await onDeleted();
                }
            });

            updateNavState();
            showPage(slot);

            return card;
        }

        function renderLibraryPdfsTab(container) {
            activeLibraryPdfContainer = container;
            const view = libraryPdfView;

            if (view.mode === 'pages') {
                container.innerHTML = ''
                    + '<div class="library-pdf-toolbar">'
                    + '<button type="button" class="library-pdf-back-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg><span>Back</span></button>'
                    + '<input type="checkbox" class="library-pdf-select-all" aria-label="Select all pages">'
                    + '<select class="library-pdf-bulk-select">'
                    + '<option value="" selected>Bulk action...</option>'
                    + '<option value="delete">Delete</option>'
                    + '<option value="import">Insert into canvas</option>'
                    + '<option value="duplicate">Duplicate</option>'
                    + '<option value="favourite">Add to favourites</option>'
                    + '</select>'
                    + '</div>'
                    + '<div class="library-pdf-view-body"></div>';
                container.querySelector('.library-pdf-back-link').addEventListener('click', () => {
                    goToLibraryPdfView({ mode: 'list' });
                });
                renderLibraryPdfPagesView(
                    container.querySelector('.library-pdf-view-body'),
                    view.entry,
                    container.querySelector('.library-pdf-bulk-select'),
                    container.querySelector('.library-pdf-select-all')
                );
                return;
            }

            if (view.mode === 'favourites' || view.mode === 'favouritesFolder') {
                const exportDisabled = !window.CANVAS_PDF_EXPORT_ALLOWED;
                container.innerHTML = ''
                    + '<div class="library-pdf-toolbar">'
                    + '<button type="button" class="library-pdf-back-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg><span>Back</span></button>'
                    + '<input type="checkbox" class="library-pdf-select-all" aria-label="Select all favourites">'
                    + '<select class="library-pdf-bulk-select">'
                    + '<option value="" selected>Bulk action...</option>'
                    + `<option value="download"${exportDisabled ? ' disabled' : ''}>Download selected${exportDisabled ? ' (Premium)' : ''}</option>`
                    + '<option value="delete">Delete selected</option>'
                    + '</select>'
                    + (view.mode === 'favourites'
                        ? '<button type="button" class="library-pdf-import-new library-pdf-new-folder">'
                            + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
                            + '<span>New folder</span>'
                            + '</button>'
                        : '<button type="button" class="library-pdf-import-new library-pdf-delete-folder">'
                            + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6.5 6l1 14h9l1-14"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>'
                            + '<span>Delete Folder</span>'
                            + '</button>')
                    + '</div>'
                    + '<div class="library-pdf-view-body"></div>';
                container.querySelector('.library-pdf-back-link').addEventListener('click', () => {
                    goToLibraryPdfView(view.mode === 'favouritesFolder' ? { mode: 'favourites' } : { mode: 'list' });
                });
                const newFolderBtn = container.querySelector('.library-pdf-new-folder');
                if (newFolderBtn) {
                    newFolderBtn.addEventListener('click', async () => {
                        const name = window.prompt('Folder name');
                        if (!name || !name.trim()) {
                            return;
                        }
                        await createPdfFavouriteFolder(name.trim());
                        renderLibraryPdfsTab(container);
                    });
                }
                const deleteFolderBtn = container.querySelector('.library-pdf-delete-folder');
                if (deleteFolderBtn) {
                    deleteFolderBtn.addEventListener('click', async () => {
                        if (!window.confirm(`Delete folder "${view.folder}" and all favourites inside it? This cannot be undone.`)) {
                            return;
                        }
                        await deletePdfFavouriteFolder(view.folder);
                        goToLibraryPdfView({ mode: 'favourites' });
                    });
                }
                renderLibraryFavouritesView(
                    container.querySelector('.library-pdf-view-body'),
                    view.mode === 'favouritesFolder' ? view.folder : '',
                    container.querySelector('.library-pdf-bulk-select'),
                    container.querySelector('.library-pdf-select-all')
                );
                return;
            }

            container.innerHTML = ''
                + '<div class="library-pdf-toolbar">'
                + '<button type="button" class="library-pdf-import-new">'
                + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
                + '<span>Import PDF</span>'
                + '</button>'
                + '<button type="button" class="library-pdf-import-new library-pdf-favourites-btn">'
                + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6z"/></svg>'
                + '<span>Favourites</span>'
                + '</button>'
                + '<input type="file" accept="application/pdf" class="library-pdf-file-input" style="display:none">'
                + '</div>'
                + '<div class="library-pdf-list"></div>';

            const importBtn = container.querySelector('.library-pdf-import-new');
            const fileInput = container.querySelector('.library-pdf-file-input');
            const list = container.querySelector('.library-pdf-list');

            const refresh = async () => {
                list.innerHTML = '<p class="library-pdf-status">Loading...</p>';
                const entries = await fetchPdfLibraryEntries();
                if (entries.length === 0) {
                    list.innerHTML = '<p class="library-pdf-status">No PDFs imported yet.</p>';
                    return;
                }
                list.innerHTML = '';
                entries.forEach((entry) => {
                    list.appendChild(buildLibraryPdfCard(entry, refresh));
                });
            };

            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', async () => {
                const file = fileInput.files && fileInput.files[0];
                fileInput.value = '';
                if (!file) {
                    return;
                }
                importBtn.disabled = true;
                try {
                    await uploadPdfToLibrary(file);
                    await refresh();
                } finally {
                    importBtn.disabled = false;
                }
            });

            container.querySelector('.library-pdf-favourites-btn').addEventListener('click', () => {
                goToLibraryPdfView({ mode: 'favourites' });
            });

            refresh();
        }

        function renderLibraryTabContent(container, tabId) {
            if (tabId === 'shapes') {
                renderLibraryShapesTab(container);
            } else if (tabId === 'pdfs') {
                renderLibraryPdfsTab(container);
            } else {
                renderLibraryPlaceholderTab(container, 'Infographics');
            }
        }

        let libraryActiveTab = 'pdfs';

        function openLibraryPanel() {
        openSlidePanel({
            title: 'Library',
            showInput: false,
            renderContent: (body) => {
            body.innerHTML = '<div class="library-tabs" role="tablist" aria-label="Library sections"></div><div class="library-tab-content" role="tabpanel"></div>';
            const tabsRow = body.querySelector('.library-tabs');
            const content = body.querySelector('.library-tab-content');

            LIBRARY_TABS.forEach((tab) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'library-tab' + (tab.id === libraryActiveTab ? ' is-active' : '');
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', tab.id === libraryActiveTab ? 'true' : 'false');
                btn.textContent = tab.label;
                btn.dataset.tab = tab.id;
                btn.addEventListener('click', () => {
                    if (libraryActiveTab === tab.id) {
                        return;
                    }
                    libraryActiveTab = tab.id;
                    tabsRow.querySelectorAll('.library-tab').forEach((el) => {
                        el.classList.toggle('is-active', el.dataset.tab === libraryActiveTab);
                        el.setAttribute('aria-selected', el.dataset.tab === libraryActiveTab ? 'true' : 'false');
                    });
                    renderLibraryTabContent(content, libraryActiveTab);
                });
                tabsRow.appendChild(btn);
            });

            renderLibraryTabContent(content, libraryActiveTab);
            }
        });
        }

        /* ===== USER PANEL ===== */
        function accountBarColor(pct) {
        if (pct === null) return 'acct-bar-indigo';
        if (pct >= 100) return 'acct-bar-red';
        if (pct >= 80) return 'acct-bar-amber';
        return 'acct-bar-indigo';
        }

        function renderAccountPanel(body, data) {
        const initial = (data.name || '?').trim().charAt(0).toUpperCase() || '?';
        const isPremium = Boolean(data.plan.isPremium);
        const priceLabel = data.plan.priceAmount > 0
            ? `${data.plan.priceSymbol}${data.plan.priceAmount.toFixed(2)}`
            : `${data.plan.priceSymbol}0`;
        const billingInterval = data.plan.billingInterval;

        const usagePct = data.aiUsage.pct;
        const pagesCap = data.canvasPages.cap;
        const pagesPct = pagesCap ? Math.min(100, Math.round((data.canvasPages.used / Math.max(pagesCap, 1)) * 100)) : null;
        const pdfsCap = data.pdfs.cap;
        const pdfsPct = pdfsCap ? Math.min(100, Math.round((data.pdfs.used / Math.max(pdfsCap, 1)) * 100)) : null;
        const safeAccount = {
            name: escapeHtml(String(data.name || '')),
            email: escapeHtml(String(data.email || '')),
            memberSince: escapeHtml(String(data.memberSince || '')),
            role: escapeHtml(String(data.role || '')),
            planName: escapeHtml(String(data.plan.name || 'Free')),
            priceLabel: escapeHtml(String(priceLabel)),
            billingInterval: escapeHtml(String(billingInterval || '')),
            resetsOn: escapeHtml(String(data.aiUsage.resetsOn || '')),
        };

        body.innerHTML = `
            <div class="acct">
            <div class="acct-signout-row">
                <a href="${window.CANVAS_HOME_URL}" class="acct-signout-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Go to homepage
                </a>
                <button type="button" class="acct-signout-btn" id="accountPanelSignOutBtn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Sign out
                </button>
            </div>

            <div class="acct-row acct-row-3">
                <div class="acct-card acct-col-2">
                <h3 class="acct-label">Account details</h3>
                <div class="acct-identity">
                    <div class="acct-avatar">${initial}</div>
                    <div>
                    <div class="acct-name">${safeAccount.name}</div>
                    <div class="acct-email">${safeAccount.email}</div>
                    </div>
                </div>
                <div class="acct-dl">
                    <div>
                    <div class="acct-dt">Member since</div>
                    <div class="acct-dd">${safeAccount.memberSince}</div>
                    </div>
                    <div>
                    <div class="acct-dt">Role</div>
                    <div class="acct-dd acct-capitalize">${safeAccount.role}</div>
                    </div>
                </div>
                <div class="acct-actions">
                    <a href="${window.CANVAS_PROFILE_EDIT_URL}" class="acct-btn acct-btn-indigo">Update Account</a>
                    <button type="button" id="acctDeleteBtn" class="acct-btn acct-btn-danger">Delete Account</button>
                </div>
                </div>

                <div class="acct-card acct-plan-card">
                <div class="acct-plan-head">
                    <h3 class="acct-label">Current plan</h3>
                    <span class="acct-badge ${isPremium ? 'is-premium' : 'is-free'}">${safeAccount.planName}</span>
                </div>
                <p class="acct-price">${safeAccount.priceLabel}${billingInterval ? `<span class="acct-price-interval">/${safeAccount.billingInterval}</span>` : ''}</p>
                <div class="acct-spacer"></div>
                ${!isPremium
                    ? `<button type="button" class="acct-upgrade-btn" id="acctUpgradeBtn">Upgrade to Premium</button>`
                    : `<div class="acct-thankyou">Thank you for being Premium.</div>`}
                </div>
            </div>

            <div class="acct-card">
                <div class="acct-plan-head" style="margin-bottom:4px;">
                <h3 class="acct-label">AI usage this month</h3>
                <span class="acct-note">Resets ${safeAccount.resetsOn}</span>
                </div>
                <div style="margin-top:12px;">
                ${data.aiUsage.unlimited ? `
                    <div class="acct-stat-row"><span class="acct-stat-value">Unlimited</span></div>
                    <div class="acct-bar-track"><div class="acct-bar-fill acct-bar-emerald" style="width:100%"></div></div>
                ` : `
                    <div class="acct-stat-row"><span class="acct-stat-value">${data.aiUsage.tokensUsed.toLocaleString()}</span><span class="acct-stat-cap">tokens used</span></div>
                    <div class="acct-bar-track"><div class="acct-bar-fill ${accountBarColor(usagePct)}" style="width:${usagePct ?? 6}%"></div></div>
                    ${usagePct !== null && usagePct >= 80 ? `<p class="acct-warning ${usagePct >= 100 ? 'is-danger' : 'is-warning'}">${usagePct >= 100 ? 'You have reached your monthly usage limit.' : 'You are approaching your monthly usage limit.'}</p>` : ''}
                `}
                </div>
            </div>

            <div class="acct-row acct-row-2">
                <div class="acct-card">
                <h3 class="acct-label" style="margin-bottom:12px;">Canvas pages</h3>
                <div class="acct-stat-row"><span class="acct-stat-value">${data.canvasPages.used}</span><span class="acct-stat-cap">${pagesCap ? 'of ' + pagesCap : 'unlimited'}</span></div>
                <div class="acct-bar-track"><div class="acct-bar-fill ${accountBarColor(pagesPct)}" style="width:${pagesPct ?? 6}%"></div></div>
                </div>

                <div class="acct-card">
                <h3 class="acct-label" style="margin-bottom:12px;">Imported PDFs</h3>
                <div class="acct-stat-row"><span class="acct-stat-value">${data.pdfs.used}</span><span class="acct-stat-cap">${pdfsCap ? 'of ' + pdfsCap : 'unlimited'}</span></div>
                <div class="acct-bar-track"><div class="acct-bar-fill ${accountBarColor(pdfsPct)}" style="width:${pdfsPct ?? 6}%"></div></div>
                ${data.pdfs.sizeCapMb ? `<div class="acct-note">Max ${data.pdfs.sizeCapMb}MB per file</div>` : ''}
                </div>
            </div>

            </div>
        `;

        const signOutBtn = body.querySelector('#accountPanelSignOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.CANVAS_LOGOUT_URL;
            form.innerHTML = `<input type="hidden" name="_token" value="${__csrfToken}">`;
            document.body.appendChild(form);
            form.submit();
            });
        }

        const upgradeBtn = body.querySelector('#acctUpgradeBtn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.CANVAS_BILLING_CHECKOUT_URL;
            form.innerHTML = `<input type="hidden" name="_token" value="${__csrfToken}">`;
            document.body.appendChild(form);
            form.submit();
            });
        }

        const deleteBtn = body.querySelector('#acctDeleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => renderAccountDeleteConfirm(body, data));
        }
        }

        function renderAccountDeleteConfirm(body, data) {
        body.innerHTML = `
            <div class="acct">
            <div class="acct-card">
                <h3 class="acct-label" style="margin-bottom:8px;">Delete account</h3>
                <p class="acct-note" style="margin-bottom:16px;">This will permanently delete your account and all its data. Enter your password to confirm.</p>
                <input type="password" id="acctDeletePassword" class="acct-delete-input" placeholder="Password" autocomplete="current-password">
                <p class="acct-delete-error" id="acctDeleteError" style="display:none;"></p>
                <div class="acct-actions" style="margin-top:16px;">
                <button type="button" id="acctDeleteCancelBtn" class="acct-btn acct-btn-indigo">Cancel</button>
                <button type="button" id="acctDeleteConfirmBtn" class="acct-btn acct-btn-danger">Delete Account</button>
                </div>
            </div>
            </div>
        `;

        const passwordInput = body.querySelector('#acctDeletePassword');
        const errorEl = body.querySelector('#acctDeleteError');

        body.querySelector('#acctDeleteCancelBtn').addEventListener('click', () => renderAccountPanel(body, data));

        body.querySelector('#acctDeleteConfirmBtn').addEventListener('click', async () => {
            errorEl.style.display = 'none';

            const response = await fetch(window.CANVAS_PROFILE_DESTROY_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': __csrfToken,
            },
            body: JSON.stringify({ password: passwordInput.value }),
            });

            if (response.ok) {
            window.location.href = window.CANVAS_HOME_URL;
            return;
            }

            if (response.status === 422) {
            const payload = await response.json();
            errorEl.textContent = payload.errors?.password?.[0] || 'Incorrect password.';
            } else {
            errorEl.textContent = 'Something went wrong. Please try again.';
            }
            errorEl.style.display = 'block';
            passwordInput.focus();
        });

        passwordInput.focus();
        }

        function openUserPanel() {
        if (window.CANVAS_DEMO_MODE) {
            window.location.href = window.CANVAS_REGISTER_URL;
            return;
        }

        openSlidePanel({
            title: 'Account',
            showInput: false,
            renderContent: (body) => {
            body.innerHTML = '<div class="slide-placeholder"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 22c2-6 7-9 8-9s6 3 8 9" fill="none" stroke="currentColor" stroke-width="2"/></svg><h3>Loading&hellip;</h3></div>';
            }
        });

        fetch(window.CANVAS_ACCOUNT_SUMMARY_URL, {
            headers: { 'Accept': 'application/json' },
        })
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((data) => renderAccountPanel(slidePanel.body, data))
            .catch(() => {
            slidePanel.body.innerHTML = '<div class="slide-placeholder"><h3>Could not load account details</h3><p>Please try again.</p></div>';
            });
        }

        /* ===== EVENT LISTENERS ===== */
        document.querySelectorAll('.search-icon').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSearchPanel();
        });
        });

        document.querySelectorAll('.library-icon').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLibraryPanel();
        });
        });

        document.querySelectorAll('.account-icon').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openUserPanel();
        });
        });
