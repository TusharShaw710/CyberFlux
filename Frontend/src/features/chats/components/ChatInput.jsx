import React, { useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const currentChatId=useSelector((state)=>state.chat.currentChatId);
  const {handleSendMessageStream}=useChat();

  const handleSend = () => {
    if (message.trim()) {
      handleSendMessageStream(message, currentChatId);
      setMessage('')
    }
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
        <div className="flex items-end gap-4">
          {/* Attachment Button */}
          <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group">
            <Paperclip size={18} className="text-gray-400 group-hover:text-[#00FFC2]" />
          </button>

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
            disabled={!message.trim()}
            className="p-3 rounded-xl bg-linear-to-r from-[#00FFC2] to-[#3D5AFE] text-black font-semibold hover:shadow-lg hover:shadow-[#00FFC2]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
