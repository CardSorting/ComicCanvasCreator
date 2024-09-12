export class PanelService {
    constructor() {
        this.panels = [];
    }

    initializeCanvas(container) {
        // This function will be called when initializing the canvas
    }

    addPanel() {
        const panel = document.createElement('div');
        panel.classList.add('comic-panel', 'inline-block', 'mr-4', 'border', 'border-gray-300', 'bg-white', 'relative');
        panel.style.width = '300px';
        panel.style.height = '300px';
        
        this.panels.push(panel);
        document.getElementById('canvas-container').appendChild(panel);

        this.addEventListeners(panel);
    }

    addEventListeners(panel) {
        panel.addEventListener('click', (e) => {
            if (this.currentTool === 'shape') {
                this.addShape(e, panel);
            }
        });
    }

    addShape(e, panel) {
        const shape = document.createElement('div');
        shape.classList.add('absolute', 'bg-black', 'rounded-full');
        shape.style.width = '20px';
        shape.style.height = '20px';
        shape.style.left = `${e.offsetX - 10}px`;
        shape.style.top = `${e.offsetY - 10}px`;
        panel.appendChild(shape);
    }

    reorderPanels() {
        const container = document.getElementById('canvas-container');
        const panelArray = Array.from(container.children);
        panelArray.sort(() => Math.random() - 0.5);
        panelArray.forEach(panel => container.appendChild(panel));
    }

    changeLayout() {
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

    setTool(tool) {
        this.currentTool = tool;
    }

    setColor(color) {
        this.currentColor = color;
    }

    setLineWidth(width) {
        this.currentLineWidth = width;
    }

    saveComic() {
        // Implement comic saving functionality
        console.log('Saving comic...');
    }
}
