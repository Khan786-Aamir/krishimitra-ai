import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageContainer from './PageContainer';

export const DashboardLayout = ({
  sidebarGroups = [],
  user,
  onLogout,
  title,
  actions,
  children,
  size = 'lg',
  className = '',
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen flex bg-background text-text ${className}`} {...props}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          groups={sidebarGroups}
          user={user}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar drawer content */}
          <Sidebar
            groups={sidebarGroups}
            user={user}
            onLogout={onLogout}
            isCollapsed={false}
            className="w-64 relative animate-slide-in"
          />
        </div>
      )}

      {/* Main Content Pane */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Topbar
          title={title}
          onMenuClick={() => setMobileOpen(true)}
          actions={actions}
        />
        <main className="flex-1 overflow-y-auto">
          <PageContainer size={size}>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
