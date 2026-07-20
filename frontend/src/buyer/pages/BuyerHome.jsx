import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  Heart,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import buyerService from '../services/buyerService';
import StatCard from '../components/cards/StatCard';
import QuickActions from '../components/cards/QuickActions';
import ProductCard from '../components/cards/ProductCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const BuyerHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load buyer dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="cards" count={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  const { stats, profile, todayMarketSummary, featuredProducts } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Wholesale Buyer Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Direct Farm Sourcing, <br />
            <span className="text-indigo-400 bg-clip-text">Fair Mandi Rates.</span>
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Welcome back to <span className="text-white font-semibold">{profile?.companyName || 'AgriCorp Procurement'}</span>. Discover certified organic and commercial crop harvests directly from accredited regional farmers.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/buyer/browse')}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <span>Browse All Crops</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/buyer/market-prices')}
              className="flex items-center gap-2 px-5 py-2.5 bg-card/60 hover:bg-card text-gray-200 border border-border text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <span>View Mandi Prices</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Floating Decorative Blur */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Today's Market Summary Banner */}
      {todayMarketSummary && (
        <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text">Today's Market Pulse</h4>
              <p className="text-xs text-text/50">Aggregated from active state mandis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-xs">
            <div className="bg-surface/60 p-2.5 rounded-xl border border-border/50">
              <span className="text-text/40 block text-[10px] uppercase font-semibold">Total Trade Volume</span>
              <span className="font-bold text-text text-sm">{todayMarketSummary.totalVolume}</span>
            </div>
            <div className="bg-surface/60 p-2.5 rounded-xl border border-border/50">
              <span className="text-text/40 block text-[10px] uppercase font-semibold">Active Mandis</span>
              <span className="font-bold text-text text-sm">{todayMarketSummary.activeMandis} Locations</span>
            </div>
            <div className="bg-surface/60 p-2.5 rounded-xl border border-border/50">
              <span className="text-text/40 block text-[10px] uppercase font-semibold">Price Index Trend</span>
              <span className="font-bold text-emerald-400 text-sm">{todayMarketSummary.priceTrendAvg}</span>
            </div>
            <div className="bg-surface/60 p-2.5 rounded-xl border border-border/50">
              <span className="text-text/40 block text-[10px] uppercase font-semibold">Top Commodity Gainer</span>
              <span className="font-bold text-indigo-400 text-xs truncate block">{todayMarketSummary.topGainer}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards Grid (6 Animated Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Available Products"
          value={stats?.availableProducts || 0}
          subtitle="Ready for bulk procurement"
          icon={ShoppingBag}
          colorScheme="indigo"
          onClick={() => navigate('/buyer/browse')}
        />
        <StatCard
          title="Verified Farmers"
          value={stats?.verifiedFarmers || 0}
          subtitle="Accredited crop producers"
          icon={Users}
          colorScheme="emerald"
          onClick={() => navigate('/buyer/farmers')}
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          subtitle="In transit / Processing"
          icon={Clock}
          colorScheme="amber"
          onClick={() => navigate('/buyer/orders')}
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders || 0}
          subtitle="Fulfilled successfully"
          icon={CheckCircle2}
          colorScheme="purple"
          onClick={() => navigate('/buyer/orders')}
        />
        <StatCard
          title="Wishlist Items"
          value={stats?.wishlistItems || 0}
          subtitle="Saved for monitoring"
          icon={Heart}
          colorScheme="rose"
          onClick={() => navigate('/buyer/wishlist')}
        />
        <StatCard
          title="Monthly Spending"
          value={`₹${(stats?.monthlySpending || 0).toLocaleString()}`}
          subtitle="Current calendar month"
          icon={TrendingUp}
          colorScheme="blue"
          onClick={() => navigate('/buyer/analytics')}
        />
      </div>

      {/* Quick Actions Component */}
      <QuickActions />

      {/* Featured Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text font-display">Featured Crop Listings</h3>
            <p className="text-xs text-text/50">Top rated harvests from verified farms</p>
          </div>
          <button
            onClick={() => navigate('/buyer/browse')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={() => navigate('/buyer/browse')}
                onContactFarmer={() => navigate('/buyer/farmers')}
                onWishlistToggle={() => navigate('/buyer/wishlist')}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured products currently"
            description="Explore our complete marketplace gallery to discover available crops."
            actionText="Browse Crops"
            onAction={() => navigate('/buyer/browse')}
          />
        )}
      </div>
    </div>
  );
};

export default BuyerHome;
