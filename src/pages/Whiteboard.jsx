// src/pages/Whiteboard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, X, Menu } from 'lucide-react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const Whiteboard = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load board name from localStorage
  useEffect(() => {
    try {
      const boards = JSON.parse(localStorage.getItem('boards') || '[]');
      const board = boards.find(b => b.id === boardId);
      if (board) {
        setBoardName(board.name);
      }
    } catch (error) {
      console.error('Error loading board name:', error);
    }
  }, [boardId]);

  // Close info panel on mobile when drawing
  const handleCanvasInteraction = () => {
    if (isMobile && showInfo) {
      setShowInfo(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-md flex-shrink-0"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex-shrink-0"
            title="Go back"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 dark:text-white" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-xl font-bold text-gray-800 dark:text-white truncate">
              {boardName || 'Untitled Board'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate hidden xs:block">
              ID: {boardId}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex-shrink-0"
          title={showInfo ? 'Hide info' : 'Show info'}
        >
          {showInfo ? (
            <X size={20} className="sm:w-6 sm:h-6 dark:text-white" />
          ) : (
            <Info size={20} className="sm:w-6 sm:h-6 dark:text-white" />
          )}
        </button>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-blue-50 dark:bg-gray-800 border-b border-blue-200 dark:border-gray-700 p-3 sm:p-4 overflow-y-auto max-h-48 sm:max-h-64 flex-shrink-0"
          >
            <div className="max-w-4xl mx-auto text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <h3 className="font-semibold mb-2 sm:mb-3">Keyboard Shortcuts:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">Ctrl + Z</kbd>
                    <span>Undo</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">Ctrl + Y</kbd>
                    <span>Redo</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">B</kbd>
                    <span>Brush</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">E</kbd>
                    <span>Eraser</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">T</kbd>
                    <span>Text</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">L</kbd>
                    <span>Line</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">R</kbd>
                    <span>Rectangle</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">C</kbd>
                    <span>Circle</span>
                  </p>
                </div>
              </div>
              <p className="text-xs mt-2 sm:mt-3 text-gray-600 dark:text-gray-400">
                💡 Tip: Touch is fully supported on mobile devices
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex-shrink-0 overflow-x-auto">
        <Toolbar canvasRef={canvasRef} boardId={boardId} />
      </div>

      {/* Canvas Container */}
      <div 
        className="flex-1 overflow-hidden"
        onMouseDown={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
      >
        <Canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Whiteboard;