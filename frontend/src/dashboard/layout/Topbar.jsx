import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  Check,
  CheckSquare,
  X
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { notificationService } from '../services/notificationService';
import { Button } from '../../components/ui';

export const Topbar = ({
  user,
  onLogout,
  onMenuClick,
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Date & Time states
  const [time, setTime] = useState(new Date());
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Tick clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds for new alerts
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Greeting helper
  const getGreeting = () => {
    const hrs = time.getHours();
    const firstName = user?.name ? user.name.split(' ')[0] : 'Farmer';
    if (hrs < 12) return `Good Morning, ${firstName} 👋`;
    if (hrs < 17) return `Good Afternoon, ${firstName} 👋`;
    return `Good Evening, ${firstName} 👋`;
  };

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header
      className={`h-16 border-b border-border bg-glass backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 ${className}`}
    >
      {/* Left Area: Hamburger and Greeting */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-text/60 hover:text-text focus:outline-none p-1.5 hover:bg-surface/50 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="hidden sm:block">
          <h2 className="text-base font-bold font-display text-text leading-tight">
            {getGreeting()}
          </h2>
          <p className="text-[10px] text-text/40 font-semibold mt-0.5">
            {formattedDate} • <span className="font-mono">{formattedTime}</span>
          </p>
        </div>
      </div>

      {/* Middle Area: Search bar */}
      <div className="flex-1 max-w-xs md:max-w-md mx-4 relative hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crops, schedules, schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border text-sm rounded-xl py-2 pl-10 pr-4 text-text placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Right Area: Theme, Notification panel, Profile dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-text/60 hover:text-text rounded-full hover:bg-surface/50 transition-all cursor-pointer focus:outline-none"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-text/60 hover:text-text rounded-full hover:bg-surface/50 transition-all cursor-pointer relative focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-black rounded-full bg-primary text-white scale-90 flex items-center justify-center min-w-[16px] h-[16px]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-glass-lg overflow-hidden z-50 text-left"
              >
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
                  <h4 className="font-bold text-sm text-text flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-border/40">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-text/40 text-xs">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-4 transition-colors hover:bg-surface/30 cursor-pointer relative flex gap-3 ${
                          !notif.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          if (notif.link) navigate(notif.link);
                          setShowNotifications(false);
                        }}
                      >
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs border ${
                          notif.priority === 'high'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          ✓
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs font-bold text-text truncate">{notif.title}</p>
                          <p className="text-[11px] text-text/60 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[9px] text-text/30 font-semibold block mt-1.5">
                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif._id, e)}
                            className="p-1 rounded bg-surface border border-border text-text/40 hover:text-primary transition-colors cursor-pointer absolute right-3 top-4"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0 cursor-pointer focus:outline-none"
          >
            {user?.name ? user.name[0].toUpperCase() : 'F'}
          </button>

          {/* Profile Dropdown panel */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-glass-lg overflow-hidden z-50 text-left p-1.5"
              >
                <div className="px-3.5 py-2.5 border-b border-border/50">
                  <p className="text-xs font-bold text-text truncate">{user?.name}</p>
                  <p className="text-[10px] text-text/40 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/farmer/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text/70 hover:text-text hover:bg-surface/50 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4" />
                    Farmer Profile
                  </Link>
                  <Link
                    to="/farmer/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text/70 hover:text-text hover:bg-surface/50 rounded-xl transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                </div>
                <div className="border-t border-border/50 pt-1.5 mt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
