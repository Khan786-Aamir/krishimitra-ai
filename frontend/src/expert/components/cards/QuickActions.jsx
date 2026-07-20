import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, MessageSquare, Calendar, BookOpen, Users, BarChart3 } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Review AI Diagnosis',
      subtitle: 'Inspect & validate crop disease diagnosis',
      icon: Stethoscope,
      to: '/expert/reviews',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Farmer Consultations',
      subtitle: 'Manage active query & advisory requests',
      icon: MessageSquare,
      to: '/expert/consultations',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Appointments Schedule',
      subtitle: 'View calendar & scheduled field sessions',
      icon: Calendar,
      to: '/expert/appointments',
      color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30'
    },
    {
      title: 'Knowledge Hub',
      subtitle: 'Browse pesticide, fertilizer & crop guides',
      icon: BookOpen,
      to: '/expert/knowledge-hub',
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Farmers Directory',
      subtitle: 'Access farmer profiles & disease histories',
      icon: Users,
      to: '/expert/farmers',
      color: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30'
    },
    {
      title: 'Advisory Analytics',
      subtitle: 'Track consultation trends & ratings',
      icon: BarChart3,
      to: '/expert/analytics',
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-text font-display">Expert Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(act.to)}
              className={`p-4 rounded-2xl bg-card border border-border/80 shadow-md hover:shadow-xl bg-gradient-to-br ${act.color} flex items-center gap-4 cursor-pointer transition-all`}
            >
              <div className="p-3 rounded-xl bg-background/60 backdrop-blur-sm shrink-0 border border-border/50">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-text truncate">{act.title}</h4>
                <p className="text-[11px] text-text/50 truncate mt-0.5">{act.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
