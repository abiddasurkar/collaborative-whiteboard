// src/components/Toolbar.jsx
import React, { useState } from 'react';
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
  Copy,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  Layers,
  Eye,
  Grid3X3,
  Palette,
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

  const [showSettings, setShowSettings] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showShapes, setShowShapes] = useState(false);

  const tools = [
    { id: 'brush', icon: Paintbrush, label: 'Brush', shortcut: 'B' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
    { id: 'line', icon: LucideBaseline, label: 'Line', shortcut: 'L' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'C' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  ];

  const shapeTools = [
    { id: 'filled-rectangle', icon: Square, label: 'Filled Rectangle' },
    { id: 'filled-circle', icon: Circle, label: 'Filled Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  ];

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  ];

  const handleExport = (format = 'png') => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    
    if (format === 'png') {
      link.href = canvas.toDataURL('image/png');
      link.download = `whiteboard-${Date.now()}.png`;
    } else if (format === 'jpg') {
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `whiteboard-${Date.now()}.jpg`;
    }
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

  const handleKeyDown = (e) => {
    if (e.key === 'z' && e.ctrlKey) {
      e.preventDefault();
      undo(canvasRef.current);
    }
    if (e.key === 'y' && e.ctrlKey) {
      e.preventDefault();
      redo(canvasRef.current);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex items-center gap-2 p-3 overflow-x-auto border-b sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Main Tools */}
      <div className="flex gap-1 border-r pr-3">
        {tools.map(({ id, icon: Icon, label, shortcut }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`p-2 rounded transition flex-shrink-0 ${
              tool === id
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={`${label} (${shortcut})`}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Shapes Dropdown */}
      <div className="relative group border-r pr-3">
        <button
          onClick={() => setShowShapes(!showShapes)}
          className={`p-2 rounded transition flex-shrink-0 ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="More Shapes"
        >
          <Layers size={18} />
        </button>
        {showShapes && (
          <div className={`absolute top-12 left-0 rounded-lg shadow-lg p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            {shapeTools.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setTool(id);
                  setShowShapes(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker & Palette */}
      <div className="flex items-center gap-2 border-r pr-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0"
          title="Pick color"
        />
        <button
          onClick={() => setShowColorPalette(!showColorPalette)}
          className={`p-2 rounded transition flex-shrink-0 ${
            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Color palette"
        >
          <Palette size={18} />
        </button>
        {showColorPalette && (
          <div className={`absolute top-14 left-32 rounded-lg shadow-lg p-3 grid grid-cols-5 gap-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            {presetColors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setShowColorPalette(false);
                }}
                className="w-6 h-6 rounded border-2 hover:scale-110 transition"
                style={{ backgroundColor: c, borderColor: color === c ? '#3b82f6' : 'transparent' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stroke Width & Font Size */}
      <div className="flex items-center gap-2 border-r pr-3">
        <label className={`text-xs font-medium flex-shrink-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Size:
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-16"
        />
        <span className={`text-xs w-5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {strokeWidth}
        </span>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-2 border-r pr-3">
        <label className={`text-xs font-medium flex-shrink-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Font:
        </label>
        <input
          type="range"
          min="8"
          max="48"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-16"
        />
        <span className={`text-xs w-5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {fontSize}
        </span>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1 border-r pr-3">
        <button
          onClick={() => undo(canvasRef.current)}
          className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => redo(canvasRef.current)}
          className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Export/Actions */}
      <div className="flex gap-1 border-r pr-3">
        <div className="relative group">
          <button
            className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title="Export"
          >
            <Download size={18} />
          </button>
          <div className={`absolute top-12 left-0 rounded-lg shadow-lg p-2 hidden group-hover:block ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <button
              onClick={() => handleExport('png')}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100'
              }`}
            >
              Export as PNG
            </button>
            <button
              onClick={() => handleExport('jpg')}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100'
              }`}
            >
              Export as JPG
            </button>
          </div>
        </div>

        <button
          onClick={handleShareBoard}
          className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Share Board"
        >
          <Share2 size={18} />
        </button>

        <button
          onClick={() => clearCanvas(canvasRef.current)}
          className={`p-2 rounded transition text-red-500 flex-shrink-0 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          title="Clear Canvas"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Settings */}
      <div className="relative group border-r pr-3">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title="Settings"
        >
          <Settings size={18} />
        </button>
        {showSettings && (
          <div className={`absolute top-12 right-0 rounded-lg shadow-lg p-3 w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Canvas Settings
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Board ID: {boardId}</p>
              <p className="mt-2">Shortcuts:</p>
              <ul className="mt-1 space-y-1">
                <li>Ctrl+Z: Undo</li>
                <li>Ctrl+Y: Redo</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <div className="ml-auto">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded transition flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;