let isAddingText = false;
let currentTextBubble = null;
let longPressTimer;

export function initializeTextBubble() {
    const textTool = document.getElementById('text-tool');
    const textOptions = document.getElementById('text-options');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const textAlign = document.getElementById('text-align');
    const bubbleType = document.getElementById('bubble-type');
    const textColor = document.getElementById('text-color');
    const textBold = document.getElementById('text-bold');
    const textItalic = document.getElementById('text-italic');
    const textUnderline = document.getElementById('text-underline');

    textTool.addEventListener('click', () => {
        isAddingText = !isAddingText;
        textOptions.classList.toggle('hidden');
    });

    document.addEventListener('click', addTextBubble);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);

    fontFamily.addEventListener('change', updateTextStyle);
    fontSize.addEventListener('input', updateTextStyle);
    textAlign.addEventListener('change', updateTextStyle);
    bubbleType.addEventListener('change', changeBubbleType);
    textColor.addEventListener('input', updateTextStyle);
    textBold.addEventListener('change', updateTextStyle);
    textItalic.addEventListener('change', updateTextStyle);
    textUnderline.addEventListener('change', updateTextStyle);
}

function handleTouchStart(e) {
    if (!isAddingText) return;
    longPressTimer = setTimeout(() => {
        addTextBubble(e.touches[0]);
        vibrate(50);
    }, 500);
}

function handleTouchEnd(e) {
    clearTimeout(longPressTimer);
}

function handleTouchMove(e) {
    clearTimeout(longPressTimer);
}

function addTextBubble(e) {
    if (!isAddingText) return;

    const panel = e.target.closest('.comic-panel');
    if (!panel) return;

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    const panelRect = panel.getBoundingClientRect();
    const relativeX = x - panelRect.left;
    const relativeY = y - panelRect.top;

    const bubble = document.createElement('div');
    bubble.contentEditable = true;
    bubble.className = 'text-bubble speech-bubble absolute min-w-[100px] min-h-[50px] p-2 bg-white border-2 border-black rounded-lg cursor-move';
    bubble.style.left = `${relativeX}px`;
    bubble.style.top = `${relativeY}px`;
    bubble.setAttribute('aria-label', 'Text bubble');
    bubble.setAttribute('role', 'textbox');
    bubble.tabIndex = 0;

    panel.appendChild(bubble);
    bubble.focus();

    currentTextBubble = bubble;
    makeDraggable(bubble);
    makeResizable(bubble);
    makeConnectable(bubble, panel);
    showFloatingToolbar(bubble);
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener('mousedown', startDragging);
    element.addEventListener('touchstart', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = (e.clientX || e.touches[0].clientX) - element.offsetLeft;
        startY = (e.clientY || e.touches[0].clientY) - element.offsetTop;
        updateZIndex(element);
        vibrate(50);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.clientX || e.touches[0].clientX) - startX;
        const y = (e.clientY || e.touches[0].clientY) - startY;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        updateConnection(element);
    }

    function stopDragging() {
        isDragging = false;
    }
}

function makeResizable(element) {
    const resizer = document.createElement('div');
    resizer.className = 'resizer w-11 h-11 bg-blue-500 absolute right-0 bottom-0 cursor-se-resize';
    resizer.setAttribute('aria-label', 'Resize handle');
    resizer.setAttribute('role', 'button');
    resizer.tabIndex = 0;

    element.appendChild(resizer);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizer.addEventListener('mousedown', startResizing);
    resizer.addEventListener('touchstart', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('mouseup', stopResizing);
    document.addEventListener('touchend', stopResizing);

    function startResizing(e) {
        isResizing = true;
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        e.stopPropagation();
        vibrate(50);
    }

    function resize(e) {
        if (!isResizing) return;
        e.preventDefault();
        const width = startWidth + ((e.clientX || e.touches[0].clientX) - startX);
        const height = startHeight + ((e.clientY || e.touches[0].clientY) - startY);
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        updateConnection(element);
    }

    function stopResizing() {
        isResizing = false;
    }
}

function showFloatingToolbar(bubble) {
    const toolbar = document.createElement('div');
    toolbar.className = 'floating-toolbar fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-2 flex justify-around items-center';
    toolbar.innerHTML = `
        <button class="p-2 bg-blue-500 text-white rounded" onclick="changeFontSize('increase')">A+</button>
        <button class="p-2 bg-blue-500 text-white rounded" onclick="changeFontSize('decrease')">A-</button>
        <input type="color" id="floating-text-color" value="#000000" onchange="changeTextColor(this.value)">
        <select id="floating-bubble-type" onchange="changeBubbleType(this.value)">
            <option value="speech">Speech</option>
            <option value="thought">Thought</option>
            <option value="shout">Shout</option>
            <option value="whisper">Whisper</option>
            <option value="narration">Narration</option>
        </select>
    `;
    document.body.appendChild(toolbar);

    bubble.addEventListener('blur', () => {
        toolbar.remove();
    });
}

function vibrate(duration) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// ... (keep the rest of the functions unchanged)

// Add these new functions for the floating toolbar
window.changeFontSize = function(action) {
    if (!currentTextBubble) return;
    const currentSize = parseInt(window.getComputedStyle(currentTextBubble).fontSize);
    const newSize = action === 'increase' ? currentSize + 2 : currentSize - 2;
    currentTextBubble.style.fontSize = `${newSize}px`;
};

window.changeTextColor = function(color) {
    if (!currentTextBubble) return;
    currentTextBubble.style.color = color;
};

window.changeBubbleType = function(type) {
    if (!currentTextBubble) return;
    currentTextBubble.className = `text-bubble ${type}-bubble absolute min-w-[100px] min-h-[50px] p-2 bg-white border-2 border-black rounded-lg cursor-move`;
    // Apply specific styles based on the bubble type (similar to the existing changeBubbleType function)
};

// Implement pinch-to-zoom for resizing text bubbles
let initialDistance = 0;
let initialFontSize = 0;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2 && currentTextBubble) {
        e.preventDefault();
        initialDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
        initialFontSize = parseInt(window.getComputedStyle(currentTextBubble).fontSize);
    }
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && currentTextBubble) {
        e.preventDefault();
        const distance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
        const scale = distance / initialDistance;
        const newFontSize = initialFontSize * scale;
        currentTextBubble.style.fontSize = `${newFontSize}px`;
    }
});

// Implement undo/redo functionality
const undoStack = [];
const redoStack = [];

function saveState() {
    const state = document.querySelector('#canvas-container').innerHTML;
    undoStack.push(state);
    redoStack.length = 0;
}

function undo() {
    if (undoStack.length > 1) {
        const currentState = undoStack.pop();
        redoStack.push(currentState);
        const previousState = undoStack[undoStack.length - 1];
        document.querySelector('#canvas-container').innerHTML = previousState;
        vibrate(50);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(nextState);
        document.querySelector('#canvas-container').innerHTML = nextState;
        vibrate(50);
    }
}

// Implement three-finger swipe gestures for undo/redo
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 3) {
        touchStartX = e.touches[0].clientX;
    }
});

document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 3) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (deltaX > 100) {
            redo();
        } else if (deltaX < -100) {
            undo();
        }
    }
});

// Call saveState() after each significant action (e.g., adding/modifying text bubbles)
