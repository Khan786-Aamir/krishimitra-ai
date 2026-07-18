import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../buttons/Button';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  ...props
}) => {
  const getPagesRange = () => {
    const range = [];
    const delta = 2;
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }
    
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  return (
    <div className={`flex items-center justify-center gap-1.5 select-none ${className}`} {...props}>
      <Button
        variant="outline"
        size="sm"
        className="p-2 rounded-xl"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPagesRange().map((page, index) => {
        if (page === '...') {
          return (
            <span key={index} className="px-3 text-text/30 font-bold tracking-widest">
              ...
            </span>
          );
        }
        
        const isActive = page === currentPage;
        return (
          <Button
            key={index}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            className="w-9 h-9 p-0 rounded-xl"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        className="p-2 rounded-xl"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
