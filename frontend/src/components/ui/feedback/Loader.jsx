import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({
  size = 'md',
  className = '',
  color = 'primary',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    text: 'text-text',
  };

  const currentSize = sizes[size] || sizes.md;
  const currentColor = colors[color] || colors.primary;

  return (
    <div className={`flex items-center justify-center p-4 ${className}`} {...props}>
      <Loader2 className={`animate-spin ${currentSize} ${currentColor} shrink-0`} />
    </div>
  );
};

export default Loader;
