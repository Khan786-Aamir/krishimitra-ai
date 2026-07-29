import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Award, TrendingUp, Sparkles, MapPin, 
  Star, ChevronRight, Eye, Phone, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import { Button, Badge } from '../../components/ui';

export const MarketplaceHome = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [listingsData, insightsData] = await Promise.all([
          marketplaceService.getListings(),
          marketplaceService.getMarketInsights()
        ]);
        setListings(listingsData || []);
        setInsights(insightsData);
      } catch (err) {
        console.error('Error loading marketplace home:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Filter listings into homepage categories
  const featuredListings = listings.filter(l => l.isOrganic).slice(0, 3);
  const recentlyAdded = [...listings].sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate)).slice(0, 3);
  const highestRated = [...listings].sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
  const nearbyListings = listings.slice(1, 4); // Simulated nearby
  const popularFarmers = [
    { name: 'Gurpreet Singh', location: 'Karnal, Haryana', experience: '12 Yrs Exp', rating: 4.9, image: 'https://images.unsplash.com/photo-1542462867-c385ff2175bd?auto=format&fit=crop&q=80&w=150' },
    { name: 'Karthik Raja', location: 'Salem, Tamil Nadu', experience: '8 Yrs Exp', rating: 4.8, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Ramesh Patel', location: 'Nashik, Maharashtra', experience: '15 Yrs Exp', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' }
  ];

  const handleViewProduct = (id) => {
    // Navigate to product details
    navigate(`/marketplace/listings/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants} 
      className="space-y-8"
    >
      {/* Premium Hero section */}
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-dark/85 to-indigo-900/80 border border-primary/20 p-6 sm:p-10 text-white shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-extrabold text-[9px] px-3 py-1">
            Certified B2B Agriculture Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black font-display leading-tight tracking-tight">
            Direct Farm Procurement <br />
            <span className="text-primary">Without Middlemen</span>
          </h1>
          <p className="text-xs sm:text-sm text-text/70 leading-relaxed font-medium">
            Procure accredited organic cereals, Nashik quality red onions, high curcumin turmeric, and fresh seasonal harvests directly from verified regional producers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => navigate('/marketplace/browse')} className="flex items-center gap-1.5 font-bold shadow-lg shadow-primary/20 text-xs py-3 px-5 rounded-xl">
              <span>Explore Crop Batches</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/marketplace/categories')} variant="outline" className="border-border hover:bg-white/5 text-xs py-3 px-5 rounded-xl">
              Browse Categories
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Market Highlights ticker */}
      {insights && (
        <motion.div 
          variants={itemVariants} 
          className="bg-card/40 border border-border/80 rounded-2xl p-4 overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-card to-transparent w-10 z-10" />
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-card to-transparent w-10 z-10" />
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-primary shrink-0 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Live Mandi Ticker:
            </span>
            <div className="flex gap-8 animate-marquee whitespace-nowrap overflow-x-auto scrollbar-none py-1">
              {insights.trendingCrops.map((c, i) => (
                <div key={i} className="inline-flex items-center gap-2">
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="text-gray-400 font-semibold">{c.rate}</span>
                  <span className="text-emerald-400 font-black text-[10px]">{c.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Featured Listings (Organic crops) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">Featured Organic Batches</h2>
          </div>
          <Link to="/marketplace/browse?organic=true" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-60 bg-card/60 animate-pulse rounded-2xl" />
            ))
          ) : featuredListings.map(listing => (
            <ProductPreviewCard key={listing.id} product={listing} onView={handleViewProduct} />
          ))}
        </div>
      </motion.div>

      {/* Middle row: Trending Crops & Recently Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recently Added */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Recently Harvested Batches</h2>
            <Link to="/marketplace/browse?sort=Newest" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>Browse All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-card/60 animate-pulse rounded-xl" />
              ))
            ) : recentlyAdded.map(listing => (
              <ProductRowCard key={listing.id} product={listing} onView={handleViewProduct} />
            ))}
          </div>
        </motion.div>

        {/* Highest Rated */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Highest Rated Batches</h2>
            <Link to="/marketplace/browse?sort=Most+Popular" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-card/60 animate-pulse rounded-xl" />
              ))
            ) : highestRated.map(listing => (
              <ProductRowCard key={listing.id} product={listing} onView={handleViewProduct} />
            ))}
          </div>
        </motion.div>

      </div>

      {/* Nearby Crop Batches */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Regional Nearby Crop Batches
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-60 bg-card/60 animate-pulse rounded-2xl" />
            ))
          ) : nearbyListings.map(listing => (
            <ProductPreviewCard key={listing.id} product={listing} onView={handleViewProduct} />
          ))}
        </div>
      </motion.div>

      {/* Popular Farmers Carousel / List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Verified Accredited Producers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {popularFarmers.map((f, i) => (
            <div key={i} className="bg-card border border-border/80 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border">
                <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="min-w-0 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-1">
                  <span>{f.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10 shrink-0" />
                </h4>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{f.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">{f.experience}</span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{f.rating}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

// Sub-Component: ProductPreviewCard
const ProductPreviewCard = ({ product, onView }) => {
  const { id, _id, name, price, unit, location, averageRating, images, isOrganic, qualityGrade, availableQuantity } = product;
  const image = images && images.length > 0 ? images[0].url : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300';
  
  return (
    <div className="bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group">
      <div className="relative h-40 bg-surface overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        
        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex gap-1 z-10 text-[9px] font-bold">
          {isOrganic && (
            <span className="bg-emerald-500/90 text-white px-2 py-0.5 rounded-md">Organic</span>
          )}
          {qualityGrade && (
            <span className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-md">Grade {qualityGrade}</span>
          )}
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm text-[10px] font-bold text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          <span>{averageRating}</span>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
        <div>
          <h4 className="font-extrabold text-white line-clamp-1 group-hover:text-primary transition-colors">{name}</h4>
          <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-indigo-400" />
            {location}
          </span>
        </div>

        <div className="pt-2.5 border-t border-border/50 flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">Mandi Rate</span>
            <span className="font-extrabold text-primary text-sm">₹{price} <span className="text-[10px] text-gray-500 font-normal">{unit}</span></span>
          </div>
          <Button
            size="sm"
            onClick={() => onView(id || _id)}
            className="rounded-xl px-3 py-1 bg-surface hover:bg-border text-text font-bold flex items-center gap-1 border border-border text-[10px]"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Sub-Component: ProductRowCard
const ProductRowCard = ({ product, onView }) => {
  const { id, _id, name, price, unit, location, averageRating, images, availableQuantity } = product;
  const image = images && images.length > 0 ? images[0].url : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=150';
  
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-3 flex items-center gap-4 hover:border-border/100 hover:shadow-md transition-all group">
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-surface">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0 text-xs flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-white truncate max-w-[200px]">{name}</h4>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Qty: {availableQuantity} {unit}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{averageRating}</span>
            </span>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <span className="block font-black text-primary text-xs">₹{price}</span>
          <Button
            size="sm"
            onClick={() => onView(id || _id)}
            className="rounded-lg p-1 px-2.5 mt-1 bg-surface hover:bg-border border border-border text-[10px] font-bold text-gray-400 hover:text-white"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHome;
