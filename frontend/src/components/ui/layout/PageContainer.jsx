import React from 'react';

export const PageContainer = ({
  className = '',
  children,
  size = 'lg',
  ...props
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[90rem]',
    full: 'max-w-full',
  };

  const currentSize = sizes[size] || sizes.lg;

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentSize} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
