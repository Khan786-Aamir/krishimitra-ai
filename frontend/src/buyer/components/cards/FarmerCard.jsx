import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Star, Award, Sprout, ExternalLink } from 'lucide-react';

export const FarmerCard = ({ farmer, onViewProfile }) => {
  const {
    name,
    location,
    primaryCrops = [],
    rating = 4.8,
    reviewsCount = 30,
    isVerified = true,
    experienceYears = 10,
    avatar,
    farmSize = '20 Acres'
  } = farmer;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-4 group transition-all"
    >
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt={name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-colors"
          />
          {isVerified && (
            <span className="absolute -bottom-1 -right-1 p-1 bg-indigo-500 text-white rounded-full shadow-md" title="Verified Producer">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-base font-bold text-text truncate font-display">{name}</h3>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{rating}</span>
            </span>
          </div>

          <p className="text-xs text-text/50 flex items-center gap-1 mt-1 truncate">
            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <p className="text-[11px] text-text/40 flex items-center gap-1 mt-0.5 font-medium">
            <Award className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{experienceYears} Years Farming Exp. ({farmSize})</span>
          </p>
        </div>
      </div>

      {/* Primary Crops Tags */}
      <div className="pt-2 border-t border-border/60">
        <span className="text-[10px] uppercase font-semibold text-text/40 block mb-1.5">Primary Crops</span>
        <div className="flex flex-wrap gap-1.5">
          {primaryCrops.map((crop, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-border/70 text-text/80 text-[11px] font-semibold rounded-lg"
            >
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>{crop}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onViewProfile && onViewProfile(farmer)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
      >
        <span>View Farmer Profile</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default FarmerCard;
