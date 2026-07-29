import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Leaf, ShoppingBag, Grape, Layers, 
  Flame, Flower2, HeartHandshake, ChevronRight 
} from 'lucide-react';

export const BrowseCategories = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Cereals', desc: 'Wheat, Rice, Corn, Barley, Oats, Millets', icon: <ShoppingBag className="w-6 h-6 text-amber-400" />, bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20' },
    { name: 'Vegetables', desc: 'Nashik Red Onions, Potatoes, Tomatoes, Cauli', icon: <Sprout className="w-6 h-6 text-emerald-400" />, bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20' },
    { name: 'Fruits', desc: 'Nagpur Oranges, Alphonso Mangoes, Apples, Bananas', icon: <Grape className="w-6 h-6 text-rose-400" />, bg: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20' },
    { name: 'Pulses', desc: 'Desi brown Chickpeas, Red Lentils, Green Gram', icon: <Layers className="w-6 h-6 text-orange-400" />, bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20' },
    { name: 'Oil Seeds', desc: 'Mustard Seeds, Groundnut, Soybean, Sunflower', icon: <Sprout className="w-6 h-6 text-yellow-400" />, bg: 'from-yellow-500/10 to-yellow-600/5', border: 'border-yellow-500/20' },
    { name: 'Spices', desc: 'Curcumin Turmeric, Red Chilli, Cardamom, Clove', icon: <Flame className="w-6 h-6 text-red-400" />, bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20' },
    { name: 'Flowers', desc: 'Rose, Marigold, Jasmine, Chrysanthemum, Lily', icon: <Flower2 className="w-6 h-6 text-purple-400" />, bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20' },
    { name: 'Organic Produce', desc: 'Certified chemical-free bio products', icon: <Leaf className="w-6 h-6 text-teal-400" />, bg: 'from-teal-500/10 to-teal-600/5', border: 'border-teal-500/20' }
  ];

  const handleCategoryClick = (name) => {
    navigate(`/marketplace/browse?category=${encodeURIComponent(name)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight">
          Browse Crop Classifications
        </h1>
        <p className="text-gray-400 text-xs mt-1">Select an agricultural division to browse bulk harvest listings.</p>
      </div>

      {/* Grid of Categories */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            onClick={() => handleCategoryClick(cat.name)}
            className={`bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-card border border-border/80 flex items-center justify-center shadow-md">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">
                  {cat.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-primary font-bold hover:underline self-start pt-2">
              <span>Explore division</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrowseCategories;
