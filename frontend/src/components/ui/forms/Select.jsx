import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className = '',
  id,
  placeholder,
  children,
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
        <select
          id={id}
          ref={ref}
          className={`w-full appearance-none bg-background border rounded-custom text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm pl-4 pr-10 py-3 ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-surface text-text/30">
              {placeholder}
            </option>
          )}
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-text">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text/40">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
