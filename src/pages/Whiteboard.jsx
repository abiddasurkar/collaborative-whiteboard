
// src/pages/Whiteboard.jsx
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const Whiteboard = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          title="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Board: {boardId}
        </h1>
      </div>
      
      <Toolbar canvasRef={canvasRef} boardId={boardId} />
      
      <Canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;