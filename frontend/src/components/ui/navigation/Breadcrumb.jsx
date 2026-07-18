import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({
  items = [],
  className = '',
  ...props
}) => {
  return (
    <nav className={`flex text-xs font-semibold text-text/40 select-none ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-text/20 shrink-0" />}
              {isLast ? (
                <span className="text-text/80 tracking-wide truncate">{item.label}</span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-text transition-colors flex items-center"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
