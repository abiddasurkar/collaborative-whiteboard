// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Copy } from 'lucide-react';

const HomePage = () => {
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('boards');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  const createNewBoard = () => {
    const newBoardId = Math.random().toString(36).substr(2, 9);
    const newBoard = {
      id: newBoardId,
      name: `Board - ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
    navigate(`/board/${newBoardId}`);
  };

  const deleteBoard = (id) => {
    const updatedBoards = boards.filter((b) => b.id !== id);
    setBoards(updatedBoards);
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
  };

  const copyBoardLink = (id) => {
    const link = `${window.location.origin}/collaborative-whiteboard/board/${id}`;
    navigator.clipboard.writeText(link);
    alert('Board link copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Collaborative Whiteboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Draw, collaborate, and share in real-time
          </p>
          <button
            onClick={createNewBoard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition"
          >
            <Plus size={24} />
            Create New Board
          </button>
        </motion.div>

        {/* Boards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Boards</h2>
          {boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-600 text-lg">
                No boards yet. Create one to get started!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <motion.div
                  key={board.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                      {board.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => copyBoardLink(board.id)}
                      className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Copy size={16} />
                      Share
                    </button>
                    <button
                      onClick={() => deleteBoard(board.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
