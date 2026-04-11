import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-[#00FFC2]/50 shadow-lg shadow-[#00FFC2]/20 rounded-xl px-4 py-3 transform animate-in slide-in-from-top-4 fade-in duration-300">
      <CheckCircle size={20} className="text-[#00FFC2]" />
      <span className="text-white text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-2">
        <X size={16} />
      </button>
    </div>
  );
};
