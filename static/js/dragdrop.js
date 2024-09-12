export function initializeDragAndDrop(sidebar, canvasContainer) {
    const draggableElements = sidebar.querySelectorAll('.draggable-element');

    draggableElements.forEach(element => {
        element.addEventListener('dragstart', dragStart);
    });

    canvasContainer.addEventListener('dragover', dragOver);
    canvasContainer.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.src);
    e.dataTransfer.setData('elementType', e.target.dataset.type);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const elementSrc = e.dataTransfer.getData('text/plain');
    const elementType = e.dataTransfer.getData('elementType');

    const img = new Image();
    img.src = elementSrc;
    img.onload = () => {
        const panel = e.target.closest('.comic-panel');
        if (panel) {
            const ctx = panel.getContext('2d');
            const x = e.offsetX - panel.offsetLeft;
            const y = e.offsetY - panel.offsetTop;

            if (elementType === 'background') {
                ctx.drawImage(img, 0, 0, panel.width, panel.height);
            } else {
                const scaleFactor = 0.5;
                const width = img.width * scaleFactor;
                const height = img.height * scaleFactor;
                ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
            }
        }
    };
}
