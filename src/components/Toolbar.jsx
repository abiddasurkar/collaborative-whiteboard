// src/components/Toolbar.jsx

import {
  Paintbrush,
  Eraser,
  LucideBaseline,
  Square,
  Circle,
  Type,
  Undo2,
  Redo2,
  Download,
  Trash2,
  Moon,
  Sun,
  Share2,
} from 'lucide-react';
import { useWhiteboardStore } from '../store/whiteboardStore';

const Toolbar = ({ canvasRef, boardId }) => {
  const {
    tool,
    color,
    strokeWidth,
    fontSize,
    isDarkMode,
    setTool,
    setColor,
    setStrokeWidth,
    setFontSize,
    toggleDarkMode,
    undo,
    redo,
    clearCanvas,
  } = useWhiteboardStore();

  const tools = [
    { id: 'brush', icon: Paintbrush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'line', icon: LucideBaseline, label: 'Line' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const handleExport = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `whiteboard-${Date.now()}.png`;
    link.click();
  };

  const handleShareBoard = () => {
    const boardUrl = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(boardUrl).then(() => {
      alert('Board link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  return (
    <div className={`flex items-center gap-2 p-4 overflow-x-auto border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Tools */}
      <div className="flex gap-1 border-r pr-4">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`p-2 rounded transition ${
              tool === id
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
          title="Pick color"
        />
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2 border-l border-r px-4">
        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Size:
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-20"
        />
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {strokeWidth}
        </span>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          onClick={() => undo(canvasRef.current)}
          className={`p-2 rounded transition ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Undo"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={() => redo(canvasRef.current)}
          className={`p-2 rounded transition ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Redo"
        >
          <Redo2 size={20} />
        </button>
      </div>

      {/* Export/Clear */}
      <div className="flex gap-1 border-l border-r px-4">
        <button
          onClick={handleExport}
          className={`p-2 rounded transition flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Export as PNG"
        >
          <Download size={20} />
        </button>
        <button
          onClick={handleShareBoard}
          className={`p-2 rounded transition flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Share Board"
        >
          <Share2 size={20} />
        </button>
        <button
          onClick={() => clearCanvas(canvasRef.current)}
          className={`p-2 rounded transition text-red-500 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Dark Mode */}
      <div className="ml-auto">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded transition ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;