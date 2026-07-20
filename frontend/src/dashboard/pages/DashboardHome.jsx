import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  Heart,
  Cpu,
  IndianRupee,
  Tractor,
  ShoppingCart,
  Calendar,
  CloudLightning,
  AlertCircle
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { weatherService } from '../services/weatherService';
import { schemeService } from '../services/schemeService';

// Import Cards
import StatCard from '../components/cards/StatCard';
import QuickActions from '../components/cards/QuickActions';

// Import Charts
import { CropYieldChart, RevenueTrendChart } from '../components/charts/DashboardCharts';

// Import Widgets
import WeatherWidget from '../components/widgets/WeatherWidget';
import SchemesWidget from '../components/widgets/SchemesWidget';
import AIPreviewWidget from '../components/widgets/AIPreviewWidget';
import MarketplaceWidget from '../components/widgets/MarketplaceWidget';
import RentalWidget from '../components/widgets/RentalWidget';
import CommunityWidget from '../components/widgets/CommunityWidget';

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
};

export const DashboardHome = () => {
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashRes = await dashboardService.getDashboard();
      if (dashRes.success) {
        setData(dashRes.data);
        
        // Fetch weather based on farmer location
        const weatherRes = await weatherService.getWeather(dashRes.data.profile.location);
        if (weatherRes.success) {
          setWeather(weatherRes.data);
        }

        // Fetch schemes
        const schemeRes = await schemeService.getSchemes();
        if (schemeRes.success) {
          setSchemes(schemeRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Loading Skeletons */}
        <div className="h-10 w-1/3 bg-card rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-card rounded-2xl" />
          <div className="h-80 bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCrops: 0,
    healthyCrops: 0,
    aiDiagnoses: 0,
    revenue: 0,
    activeRentals: 0,
    marketplaceOrders: 0
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Overview Stats Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Crops"
          value={stats.totalCrops}
          icon={<Sprout className="w-5 h-5" />}
          gradientClass="from-emerald-500/10 to-green-500/5"
          borderHoverClass="hover:border-primary/30"
          iconColorClass="text-primary border-primary/20 bg-primary/10"
        />
        <StatCard
          title="Healthy Crops"
          value={stats.healthyCrops}
          icon={<Heart className="w-5 h-5" />}
          gradientClass="from-green-500/10 to-emerald-500/5"
          borderHoverClass="hover:border-emerald-500/30"
          iconColorClass="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <StatCard
          title="AI Diagnoses"
          value={stats.aiDiagnoses}
          icon={<Cpu className="w-5 h-5" />}
          gradientClass="from-cyan-500/10 to-blue-500/5"
          borderHoverClass="hover:border-cyan-500/30"
          iconColorClass="text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
        />
        <StatCard
          title="Total Revenue"
          value={stats.revenue}
          prefix="₹"
          icon={<IndianRupee className="w-5 h-5" />}
          gradientClass="from-amber-500/10 to-yellow-500/5"
          borderHoverClass="hover:border-amber-500/30"
          iconColorClass="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={<Tractor className="w-5 h-5" />}
          gradientClass="from-pink-500/10 to-purple-500/5"
          borderHoverClass="hover:border-pink-500/30"
          iconColorClass="text-pink-400 border-pink-500/20 bg-pink-500/10"
        />
        <StatCard
          title="Market Orders"
          value={stats.marketplaceOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          gradientClass="from-blue-500/10 to-indigo-500/5"
          borderHoverClass="hover:border-blue-500/30"
          iconColorClass="text-blue-400 border-blue-500/20 bg-blue-500/10"
        />
      </motion.div>

      {/* Quick Actions & Weather/Schemes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-sm text-text/40 uppercase tracking-wider">Quick Actions</h4>
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="font-bold text-sm text-text/40 uppercase tracking-wider">Weather Insight</h4>
          {weather && <WeatherWidget weather={weather} />}
        </motion.div>
      </div>

      {/* Analytics Charts & Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-text">Yield Forecast Analytics</h4>
              <p className="text-[10px] text-text/40 font-semibold mt-0.5">Simulated harvest output vs months</p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full font-bold">
              +15.2% Growth
            </span>
          </div>
          {data?.charts?.monthlyCropYield && (
            <CropYieldChart data={data.charts.monthlyCropYield} />
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="font-bold text-sm text-text/40 uppercase tracking-wider">Government Schemes</h4>
          <SchemesWidget schemes={schemes} />
        </motion.div>
      </div>

      {/* Future Preview Modules Panel */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h4 className="font-bold text-sm text-text/40 uppercase tracking-wider">Modular Platform Preview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AIPreviewWidget />
          <MarketplaceWidget />
          <RentalWidget />
          <CommunityWidget />
        </div>
      </motion.div>

      {/* Recent Activity Timeline & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Timeline */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
          <h4 className="font-bold text-sm text-text">Recent Farm Activities</h4>
          <div className="flow-root mt-2">
            <ul className="-mb-8">
              {data?.activities?.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== data.activities.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border/60" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3.5 items-start">
                      <div>
                        <span className={`h-8 w-8 rounded-lg border flex items-center justify-center text-xs shrink-0 ${
                          activity.type === 'crop'
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : activity.type === 'notification'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {activity.type === 'crop' ? '🌾' : '🔔'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text leading-tight">{activity.title}</p>
                        <p className="text-[10px] text-text/50 mt-1 leading-normal">{activity.description}</p>
                        <span className="text-[9px] text-text/30 font-semibold block mt-1.5">
                          {new Date(activity.time).toLocaleDateString()} at {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Revenue chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-text">Income & Sales Trend</h4>
              <p className="text-[10px] text-text/40 font-semibold mt-0.5">Aggregate marketplace revenue</p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold">
              ₹50,000 June Peak
            </span>
          </div>
          {data?.charts?.revenueTrend && (
            <RevenueTrendChart data={data.charts.revenueTrend} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
