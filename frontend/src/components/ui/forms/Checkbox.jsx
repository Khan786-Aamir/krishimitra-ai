import React, { forwardRef } from 'react';

export const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 bg-background border border-border peer-checked:border-primary peer-checked:bg-primary rounded-md flex items-center justify-center transition-all duration-200 shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
          <svg
            className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
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

Checkbox.displayName = 'Checkbox';
export default Checkbox;
