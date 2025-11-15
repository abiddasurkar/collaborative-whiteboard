// src/components/Canvas.jsx
import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

const Canvas = forwardRef((props, ref) => {
  const localCanvasRef = useRef(null);
  const canvasRef = ref || localCanvasRef;
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const {
    tool,
    color,
    strokeWidth,
    fontSize,
    isDrawing,
    startX,
    startY,
    setIsDrawing,
    setStartPosition,
    addToHistory,
  } = useWhiteboardStore();

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize canvas
  useEffect(() => {
    resizeCanvas();
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dpr = window.devicePixelRatio || 1;
      const headerHeight = isMobile ? 60 : 80; // Adjust for mobile header
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = (window.innerHeight - headerHeight) * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = (window.innerHeight - headerHeight) + 'px';
    } catch (error) {
      console.error('Error resizing canvas:', error);
    }
  };

  const getMousePos = (e) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    } catch (error) {
      console.error('Error getting mouse position:', error);
      return { x: 0, y: 0 };
    }
  };

  const getTouchPos = (e) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !e.touches || e.touches.length === 0) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } catch (error) {
      console.error('Error getting touch position:', error);
      return { x: 0, y: 0 };
    }
  };

  const draw = (fromX, toX, fromY, toY) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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
    } catch (error) {
      console.error('Error drawing:', error);
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY, headlen) => {
    try {
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
    } catch (error) {
      console.error('Error drawing arrow:', error);
    }
  };

  // MOUSE EVENTS
  const handleMouseDown = (e) => {
    try {
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
      setStartPosition(x, y);
      lastPositionRef.current = { x, y };
    } catch (error) {
      console.error('Error on mouse down:', error);
    }
  };

  const handleMouseMove = (e) => {
    try {
      if (!isDrawing || tool === 'text') return;

      e.preventDefault();
      const { x, y } = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const state = useWhiteboardStore.getState();

      if (state.historyStep >= 0 && state.history.length > 0) {
        const img = new Image();
        img.src = state.history[state.historyStep];
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            draw(startX, x, startY, y);
          }
        };
        img.onerror = () => {
          draw(startX, x, startY, y);
        };
      } else {
        draw(startX, x, startY, y);
      }
      
      lastPositionRef.current = { x, y };
    } catch (error) {
      console.error('Error on mouse move:', error);
    }
  };

  const handleMouseUp = () => {
    try {
      if (isDrawing && tool !== 'text') {
        setIsDrawing(false);
        addToHistory(canvasRef.current);
      }
    } catch (error) {
      console.error('Error on mouse up:', error);
    }
  };

  // TOUCH EVENTS
  const handleTouchStart = (e) => {
    try {
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
      setStartPosition(x, y);
      lastPositionRef.current = { x, y };
    } catch (error) {
      console.error('Error on touch start:', error);
    }
  };

  const handleTouchMove = (e) => {
    try {
      if (!isDrawing || tool === 'text') return;

      e.preventDefault();
      const { x, y } = getTouchPos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const state = useWhiteboardStore.getState();

      if (state.historyStep >= 0 && state.history.length > 0) {
        const img = new Image();
        img.src = state.history[state.historyStep];
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            draw(startX, x, startY, y);
          }
        };
        img.onerror = () => {
          draw(startX, x, startY, y);
        };
      } else {
        draw(startX, x, startY, y);
      }
      
      lastPositionRef.current = { x, y };
    } catch (error) {
      console.error('Error on touch move:', error);
    }
  };

  const handleTouchEnd = (e) => {
    try {
      if (isDrawing && tool !== 'text') {
        e.preventDefault();
        setIsDrawing(false);
        addToHistory(canvasRef.current);
      }
    } catch (error) {
      console.error('Error on touch end:', error);
    }
  };

  const handleTextSubmit = () => {
    try {
      if (!textInput.trim()) {
        setIsTextMode(false);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(textInput, textPosition.x, textPosition.y);
      
      addToHistory(canvas);
      setIsTextMode(false);
      setTextInput('');
    } catch (error) {
      console.error('Error submitting text:', error);
    }
  };

  if (isTextMode) {
    return (
      <div className="relative flex-1 bg-white dark:bg-gray-900 w-full h-full">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ 
            display: 'block', 
            margin: 0, 
            padding: 0, 
            cursor: 'text',
            touchAction: 'none',
          }}
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
            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none min-w-[150px] dark:text-white text-sm"
            placeholder="Enter text..."
          />
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block bg-white dark:bg-gray-900 cursor-crosshair w-full h-full"
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
        width: '100%',
        height: '100%',
      }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;