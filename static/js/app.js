import { PanelService } from './services/PanelService.js';
import { ImageService } from './services/ImageService.js';
import { DragDropService } from './services/DragDropService.js';
import { TextBubbleService } from './services/TextBubbleService.js';

document.addEventListener('DOMContentLoaded', () => {
    const panelService = new PanelService();
    const imageService = new ImageService();
    const dragDropService = new DragDropService();
    const textBubbleService = new TextBubbleService();

    const sidebar = document.getElementById('sidebar');
    const canvasContainer = document.getElementById('canvas-container');

    panelService.initializeCanvas(canvasContainer);
    imageService.initializeImageUpload();
    dragDropService.initializeDragAndDrop(sidebar, canvasContainer);
    textBubbleService.initializeTextBubble();

    // Add panel button
    const addPanelButton = document.getElementById('add-panel');
    addPanelButton.addEventListener('click', () => {
        panelService.addPanel();
        saveState();
    });

    // Reorder panels button
    const reorderButton = document.getElementById('reorder-panels');
    reorderButton.addEventListener('click', () => {
        panelService.reorderPanels();
        saveState();
    });

    // Change layout button
    const changeLayoutButton = document.getElementById('change-layout');
    changeLayoutButton.addEventListener('click', () => {
        panelService.changeLayout();
        saveState();
    });

    // Save comic button
    const saveComicButton = document.getElementById('save-comic');
    saveComicButton.addEventListener('click', () => {
        panelService.saveComic();
    });

    // Export buttons
    const exportPDFButton = document.getElementById('export-pdf');
    const exportSVGButton = document.getElementById('export-svg');

    exportPDFButton.addEventListener('click', () => exportComic('pdf'));
    exportSVGButton.addEventListener('click', () => exportComic('svg'));

    function exportComic(format) {
        const comicData = document.getElementById('canvas-container').innerHTML;
        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ format, comicData }),
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `comic.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error exporting comic:', error));
    }

    // Mobile navigation
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
