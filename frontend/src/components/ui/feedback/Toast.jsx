import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success',
  onClose,
  className = '',
  ...props
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-primary shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const borders = {
    success: 'border-primary/20 text-text/90',
    error: 'border-red-500/20 text-text/90',
    info: 'border-sky-500/20 text-text/90',
    warning: 'border-amber-500/20 text-text/90',
  };

  return (
    <div
      className={`flex items-start justify-between p-4.5 border rounded-custom shadow-2xl animate-slide-in bg-card/95 backdrop-blur-md ${
        borders[type] || borders.success
      } ${className}`}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icons[type] || icons.success}
        <span className="text-sm font-semibold leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-0.5 text-text/30 hover:text-text rounded-lg hover:bg-surface/50 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
