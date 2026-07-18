import React from 'react';

export const NotificationBadge = ({
  count = 0,
  max = 99,
  className = '',
  ...props
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold border border-card shadow-sm select-none ${className}`}
      {...props}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
