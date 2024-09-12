export class DragDropService {
    constructor() {
        this.sidebar = null;
        this.canvasContainer = null;
    }

    initializeDragAndDrop(sidebar, canvasContainer) {
        this.sidebar = sidebar;
        this.canvasContainer = canvasContainer;

        const draggableElements = this.sidebar.querySelectorAll('.draggable-element');

        draggableElements.forEach(element => {
            element.addEventListener('dragstart', this.dragStart.bind(this));
        });

        this.canvasContainer.addEventListener('dragover', this.dragOver.bind(this));
        this.canvasContainer.addEventListener('drop', this.drop.bind(this));
    }

    dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.src);
    }

    dragOver(e) {
        e.preventDefault();
    }

    drop(e) {
        e.preventDefault();
        const elementSrc = e.dataTransfer.getData('text/plain');

        const img = new Image();
        img.src = elementSrc;
        img.onload = () => {
            const panel = e.target.closest('.comic-panel');
            if (panel) {
                const x = e.offsetX - panel.offsetLeft;
                const y = e.offsetY - panel.offsetTop;

                const scaleFactor = 0.5;
                const width = img.width * scaleFactor;
                const height = img.height * scaleFactor;

                const imgElement = document.createElement('img');
                imgElement.src = elementSrc;
                imgElement.style.position = 'absolute';
                imgElement.style.left = `${x - width / 2}px`;
                imgElement.style.top = `${y - height / 2}px`;
                imgElement.style.width = `${width}px`;
                imgElement.style.height = `${height}px`;
                imgElement.style.cursor = 'move';
                imgElement.draggable = true;

                panel.appendChild(imgElement);
                this.makeImageDraggable(imgElement);
            }
        };
    }

    makeImageDraggable(imgElement) {
        let isDragging = false;
        let startX, startY;

        imgElement.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            startX = e.clientX - imgElement.offsetLeft;
            startY = e.clientY - imgElement.offsetTop;
        }

        function drag(e) {
            if (!isDragging) return;
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            imgElement.style.left = `${x}px`;
            imgElement.style.top = `${y}px`;
        }

        function stopDragging() {
            isDragging = false;
        }
    }
}
