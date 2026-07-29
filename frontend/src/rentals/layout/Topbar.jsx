import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, LogOut, ChevronDown, Menu } from 'lucide-react';
import { Logo } from '../../components/ui';

export const Topbar = ({
  user,
  onLogout,
  onOpenMobileMenu,
  className = ''
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalQuery.trim()) {
      navigate(`/rentals/browse?search=${encodeURIComponent(globalQuery)}`);
    }
  };

  return (
    <header
      className={`h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 ${className}`}
    >
      {/* Search & Drawer triggers */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-text/60 hover:text-text hover:bg-surface rounded-xl border border-border/80 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden flex items-center gap-1.5">
          <Logo variant="compact" size="xs" />
        </div>

        {/* Global Search bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center w-64 md:w-80">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search machinery, tractors, tillers..."
            className="w-full pl-9 pr-4 py-2 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30 transition-colors"
          />
        </form>
      </div>

      {/* Right User drop menu */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 bg-surface border border-border/80 px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>RENTAL SECURE GATE</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 px-2.5 rounded-xl hover:bg-surface/85 border border-transparent hover:border-border/60 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-white max-w-[100px] truncate">{user?.name || 'User'}</span>
              <span className="block text-[9px] text-text/50 font-semibold leading-none">{user?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text/40" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl py-2 z-20 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-border/50">
                  <p className="font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-text/50 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(user?.role === 'Farmer' ? '/farmer/profile' : (user?.role === 'Buyer' ? '/buyer/profile' : '/expert/profile'));
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface text-text/80 hover:text-white transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface text-rose-400 hover:bg-rose-500/5 transition-colors border-t border-border/40 mt-1 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Session</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
