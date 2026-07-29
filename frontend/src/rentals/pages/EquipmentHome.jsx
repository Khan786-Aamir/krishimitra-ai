import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Tractor,
  Sparkles,
  TrendingUp,
  Award,
  MapPin,
  Star,
  ChevronRight,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import equipmentService from '../../services/equipmentService';
import { Button, Badge } from '../../components/ui';

export const EquipmentHome = () => {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getEquipmentList();
        setEquipmentList(data || []);
      } catch (err) {
        console.error('Error loading equipment home:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Filter listings based on requirements
  const featuredEquipment = equipmentList.slice(0, 3); // Featured listings
  const trendingEquipment = [...equipmentList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3); // Sorted by views
  const mostBooked = [...equipmentList].sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)).slice(0, 3); // Sorted by bookingCount
  const topRated = [...equipmentList].sort((a, b) => b.rating - a.rating).slice(0, 3); // Sorted by rating
  const nearbyEquipment = equipmentList.slice(1, 4); // Simulated nearby matching

  const handleViewEquipment = (id) => {
    navigate(`/rentals/listings/${id}`);
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

  const categories = [
    { name: 'Tractors', count: 12, icon: <Tractor className="w-5 h-5 text-emerald-400" /> },
    { name: 'Harvesters', count: 8, icon: <Layers className="w-5 h-5 text-indigo-400" /> },
    { name: 'Tillers & Cultivators', count: 14, icon: <TrendingUp className="w-5 h-5 text-amber-400" /> },
    { name: 'Irrigation Equipment', count: 9, icon: <Award className="w-5 h-5 text-blue-400" /> }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Premium Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/85 to-indigo-950/85 border border-primary/20 p-6 sm:p-10 text-white shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent)] pointer-events-none" />
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-extrabold text-[9px] px-3 py-1">
            Peer-to-Peer Agricultural Leasing
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black font-display leading-tight tracking-tight">
            Rent Heavy Machinery <br />
            <span className="text-primary">Directly From Nearby Farmers</span>
          </h1>
          <p className="text-xs sm:text-sm text-text/70 leading-relaxed font-medium">
            Lease tractors, combined harvesters, precision seed drills, and high-pressure chemical sprayers. No hidden margins, clear contracts, and verified local machinery owners.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => navigate('/rentals/browse')} className="flex items-center gap-1.5 font-bold shadow-lg shadow-primary/20 text-xs py-3 px-5 rounded-xl">
              <span>Find Available Fleet</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/rentals/categories')} variant="outline" className="border-border hover:bg-white/5 text-xs py-3 px-5 rounded-xl">
              Browse Categories
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Statistics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Lending Fleet</span>
          <span className="block text-2xl font-black text-white mt-1">45+ Machines</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Bookings</span>
          <span className="block text-2xl font-black text-primary mt-1">1,280 Days</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Avg rating</span>
          <span className="block text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">4.92 ★</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Trusted Owners</span>
          <span className="block text-2xl font-black text-white mt-1">32 Farmers</span>
        </div>
      </motion.div>

      {/* Popular Categories Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white">Popular Rental Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <div
              key={i}
              onClick={() => navigate(`/rentals/browse?category=${encodeURIComponent(c.name)}`)}
              className="bg-card border border-border/80 rounded-2xl p-5 hover:border-primary/40 hover:shadow-premium transition-all duration-300 cursor-pointer flex items-center gap-4 group"
            >
              <div className="p-3 bg-surface border border-border rounded-xl group-hover:bg-primary/10 transition-colors">
                {c.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-primary transition-colors">{c.name}</h4>
                <span className="text-[10px] text-gray-500 font-semibold">{c.count} Listings</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 1. Featured Equipment Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">Featured Equipment</h2>
          </div>
          <Link to="/rentals/browse" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-card/60 animate-pulse rounded-2xl" />
            ))
          ) : featuredEquipment.map(item => (
            <EquipmentPreviewCard key={item.id} equipment={item} onView={handleViewEquipment} />
          ))}
        </div>
      </motion.div>

      {/* 2. Trending Equipment & 3. Most Booked Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trending Equipment */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-indigo-400" />
              Trending Machinery (Popular)
            </h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-card/60 animate-pulse rounded-xl" />
              ))
            ) : trendingEquipment.map(item => (
              <EquipmentRowCard key={item.id} equipment={item} onView={handleViewEquipment} />
            ))}
          </div>
        </motion.div>

        {/* Most Booked */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Most Booked Machinery
            </h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-card/60 animate-pulse rounded-xl" />
              ))
            ) : mostBooked.map(item => (
              <EquipmentRowCard key={item.id} equipment={item} onView={handleViewEquipment} />
            ))}
          </div>
        </motion.div>

      </div>

      {/* 4. Top Rated Equipment */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-1.5">
            <Award className="w-5 h-5 text-amber-400" />
            Top Rated Machinery
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-card/60 animate-pulse rounded-2xl" />
            ))
          ) : topRated.map(item => (
            <EquipmentPreviewCard key={item.id} equipment={item} onView={handleViewEquipment} />
          ))}
        </div>
      </motion.div>

      {/* 5. Nearby Equipment */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Machinery Nearby Your Farm
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-card/60 animate-pulse rounded-2xl" />
            ))
          ) : nearbyEquipment.map(item => (
            <EquipmentPreviewCard key={item.id} equipment={item} onView={handleViewEquipment} />
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

// Sub-Component: EquipmentPreviewCard
export const EquipmentPreviewCard = ({ equipment, onView }) => {
  const { id, _id, equipmentName, rentalPricePerDay, location, rating, images, condition, category, availabilityStatus } = equipment;
  const image = images && images.length > 0 ? images[0].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=300';

  const badgeColors = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Booked: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Maintenance: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Unavailable: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all flex flex-col justify-between group">
      <div className="relative h-40 bg-surface overflow-hidden">
        <img src={image} alt={equipmentName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10 text-[9px] font-bold">
          <span className="bg-indigo-500/90 text-white px-2 py-0.5 rounded-md">{category}</span>
          <span className="bg-surface/90 text-gray-300 px-2 py-0.5 border border-border/65 rounded-md">{condition}</span>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md ${badgeColors[availabilityStatus] || badgeColors.Available}`}>
            {availabilityStatus}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm text-[10px] font-bold text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
        <div>
          <h4 className="font-extrabold text-white line-clamp-1 group-hover:text-primary transition-colors">{equipmentName}</h4>
          <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-indigo-400" />
            {location}
          </span>
        </div>

        <div className="pt-2.5 border-t border-border/50 flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-gray-500 block">Rental Rate</span>
            <span className="font-extrabold text-primary text-sm">₹{rentalPricePerDay?.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">/ day</span></span>
          </div>
          <Button
            size="sm"
            onClick={() => onView(id || _id)}
            className="rounded-xl px-3 py-1 bg-surface hover:bg-border text-text font-bold flex items-center gap-1 border border-border text-[10px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Sub-Component: EquipmentRowCard
export const EquipmentRowCard = ({ equipment, onView }) => {
  const { id, _id, equipmentName, rentalPricePerDay, rating, images, bookingCount, views } = equipment;
  const image = images && images.length > 0 ? images[0].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=150';

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-3 flex items-center gap-4 hover:border-border/100 hover:shadow-md transition-all group">
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-surface">
        <img src={image} alt={equipmentName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0 text-xs flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-white truncate max-w-[200px]">{equipmentName}</h4>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Booked {bookingCount || 0} times | {views || 0} views</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{rating}</span>
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="block font-black text-primary text-xs">₹{rentalPricePerDay?.toLocaleString()}/day</span>
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
