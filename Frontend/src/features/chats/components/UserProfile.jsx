import React from 'react'
import { LogOut } from 'lucide-react'

export const UserProfile = ({ user = { name: 'Alex Chen', status: 'Standard Access', avatar: '👾' } }) => {
  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 cursor-pointer group">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-lg font-bold">
          {user.avatar}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-400">{user.status}</p>
        </div>

        {/* Logout Button */}
        <button className="p-1 rounded-lg hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <LogOut size={16} className="text-gray-400 hover:text-[#FF00E5]" />
        </button>
      </div>
    </div>
  )
}
