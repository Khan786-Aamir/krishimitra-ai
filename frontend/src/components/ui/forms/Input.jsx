import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text/60 mb-2 select-none">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full bg-background border rounded-custom text-text placeholder-text/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm ${
            leftIcon ? 'pl-11' : 'pl-4'
          } ${
            rightIcon ? 'pr-11' : 'pr-4'
          } ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border'
          } py-3 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text/40">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-semibold flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
