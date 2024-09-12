import { PanelService } from './services/PanelService.js';
import { TextBubbleService } from './services/TextBubbleService.js';
import { DragDropService } from './services/DragDropService.js';
import { ImageService } from './services/ImageService.js';
import { initializeToolbar } from './toolbar.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('canvas-container');
    const sidebar = document.getElementById('sidebar');
    const highContrastToggle = document.getElementById('high-contrast');

    const panelService = new PanelService();
    const textBubbleService = new TextBubbleService();
    const dragDropService = new DragDropService();
    const imageService = new ImageService();

    panelService.initializeCanvas(canvasContainer);
    initializeToolbar(sidebar);
    dragDropService.initializeDragAndDrop(sidebar, canvasContainer);
    textBubbleService.initializeTextBubble();
    imageService.initializeImageUpload();

    // Add initial panel
    panelService.addPanel();

    // Event listener for adding new panels
    document.getElementById('add-panel').addEventListener('click', () => {
        panelService.addPanel();
        saveState();
    });

    // Event listener for reordering panels
    document.getElementById('reorder-panels').addEventListener('click', () => {
        panelService.reorderPanels();
        saveState();
    });

    // Event listener for changing layout
    document.getElementById('change-layout').addEventListener('click', () => {
        panelService.changeLayout();
        saveState();
    });

    // Undo and Redo functionality
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    // High Contrast mode toggle
    highContrastToggle.addEventListener('click', toggleHighContrast);

    // Mobile navigation functionality
    const addPanelMobile = document.getElementById('add-panel-mobile');
    const textToolMobile = document.getElementById('text-tool-mobile');
    const saveComicMobile = document.getElementById('save-comic-mobile');
    const moreOptionsMobile = document.getElementById('more-options-mobile');

    addPanelMobile.addEventListener('click', () => {
        panelService.addPanel();
        saveState();
    });

    textToolMobile.addEventListener('click', () => {
        textBubbleService.toggleTextTool();
    });

    saveComicMobile.addEventListener('click', () => {
        panelService.saveComic();
    });

    moreOptionsMobile.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && !sidebar.contains(e.target) && e.target !== moreOptionsMobile) {
            sidebar.classList.add('hidden');
        }
    });

    // Resize handler to show sidebar on larger screens
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    });
});

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

// Load high contrast setting from local storage
if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
}

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

function vibrate(duration) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Call saveState() after each significant action (e.g., adding/modifying text bubbles, dragging elements)
// You'll need to add this function call in appropriate places throughout your code
