
// src/pages/Whiteboard.jsx
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import { ArrowLeft } from 'lucide-react';

const Whiteboard = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Board: {boardId}
        </h1>
      </div>
      
      <Toolbar canvasRef={canvasRef} boardId={boardId} />
      
      <Canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;