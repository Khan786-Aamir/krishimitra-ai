import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Sprout,
  ShoppingBag,
  Wrench,
  Award,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { label: t('sidebar.home'), to: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: t('sidebar.ai'), to: '/assistant', icon: <Bot className="w-5 h-5" /> },
    { label: t('sidebar.users'), to: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { label: t('sidebar.farmers'), to: '/admin/farmers', icon: <Sprout className="w-5 h-5" /> },
    { label: t('sidebar.buyers'), to: '/admin/buyers', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: t('sidebar.experts'), to: '/admin/experts', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: t('sidebar.marketplace'), to: '/admin/marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: t('sidebar.equipmentRentals'), to: '/admin/equipment', icon: <Wrench className="w-5 h-5" /> },
    { label: t('sidebar.schemes'), to: '/admin/schemes', icon: <Award className="w-5 h-5" /> },
    { label: t('sidebar.aiReports'), to: '/admin/ai', icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: t('sidebar.community'), to: '/admin/community', icon: <MessageSquare className="w-5 h-5" /> },
    { label: t('sidebar.analytics'), to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: t('sidebar.profile'), to: '/admin/profile', icon: <User className="w-5 h-5" /> },
    { label: t('sidebar.settings'), to: '/admin/settings', icon: <Settings className="w-5 h-5" /> }
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
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Admin</span>
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center">
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

      {/* Nav Menu Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={idx} className="relative">
                <Link
                  to={item.to}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative z-10 ${
                    isActive
                      ? 'text-primary'
                      : 'text-text/60 hover:text-text hover:bg-surface/50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {isActive && (
                    <motion.div
                      layoutId="adminActiveIndicator"
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

      {/* Sidebar Footer User & Log Out */}
      <div className="p-4 border-t border-border bg-surface/30 shrink-0">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text truncate leading-tight">{user.name}</p>
              <p className="text-xs text-text/40 truncate mt-0.5">Control Panel</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? t('nav.signOut') : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>{t('nav.signOut')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
