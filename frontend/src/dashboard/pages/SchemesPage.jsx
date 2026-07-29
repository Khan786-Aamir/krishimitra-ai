import React from 'react';
import { motion } from 'framer-motion';
import { Award, Landmark, FileText } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export const SchemesPage = () => {
  const features = [
    'Central schemes',
    'State schemes',
    'Eligibility checker',
    'Apply online',
    'AI recommendations'
  ];

  const illustration = (
    <div className="relative w-64 h-64 bg-card/40 border border-border/60 rounded-3xl flex items-center justify-center shadow-glass overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none" />

      {/* Floating Building */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center p-8 bg-surface/50 border border-border/50 rounded-2xl shadow-premium z-10"
      >
        <Landmark className="w-24 h-24 text-emerald-400 animate-pulse" />
      </motion.div>

      {/* Floating Badges */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-10 right-10 bg-indigo-500/10 border border-indigo-500/30 p-2.5 rounded-xl z-20 text-indigo-400"
      >
        <Award className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="absolute bottom-10 left-10 bg-emerald-500/10 border border-primary/30 p-2.5 rounded-xl z-20 text-primary"
      >
        <FileText className="w-6 h-6" />
      </motion.div>
    </div>
  );

  return (
    <ComingSoon
      title="Government Schemes"
      subtitle="We're compiling state and central subsidy archives. This helper will offer eligibility checker questionnaires and one-click application forms."
      icon={Landmark}
      features={features}
      illustration={illustration}
    />
  );
};

export default SchemesPage;
