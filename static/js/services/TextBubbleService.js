export class TextBubbleService {
    constructor() {
        this.isAddingText = false;
        this.currentTextBubble = null;
        this.longPressTimer = null;
    }

    initializeTextBubble() {
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
            this.isAddingText = !this.isAddingText;
            textOptions.classList.toggle('hidden');
        });

        document.addEventListener('click', this.addTextBubble.bind(this));
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));

        fontFamily.addEventListener('change', this.updateTextStyle.bind(this));
        fontSize.addEventListener('input', this.updateTextStyle.bind(this));
        textAlign.addEventListener('change', this.updateTextStyle.bind(this));
        bubbleType.addEventListener('change', this.changeBubbleType.bind(this));
        textColor.addEventListener('input', this.updateTextStyle.bind(this));
        textBold.addEventListener('change', this.updateTextStyle.bind(this));
        textItalic.addEventListener('change', this.updateTextStyle.bind(this));
        textUnderline.addEventListener('change', this.updateTextStyle.bind(this));
    }

    handleTouchStart(e) {
        if (!this.isAddingText) return;
        this.longPressTimer = setTimeout(() => {
            this.addTextBubble(e.touches[0]);
            this.vibrate(50);
        }, 500);
    }

    handleTouchEnd(e) {
        clearTimeout(this.longPressTimer);
    }

    handleTouchMove(e) {
        clearTimeout(this.longPressTimer);
    }

    addTextBubble(e) {
        if (!this.isAddingText) return;

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

        this.currentTextBubble = bubble;
        this.makeDraggable(bubble);
        this.makeResizable(bubble);
        this.makeConnectable(bubble, panel);
        this.showFloatingToolbar(bubble);
    }

    makeDraggable(element) {
        // ... (implementation of makeDraggable)
    }

    makeResizable(element) {
        // ... (implementation of makeResizable)
    }

    makeConnectable(bubble, panel) {
        // ... (implementation of makeConnectable)
    }

    showFloatingToolbar(bubble) {
        // ... (implementation of showFloatingToolbar)
    }

    updateTextStyle() {
        // ... (implementation of updateTextStyle)
    }

    changeBubbleType() {
        // ... (implementation of changeBubbleType)
    }

    vibrate(duration) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
}
