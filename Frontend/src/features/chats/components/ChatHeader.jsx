import React from 'react'
import { User, Menu } from 'lucide-react'

export const ChatHeader = ({ onMenuClick }) => {
  return (
    <div className="backdrop-blur-lg">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left Section - Hamburger Menu (Mobile Only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          <Menu size={20} className="text-gray-400 hover:text-[#00FFC2]" />
        </button>

        {/* Right Section - Status & Profile */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Status Indicator (Hidden on Mobile) */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <span className="text-xs text-gray-300 font-medium">System Optimal</span>
          </div>

          {/* Profile Icon */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
            <User size={18} className="text-gray-400 hover:text-[#00FFC2]" />
          </button>
        </div>
      </div>
    </div>
  )
}
