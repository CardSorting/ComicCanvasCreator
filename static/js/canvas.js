const panels = [];
let currentTool = 'shape';
let currentColor = '#000000';
let currentLineWidth = 2;

export function initializeCanvas(container) {
    // This function will be called when initializing the canvas
}

export function addPanel() {
    const panel = document.createElement('div');
    panel.classList.add('comic-panel', 'inline-block', 'mr-4', 'border', 'border-gray-300', 'bg-white', 'relative');
    panel.style.width = '300px';
    panel.style.height = '300px';
    
    panels.push(panel);
    document.getElementById('canvas-container').appendChild(panel);

    addEventListeners(panel);
}

function addEventListeners(panel) {
    panel.addEventListener('click', (e) => {
        if (currentTool === 'shape') {
            addShape(e, panel);
        }
    });
}

function addShape(e, panel) {
    const shape = document.createElement('div');
    shape.classList.add('absolute', 'bg-black', 'rounded-full');
    shape.style.width = '20px';
    shape.style.height = '20px';
    shape.style.left = `${e.offsetX - 10}px`;
    shape.style.top = `${e.offsetY - 10}px`;
    panel.appendChild(shape);
}

export function reorderPanels() {
    const container = document.getElementById('canvas-container');
    const panelArray = Array.from(container.children);
    panelArray.sort(() => Math.random() - 0.5);
    panelArray.forEach(panel => container.appendChild(panel));
}

export function changeLayout() {
    const container = document.getElementById('canvas-container');
    const layouts = [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-1 md:grid-cols-2',
        'grid-cols-2 md:grid-cols-3'
    ];
    const currentLayout = container.className.split(' ').find(cls => cls.startsWith('grid-cols'));
    const currentIndex = layouts.indexOf(currentLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    container.classList.remove(currentLayout);
    container.classList.add(layouts[nextIndex]);
}

export function setTool(tool) {
    currentTool = tool;
}

export function setColor(color) {
    currentColor = color;
}

export function setLineWidth(width) {
    currentLineWidth = width;
}

export function saveComic() {
    // Implement comic saving functionality
    console.log('Saving comic...');
}
