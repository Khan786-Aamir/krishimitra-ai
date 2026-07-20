import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Calendar,
  User,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Heart,
  CheckCircle2,
  X
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const BuyerTopbar = ({ user, onLogout, onMenuClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const notifications = [
    {
      id: 'notif-1',
      title: 'Order Status Update',
      message: 'Batch #ORD-9821 (Sharbati Wheat) has been dispatched from Ludhiana warehouse.',
      time: '15m ago',
      type: 'order',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'notif-2',
      title: 'Price drop alert!',
      message: '1121 Basmati Rice price dropped by ₹50/Qtl in Karnal Mandi.',
      time: '1h ago',
      type: 'price',
      icon: <TrendingUp className="w-4 h-4 text-indigo-400" />
    },
    {
      id: 'notif-3',
      title: 'Wishlist Item Restocked',
      message: 'Kashmiri Saffron (Grade 1) is back in stock with 15kg available quantity.',
      time: '3h ago',
      type: 'wishlist',
      icon: <Heart className="w-4 h-4 text-rose-400" />
    },
    {
      id: 'notif-4',
      title: 'System Notification',
      message: 'New verified farmers added to Punjab & Haryana regional crop clusters.',
      time: '1d ago',
      type: 'system',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Menu Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl bg-surface hover:bg-border text-text/70 transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-base font-bold text-text leading-tight font-display">
            {getGreeting()}, <span className="text-indigo-400">{user?.name || 'Buyer'}</span>
          </h2>
          <p className="text-xs text-text/40 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span>{currentDateFormatted}</span>
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, mandi prices, or verified farmers..."
            className="w-full pl-10 pr-4 py-2 bg-surface/60 border border-border/80 focus:border-indigo-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
          />
        </div>
      </form>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-surface/80 hover:bg-border text-text/70 hover:text-text border border-border/60 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-surface/80 hover:bg-border text-text/70 hover:text-text border border-border/60 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-text/70" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-in">
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface/40">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-text">Notifications</h4>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-text/40 hover:text-text rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border/50 custom-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-surface/50 transition-colors flex gap-3">
                    <div className="p-2 rounded-xl bg-surface border border-border shrink-0 h-fit">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-text truncate">{n.title}</h5>
                        <span className="text-[10px] text-text/40 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-text/60 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border bg-surface/30 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-400 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-surface/80 hover:bg-border border border-border/60 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'B'}
            </div>
            <span className="text-xs font-semibold text-text hidden sm:inline-block max-w-[100px] truncate">
              {user?.name || 'Buyer Account'}
            </span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-slide-in">
              <div className="p-3 border-b border-border/80 mb-1">
                <p className="text-xs font-bold text-text">{user?.name}</p>
                <p className="text-[11px] text-indigo-400 font-medium">Role: Buyer</p>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/buyer/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-text/70 hover:text-text hover:bg-surface transition-colors text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>My Buyer Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BuyerTopbar;
