// src/components/Canvas.jsx
import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

const Canvas = forwardRef((props, ref) => {
  const localCanvasRef = useRef(null);
  const canvasRef = ref || localCanvasRef;
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawingLocal] = useState(false);

  const {
    tool,
    color,
    strokeWidth,
    fontSize,
    startX,
    startY,
    setIsDrawing,
    setStartPosition,
    addToHistory,
  } = useWhiteboardStore();

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 80) * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = (window.innerHeight - 80) + 'px';

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = (window.innerHeight - 80) * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = (window.innerHeight - 80) + 'px';
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const draw = (fromX, toX, fromY, toY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = `${fontSize}px Arial`;

    switch (tool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        break;

      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(toX, toY, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'line':
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        break;

      case 'rectangle':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeRect(fromX, fromY, toX - fromX, toY - fromY);
        break;

      case 'circle':
        ctx.globalCompositeOperation = 'source-over';
        const radius = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        ctx.beginPath();
        ctx.arc(fromX, fromY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case 'filled-rectangle':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillRect(fromX, fromY, toX - fromX, toY - fromY);
        break;

      case 'filled-circle':
        ctx.globalCompositeOperation = 'source-over';
        const filledRadius = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        ctx.beginPath();
        ctx.arc(fromX, fromY, filledRadius, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'arrow':
        ctx.globalCompositeOperation = 'source-over';
        drawArrow(ctx, fromX, fromY, toX, toY, strokeWidth);
        break;

      default:
        break;
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY, headlen) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  // MOUSE EVENTS
  const handleMouseDown = (e) => {
    if (tool === 'text') {
      const { x, y } = getMousePos(e);
      setIsTextMode(true);
      setTextPosition({ x, y });
      setTextInput('');
      return;
    }
    
    e.preventDefault();
    const { x, y } = getMousePos(e);
    setIsDrawing(true);
    setIsDrawingLocal(true);
    setStartPosition(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool === 'text') return;

    e.preventDefault();
    const { x, y } = getMousePos(e);
    const canvas = canvasRef.current;
    const state = useWhiteboardStore.getState();

    if (state.historyStep >= 0 && state.history.length > 0) {
      const img = new Image();
      img.src = state.history[state.historyStep];
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        draw(startX, x, startY, y);
      };
    } else {
      draw(startX, x, startY, y);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool !== 'text') {
      setIsDrawing(false);
      setIsDrawingLocal(false);
      addToHistory(canvasRef.current);
    }
  };

  // TOUCH EVENTS
  const handleTouchStart = (e) => {
    if (tool === 'text') {
      const { x, y } = getTouchPos(e);
      setIsTextMode(true);
      setTextPosition({ x, y });
      setTextInput('');
      return;
    }

    e.preventDefault();
    const { x, y } = getTouchPos(e);
    setIsDrawing(true);
    setIsDrawingLocal(true);
    setStartPosition(x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing || tool === 'text') return;

    e.preventDefault();
    const { x, y } = getTouchPos(e);
    const canvas = canvasRef.current;
    const state = useWhiteboardStore.getState();

    if (state.historyStep >= 0 && state.history.length > 0) {
      const img = new Image();
      img.src = state.history[state.historyStep];
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        draw(startX, x, startY, y);
      };
    } else {
      draw(startX, x, startY, y);
    }
  };

  const handleTouchEnd = (e) => {
    if (isDrawing && tool !== 'text') {
      e.preventDefault();
      setIsDrawing(false);
      setIsDrawingLocal(false);
      addToHistory(canvasRef.current);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setIsTextMode(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    addToHistory(canvas);
    setIsTextMode(false);
    setTextInput('');
  };

  if (isTextMode) {
    return (
      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="block bg-white dark:bg-gray-900 w-full h-full"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ display: 'block', margin: 0, padding: 0, cursor: 'text', touchAction: 'none' }}
        />
        <div
          className="absolute bg-white dark:bg-gray-800 border-2 border-blue-500 rounded shadow-lg p-2"
          style={{
            left: `${textPosition.x}px`,
            top: `${textPosition.y}px`,
            zIndex: 1000,
          }}
        >
          <input
            autoFocus
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTextSubmit();
              if (e.key === 'Escape') setIsTextMode(false);
            }}
            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none min-w-[150px] dark:text-white"
            placeholder="Enter text..."
          />
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block bg-white dark:bg-gray-900 cursor-crosshair w-full flex-1"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ 
        display: 'block', 
        margin: 0, 
        padding: 0,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;