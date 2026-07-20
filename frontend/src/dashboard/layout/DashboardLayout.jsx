import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout = ({ className = '', ...props }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex bg-background text-text ${className}`} {...props}>
      {/* Desktop Sidebar (visible on md screens upwards, width toggles 64 / 20) */}
      <div className="hidden md:block shrink-0 transition-all duration-300">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Mobile Drawer (visible on small/mobile screens) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Sidebar */}
          <Sidebar
            user={user}
            onLogout={handleLogout}
            isCollapsed={false}
            setIsCollapsed={() => {}}
            className="w-64 relative z-50 animate-slide-in shadow-2xl"
          />
        </div>
      )}

      {/* Main content pane */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Topbar
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setMobileOpen(true)}
        />
        
        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
