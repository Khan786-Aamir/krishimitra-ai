import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendText,
  colorScheme = 'indigo',
  onClick
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/5'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/5'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/5'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/5'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/5'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/5'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.indigo;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-card border border-border/80 shadow-lg ${scheme.glow} flex flex-col justify-between space-y-4 relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text/50">{title}</p>
          <h3 className="text-2xl font-extrabold text-text mt-1 font-display tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${scheme.bg} ${scheme.border} ${scheme.text} border transition-transform group-hover:scale-110`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
        {subtitle && <span className="text-text/50 truncate">{subtitle}</span>}
        {trendText && (
          <span
            className={`font-bold ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-text/50'
            }`}
          >
            {trendText}
          </span>
        )}
      </div>

      {/* Decorative Blur Backing */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${scheme.bg} rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity`} />
    </motion.div>
  );
};

export default StatCard;
