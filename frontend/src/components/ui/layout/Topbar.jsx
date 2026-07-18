import React from 'react';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { Button } from '../buttons/Button';
import { useTheme } from '../../../hooks/useTheme';

export const Topbar = ({
  title,
  onMenuClick,
  actions,
  className = '',
  ...props
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`h-16 border-b border-border bg-glass backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-text/60 hover:text-text focus:outline-none p-1.5 hover:bg-surface/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        {title && <h2 className="text-lg font-bold font-display text-text truncate">{title}</h2>}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2 text-text/60 hover:text-text rounded-full hover:bg-surface/50"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>

        {/* Notifications Icon */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-text/60 hover:text-text rounded-full hover:bg-surface/50 relative"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </Button>

        {actions && <div className="flex items-center gap-2 border-l border-border pl-3">{actions}</div>}
      </div>
    </header>
  );
};

export default Topbar;
