import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { MainLayout } from '../components/MainLayout'
import useChat from '../hooks/useChat'
import { useEffect } from 'react'

export const DashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { initClient, handleGetChat } = useChat();
  useEffect(() => {
    initClient(),
    handleGetChat();
  }, [])

  return (
    <div className="flex h-screen bg-[#0D0D12] font-sans relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <MainLayout onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  )
}
