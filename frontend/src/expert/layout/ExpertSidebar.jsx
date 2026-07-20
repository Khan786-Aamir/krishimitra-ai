import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  Calendar,
  Users,
  BookOpen,
  MessageCircle,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../../components/ui';

export const ExpertSidebar = ({
  user,
  onLogout,
  isCollapsed,
  setIsCollapsed,
  className = ''
}) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', to: '/expert', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'AI Diagnosis Reviews', to: '/expert/reviews', icon: <Stethoscope className="w-5 h-5" /> },
    { label: 'Consultations', to: '/expert/consultations', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Appointments', to: '/expert/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Farmers', to: '/expert/farmers', icon: <Users className="w-5 h-5" /> },
    { label: 'Knowledge Hub', to: '/expert/knowledge-hub', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Community', to: '/expert/community', icon: <MessageCircle className="w-5 h-5" /> },
    { label: 'Analytics', to: '/expert/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Profile', to: '/expert/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Settings', to: '/expert/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Sidebar Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <Logo variant="compact" size="sm" />
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
              item.to === '/expert'
                ? location.pathname === '/expert'
                : location.pathname.startsWith(item.to);

            return (
              <li key={idx} className="relative">
                <Link
                  to={item.to}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative z-10 ${
                    isActive
                      ? 'text-emerald-400 font-bold'
                      : 'text-text/60 hover:text-text hover:bg-surface/50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {isActive && (
                    <motion.div
                      layoutId="expertActiveIndicator"
                      className="absolute inset-0 bg-emerald-500/10 border-l-2 border-emerald-500 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-border bg-surface/30 shrink-0">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-sm shrink-0">
              {user.name ? user.name[0].toUpperCase() : 'E'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text truncate leading-tight">{user.name}</p>
              <p className="text-xs text-emerald-400 font-medium truncate mt-0.5">Agriculture Expert</p>
            </div>
          </div>
        )}

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

export default ExpertSidebar;
