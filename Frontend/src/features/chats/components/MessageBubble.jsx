import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Mail } from 'lucide-react'
import { EmailModal } from './EmailModal'
import { Toast } from './Toast'

export const MessageBubble = ({ message, role, isStreaming = false }) => {
  const [displayCursor, setDisplayCursor] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      const cursorInterval = setInterval(() => {
        setDisplayCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isStreaming]);

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-full px-6 py-4 rounded-2xl transition-all duration-300 ${
          role === 'user'
            ? 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 rounded-b-sm'
            : `bg-black/40 max-w-full backdrop-blur-lg border transition-all duration-200 ${
                isStreaming
                  ? 'border-[#00FFC2]/50 shadow-lg shadow-[#00FFC2]/20'
                  : 'border-[#00FFC2]/30 hover:border-[#00FFC2]/50 shadow-lg shadow-[#00FFC2]/10 hover:shadow-[#00FFC2]/20'
              }`
        }`}
      >
        {role === 'user' ? (
          <p className="text-sm text-white leading-relaxed">
            {message}
          </p>
        ) : (
          <div className="text-sm text-white leading-relaxed markdown-content">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#00FFC2] mt-4 mb-3" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#00FFC2] mt-4 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-3 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-3 ml-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 my-3 ml-4" {...props} />,
                li: ({node, ...props}) => <li className="text-sm" {...props} />,
                p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="text-[#00FFC2]" {...props} />,
                em: ({node, ...props}) => <em className="text-gray-300" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="bg-white/10 px-2 py-1 rounded text-[#00FFC2] text-xs" {...props} />
                  ) : (
                    <code className="block bg-white/10 p-3 rounded my-3 text-xs overflow-x-auto" {...props} />
                  ),
                table: ({node, ...props}) => <table className="w-full border-collapse my-3" {...props} />,
                thead: ({node, ...props}) => <thead className="bg-white/5" {...props} />,
                tbody: ({node, ...props}) => <tbody {...props} />,
                tr: ({node, ...props}) => <tr className="border-b border-white/10" {...props} />,
                th: ({node, ...props}) => <th className="px-4 py-2 text-left text-[#00FFC2] font-bold" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-2 text-white" {...props} />,
              }}
              remarkPlugins={[remarkGfm]}
            >
              {message}
            </ReactMarkdown>
            {isStreaming && (
              <span className={`inline-block w-1 h-4 bg-[#00FFC2] ml-1 transition-opacity ${
                displayCursor ? 'opacity-100' : 'opacity-0'
              }`} />
            )}
            
            {!isStreaming && (
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setIsEmailModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-[#00FFC2] transition-colors"
                >
                  <Mail size={14} /> Share via Email
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        message={message}
        onSuccess={() => setShowToast(true)}
      />
      {showToast && (
        <Toast 
          message="Email request sent successfully 📧" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}
