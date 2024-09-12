export class ImageService {
    constructor() {
        this.imageUploadButton = null;
        this.imageInput = null;
        this.imageOptions = null;
    }

    initializeImageUpload() {
        this.imageUploadButton = document.getElementById('image-upload');
        this.imageInput = document.getElementById('image-input');
        this.imageOptions = document.getElementById('image-options');

        this.imageUploadButton.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', this.handleImageUpload.bind(this));

        document.getElementById('resize-image').addEventListener('click', this.resizeImage.bind(this));
        document.getElementById('crop-image').addEventListener('click', this.cropImage.bind(this));
        document.getElementById('rotate-image').addEventListener('click', this.rotateImage.bind(this));

        // Add event listener for mobile upload button
        const mobileUploadButton = document.getElementById('upload-image-mobile');
        if (mobileUploadButton) {
            mobileUploadButton.addEventListener('click', () => {
                this.imageInput.click();
            });
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('uploaded-image', 'max-w-full', 'h-auto', 'cursor-move');
                img.draggable = true;

                const panel = document.querySelector('.comic-panel');
                if (panel) {
                    panel.appendChild(img);
                    this.makeDraggable(img);
                    this.imageOptions.classList.remove('hidden');
                }

                // Add the uploaded image to the sidebar
                this.addImageToSidebar(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    addImageToSidebar(imageSrc) {
        const imageContainer = document.getElementById('images');
        if (imageContainer) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.draggable = true;
            img.classList.add('draggable-element', 'w-full', 'h-auto');
            img.dataset.type = 'image';
            imageContainer.querySelector('.grid').appendChild(img);
        }
    }

    makeDraggable(element) {
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

    resizeImage() {
        const img = document.querySelector('.uploaded-image');
        if (img) {
            const newWidth = prompt('Enter new width (in pixels):', img.width);
            if (newWidth) {
                img.style.width = `${newWidth}px`;
                img.style.height = 'auto';
            }
        }
    }

    cropImage() {
        // Implement image cropping functionality
        console.log('Cropping image...');
    }

    rotateImage() {
        const img = document.querySelector('.uploaded-image');
        if (img) {
            const currentRotation = img.style.transform ? parseInt(img.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;
            const newRotation = (currentRotation + 90) % 360;
            img.style.transform = `rotate(${newRotation}deg)`;
        }
    }
}
