import { setTool, setColor, setLineWidth, saveComic } from './canvas.js';

export function initializeToolbar(toolbar) {
    const shapeTool = document.getElementById('shape-tool');
    const textTool = document.getElementById('text-tool');
    const saveButton = document.getElementById('save-comic');

    const tools = [shapeTool, textTool];

    function setActiveTool(activeTool) {
        tools.forEach(tool => {
            if (tool === activeTool) {
                tool.classList.remove('bg-gray-300');
                tool.classList.add('bg-blue-500', 'text-white');
            } else {
                tool.classList.remove('bg-blue-500', 'text-white');
                tool.classList.add('bg-gray-300');
            }
        });
    }

    shapeTool.addEventListener('click', () => {
        setTool('shape');
        setActiveTool(shapeTool);
    });

    textTool.addEventListener('click', () => {
        setTool('text');
        setActiveTool(textTool);
    });

    saveButton.addEventListener('click', saveComic);

    // Set shape as the default active tool
    setActiveTool(shapeTool);
}
