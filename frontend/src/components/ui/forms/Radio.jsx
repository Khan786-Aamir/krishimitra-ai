import React, { forwardRef } from 'react';

export const Radio = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <div className="relative flex items-center justify-center">
          <input
            id={id}
            ref={ref}
            type="radio"
            className="sr-only peer"
            {...props}
          />
          <div className="w-5 h-5 bg-background border border-border rounded-full transition-all duration-200 shadow-sm peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30" />
          <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none" />
        </div>
        {label && (
          <span className="ml-3 text-sm text-text/80 font-medium hover:text-text transition-colors">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-semibold pl-8">
          {error}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
export default Radio;
