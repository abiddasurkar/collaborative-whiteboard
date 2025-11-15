/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 🌙 enable dark mode toggle via class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      /* 🎨 Color Tokens for Light & Dark Modes */
      colors: {
        'bg-light': '#ffffff',
        'bg-dark': '#0f172a',
        'surface-light': '#f9fafb',
        'surface-dark': '#1e293b',
        'border-light': 'rgba(0, 0, 0, 0.1)',
        'border-dark': 'rgba(255, 255, 255, 0.1)',
        'text-light': '#1f2937',
        'text-dark': '#f3f4f6',
      },

      /* 🌀 Custom Animations */
      animation: {
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-slower': 'float-slower 25s ease-in-out infinite',
        'float-random': 'float-random 30s linear infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        'float-slower': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(10px) translateY(-15px)' },
          '50%': { transform: 'translateX(0px) translateY(-25px)' },
          '75%': { transform: 'translateX(-10px) translateY(-15px)' },
        },
        'float-random': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
          '25%': { transform: 'translateY(-40px) translateX(10px)', opacity: '0.6' },
          '50%': { transform: 'translateY(-80px) translateX(-5px)', opacity: '0.8' },
          '75%': { transform: 'translateY(-40px) translateX(-10px)', opacity: '0.6' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.05', transform: 'scale(1)' },
          '50%': { opacity: '0.1', transform: 'scale(1.05)' },
        },
      },

      /* 🌈 Backgrounds & Effects */
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '64px 64px',
      },

      /* 💫 Optional Glows */
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.5)',
      },

      /* 🌫️ Optional blur utilities */
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};