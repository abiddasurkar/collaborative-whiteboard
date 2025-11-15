// src/pages/Whiteboard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Info } from 'lucide-react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const Whiteboard = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setBoardName(board.name);
    }
  }, [boardId]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-md"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            title="Go back"
          >
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {boardName || 'Untitled Board'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {boardId}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <Info size={24} className="dark:text-white" />
        </button>
      </motion.div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 dark:bg-gray-800 border-b border-blue-200 dark:border-gray-700 p-4"
        >
          <div className="max-w-2xl mx-auto text-sm text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold mb-2">Keyboard Shortcuts:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Ctrl + Z</kbd> - Undo</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Ctrl + Y</kbd> - Redo</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">B</kbd> - Brush</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">E</kbd> - Eraser</p>
              </div>
              <div>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">T</kbd> - Text</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">L</kbd> - Line</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">R</kbd> - Rectangle</p>
                <p><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">C</kbd> - Circle</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toolbar */}
      <Toolbar canvasRef={canvasRef} boardId={boardId} />

      {/* Canvas */}
      <Canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;
