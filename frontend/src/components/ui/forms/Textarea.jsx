import React, { forwardRef } from 'react';

export const Textarea = forwardRef(({
  label,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text/60 mb-2 select-none">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className={`w-full bg-background border rounded-custom text-text placeholder-text/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm px-4 py-3 ${
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
