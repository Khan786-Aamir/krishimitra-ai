import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = forwardRef(({
  className = '',
  onClear,
  value,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
        <Search className="h-4 w-4 shrink-0" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        className={`w-full bg-background border border-border rounded-custom text-text placeholder-text/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm pl-10 pr-10 py-2.5 ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text/40 hover:text-text focus:outline-none transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;
