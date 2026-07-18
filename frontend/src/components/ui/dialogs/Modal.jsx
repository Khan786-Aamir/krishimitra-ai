import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../buttons/Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  ...props
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-card border border-border w-full rounded-custom shadow-glass-lg flex flex-col max-h-[90vh] overflow-hidden animate-scale-in ${currentSize} ${className}`}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-border shrink-0">
          {title ? (
            <h3 className="text-lg font-bold font-display text-text truncate">{title}</h3>
          ) : (
            <div />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 text-text/40 hover:text-text rounded-lg hover:bg-surface/50 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-sm text-text/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
