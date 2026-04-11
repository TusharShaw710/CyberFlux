import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import useEmail from '../hooks/useEmail.js';

export const EmailModal = ({ isOpen, onClose, message, onSuccess }) => {
  const [to, setTo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const { handleSendEmail } = useEmail();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!to) return;

    setIsSending(true);
    setError(null);

    try {
      await handleSendEmail(to, "Cyberflux Response ⚡", message);
      
      onSuccess();
      onClose();
      setTo('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send email. Ensure Gmail is connected.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0D0D12] border border-white/10 rounded-2xl max-w-lg w-full mx-4 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-[#3D5AFE] pointer-events-none" />
        
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Send className="text-[#3D5AFE]" size={20} />
              Share via Email
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">To</label>
              <input 
                type="email" 
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3D5AFE]/50 focus:ring-1 focus:ring-[#3D5AFE]/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Subject</label>
              <input 
                type="text" 
                readOnly
                value="Cyberflux Response ⚡"
                className="w-full bg-black/20 border border-transparent rounded-lg px-4 py-2 text-gray-300 text-sm cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Message</label>
              <textarea 
                readOnly
                value={message}
                rows={5}
                className="w-full bg-black/20 border border-white/5 rounded-lg px-4 py-3 text-gray-300 text-sm resize-none cursor-not-allowed no-scrollbar"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#3D5AFE] hover:bg-[#3D5AFE]/80 transition-colors shadow-lg shadow-[#3D5AFE]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
