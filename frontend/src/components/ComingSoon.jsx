import React from 'react';
import { motion } from 'framer-motion';
import { Check, Bell } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Button } from './ui';
import { useTranslation } from 'react-i18next';

export const ComingSoon = ({ title, subtitle, icon: IconComponent, features, illustration }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const handleNotifyMe = () => {
    showToast(t('comingSoon.developmentToast'), 'success');
  };

  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center p-4">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative w-full max-w-5xl bg-card/20 border border-border/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-glass-lg backdrop-blur-md overflow-hidden z-10">
        
        {/* Floating Particles Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.9, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column: Title, Details, Features, CTA */}
          <div className="space-y-6 text-left">
            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
            >
              <span>🚀 {t('comingSoon.comingBadge')}</span>
            </motion.div>

            {/* Title Section */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white flex items-center gap-3.5"
              >
                {IconComponent && <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />}
                <span>{t('comingSoon.title')}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-text-muted text-sm sm:text-base leading-relaxed font-semibold uppercase tracking-wider text-primary/80"
              >
                {title} {t('comingSoon.page')}
              </motion.p>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-text-muted text-xs sm:text-sm leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Feature Checklist Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-background/30 border border-border/40 p-5 rounded-2xl"
            >
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-text/80">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Notify Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button
                  onClick={handleNotifyMe}
                  variant="primary"
                  size="lg"
                  className="shadow-glow-primary shadow-md hover:shadow-glow-primary/40 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>{t('comingSoon.notifyMe')}</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Custom Animated CSS Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full flex items-center justify-center min-h-[260px] relative"
          >
            {illustration}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;
