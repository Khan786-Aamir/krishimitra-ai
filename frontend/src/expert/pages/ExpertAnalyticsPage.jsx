import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Star, RefreshCw } from 'lucide-react';
import expertService from '../services/expertService';
import {
  MonthlyConsultationsChart,
  DiseaseCategoryChart,
  FarmerSatisfactionChart
} from '../components/charts/ExpertCharts';
import { LoadingSkeleton, ErrorState } from '../components/ui/StateViews';

export const ExpertAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expertService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Unable to load expert analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) return <LoadingSkeleton type="cards" count={3} />;
  if (error) return <ErrorState message={error} onRetry={loadAnalytics} />;

  const { monthlyConsultations, diseaseCategories, farmerSatisfaction } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Advisory Performance Analytics</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Data metrics on monthly query resolution, disease distribution, and farmer satisfaction ratings.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-surface border border-border text-xs font-bold text-text rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-text font-display">Monthly Consultations Resolved</h3>
            </div>
          </div>
          <MonthlyConsultationsChart data={monthlyConsultations} />
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-text font-display">Diagnosed Disease Categories</h3>
            </div>
          </div>
          <DiseaseCategoryChart data={diseaseCategories} />
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-base font-bold text-text font-display">Farmer Review Breakdown</h3>
            </div>
          </div>
          <FarmerSatisfactionChart data={farmerSatisfaction} />
        </div>
      </div>
    </div>
  );
};

export default ExpertAnalyticsPage;
