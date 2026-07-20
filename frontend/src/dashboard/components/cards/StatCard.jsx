import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Clean inline CountUp component
export const AnimatedCounter = ({ value, duration = 1200, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value); // Fallback for strings
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp = null;
          
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuad curve
            const easeProgress = progress * (2 - progress);
            const currentVal = Math.floor(easeProgress * end);
            setCount(currentVal);
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={elementRef} className="font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatCard = ({
  title,
  value,
  icon,
  gradientClass = 'from-emerald-500/10 to-green-500/5',
  borderHoverClass = 'hover:border-primary/30',
  iconColorClass = 'text-primary border-primary/20 bg-primary/10',
  prefix = '',
  suffix = '',
  description = ''
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative bg-card border border-border rounded-2xl p-5 overflow-hidden transition-all duration-300 shadow-premium hover:shadow-glass-lg ${borderHoverClass}`}
    >
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-40 pointer-events-none -z-10`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1 pr-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-text/40">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight font-display text-text leading-none mt-1">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </h3>
          {description && (
            <p className="text-[11px] text-text/50 font-medium">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className={`p-3 rounded-xl border shrink-0 flex items-center justify-center ${iconColorClass}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
