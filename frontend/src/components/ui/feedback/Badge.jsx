import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-bold rounded-full select-none border';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    gray: 'bg-text/5 text-text/50 border-text/10',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px] tracking-wider uppercase',
    md: 'px-2.5 py-1 text-xs',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <span
      className={`${baseClasses} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
