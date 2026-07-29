import React from 'react';
import { Menu, LogOut, User, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
  };

  const nameLetter = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <div className="h-14 border-b border-border bg-card/65 backdrop-blur-md flex items-center justify-between px-6 shrink-0 select-none z-20">
      
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-glow-primary">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-xs text-white tracking-tight">KrishiMitra AI</span>
        </div>
      </div>

      {/* Page Context Details */}
      <div className="hidden lg:block">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Agricultural Helper</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-extrabold text-white block leading-tight">{user?.name || 'Gurpreet Singh'}</span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-wider block mt-0.5">{user?.role || 'Farmer'}</span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black shadow-inner">
            {nameLetter}
          </div>
        </div>
      </div>

    </div>
  );
};
