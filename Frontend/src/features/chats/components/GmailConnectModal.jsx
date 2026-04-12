import React from 'react';
import { X, Mail } from 'lucide-react';

export const GmailConnectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConnect = () => {
    window.location.href = 'https://cyberflux-yyap.onrender/api/email/auth/google';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0D0D12] border border-white/10 rounded-2xl max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 bg-[#FF00E5] pointer-events-none" />
        
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-[#00FFC2] bg-clip-text text-transparent flex items-center gap-2">
              <Mail className="text-[#00FFC2]" size={24} />
              Connect Your Gmail
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            This feature is currently in testing mode. Please provide your Gmail address so it can be manually approved. Once approved, you can send emails using Cyberflux.
          </p>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConnect}
              className="px-5 py-2 rounded-lg text-sm font-bold text-black bg-[#00FFC2] hover:bg-[#00FFC2]/80 transition-colors shadow-lg shadow-[#00FFC2]/20"
            >
              Connect Gmail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
