import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import aiService from '../../services/aiService';

export const AssistantLayout = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSessions = async () => {
    try {
      const data = await aiService.getSessions();
      setSessions(data || []);
    } catch (err) {
      console.warn('Failed to load chat history logs', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      
      {/* Sidebar - Desktop and Mobile sliding overlay */}
      <div className={`fixed inset-y-0 left-0 z-30 transform lg:static lg:translate-x-0 transition-transform duration-300 shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          fetchSessions={fetchSessions}
        />
      </div>

      {/* Backdrop blocker for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-25 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top bar header */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Outlet viewport */}
        <div className="flex-1 overflow-hidden bg-surface/10 relative">
          <Outlet context={{
            sessions,
            activeSessionId,
            setActiveSessionId,
            fetchSessions
          }} />
        </div>

      </div>

    </div>
  );
};

export default AssistantLayout;
