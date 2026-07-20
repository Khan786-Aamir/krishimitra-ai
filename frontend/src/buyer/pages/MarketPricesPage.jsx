import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, RefreshCw, Search, X } from 'lucide-react';
import buyerService from '../services/buyerService';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const MarketPricesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getMarketPrices();
      setPrices(data || []);
    } catch (err) {
      setError('Failed to refresh mandi prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const filteredPrices = prices.filter(
    (p) =>
      p.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display flex items-center gap-2">
            <span>Live Mandi Price Board</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Real-time APMC mandi prices and wholesale daily rate fluctuations.
          </p>
        </div>

        <button
          onClick={loadPrices}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-surface border border-border text-xs font-bold text-text rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop commodity or mandi location (e.g. Khanna, Karnal, Lasalgaon)..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface/60 border border-border/80 focus:border-indigo-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table UI */}
      {loading ? (
        <LoadingSkeleton type="table" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadPrices} />
      ) : filteredPrices.length === 0 ? (
        <EmptyState
          title="No Price Records Found"
          description="No mandi records match your search query."
          actionText="Reset Search Filter"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface/60 text-text/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Commodity Crop</th>
                  <th className="p-4">Today Rate</th>
                  <th className="p-4">Yesterday Rate</th>
                  <th className="p-4">Price Trend</th>
                  <th className="p-4">Mandi Market Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface/40 transition-colors">
                    <td className="p-4 font-bold text-text text-sm font-display">{item.crop}</td>
                    <td className="p-4 font-extrabold text-indigo-400 text-sm">
                      ₹{item.todayPrice.toLocaleString()}{' '}
                      <span className="text-[10px] text-text/40 font-normal">{item.unit}</span>
                    </td>
                    <td className="p-4 text-text/60">₹{item.yesterdayPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          item.trend === 'up'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.trend === 'down'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-surface text-text/60 border border-border'
                        }`}
                      >
                        {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        {item.trend === 'flat' && <Minus className="w-3 h-3" />}
                        <span>{item.changePct}</span>
                      </span>
                    </td>
                    <td className="p-4 text-text/70 flex items-center gap-1.5 pt-5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{item.location}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPricesPage;
