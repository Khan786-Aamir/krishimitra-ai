import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart2, TrendingUp } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export const AnalyticsPage = () => {
  const features = [
    'Crop Reports',
    'Revenue Analytics',
    'Equipment Usage',
    'Marketplace Insights',
    'Export Reports'
  ];

  const illustration = (
    <div className="relative w-64 h-64 bg-card/40 border border-border/60 rounded-3xl flex items-center justify-center shadow-glass overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none" />

      {/* Main Chart Icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center justify-center p-8 bg-surface/50 border border-border/50 rounded-2xl shadow-premium z-10"
      >
        <LineChart className="w-24 h-24 text-emerald-400 animate-pulse" />
      </motion.div>

      {/* Floating Indicators */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-10 right-10 bg-indigo-500/10 border border-indigo-500/30 p-2.5 rounded-xl z-20 text-indigo-400"
      >
        <TrendingUp className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="absolute bottom-10 left-10 bg-emerald-500/10 border border-primary/30 p-2.5 rounded-xl z-20 text-primary"
      >
        <BarChart2 className="w-6 h-6" />
      </motion.div>
    </div>
  );

  return (
    <ComingSoon
      title="Analytics & Reports"
      subtitle="We're implementing precision telemetry chart builders. This console will generate dynamic yield estimates, equipment utilization records, and direct PDF downloads."
      icon={BarChart2}
      features={features}
      illustration={illustration}
    />
  );
};

export default AnalyticsPage;
