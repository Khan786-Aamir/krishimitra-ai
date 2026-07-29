import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Sun } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export const WeatherPage = () => {
  const features = [
    'Live weather',
    '7-day forecast',
    'Rain alerts',
    'Temperature',
    'Wind speed',
    'Irrigation recommendations'
  ];

  const illustration = (
    <div className="relative w-64 h-64 bg-card/40 border border-border/60 rounded-3xl flex items-center justify-center shadow-glass overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-primary/5 pointer-events-none" />

      {/* Floating Sun */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="absolute top-10 left-10 text-amber-400 z-10"
      >
        <Sun className="w-16 h-16" />
      </motion.div>

      {/* Floating Cloud */}
      <motion.div
        animate={{ x: [-8, 8, -8], y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 right-10 text-gray-300 z-20 flex flex-col items-center bg-surface/40 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-premium"
      >
        <CloudSun className="w-20 h-20 text-primary animate-pulse" />
      </motion.div>

      {/* Rain Droplets */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-3.5 bg-sky-400 rounded-full"
          style={{
            bottom: '15%',
            left: `${35 + i * 12}%`,
          }}
          animate={{
            y: [0, 20, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );

  return (
    <ComingSoon
      title="Weather Intelligence"
      subtitle="We're integrating hyperlocal agrometeorology weather stations. You will receive temperature indices, rain alerts, and localized irrigation recommendation logs."
      icon={CloudSun}
      features={features}
      illustration={illustration}
    />
  );
};

export default WeatherPage;
