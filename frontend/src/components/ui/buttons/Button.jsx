import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-custom transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10 hover:shadow-primary/20 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/10 hover:shadow-secondary/20 focus:ring-secondary',
    outline: 'border border-border text-text hover:bg-surface/50 focus:ring-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/10',
    icon: 'p-2.5 border border-border text-text hover:bg-surface/50 focus:ring-primary',
    ghost: 'text-text/80 hover:text-text hover:bg-surface/30 focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = variant === 'icon' ? '' : (sizes[size] || sizes.md);

  const buttonClasses = `${baseStyles} ${currentVariant} ${currentSize} ${className}`;
  const isButtonDisabled = disabled || isLoading;

  const elementProps = {
    className: buttonClasses,
    ...props,
  };

  if (Component === 'button') {
    elementProps.disabled = isButtonDisabled;
    elementProps.type = props.type || 'button';
  } else if (isButtonDisabled) {
    // If it's a Link or a and disabled, disable pointer events
    elementProps.className = `${buttonClasses} pointer-events-none opacity-50`;
    elementProps['aria-disabled'] = true;
    elementProps.tabIndex = -1;
  }

  return (
    <Component {...elementProps}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>}
    </Component>
  );
};
