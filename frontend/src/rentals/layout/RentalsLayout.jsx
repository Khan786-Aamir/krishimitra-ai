import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const RentalsLayout = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background-dark text-white z-50">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 bg-primary/10 rounded-full animate-pulse"></div>
          <span className="absolute font-sans font-bold text-sm text-primary">KM</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background-dark text-text flex">
      {/* Desktop Sidebar */}
      <Sidebar
        user={user}
        onLogout={logout}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        className="hidden md:flex"
      />

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <Sidebar
        user={user}
        onLogout={logout}
        isCollapsed={false}
        setIsCollapsed={() => {}}
        className={`fixed top-0 bottom-0 left-0 z-50 md:hidden transition-transform duration-350 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      />

      {/* Layout Content wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Topbar
          user={user}
          onLogout={logout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RentalsLayout;
