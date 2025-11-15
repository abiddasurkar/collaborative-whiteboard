
// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl top-20 left-10"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl bottom-20 right-10"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-2xl mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <Ghost className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
        </motion.div>

        <h1 className="text-7xl sm:text-9xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto leading-relaxed">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm border border-white/20 text-gray-300 rounded-xl font-semibold hover:text-white hover:border-cyan-400/30 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={20} />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-3"
          >
            <Home size={20} />
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;