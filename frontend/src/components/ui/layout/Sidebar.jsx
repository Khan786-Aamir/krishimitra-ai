import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Logo } from '../branding/Logo';
import { Button } from '../buttons/Button';

export const Sidebar = ({
  groups = [],
  user,
  onLogout,
  className = '',
  isCollapsed: controlledCollapsed,
  setIsCollapsed: setControlledCollapsed,
  ...props
}) => {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : localCollapsed;
  const location = useLocation();

  const toggleCollapse = () => {
    if (setControlledCollapsed) {
      setControlledCollapsed(!isCollapsed);
    } else {
      setLocalCollapsed(!localCollapsed);
    }
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
      {...props}
    >
      {/* Brand area */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        {!isCollapsed ? (
          <Logo variant="compact" size="sm" />
        ) : (
          <div className="mx-auto">
            <Logo variant="icon" size="sm" />
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg bg-surface hover:bg-border text-text/60 hover:text-text border border-border transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav groups scrollable */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {group.title && !isCollapsed && (
              <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-text/30">
                {group.title}
              </h4>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.to;
                return (
                  <li key={itemIdx}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-text/60 hover:text-text hover:bg-surface/50'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {item.icon && <span className="w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      {(user || onLogout) && (
        <div className="p-4 border-t border-border bg-surface/30 shrink-0">
          {!isCollapsed && user ? (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user.name ? user.name[0].toUpperCase() : '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text truncate">{user.name}</p>
                <p className="text-xs text-text/40 truncate">{user.role}</p>
              </div>
            </div>
          ) : null}
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className={`w-full flex items-center gap-2 ${isCollapsed ? 'px-0 py-2 justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
