import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../buttons/Button';

export const EmptyState = ({
  icon,
  title = 'No data available',
  description = 'There are no items matching this criteria. Try checking back later.',
  actionText,
  onAction,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-custom border border-dashed border-border bg-card/10 max-w-md mx-auto ${className}`}
      {...props}
    >
      <div className="p-4 rounded-full bg-surface border border-border text-text/30 mb-4 shrink-0 animate-pulse">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-bold text-text font-display mb-1">{title}</h3>
      <p className="text-sm text-text/50 leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
