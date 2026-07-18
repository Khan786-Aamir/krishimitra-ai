import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  variant = 'pills',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      <div className={`flex ${
        variant === 'pills'
          ? 'bg-surface/30 p-1.5 rounded-2xl border border-border w-fit gap-1'
          : 'border-b border-border gap-2'
      }`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'text-text/60 hover:text-text hover:bg-surface/50'
                }`}
              >
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-[1px] focus:outline-none ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text/60 hover:text-text hover:border-text/20'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
