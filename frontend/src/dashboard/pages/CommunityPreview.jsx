import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, HelpCircle } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export const CommunityPreview = () => {
  const features = [
    'Ask Questions',
    'Share Experiences',
    'Expert Answers',
    'Farmer Discussions',
    'Like & Comment'
  ];

  const illustration = (
    <div className="relative w-64 h-64 bg-card/40 border border-border/60 rounded-3xl flex items-center justify-center shadow-glass overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-primary/5 pointer-events-none" />

      {/* Main Forum Bubble Icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center justify-center p-8 bg-surface/50 border border-border/50 rounded-2xl shadow-premium z-10"
      >
        <Users className="w-24 h-24 text-primary animate-pulse" />
      </motion.div>

      {/* Floating Dialog Nodes */}
      <motion.div
        animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 bg-indigo-500/10 border border-indigo-500/30 p-2.5 rounded-xl z-20 text-indigo-400"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ x: [5, -5, 5], y: [5, -5, 5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute bottom-10 left-10 bg-emerald-500/10 border border-primary/30 p-2.5 rounded-xl z-20 text-primary"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.div>
    </div>
  );

  return (
    <ComingSoon
      title="Community Forum"
      subtitle="We're launching a secure farmer peer connection hub. This bulletin will support threads, advisory moderation, and direct expert response reviews."
      icon={MessageSquare}
      features={features}
      illustration={illustration}
    />
  );
};

export default CommunityPreview;
