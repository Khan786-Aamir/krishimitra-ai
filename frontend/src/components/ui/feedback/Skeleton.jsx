import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text',
  ...props
}) => {
  const baseClasses = 'bg-surface/60 animate-pulse';
  
  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-custom',
  };

  const currentVariant = variants[variant] || variants.text;

  return (
    <div
      className={`${baseClasses} ${currentVariant} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="border border-border bg-card p-6 rounded-custom space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="w-10 h-10" />
      <div className="space-y-1.5 flex-1">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-5/6" />
    </div>
  </div>
);

export default Skeleton;
