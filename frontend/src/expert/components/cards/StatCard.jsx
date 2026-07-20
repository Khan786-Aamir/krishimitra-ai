import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'emerald',
  onClick
}) => {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' }
  };

  const scheme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-card border border-border/80 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group ${
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

      {subtitle && (
        <div className="text-xs pt-1 border-t border-border/40 text-text/50 truncate">
          {subtitle}
        </div>
      )}

      <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${scheme.bg} rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity`} />
    </motion.div>
  );
};

export default StatCard;
