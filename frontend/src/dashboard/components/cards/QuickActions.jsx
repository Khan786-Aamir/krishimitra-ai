import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, List, Brain, Tractor, Share2, ShoppingBag } from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Add Crop',
      description: 'Register a new crop batch',
      to: '/farmer/crops?action=add',
      icon: <PlusCircle className="w-5 h-5" />,
      colorClass: 'bg-primary/10 text-primary border-primary/20 hover:border-primary/45'
    },
    {
      title: 'View Crops',
      description: 'Track your existing crops list',
      to: '/farmer/crops',
      icon: <List className="w-5 h-5" />,
      colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/45'
    },
    {
      title: 'Diagnose Crop',
      description: 'Run AI pathogen diagnostics',
      to: '/farmer/ai',
      icon: <Brain className="w-5 h-5" />,
      colorClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/45'
    },
    {
      title: 'Rent Equipment',
      description: 'Lease agricultural machinery',
      to: '/farmer/equipment',
      icon: <Tractor className="w-5 h-5" />,
      colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/45'
    },
    {
      title: 'Sell Crop',
      description: 'Post harvest listings to buyers',
      to: '/farmer/marketplace?action=sell',
      icon: <Share2 className="w-5 h-5" />,
      colorClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:border-pink-500/45'
    },
    {
      title: 'Marketplace',
      description: 'Browse trading prices & bids',
      to: '/farmer/marketplace',
      icon: <ShoppingBag className="w-5 h-5" />,
      colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/45'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
      {actions.map((act, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Link
            to={act.to}
            className={`flex flex-col items-start p-4 rounded-2xl border transition-all h-full text-left space-y-2 bg-card cursor-pointer ${act.colorClass}`}
          >
            <div className="p-2 rounded-lg bg-surface border border-border/40 shrink-0">
              {act.icon}
            </div>
            <div>
              <h5 className="font-bold text-sm text-text leading-tight">{act.title}</h5>
              <p className="text-[10px] text-text/50 font-medium mt-1 leading-normal">
                {act.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
