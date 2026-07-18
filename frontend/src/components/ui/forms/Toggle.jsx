import React, { forwardRef } from 'react';

export const Toggle = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-surface border border-border peer-checked:border-primary peer-checked:bg-primary rounded-full transition-all duration-200 shadow-inner peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30" />
          <div className="absolute left-[3px] top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-all duration-200 peer-checked:translate-x-4" />
        </div>
        {label && (
          <span className="ml-3 text-sm text-text/80 font-medium hover:text-text transition-colors">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-semibold pl-13">
          {error}
        </p>
      )}
    </div>
  );
});

Toggle.displayName = 'Toggle';
export default Toggle;
