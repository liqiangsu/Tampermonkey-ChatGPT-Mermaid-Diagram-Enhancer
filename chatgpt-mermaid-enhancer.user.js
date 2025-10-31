// ==UserScript==
// @name         ChatGPT Mermaid Diagram Enhancer
// @namespace    https://github.com/yourusername/chatgpt-mermaid-enhancer
// @version      1.0.6
// @description  Enhances ChatGPT by adding buttons to visualize Mermaid diagrams in code blocks
// @author       Danny Su
// @match        https://chatgpt.com/c/*
// @require      https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/yourusername/chatgpt-mermaid-enhancer/main/chatgpt-mermaid-enhancer.user.js
// @downloadURL  https://raw.githubusercontent.com/yourusername/chatgpt-mermaid-enhancer/main/chatgpt-mermaid-enhancer.user.js
// @supportURL   https://github.com/yourusername/chatgpt-mermaid-enhancer/issues
// @homepageURL  https://github.com/yourusername/chatgpt-mermaid-enhancer
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        mermaidButtonText: '📊 View Diagram',
        mermaidButtonClass: 'mermaid-view-btn',
        modalClass: 'mermaid-modal',
        overlayClass: 'mermaid-overlay',
        processedClass: 'mermaid-processed'
    };

    // Initialize Mermaid
    let mermaidInitialized = false;
    
    function initializeMermaid() {
        if (mermaidInitialized) return;
        
        try {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose', // Allow more flexibility in parsing
                themeVariables: {
                    darkMode: true,
                    primaryColor: '#10a37f',
                    primaryTextColor: '#ffffff',
                    primaryBorderColor: '#10a37f',
                    lineColor: '#ffffff',
                    secondaryColor: '#1a1a1a',
                    tertiaryColor: '#2d2d2d'
                },
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                },
                sequence: {
                    useMaxWidth: true,
                    wrap: true
                },
                journey: {
                    useMaxWidth: true
                },
                // Enable all diagram types
                er: {
                    useMaxWidth: true
                },
                pie: {
                    useMaxWidth: true
                },
                gantt: {
                    useMaxWidth: true
                }
            });
            mermaidInitialized = true;
            console.log('ChatGPT Mermaid Enhancer: Mermaid initialized successfully');
        } catch (error) {
            console.error('ChatGPT Mermaid Enhancer: Failed to initialize Mermaid:', error);
        }
    }

    // Add custom CSS styles
    GM_addStyle(`
        .${CONFIG.mermaidButtonClass} {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 8px;
            margin-left: 8px;
            background-color: #10a37f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.2s ease;
            z-index: 20;
            white-space: nowrap;
            user-select: none;
            outline: none;
        }

        .${CONFIG.mermaidButtonClass}:hover {
            background-color: #0d8f6f;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(16, 163, 127, 0.3);
        }

        .${CONFIG.mermaidButtonClass}:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(16, 163, 127, 0.2);
        }

        .${CONFIG.mermaidButtonClass}:focus {
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.4);
        }

        .${CONFIG.overlayClass} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .${CONFIG.modalClass} {
            background-color: #1a1a1a;
            border: 1px solid #404040;
            border-radius: 8px;
            padding: 20px;
            min-width: 800px;
            min-height: 600px;
            width: 80vw;
            height: 80vh;
            max-width: 95vw;
            max-height: 95vh;
            overflow: hidden;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            resize: both;
            cursor: move;
        }

        .${CONFIG.modalClass} .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: #999;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .${CONFIG.modalClass} .close-btn:hover {
            color: #fff;
        }

        .${CONFIG.modalClass} .diagram-container {
            margin-top: 30px;
            text-align: center;
            height: calc(100% - 60px);
            overflow: auto;
            position: relative;
            border: 1px solid #333;
            border-radius: 4px;
            background: #0f0f0f;
        }

        .${CONFIG.modalClass} .diagram-wrapper {
            position: relative;
            display: inline-block;
            min-width: 100%;
            min-height: 100%;
            transform-origin: center center;
            transition: transform 0.2s ease;
        }

        .${CONFIG.modalClass} .zoom-controls {
            position: absolute;
            top: 50px;
            right: 15px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 100;
        }

        .${CONFIG.modalClass} .zoom-btn {
            background: #333;
            border: 1px solid #555;
            color: #fff;
            width: 35px;
            height: 35px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s ease;
        }

        .${CONFIG.modalClass} .zoom-btn:hover {
            background: #444;
        }

        .${CONFIG.modalClass} .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            cursor: move;
            user-select: none;
            padding: 5px 0;
        }

        .${CONFIG.modalClass} .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nw-resize;
            background: linear-gradient(-45deg, transparent 0%, transparent 30%, #555 30%, #555 40%, transparent 40%, transparent 60%, #555 60%, #555 70%, transparent 70%);
        }

        .${CONFIG.modalClass} .error-message {
            color: #ff6b6b;
            background-color: #2d1a1a;
            border: 1px solid #ff6b6b;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
        }

        .${CONFIG.modalClass} .error-details {
            margin: 10px 0;
            padding: 10px;
            background-color: #1a0f0f;
            border-radius: 4px;
            border-left: 3px solid #ff6b6b;
        }

        .${CONFIG.modalClass} .error-text {
            background-color: #330000;
            color: #ffcccc;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            border: 1px solid #ff4444;
            margin: 5px 0;
        }

        .${CONFIG.modalClass} .code-text {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
        }

        .${CONFIG.modalClass} .selectable {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            cursor: text !important;
        }

        .${CONFIG.modalClass} .selectable::-moz-selection {
            background-color: #4a90e2;
            color: white;
        }

        .${CONFIG.modalClass} .selectable::selection {
            background-color: #4a90e2;
            color: white;
        }

        .${CONFIG.modalClass} .copy-error-btn {
            background-color: #ff6b6b;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 10px;
            transition: background-color 0.2s;
        }

        .${CONFIG.modalClass} .copy-error-btn:hover {
            background-color: #ff5252;
        }

        .${CONFIG.modalClass} h3 {
            color: #fff;
            margin: 0 0 15px 0;
            font-size: 18px;
        }

        /* Mermaid diagram styling */
        .${CONFIG.modalClass} .mermaid {
            background-color: transparent !important;
        }

        .${CONFIG.modalClass} svg {
            max-width: 100% !important;
            height: auto !important;
        }
    `);

    // Function to detect if a code block contains Mermaid syntax
    function isMermaidCode(codeElement) {
        // Method 1: Check for explicit "mermaid" language indicator in the header
        // Look for the specific ChatGPT structure: div with "mermaid" text
        let container = codeElement.closest('pre');
        if (!container) {
            container = codeElement.closest('div[class*="bg-token"], div[class*="rounded"]');
        }
        
        if (container) {
            // Look for the language indicator div that contains "mermaid"
            const headerDiv = container.querySelector('div[class*="flex"][class*="items-center"]:first-child');
            if (headerDiv && headerDiv.textContent.toLowerCase().trim() === 'mermaid') {
                return true;
            }
            
            // Also check for any div that contains just "mermaid" text
            const allDivs = container.querySelectorAll('div');
            for (const div of allDivs) {
                if (div.textContent.toLowerCase().trim() === 'mermaid') {
                    return true;
                }
            }
        }

        // Method 2: Check for language-mermaid class on code element
        if (codeElement.classList.contains('language-mermaid')) {
            return true;
        }

        // Method 3: Check if the code content looks like Mermaid syntax
        const codeText = codeElement.textContent || codeElement.innerText || '';
        if (!codeText.trim()) return false;

        // Clean the text for analysis (handle HTML entities)
        const cleanText = codeText
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
            .trim();

        const mermaidKeywords = [
            'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 
            'stateDiagram', 'journey', 'pie', 'gitgraph', 'mindmap',
            'timeline', 'gantt', 'erDiagram', 'subgraph', 'quadrantChart',
            'requirementDiagram', 'c4Context', 'gitGraph'
        ];

        const mermaidOperators = ['-->', '--', '==>', '=>', '-.', '-.-', '-..-', '=.='];
        
        // Check for flowchart direction indicators  
        const flowchartDirections = ['TD', 'TB', 'BT', 'RL', 'LR'];
        
        // Check for Mermaid-specific syntax patterns
        const mermaidPatterns = [
            /participant\s+\w+/i,           // sequence diagrams
            /class\s+\w+/i,                 // class diagrams  
            /state\s+\w+/i,                 // state diagrams
            /\w+\s*-->\s*\w+/,             // arrows
            /\w+\s*\[\s*.+\s*\]/,          // node labels
            /%%.*$/m,                       // comments
            /%%.*/                          // comments
        ];
        
        const hasKeyword = mermaidKeywords.some(keyword => 
            cleanText.toLowerCase().includes(keyword.toLowerCase())
        );
        
        const hasOperator = mermaidOperators.some(op => cleanText.includes(op));
        
        const hasDirection = flowchartDirections.some(dir => 
            new RegExp(`\\b${dir}\\b`, 'i').test(cleanText)
        );

        const hasPattern = mermaidPatterns.some(pattern => pattern.test(cleanText));

        // Return true if we have strong indicators of Mermaid syntax
        return hasKeyword || (hasOperator && hasPattern) || (hasDirection && hasOperator);
    }

    // Function to extract Mermaid code from element
    function extractMermaidCode(codeElement) {
        return codeElement.textContent || codeElement.innerText || '';
    }

    // Function to add copy functionality to error messages
    function addCopyFunctionality(container) {
        // Find all copy buttons in the container and add event listeners
        const copyButtons = container.querySelectorAll('.copy-error-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-copy-target');
                const targetElement = container.querySelector(`#${targetId}`);
                
                if (targetElement) {
                    const text = targetElement.textContent;
                    copyTextToClipboard(text, this);
                } else {
                    console.error('Target element not found:', targetId);
                }
            });
        });

        function copyTextToClipboard(text, button) {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopyFeedback(button);
                }).catch((err) => {
                    console.warn('Clipboard API failed, falling back to selection method:', err);
                    fallbackCopyText(text, button);
                });
            } else {
                // Fallback for older browsers or non-HTTPS
                fallbackCopyText(text, button);
            }
        }

        function fallbackCopyText(text, button) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            
            try {
                textArea.focus();
                textArea.select();
                textArea.setSelectionRange(0, 99999); // For mobile devices
                
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopyFeedback(button);
                } else {
                    showCopyError(button);
                }
            } catch (err) {
                console.error('Fallback copy failed:', err);
                showCopyError(button);
            } finally {
                document.body.removeChild(textArea);
            }
        }

        function showCopyFeedback(button) {
            const originalText = button.textContent;
            const originalBgColor = button.style.backgroundColor;
            
            button.textContent = '✓ Copied!';
            button.style.backgroundColor = '#4CAF50';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalBgColor || '#ff6b6b';
                button.disabled = false;
            }, 2000);
        }

        function showCopyError(button) {
            const originalText = button.textContent;
            
            button.textContent = '❌ Failed';
            button.style.backgroundColor = '#d32f2f';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#ff6b6b';
            }, 2000);
        }
    }

    // Function to create and show modal with Mermaid diagram
    function showMermaidModal(mermaidCode) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = CONFIG.overlayClass;

        // Create modal
        const modal = document.createElement('div');
        modal.className = CONFIG.modalClass;

        // Create header with title and close button
        const header = document.createElement('div');
        header.className = 'modal-header';

        const title = document.createElement('h3');
        title.textContent = 'Mermaid Diagram';
        title.style.margin = '0';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => document.body.removeChild(overlay);

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';

        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'zoom-btn';
        zoomInBtn.innerHTML = '+';
        zoomInBtn.title = 'Zoom In';

        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'zoom-btn';
        zoomOutBtn.innerHTML = '−';
        zoomOutBtn.title = 'Zoom Out';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'zoom-btn';
        resetBtn.innerHTML = '⌂';
        resetBtn.title = 'Reset Zoom';

        zoomControls.appendChild(zoomInBtn);
        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(resetBtn);

        // Create diagram container
        const diagramContainer = document.createElement('div');
        diagramContainer.className = 'diagram-container';

        // Create diagram wrapper for zoom/pan
        const diagramWrapper = document.createElement('div');
        diagramWrapper.className = 'diagram-wrapper';
        diagramContainer.appendChild(diagramWrapper);

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(zoomControls);
        modal.appendChild(diagramContainer);
        modal.appendChild(resizeHandle);
        overlay.appendChild(modal);

        // Add functionality
        setupModalInteractions(modal, header, diagramContainer, diagramWrapper, zoomInBtn, zoomOutBtn, resetBtn, resizeHandle);

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };

        // Close on Escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        // Add to DOM
        document.body.appendChild(overlay);

        // Render Mermaid diagram
        renderMermaidDiagram(mermaidCode, diagramWrapper);
    }

    // Function to render Mermaid diagram
    async function renderMermaidDiagram(mermaidCode, container) {
        if (!mermaidInitialized) {
            initializeMermaid();
        }

        try {
            // Clean the code (remove code block markers if present)
            let cleanCode = mermaidCode.trim();
            cleanCode = cleanCode.replace(/^```mermaid\s*\n?/i, '');
            cleanCode = cleanCode.replace(/\n?```\s*$/i, '');
            cleanCode = cleanCode.trim();

            // Additional cleaning for common issues
            cleanCode = cleanCode.replace(/&gt;/g, '>');
            cleanCode = cleanCode.replace(/&lt;/g, '<');
            cleanCode = cleanCode.replace(/&amp;/g, '&');

            console.log('ChatGPT Mermaid Enhancer: Attempting to render code:', cleanCode);

            // Generate unique ID for this diagram
            const diagramId = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

            // Try to render directly without validation first (validation might be the issue)
            try {
                const { svg } = await mermaid.render(diagramId, cleanCode);
                container.innerHTML = svg;
                console.log('ChatGPT Mermaid Enhancer: Diagram rendered successfully');
                return;
            } catch (renderError) {
                console.warn('ChatGPT Mermaid Enhancer: Direct render failed, trying with validation:', renderError);
                
                // If direct render fails, try validation first
                try {
                    const parseResult = await mermaid.parse(cleanCode);
                    if (parseResult === true || parseResult.parser) {
                        // Parse successful, try render again
                        const { svg } = await mermaid.render(diagramId + '_retry', cleanCode);
                        container.innerHTML = svg;
                        console.log('ChatGPT Mermaid Enhancer: Diagram rendered after validation');
                        return;
                    }
                } catch (parseError) {
                    console.error('ChatGPT Mermaid Enhancer: Parse error:', parseError);
                }
                
                // If everything fails, throw the original render error
                throw renderError;
            }

        } catch (error) {
            console.error('ChatGPT Mermaid Enhancer: Rendering error:', error);
            
            // Extract detailed error information
            const fullErrorMessage = error.message || error.toString();
            const errorStack = error.stack || 'No stack trace available';
            
            // Provide more helpful error messages
            let userFriendlyMsg = fullErrorMessage;
            if (fullErrorMessage.includes("language 'mermaid'")) {
                userFriendlyMsg = 'Mermaid diagram type not recognized. Please check the syntax.';
            } else if (fullErrorMessage.includes('Parse error')) {
                userFriendlyMsg = 'Syntax error in Mermaid diagram. Please check the code structure.';
            } else if (fullErrorMessage.includes('Lexical error')) {
                userFriendlyMsg = 'Invalid characters or tokens in the diagram syntax.';
            } else if (fullErrorMessage.includes('Expecting')) {
                userFriendlyMsg = 'Missing or incorrect syntax elements in the diagram.';
            }

            // Generate unique IDs for copy functionality
            const errorId = 'error-' + Date.now();
            const codeId = 'code-' + Date.now();
            
            container.innerHTML = `
                <div class="error-message">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <strong>❌ Error rendering Mermaid diagram</strong>
                        <button class="copy-error-btn" data-copy-target="${errorId}">Copy Error</button>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Summary:</strong> ${userFriendlyMsg}
                    </div>
                    
                    <div class="error-details">
                        <strong>Technical Details:</strong>
                        <pre id="${errorId}" class="error-text selectable">${fullErrorMessage}</pre>
                    </div>
                    
                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: #ff9999; font-weight: bold;">🔍 Show Mermaid Code</summary>
                        <div style="display: flex; align-items: center; margin: 10px 0 5px 0;">
                            <span style="font-weight: bold;">Source Code:</span>
                            <button class="copy-error-btn" data-copy-target="${codeId}" style="margin-left: 10px;">Copy Code</button>
                        </div>
                        <pre id="${codeId}" class="code-text selectable" style="background: #000; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">${mermaidCode}</pre>
                    </details>
                    
                    <details style="margin-top: 10px;">
                        <summary style="cursor: pointer; color: #ff9999; font-weight: bold;">🛠️ Debug Information</summary>
                        <pre class="error-text selectable" style="margin-top: 10px; font-size: 11px; max-height: 200px; overflow-y: auto;">${errorStack}</pre>
                    </details>
                    
                    <div style="margin-top: 15px; padding: 10px; background-color: #1a1a2e; border-radius: 4px; border-left: 3px solid #4a90e2;">
                        <strong style="color: #4a90e2;">💡 Helpful Tips:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px; color: #ccc;">
                            <li>Check for typos in keywords (flowchart, graph, sequenceDiagram, etc.)</li>
                            <li>Ensure proper arrow syntax (-->, ==>, etc.)</li>
                            <li>Verify all nodes are properly defined</li>
                            <li>Check for balanced brackets and quotes</li>
                        </ul>
                        <a href="https://mermaid.js.org/" target="_blank" style="color: #10a37f; text-decoration: none;">📖 Mermaid Documentation</a> |
                        <a href="https://mermaid.live/" target="_blank" style="color: #10a37f; text-decoration: none;">🧪 Online Editor</a>
                    </div>
                </div>
            `;

            // Add copy functionality to the container
            addCopyFunctionality(container);
        }
    }

    // Function to setup modal interactions (drag, zoom, pan)
    function setupModalInteractions(modal, header, diagramContainer, diagramWrapper, zoomInBtn, zoomOutBtn, resetBtn, resizeHandle) {
        let currentZoom = 1;
        let currentTranslateX = 0;
        let currentTranslateY = 0;
        let isDragging = false;
        let isResizing = false;
        let isPanning = false;
        let dragStartX, dragStartY, modalStartX, modalStartY;
        let panStartX, panStartY, wrapperStartX, wrapperStartY;

        // Helper function to get current transform values
        const getCurrentTransform = () => {
            const transform = diagramWrapper.style.transform;
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            const translateMatch = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
            
            currentZoom = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            currentTranslateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
            currentTranslateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
        };

        // Helper function to apply transform
        const applyTransform = (zoom, translateX, translateY) => {
            currentZoom = zoom;
            currentTranslateX = translateX;
            currentTranslateY = translateY;
            diagramWrapper.style.transform = `scale(${zoom}) translate(${translateX}px, ${translateY}px)`;
        };

        // Make modal draggable by header
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return; // Don't drag when clicking close button
            
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            const rect = modal.getBoundingClientRect();
            modalStartX = rect.left;
            modalStartY = rect.top;
            
            modal.style.position = 'fixed';
            modal.style.left = modalStartX + 'px';
            modal.style.top = modalStartY + 'px';
            modal.style.margin = '0';
            
            e.preventDefault();
        });

        // Zoom functionality with center point preservation
        const zoomAtPoint = (newZoom, centerX = null, centerY = null) => {
            getCurrentTransform();
            
            const clampedZoom = Math.max(0.1, Math.min(5, newZoom));
            const zoomRatio = clampedZoom / currentZoom;
            
            if (centerX !== null && centerY !== null) {
                // Zoom at specific point (for mouse wheel)
                const containerRect = diagramContainer.getBoundingClientRect();
                const relativeX = centerX - containerRect.left - containerRect.width / 2;
                const relativeY = centerY - containerRect.top - containerRect.height / 2;
                
                // Calculate new translation to keep the point under cursor
                const newTranslateX = currentTranslateX - (relativeX * (zoomRatio - 1)) / currentZoom;
                const newTranslateY = currentTranslateY - (relativeY * (zoomRatio - 1)) / currentZoom;
                
                applyTransform(clampedZoom, newTranslateX, newTranslateY);
            } else {
                // Zoom at current center (for zoom buttons)
                const newTranslateX = currentTranslateX * zoomRatio;
                const newTranslateY = currentTranslateY * zoomRatio;
                
                applyTransform(clampedZoom, newTranslateX, newTranslateY);
            }
        };

        // Button zoom - maintain current center
        zoomInBtn.addEventListener('click', () => {
            zoomAtPoint(currentZoom * 1.2);
        });
        
        zoomOutBtn.addEventListener('click', () => {
            zoomAtPoint(currentZoom / 1.2);
        });
        
        resetBtn.addEventListener('click', () => {
            applyTransform(1, 0, 0);
        });

        // Wheel zoom - zoom at mouse position
        diagramContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            zoomAtPoint(currentZoom * zoomFactor, e.clientX, e.clientY);
        });

        // Pan functionality on diagram
        diagramContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('.zoom-controls')) return;
            
            isPanning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            
            getCurrentTransform();
            wrapperStartX = currentTranslateX;
            wrapperStartY = currentTranslateY;
            
            diagramContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                
                modal.style.left = (modalStartX + deltaX) + 'px';
                modal.style.top = (modalStartY + deltaY) + 'px';
            }
            
            if (isPanning) {
                const deltaX = e.clientX - panStartX;
                const deltaY = e.clientY - panStartY;
                
                // Scale the delta by the inverse of zoom for consistent panning speed
                const scaledDeltaX = deltaX / currentZoom;
                const scaledDeltaY = deltaY / currentZoom;
                
                const newX = wrapperStartX + scaledDeltaX;
                const newY = wrapperStartY + scaledDeltaY;
                
                applyTransform(currentZoom, newX, newY);
            }
        });

        // Mouse up handler
        document.addEventListener('mouseup', () => {
            isDragging = false;
            isPanning = false;
            isResizing = false;
            diagramContainer.style.cursor = 'default';
        });

        // Resize functionality
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
            e.stopPropagation();
        });
    }

    // Function to create Mermaid view button
    function createMermaidButton(codeElement) {
        const button = document.createElement('button');
        button.className = CONFIG.mermaidButtonClass;
        button.textContent = CONFIG.mermaidButtonText;
        
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const mermaidCode = extractMermaidCode(codeElement);
            showMermaidModal(mermaidCode);
        };

        return button;
    }

    // Function to add buttons to Mermaid code blocks
    function addMermaidButtons() {
        // Look for code blocks in ChatGPT's specific structure
        const codeSelectors = [
            'code.language-mermaid',
            'code[class*="language-mermaid"]',
            'pre code',
            '.highlight code',
            'code.whitespace-pre'
        ];
        
        const codeBlocks = document.querySelectorAll(codeSelectors.join(', '));
        
        codeBlocks.forEach(codeElement => {
            // Skip if already processed
            if (codeElement.classList.contains(CONFIG.processedClass)) {
                return;
            }

            // Check if this is a Mermaid code block
            if (!isMermaidCode(codeElement)) {
                return;
            }

            // Mark as processed
            codeElement.classList.add(CONFIG.processedClass);

            // Find the ChatGPT-specific header structure
            let headerElement = findChatGPTCodeHeader(codeElement);

            // Add the Mermaid button
            if (headerElement) {
                const mermaidButton = createMermaidButton(codeElement);
                headerElement.appendChild(mermaidButton);
                console.log('ChatGPT Mermaid Enhancer: Added Mermaid button to code block');
            }
        });
    }

    // Function to find ChatGPT's specific code header structure
    function findChatGPTCodeHeader(codeElement) {
        // Look for the specific ChatGPT structure based on the provided HTML
        let container = codeElement.closest('pre');
        if (!container) {
            container = codeElement.closest('div[class*="rounded"], div[class*="bg-token"]');
        }

        if (container) {
            // Look for the header that contains the language indicator and copy button
            // Structure: div.flex.items-center with language name and copy button
            const headerCandidates = container.querySelectorAll('div[class*="flex"][class*="items-center"]');
            
            for (const candidate of headerCandidates) {
                // Check if this div contains both language indicator and copy functionality
                const hasLanguage = candidate.textContent.includes('mermaid') || 
                                  candidate.querySelector('span, div') !== null;
                const hasCopyButton = candidate.querySelector('button[aria-label*="Copy"], button svg, [class*="copy"]') !== null;
                
                if (hasLanguage || hasCopyButton) {
                    return candidate;
                }
            }

            // Fallback: look for any header-like structure with buttons
            const buttonContainer = container.querySelector('div[class*="absolute"][class*="end-0"], div[class*="sticky"]');
            if (buttonContainer) {
                // Find the actual button container within it
                const innerContainer = buttonContainer.querySelector('div[class*="flex"][class*="items-center"]');
                if (innerContainer) {
                    return innerContainer;
                }
                return buttonContainer;
            }

            // Last fallback: create our own header
            const firstChild = container.firstElementChild;
            if (firstChild && firstChild.classList.contains('flex')) {
                return firstChild;
            }
        }

        // If all else fails, create a button container
        if (container) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'position: absolute; top: 8px; right: 8px; z-index: 10;';
            
            // Ensure container has relative positioning
            const containerStyle = getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
            
            container.appendChild(buttonContainer);
            return buttonContainer;
        }

        return null;
    }

    // Wait for Mermaid to be available
    function waitForMermaid(callback, maxAttempts = 10) {
        let attempts = 0;
        
        const checkMermaid = () => {
            attempts++;
            if (typeof mermaid !== 'undefined' && mermaid.initialize) {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(checkMermaid, 100);
            } else {
                console.error('ChatGPT Mermaid Enhancer: Mermaid library failed to load');
            }
        };
        
        checkMermaid();
    }

    // Initialize the script
    function initialize() {
        console.log('ChatGPT Mermaid Enhancer: Initializing...');
        
        // Wait for Mermaid to be available, then initialize
        waitForMermaid(() => {
            // Initialize Mermaid
            initializeMermaid();
            
            // Add buttons to existing code blocks
            addMermaidButtons();
            
            // Set up observer for dynamically added content
            setupObserver();
            
            console.log('ChatGPT Mermaid Enhancer: Initialization complete');
        });
    }

    // Set up the mutation observer
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain code blocks
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Look for ChatGPT-specific code block structures
                            if (node.querySelector && (
                                node.querySelector('code[class*="language-"]') || 
                                node.querySelector('code.whitespace-pre') ||
                                node.querySelector('pre code') ||
                                node.tagName === 'CODE' ||
                                node.tagName === 'PRE' ||
                                // Look for ChatGPT's specific structure
                                node.querySelector('div[class*="rounded"] code') ||
                                // Check if the node itself is a code block container
                                (node.classList && (
                                    node.classList.contains('overflow-visible') ||
                                    node.querySelector('div:first-child')?.textContent === 'mermaid'
                                ))
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldCheck) {
                // Debounce the button addition to avoid excessive processing
                clearTimeout(window.mermaidButtonDebounce);
                window.mermaidButtonDebounce = setTimeout(() => {
                    addMermaidButtons();
                }, 150);
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();