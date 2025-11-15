// src/store/whiteboardStore.js
import { create } from 'zustand';

export const useWhiteboardStore = create((set, get) => ({
  // Drawing tools
  tool: 'brush', // 'brush', 'eraser', 'line', 'rectangle', 'circle', 'text'
  color: '#000000',
  strokeWidth: 3,
  fontSize: 16,
  
  // Canvas state
  isDrawing: false,
  startX: 0,
  startY: 0,
  history: [],
  historyStep: -1,
  
  // Dark mode
  isDarkMode: false,
  
  // Actions
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setFontSize: (size) => set({ fontSize: size }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setStartPosition: (x, y) => set({ startX: x, startY: y }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // History
  addToHistory: (canvas) => set((state) => ({
    history: [...state.history.slice(0, state.historyStep + 1), canvas.toDataURL()],
    historyStep: state.historyStep + 1,
  })),
  
  undo: (canvas) => {
    const state = get();
    if (state.historyStep > 0) {
      const newStep = state.historyStep - 1;
      const img = new Image();
      img.src = state.history[newStep];
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      set({ historyStep: newStep });
    }
  },
  
  redo: (canvas) => {
    const state = get();
    if (state.historyStep < state.history.length - 1) {
      const newStep = state.historyStep + 1;
      const img = new Image();
      img.src = state.history[newStep];
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      set({ historyStep: newStep });
    }
  },
  
  clearCanvas: (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    set({
      history: [''],
      historyStep: 0,
    });
  },
}));