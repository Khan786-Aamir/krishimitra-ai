import React from 'react';
import { RefreshCw, AlertCircle, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

// Skeleton Loading Component
export const LoadingSkeleton = ({ type = 'cards', count = 3 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-card-dark border border-border-dark rounded-2xl p-4 space-y-4">
            <div className="h-44 bg-surface-dark/60 rounded-xl w-full" />
            <div className="h-5 bg-surface-dark/80 rounded-md w-3/4" />
            <div className="h-4 bg-surface-dark/40 rounded-md w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-surface-dark/60 rounded-md w-1/3" />
              <div className="h-8 bg-primary/20 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-card-dark border border-border-dark rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-surface-dark/60 rounded-md w-1/4 mb-4" />
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-12 bg-surface-dark/30 rounded-xl w-full flex items-center px-4 justify-between">
            <div className="h-4 bg-surface-dark/60 rounded w-1/5" />
            <div className="h-4 bg-surface-dark/60 rounded w-1/6" />
            <div className="h-4 bg-surface-dark/60 rounded w-1/6" />
            <div className="h-4 bg-surface-dark/60 rounded w-1/8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 bg-card-dark border border-border-dark rounded-2xl space-y-4 animate-pulse">
      <div className="h-8 bg-surface-dark/60 rounded-md w-1/3" />
      <div className="h-4 bg-surface-dark/40 rounded-md w-2/3" />
      <div className="h-32 bg-surface-dark/20 rounded-xl w-full" />
    </div>
  );
};

// Empty State View Component
export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Available',
  description = 'There are currently no items to display in this section.',
  actionText,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-card-dark/40 border border-dashed border-border-dark/60 rounded-2xl my-6 space-y-4"
    >
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary">
        <Icon className="w-10 h-10" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-xl font-bold text-white font-display">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

// Error State View Component
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your network connection and try again.',
  onRetry
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-10 text-center bg-red-500/5 border border-red-500/20 rounded-2xl my-6 space-y-4"
    >
      <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-red-300/80 text-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      )}
    </motion.div>
  );
};

export default {
  LoadingSkeleton,
  EmptyState,
  ErrorState
};
