import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Leaf, Sparkles } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export const AIDiseasePreview = () => {
  const features = [
    'Upload crop images',
    'Instant AI diagnosis',
    'Disease confidence score',
    'Treatment suggestions',
    'Preventive measures',
    'Download report'
  ];

  const illustration = (
    <div className="relative w-64 h-64 bg-card/40 border border-border/60 rounded-3xl flex items-center justify-center shadow-glass overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      
      {/* Laser Scanning Line */}
      <motion.div
        animate={{ y: ['-10%', '240%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_var(--color-primary)] z-10"
      />

      {/* Floating Sparkles */}
      <motion.div
        animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 text-primary z-20"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
      </motion.div>

      {/* Main Leaf */}
      <motion.div
        animate={{ rotate: [-2, 2, -2], y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center justify-center p-8 bg-surface/50 border border-border/50 rounded-2xl shadow-premium z-0"
      >
        <Leaf className="w-24 h-24 text-emerald-400" />
      </motion.div>
    </div>
  );

  return (
    <ComingSoon
      title="AI Crop Disease Detection"
      subtitle="We're building an advanced computer-vision pathology engine for crops. This module will allow you to capture leaf details and receive instant diagnostic formulations."
      icon={Brain}
      features={features}
      illustration={illustration}
    />
  );
};

export default AIDiseasePreview;
