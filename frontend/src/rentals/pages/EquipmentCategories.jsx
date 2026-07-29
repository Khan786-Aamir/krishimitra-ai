import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Layers, Shield, Droplet, Wind, Hammer, Sun, Sparkles, HelpCircle } from 'lucide-react';
import { PageContainer } from '../../components/ui';

export const EquipmentCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Tractors',
      description: 'Heavy duty, utility, and garden tractors from top brands like John Deere and Mahindra.',
      count: '12 available',
      icon: <Tractor className="w-8 h-8 text-emerald-400" />,
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20'
    },
    {
      name: 'Harvesters',
      description: 'Combine, crop, and grain harvesters to speed up the harvesting processes.',
      count: '8 available',
      icon: <Layers className="w-8 h-8 text-indigo-400" />,
      bg: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-500/20'
    },
    {
      name: 'Tillers & Cultivators',
      description: 'Power rotavators, tillers, plows, and soil preparation equipment.',
      count: '14 available',
      icon: <Wind className="w-8 h-8 text-amber-400" />,
      bg: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/20'
    },
    {
      name: 'Seeders & Planters',
      description: 'Precision seed drills, pneumatic planter couplers, and sowing drill rows.',
      count: '6 available',
      icon: <Sun className="w-8 h-8 text-yellow-400" />,
      bg: 'from-yellow-500/10 to-yellow-500/5',
      border: 'border-yellow-500/20'
    },
    {
      name: 'Irrigation Equipment',
      description: 'Drip pipes, sprinkler systems, water pumps, and hose reels.',
      count: '9 available',
      icon: <Droplet className="w-8 h-8 text-blue-400" />,
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20'
    },
    {
      name: 'Sprayers',
      description: 'High-pressure misting kits, tractor-coupled chemical tank sprayers.',
      count: '5 available',
      icon: <Sparkles className="w-8 h-8 text-rose-400" />,
      bg: 'from-rose-500/10 to-rose-500/5',
      border: 'border-rose-500/20'
    },
    {
      name: 'Hand Tools',
      description: 'Manual seeders, grass cutters, pruners, and basic mechanical farming tools.',
      count: '11 available',
      icon: <Hammer className="w-8 h-8 text-teal-400" />,
      bg: 'from-teal-500/10 to-teal-500/5',
      border: 'border-teal-500/20'
    },
    {
      name: 'Other',
      description: 'Miscellanous equipment like solar dryers, fencing tools, and trailer couplings.',
      count: '4 available',
      icon: <HelpCircle className="w-8 h-8 text-gray-400" />,
      bg: 'from-gray-500/10 to-gray-500/5',
      border: 'border-gray-500/20'
    }
  ];

  const handleSelectCategory = (name) => {
    navigate(`/rentals/browse?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Machinery Categories</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Select a category to view listings and filter heavy machinery options.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((c, i) => (
          <div
            key={i}
            onClick={() => handleSelectCategory(c.name)}
            className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 hover:shadow-premium hover:scale-[1.02] cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 group`}
          >
            <div className="space-y-3">
              <div className="p-3 bg-surface border border-border w-fit rounded-xl group-hover:bg-primary/5 transition-colors">
                {c.icon}
              </div>
              <h3 className="font-extrabold text-sm text-white group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-[11px] text-gray-400 font-semibold line-clamp-2 leading-relaxed">{c.description}</p>
            </div>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-4">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
