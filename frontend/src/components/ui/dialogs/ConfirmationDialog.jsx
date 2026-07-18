import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../buttons/Button';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  ...props
}) => {
  const icons = {
    danger: <AlertTriangle className="w-10 h-10 text-red-500" />,
    warning: <AlertTriangle className="w-10 h-10 text-amber-500" />,
    info: <Info className="w-10 h-10 text-sky-500" />,
    success: <CheckCircle className="w-10 h-10 text-primary" />,
  };

  const confirmVariants = {
    danger: 'danger',
    warning: 'secondary',
    info: 'primary',
    success: 'primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={null} {...props}>
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3 bg-surface border border-border rounded-2xl mb-4 shrink-0 shadow-sm animate-pulse">
          {icons[variant] || icons.danger}
        </div>
        
        <h3 className="text-lg font-bold font-display text-text mb-2">{title}</h3>
        
        <p className="text-sm text-text/50 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 font-semibold"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariants[variant] || 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
