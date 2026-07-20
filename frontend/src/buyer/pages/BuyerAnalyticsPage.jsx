import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, PieChart, RefreshCw } from 'lucide-react';
import buyerService from '../services/buyerService';
import {
  MonthlySpendingChart,
  PriceTrendChart,
  CategoryDistributionChart
} from '../components/charts/BuyerCharts';
import { LoadingSkeleton, ErrorState } from '../components/ui/StateViews';

export const BuyerAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Unable to load buyer procurement analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="cards" count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAnalytics} />;
  }

  const { monthlyPurchases, priceTrend, categoryDistribution } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Buyer Procurement Analytics</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Data insights on monthly expenditure, mandi commodity trends, and category distribution.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-surface border border-border text-xs font-bold text-text rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Purchases Area Chart */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-text font-display">Monthly Spending (₹)</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              +18.4% YoY
            </span>
          </div>
          <MonthlySpendingChart data={monthlyPurchases} />
        </div>

        {/* Mandi Price Trend Line Chart */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-text font-display">Crop Rate Fluctuations (₹/Qtl)</h3>
            </div>
            <span className="text-xs text-text/40">6 Month Rolling</span>
          </div>
          <PriceTrendChart data={priceTrend} />
        </div>

        {/* Category Share Donut */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-text font-display">Sourcing Category Breakdown</h3>
            </div>
          </div>
          <CategoryDistributionChart data={categoryDistribution} />
        </div>

        {/* Metrics Overview */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-text font-display">Procurement Efficiency</h3>
            </div>
          </div>

          <div className="space-y-4 my-auto">
            <div className="p-4 bg-surface/60 rounded-xl border border-border/60 flex items-center justify-between">
              <div>
                <span className="text-text/40 block text-xs">Fulfillment Success Rate</span>
                <span className="text-lg font-bold text-emerald-400 font-display">96.8%</span>
              </div>
              <span className="text-xs text-text/50">24 / 25 Orders</span>
            </div>

            <div className="p-4 bg-surface/60 rounded-xl border border-border/60 flex items-center justify-between">
              <div>
                <span className="text-text/40 block text-xs">Avg Price Savings vs Mandi</span>
                <span className="text-lg font-bold text-indigo-400 font-display">4.2% Below Mandi</span>
              </div>
              <span className="text-xs text-text/50">Direct Sourcing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAnalyticsPage;
