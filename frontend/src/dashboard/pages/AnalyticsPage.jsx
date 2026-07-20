import React from 'react';
import {
  CropYieldChart,
  RevenueTrendChart,
  CropDistributionChart,
  DiagnosisTrendChart,
  RainfallTrendChart
} from '../components/charts/DashboardCharts';

export const AnalyticsPage = () => {
  // Local static mock arrays matching the dashboard trends
  const monthlyCropYield = [
    { month: 'Jan', yield: 40 },
    { month: 'Feb', yield: 48 },
    { month: 'Mar', yield: 62 },
    { month: 'Apr', yield: 55 },
    { month: 'May', yield: 78 },
    { month: 'Jun', yield: 85 }
  ];

  const revenueTrend = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 35000 },
    { month: 'Apr', revenue: 28000 },
    { month: 'May', revenue: 42000 },
    { month: 'Jun', revenue: 50000 }
  ];

  const cropDistribution = [
    { name: 'Basmati Rice', value: 4 },
    { name: 'Karan Wheat', value: 3 },
    { name: 'Sugarcane', value: 2 },
    { name: 'Raw Cotton', value: 1 }
  ];

  const diagnosisTrend = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 1 },
    { month: 'Apr', count: 4 },
    { month: 'May', count: 8 },
    { month: 'Jun', count: 12 }
  ];

  const rainfallTrend = [
    { month: 'Jan', rainfall: 45 },
    { month: 'Feb', rainfall: 30 },
    { month: 'Mar', rainfall: 25 },
    { month: 'Apr', rainfall: 60 },
    { month: 'May', rainfall: 150 },
    { month: 'Jun', rainfall: 210 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Farm Analytics Board</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Detailed telemetry charts tracking soil outputs, rainfall patterns, diagnosis trends, and income indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Area Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm text-text">Seasonal Crop Yield Indices</h3>
            <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              Tonnes / Hectare
            </span>
          </div>
          <CropYieldChart data={monthlyCropYield} />
        </div>

        {/* Sales Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm text-text">Revenue Trends (Mandi Bids)</h3>
            <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              Rupees (₹)
            </span>
          </div>
          <RevenueTrendChart data={revenueTrend} />
        </div>

        {/* Diagnosis Line Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm text-text">AI Pathogen Scans count</h3>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              Monthly Scans
            </span>
          </div>
          <DiagnosisTrendChart data={diagnosisTrend} />
        </div>

        {/* Rainfall Area Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm text-text">Precipitation Levels (Monsoon)</h3>
            <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
              Millimetres (mm)
            </span>
          </div>
          <RainfallTrendChart data={rainfallTrend} />
        </div>

        {/* Crop distribution Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm text-text">Crop Variety Distribution</h3>
            <span className="text-[10px] uppercase font-bold text-text/40 tracking-wider">
              Land Acre allocation
            </span>
          </div>
          <CropDistributionChart data={cropDistribution} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
