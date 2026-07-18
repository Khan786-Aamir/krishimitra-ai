import React, { useState } from 'react';

export const Avatar = ({
  src,
  name = '',
  initials,
  status = null, // 'online' | 'offline' | null
  isVerified = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: { container: 'w-8 h-8 text-xs', status: 'w-2 h-2 border-[1.5px]', verified: 'w-3 h-3' },
    md: { container: 'w-10 h-10 text-sm font-semibold', status: 'w-2.5 h-2.5 border-2', verified: 'w-4 h-4' },
    lg: { container: 'w-14 h-14 text-lg font-bold', status: 'w-3.5 h-3.5 border-2', verified: 'w-5 h-5' },
    xl: { container: 'w-20 h-20 text-2xl font-extrabold', status: 'w-4.5 h-4.5 border-[2.5px]', verified: 'w-6 h-6' },
  };

  const currentSize = sizes[size] || sizes.md;

  const getInitials = () => {
    if (initials) return initials;
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const statusColors = {
    online: 'bg-emerald-500 border-card',
    offline: 'bg-gray-500 border-card',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`} {...props}>
      <div className={`rounded-full overflow-hidden flex items-center justify-center bg-surface border border-border text-text/90 ${currentSize.container}`}>
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>

      {/* Online/Offline Status Indicator */}
      {status && statusColors[status] && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusColors[status]} ${currentSize.status} shadow-sm`}
          aria-label={`Status: ${status}`}
        />
      )}

      {/* Verified Badge */}
      {isVerified && (
        <span
          className={`absolute -top-0.5 -right-0.5 rounded-full bg-primary text-white flex items-center justify-center ${currentSize.verified} border border-card shadow-md`}
          title="Verified User"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="w-3/5 h-3/5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
};
