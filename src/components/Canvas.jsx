// src/components/Canvas.jsx
import React, { useRef, useEffect, forwardRef } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';

const Canvas = forwardRef((props, ref) => {
  const localCanvasRef = useRef(null);
  const canvasRef = ref || localCanvasRef;
  const {
    tool,
    color,
    strokeWidth,
    isDrawing,
    startX,
    startY,
    setIsDrawing,
    setStartPosition,
    addToHistory,
  } = useWhiteboardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 80;
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

  const draw = (fromX, toX, fromY, toY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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
        ctx.clearRect(toX - strokeWidth / 2, toY - strokeWidth / 2, strokeWidth, strokeWidth);
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

      default:
        break;
    }
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    setIsDrawing(true);
    setStartPosition(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { x, y } = getMousePos(e);
    const canvas = canvasRef.current;
    const state = useWhiteboardStore.getState();

    if (state.historyStep >= 0) {
      const img = new Image();
      img.src = state.history[state.historyStep];
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        draw(startX, x, startY, y);
      };
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      addToHistory(canvasRef.current);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="block bg-white dark:bg-gray-900 cursor-crosshair w-full flex-1"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ display: 'block', margin: 0, padding: 0 }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;