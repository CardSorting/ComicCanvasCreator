export function initializeImageUpload() {
    const imageUploadButton = document.getElementById('image-upload');
    const imageInput = document.getElementById('image-input');
    const imageOptions = document.getElementById('image-options');

    imageUploadButton.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', handleImageUpload);

    document.getElementById('resize-image').addEventListener('click', resizeImage);
    document.getElementById('crop-image').addEventListener('click', cropImage);
    document.getElementById('rotate-image').addEventListener('click', rotateImage);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('uploaded-image', 'max-w-full', 'h-auto', 'cursor-move');
            img.draggable = true;

            const panel = document.querySelector('.comic-panel');
            if (panel) {
                panel.appendChild(img);
                makeDraggable(img);
                document.getElementById('image-options').classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
    }

    function drag(e) {
        if (!isDragging) return;
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    function stopDragging() {
        isDragging = false;
    }
}

function resizeImage() {
    const img = document.querySelector('.uploaded-image');
    if (img) {
        const newWidth = prompt('Enter new width (in pixels):', img.width);
        if (newWidth) {
            img.style.width = `${newWidth}px`;
            img.style.height = 'auto';
        }
    }
}

function cropImage() {
    // Implement image cropping functionality
    console.log('Cropping image...');
}

function rotateImage() {
    const img = document.querySelector('.uploaded-image');
    if (img) {
        const currentRotation = img.style.transform ? parseInt(img.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;
        const newRotation = (currentRotation + 90) % 360;
        img.style.transform = `rotate(${newRotation}deg)`;
    }
}
