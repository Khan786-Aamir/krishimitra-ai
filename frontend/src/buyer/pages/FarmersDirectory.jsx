import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShieldCheck, Award, Phone, X, Sprout, Star } from 'lucide-react';
import buyerService from '../services/buyerService';
import FarmerCard from '../components/cards/FarmerCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const FarmersDirectory = () => {
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
      setError('Unable to fetch farmer directory. Please check network connection.');
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
      (f.location && f.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.primaryCrops && f.primaryCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Farmers Directory</h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Directly connect with certified regional agricultural producers and contract farm partners.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by farmer name, state/district, or primary crop grown..."
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

      {/* Farmer Cards Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadFarmers} />
      ) : filteredFarmers.length === 0 ? (
        <EmptyState
          title="No Farmers Found"
          description="We couldn't find any registered farmers matching your current search parameters."
          actionText="Reset Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <FarmerCard
              key={farmer.id || farmer._id}
              farmer={farmer}
              onViewProfile={(f) => setSelectedFarmer(f)}
            />
          ))}
        </div>
      )}

      {/* Detailed Farmer Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
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
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-text font-display">{selectedFarmer.name}</h3>
                  {selectedFarmer.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-xs text-text/50 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{selectedFarmer.location}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedFarmer.rating || 4.8} Producer Rating</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface/50 border border-border/60 rounded-xl">
                <span className="text-text/40 block text-[10px] uppercase font-semibold">Farm Size</span>
                <span className="font-bold text-text">{selectedFarmer.farmSize || '25 Acres'}</span>
              </div>
              <div className="p-3 bg-surface/50 border border-border/60 rounded-xl">
                <span className="text-text/40 block text-[10px] uppercase font-semibold">Experience</span>
                <span className="font-bold text-text">{selectedFarmer.experienceYears || 12} Years Active</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-text uppercase tracking-wider block">Primary Crops Harvested</span>
              <div className="flex flex-wrap gap-2">
                {(selectedFarmer.primaryCrops || ['Wheat', 'Rice']).map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border text-xs font-semibold text-text rounded-xl"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </div>

            {selectedFarmer.certifications && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-text uppercase tracking-wider block">Quality Certifications</span>
                <div className="flex flex-wrap gap-2">
                  {selectedFarmer.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-text/50 block text-[10px]">Direct Contact Phone</span>
                <span className="font-extrabold text-indigo-400 text-base">{selectedFarmer.phone || '+91 98765 43210'}</span>
              </div>
              <a
                href={`tel:${selectedFarmer.phone || '+919876543210'}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersDirectory;
