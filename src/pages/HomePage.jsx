// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2 } from 'lucide-react';

const HomePage = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('boards');
    if (saved) {
      try {
        setBoards(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading boards:', error);
        setBoards([]);
      }
    }
  }, []);

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
    navigator.clipboard.writeText(link).then(() => {
      alert('Board link copied!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Collaborative Whiteboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Draw, collaborate, and share in real-time
          </p>
          <button
            onClick={createNewBoard}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition"
          >
            <Plus size={24} />
            Create New Board
          </button>
        </motion.div>

        {/* Boards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Recent Boards
          </h2>
          {boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No boards yet. Create one to get started!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <motion.div
                  key={board.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="cursor-pointer mb-4"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 truncate">
                      {board.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => copyBoardLink(board.id)}
                      className="flex-1 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 py-2 rounded font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Copy size={16} />
                      Share
                    </button>
                    <button
                      onClick={() => deleteBoard(board.id)}
                      className="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 py-2 rounded font-medium transition"
                    >
                      <Trash2 size={16} className="mx-auto" />
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

export default HomePage;
