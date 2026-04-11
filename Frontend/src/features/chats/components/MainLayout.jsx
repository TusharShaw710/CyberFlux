import React, { useState, useEffect, useRef } from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { useSelector } from 'react-redux'

export const MainLayout = ({ onMenuClick }) => {
  const [dots, setDots] = useState('.');
  const messagesEndRef = useRef(null);

  const chats=useSelector((state)=>state.chat.chats);
  const currentChatId=useSelector((state)=>state.chat.currentChatId);
  const isThinking=useSelector((state)=>state.chat.isThinking);
  const streamingMessage=useSelector((state)=>state.chat.streamingMessage);

  // Animate thinking dots
  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats[currentChatId]?.messages, isThinking, streamingMessage]);

  return (
    <div className="flex-1 flex flex-col h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(255, 0, 229, 0.08) 0%, rgba(13, 13, 18, 0) 50%), #0D0D12'
    }}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5"
             style={{ background: '#00FFC2' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-5"
             style={{ background: '#3D5AFE' }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-3"
             style={{ background: '#FF00E5' }} />
      </div>

      {/* Header */}
      <ChatHeader onMenuClick={onMenuClick} />

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {chats[currentChatId]?.messages.length === 0 || !chats[currentChatId]?.messages ? (
          // Hero Section
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center  max-w-2xl relative z-10">
              {/* Main Heading with Gradient */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-3 tracking-tight text-gray-200 leading-tight">
                What are we{" "}
                <span className="bg-linear-to-r from-[#00FFC2] via-[#3D5AFE] to-[#FF00E5] bg-clip-text text-transparent">
                  synthesizing
                </span>{" "}
                today?
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-gray-400 tracking-wider mb-12 opacity-70">
                CyberFlux-0.1 Active
              </p>
            </div>
          </div>
        ) : (
          // Messages
          <div className="p-8 space-y-6 max-w-4xl mx-auto relative z-10">
            {chats[currentChatId]?.messages.map((msg) => (
              <MessageBubble key={msg._id} message={msg.text} role={msg.role} />
            ))}
            
            {/* Thinking State */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-lg border border-[#00FFC2]/50 shadow-lg shadow-[#00FFC2]/20 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#00FFC2] rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                      <span className="w-2 h-2 bg-[#00FFC2] rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      <span className="w-2 h-2 bg-[#00FFC2] rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                    </div>
                    <span className="text-sm text-gray-400">Thinking{dots}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Streaming Message */}
            {streamingMessage && (
              <MessageBubble 
                key="streaming-message"
                message={streamingMessage} 
                role="ai" 
                isStreaming={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput/>
    </div>
  )
}
