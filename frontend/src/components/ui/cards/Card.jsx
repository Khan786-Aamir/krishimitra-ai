import React from 'react';

// Base Card
export const Card = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-card border border-border rounded-custom p-6 transition-all duration-300 hover:shadow-premium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Feature Card
export const FeatureCard = ({
  icon,
  title,
  description,
  className = '',
  actionText,
  onAction,
  ...props
}) => {
  return (
    <Card
      className={`flex flex-col items-start gap-4 hover:border-primary/20 ${className}`}
      {...props}
    >
      {icon && (
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-bold font-display text-text mb-2">{title}</h3>
        <p className="text-text/70 text-sm leading-relaxed">{description}</p>
      </div>
      {actionText && (
        <button
          onClick={onAction}
          className="mt-auto text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 focus:outline-none"
        >
          <span>{actionText}</span>
          <span>&rarr;</span>
        </button>
      )}
    </Card>
  );
};

// Profile Card
export const ProfileCard = ({
  avatar,
  name,
  role,
  bio,
  details = [],
  className = '',
  actions,
  ...props
}) => {
  return (
    <Card className={`flex flex-col items-center text-center gap-4 ${className}`} {...props}>
      {avatar}
      <div>
        <h3 className="text-lg font-bold font-display text-text">{name}</h3>
        <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1">{role}</p>
      </div>
      {bio && <p className="text-text/60 text-sm leading-relaxed">{bio}</p>}
      {details.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
          {details.map((item, idx) => (
            <div key={idx} className="text-left">
              <span className="block text-[10px] uppercase font-bold text-text/40 tracking-wider">{item.label}</span>
              <span className="block text-sm font-bold text-text mt-0.5">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="w-full flex items-center justify-center gap-3 mt-4">{actions}</div>}
    </Card>
  );
};

// Statistic Card
export const StatisticCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  className = '',
  description,
  ...props
}) => {
  return (
    <Card className={`flex items-start justify-between gap-4 ${className}`} {...props}>
      <div className="space-y-2">
        <span className="block text-xs font-bold uppercase tracking-wider text-text/40">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-display text-text">{value}</span>
          {change && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {change}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-text/50">{description}</p>}
      </div>
      {icon && (
        <div className="p-3 rounded-xl bg-surface border border-border text-text/60 shrink-0">
          {icon}
        </div>
      )}
    </Card>
  );
};
