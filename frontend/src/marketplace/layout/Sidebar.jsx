import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Grid,
  FilePlus2,
  Inbox,
  Heart,
  History,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Bot
} from 'lucide-react';
import { Logo } from '../../components/ui';

export const Sidebar = ({
  user,
  onLogout,
  isCollapsed,
  setIsCollapsed,
  className = ''
}) => {
  const location = useLocation();

  // Conditional rendering based on role. Farmer is seller, Buyer is procurer
  const isFarmer = user?.role === 'Farmer';

  const menuItems = [
    { label: 'Marketplace Home', to: '/marketplace', icon: <Home className="w-5 h-5" /> },
    { label: 'AI Assistant', to: '/assistant', icon: <Bot className="w-5 h-5" /> },
    { label: 'Browse Crops', to: '/marketplace/browse', icon: <Search className="w-5 h-5" /> },
    { label: 'Categories', to: '/marketplace/categories', icon: <Grid className="w-5 h-5" /> },
    ...(isFarmer ? [
      { label: 'My Listings', to: '/marketplace/my-listings', icon: <FilePlus2 className="w-5 h-5" /> }
    ] : []),
    { label: 'Buyer Inquiries', to: '/marketplace/inquiries', icon: <Inbox className="w-5 h-5" /> },
    { label: 'Wishlist', to: '/marketplace/wishlist', icon: <Heart className="w-5 h-5" /> },
    { label: 'Recently Viewed', to: '/marketplace/recently-viewed', icon: <History className="w-5 h-5" /> },
    { label: 'Saved Searches', to: '/marketplace/saved-searches', icon: <Bookmark className="w-5 h-5" /> }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <Logo variant="compact" size="sm" />
            <span className="text-[10px] uppercase font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md font-sans">
              B2B Shop
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <Logo variant="icon" size="sm" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg bg-surface hover:bg-border text-text/60 hover:text-text border border-border transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive =
              item.to === '/marketplace'
                ? location.pathname === '/marketplace'
                : location.pathname.startsWith(item.to);

            return (
              <li key={idx} className="relative">
                <Link
                  to={item.to}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative z-10 ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-text/60 hover:text-text hover:bg-surface/50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {isActive && (
                    <motion.div
                      layoutId="marketplaceActiveIndicator"
                      className="absolute inset-0 bg-primary/10 border-l-2 border-primary rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Exit Portal & User Profile */}
      <div className="p-4 border-t border-border bg-surface/30 shrink-0 space-y-3">
        {/* User Card */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text truncate leading-tight">{user.name}</p>
              <p className="text-xs text-primary font-medium truncate mt-0.5">{user.role} Portal</p>
            </div>
          </div>
        )}

        {/* Dashboard Shortcut link */}
        <Link
          to={user?.role === 'Farmer' ? '/farmer' : (user?.role === 'Buyer' ? '/buyer' : (user?.role === 'Expert' ? '/expert' : '/admin'))}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-border/80 hover:bg-surface text-text/70 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Exit to Dashboard' : undefined}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0 text-primary" />
          {!isCollapsed && <span>Exit to Dashboard</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
