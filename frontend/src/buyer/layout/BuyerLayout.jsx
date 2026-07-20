import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BuyerSidebar from './BuyerSidebar';
import BuyerTopbar from './BuyerTopbar';
import { useAuth } from '../../context/AuthContext';

export const BuyerLayout = ({ className = '', ...props }) => {
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
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 transition-all duration-300">
        <BuyerSidebar
          user={user}
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <BuyerSidebar
            user={user}
            onLogout={handleLogout}
            isCollapsed={false}
            setIsCollapsed={() => {}}
            className="w-64 relative z-50 animate-slide-in shadow-2xl"
          />
        </div>
      )}

      {/* Main Content Pane */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <BuyerTopbar
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

export default BuyerLayout;
