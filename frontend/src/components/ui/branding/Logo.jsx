import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ variant = 'full', size = 'md', className = '', to = '/' }) => {
  // size scale
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', container: 'gap-1.5' },
    md: { icon: 'w-9 h-9', text: 'text-lg', container: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'gap-3' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const LogoIcon = () => (
    <div className={`relative flex items-center justify-center rounded-[12px] bg-gradient-to-tr from-primary to-accent p-[1.5px] shadow-lg shadow-primary/10 ${currentSize.icon}`}>
      <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-80">
        <svg
          className="w-3/5 h-3/5 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22C12 22 20 18 20 12C20 7 16 3 12 3C8 3 4 7 4 12C4 18 12 22 12 22Z" fill="url(#leaf-grad)" />
          <path d="M12 3V22" />
          <path d="M12 11C12 11 16 9 18 11" />
          <path d="M12 15C12 15 8 13 6 15" />
          <defs>
            <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );

  const LogoText = () => (
    <span className={`font-display font-extrabold tracking-tight text-text ${currentSize.text}`}>
      KrishiMitra<span className="text-primary">AI</span>
    </span>
  );

  const AiBadge = () => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase scale-90 origin-left">
      SaaS
    </span>
  );

  const renderContent = () => {
    switch (variant) {
      case 'icon':
        return <LogoIcon />;
      case 'compact':
        return (
          <div className={`flex items-center ${currentSize.container} ${className}`}>
            <LogoIcon />
            <LogoText />
          </div>
        );
      case 'full':
      default:
        return (
          <div className={`flex items-center ${currentSize.container} ${className}`}>
            <LogoIcon />
            <LogoText />
            <AiBadge />
          </div>
        );
    }
  };

  if (to) {
    return (
      <Link to={to} className="group inline-flex items-center focus:outline-none select-none">
        {renderContent()}
      </Link>
    );
  }

  return (
    <div className="group inline-flex items-center select-none">
      {renderContent()}
    </div>
  );
};
