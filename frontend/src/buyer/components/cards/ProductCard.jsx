import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, ShieldCheck, Leaf, Eye, Phone, Star } from 'lucide-react';

export const ProductCard = ({
  product,
  isWishlisted = false,
  onWishlistToggle,
  onViewDetails,
  onContactFarmer
}) => {
  const {
    id,
    name,
    farmerName,
    location,
    availableQuantity,
    price,
    priceUnit = '/ Quintal',
    qualityGrade,
    isOrganic,
    isVerified = true,
    rating = 4.8,
    image,
    description
  } = product;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between group transition-all"
    >
      {/* Crop Image & Badges */}
      <div className="relative h-48 w-full bg-surface overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isOrganic && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
              <Leaf className="w-3 h-3" />
              <span>Organic</span>
            </span>
          )}
          {qualityGrade && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-extrabold rounded-lg shadow-sm">
              <span>Grade {qualityGrade}</span>
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={() => onWishlistToggle && onWishlistToggle(product)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-background/60 hover:bg-background text-text/80 hover:text-rose-400'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Location & Rating overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm truncate max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{location}</span>
          </span>
          <span className="flex items-center gap-1 font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{rating}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-text font-display leading-snug truncate">{name}</h3>
            {isVerified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs text-text/50 mt-1 font-medium">
            Sold by <span className="text-text font-semibold">{farmerName}</span>
          </p>

          {description && (
            <p className="text-xs text-text/60 line-clamp-2 mt-2 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Quantity & Price Row */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-text/40 block">Available Qty</span>
            <span className="text-xs font-bold text-text">{availableQuantity}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-text/40 block">Est. Market Price</span>
            <span className="text-base font-extrabold text-indigo-400 font-display">
              ₹{price?.toLocaleString()}{' '}
              <span className="text-[10px] font-normal text-text/50">{priceUnit}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails && onViewDetails(product)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface hover:bg-border border border-border text-text text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-text/70" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onContactFarmer && onContactFarmer(product)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
