import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShieldCheck, Award, Sprout, Star, AlertCircle, X } from 'lucide-react';
import buyerService from '../../buyer/services/buyerService';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const FarmersDirectoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getFarmers();
      setFarmers(data || []);
    } catch (err) {
      setError('Unable to load farmer profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.location && f.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Regional Farmers Directory</h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Access farmer disease histories, farm acreage details, and regional crop profiles.
        </p>
      </div>

      {/* Search Filter */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmer name, district, or primary crop..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface/60 border border-border/80 focus:border-emerald-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadFarmers} />
      ) : filteredFarmers.length === 0 ? (
        <EmptyState
          title="No Farmers Found"
          description="No registered farmers match your search criteria."
          actionText="Reset Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((f) => (
            <div
              key={f.id || f._id}
              className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={f.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                  alt={f.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text truncate font-display">{f.name}</h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{f.rating || 4.8}</span>
                    </span>
                  </div>
                  <p className="text-xs text-text/50 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{f.location}</span>
                  </p>
                  <p className="text-[11px] text-text/40 mt-0.5">{f.experienceYears || 12} Yrs Farming ({f.farmSize || '25 Acres'})</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="text-[10px] uppercase font-semibold text-text/40 block mb-1">Recent Disease History</span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-md">
                    Yellow Rust (Wheat)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md">
                    Resolved
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedFarmer(f)}
                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                View Farmer Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Farmer Profile Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedFarmer(null)}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text rounded-xl bg-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedFarmer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                alt={selectedFarmer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30"
              />
              <div>
                <h3 className="text-lg font-bold text-text font-display">{selectedFarmer.name}</h3>
                <p className="text-xs text-text/50">{selectedFarmer.location}</p>
                <p className="text-xs font-bold text-emerald-400 mt-1">{selectedFarmer.farmSize || '25 Acres'} Farm Land</p>
              </div>
            </div>

            <div className="p-4 bg-surface/60 border border-border/60 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-text uppercase tracking-wider">Agronomy Record</h4>
              <p className="text-text/70">Primary Crops: {(selectedFarmer.primaryCrops || ['Wheat', 'Rice']).join(', ')}</p>
              <p className="text-text/70">Phone: {selectedFarmer.phone || '+91 98765 43210'}</p>
            </div>

            <button
              onClick={() => setSelectedFarmer(null)}
              className="w-full py-2.5 bg-surface hover:bg-border text-text text-xs font-semibold rounded-xl cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersDirectoryPage;
