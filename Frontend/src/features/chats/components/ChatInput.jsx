import React, { useState, useRef } from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const currentChatId=useSelector((state)=>state.chat.currentChatId);
  const {handleSendMessageStream}=useChat();

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      handleSendMessageStream(message, currentChatId, selectedFile);
      setMessage('');
      setSelectedFile(null);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className=" backdrop-blur-lg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-4 relative">
          
          {/* Attachment Preview */}
          {selectedFile && (
            <div className="absolute -top-10 left-0 flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-sm text-gray-200 border border-white/20 shadow-lg">
                <Paperclip size={14} className="mr-2 text-[#00FFC2]" />
                <span className="truncate max-w-xs">{selectedFile.name}</span>
                <button onClick={removeFile} className="ml-3 text-gray-400 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
            </div>
          )}

          {/* Attachment Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <Paperclip size={18} className="text-gray-400 group-hover:text-[#00FFC2]" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*,application/pdf"
          />

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask CyberFlux anything..."
              className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFC2]/50 focus:shadow-lg focus:shadow-[#00FFC2]/20 transition-all duration-300"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() && !selectedFile}
            className="p-3 rounded-xl bg-linear-to-r from-[#00FFC2] to-[#3D5AFE] text-black font-semibold hover:shadow-lg hover:shadow-[#00FFC2]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
