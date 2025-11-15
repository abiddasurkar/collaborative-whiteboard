// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Copy,
  Trash2,
  Search,
  Grid,
  List,
  FileText,
  Clock,
  Share2,
  Edit2,
  Calendar,
  Zap,
} from 'lucide-react';

const HomePage = () => {
  const [boards, setBoards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load boards from localStorage
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
    try {
      const newBoardId = Math.random().toString(36).substr(2, 9);
      const newBoard = {
        id: newBoardId,
        name: `Untitled Board`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '',
        size: 0,
      };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      navigate(`/board/${newBoardId}`);
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board');
    }
  };

  const deleteBoard = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        const updatedBoards = boards.filter((b) => b.id !== id);
        setBoards(updatedBoards);
        localStorage.setItem('boards', JSON.stringify(updatedBoards));
      } catch (error) {
        console.error('Error deleting board:', error);
        alert('Failed to delete board');
      }
    }
  };

  const renameBoard = (id, newName) => {
    if (!newName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const updatedBoards = boards.map((b) =>
        b.id === id ? { ...b, name: newName.trim(), updatedAt: new Date().toISOString() } : b
      );
      setBoards(updatedBoards);
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      setEditingId(null);
    } catch (error) {
      console.error('Error renaming board:', error);
      alert('Failed to rename board');
    }
  };

  const copyBoardLink = (id, e) => {
    e.stopPropagation();
    try {
      const link = `${window.location.origin}/collaborative-whiteboard/board/${id}`;
      navigator.clipboard.writeText(link).then(() => {
        alert('Board link copied to clipboard!');
      }).catch(() => {
        // Fallback: show alert with link
        alert(`Copy this link: ${link}`);
      });
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBoards = [...filteredBoards].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                Whiteboard
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Zap size={16} className="text-yellow-500 flex-shrink-0" />
                Create, draw, and share
              </p>
            </div>
            <button
              onClick={createNewBoard}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Board</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Search & View Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Boards Section */}
        {sortedBoards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20"
          >
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl mb-6">
              No boards yet. Create your first one!
            </p>
            <button
              onClick={createNewBoard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Board
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {sortedBoards.length} board{sortedBoards.length !== 1 ? 's' : ''} found
            </div>

            {viewMode === 'grid' ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {sortedBoards.map((board) => (
                    <motion.div
                      key={board.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                    >
                      {/* Board Preview */}
                      <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        <div className="text-3xl sm:text-4xl font-bold text-gray-300 dark:text-gray-500 opacity-20">
                          {board.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      </div>

                      {/* Board Info */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        {editingId === board.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => renameBoard(board.id, editingName)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') renameBoard(board.id, editingName);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 border-2 border-blue-500 rounded dark:bg-gray-700 dark:text-white focus:outline-none mb-2 text-sm"
                          />
                        ) : (
                          <h3 className="font-semibold text-sm sm:text-lg text-gray-800 dark:text-white mb-2 truncate group-hover:text-blue-600 line-clamp-2">
                            {board.name}
                          </h3>
                        )}
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap">
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Clock size={12} className="sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">{new Date(board.updatedAt).toLocaleDateString()}</span>
                            <span className="xs:hidden">{new Date(board.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(board.id);
                              setEditingName(board.name);
                            }}
                            className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 py-1.5 sm:py-2 rounded font-medium flex items-center justify-center gap-1 text-xs sm:text-sm transition"
                            title="Rename"
                          >
                            <Edit2 size={12} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Rename</span>
                          </button>
                          <button
                            onClick={(e) => copyBoardLink(board.id, e)}
                            className="flex-1 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 py-1.5 sm:py-2 rounded font-medium flex items-center justify-center gap-1 text-xs sm:text-sm transition"
                            title="Share"
                          >
                            <Share2 size={12} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Share</span>
                          </button>
                          <button
                            onClick={(e) => deleteBoard(board.id, e)}
                            className="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 py-1.5 sm:py-2 rounded font-medium flex items-center justify-center gap-1 text-xs sm:text-sm transition"
                            title="Delete"
                          >
                            <Trash2 size={12} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-2 sm:space-y-3"
              >
                <AnimatePresence>
                  {sortedBoards.map((board) => (
                    <motion.div
                      key={board.id}
                      variants={itemVariants}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition cursor-pointer p-3 sm:p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 group flex-wrap sm:flex-nowrap"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white group-hover:text-blue-600 truncate">
                          {board.name}
                        </h3>
                        <div className="flex gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <Clock size={12} className="sm:w-4 sm:h-4" />
                            {new Date(board.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => copyBoardLink(board.id, e)}
                          className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded transition"
                          title="Share"
                        >
                          <Share2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteBoard(board.id, e)}
                          className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
        >
          <p className="text-xs sm:text-sm">
            Total Boards: <span className="font-semibold text-gray-800 dark:text-white">{boards.length}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;