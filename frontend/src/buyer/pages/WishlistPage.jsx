import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Eye, MapPin, ShieldCheck, Leaf } from 'lucide-react';
import buyerService from '../services/buyerService';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buyerService.getWishlist();
      setWishlistItems(data || []);
    } catch (err) {
      setError('Unable to load your saved wishlist items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
    await buyerService.removeFromWishlist(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display flex items-center gap-3">
          <span>Saved Wishlist</span>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
            {wishlistItems.length} Saved Crops
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Monitor price updates and harvest availability for your shortlisted bulk farm products.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="cards" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadWishlist} />
      ) : wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any crop listings to your wishlist yet. Browse the crops catalog to shortlist products."
          actionText="Browse Crops Catalog"
          onAction={() => navigate('/buyer/browse')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const crop = item.cropData || item.crop || {};
            return (
              <div
                key={item._id}
                className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative h-44 bg-surface overflow-hidden">
                  <img
                    src={crop.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600'}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />

                  {crop.isOrganic && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 text-white text-[11px] font-bold rounded-lg shadow-sm">
                      <Leaf className="w-3 h-3" />
                      <span>Organic</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-red-500/20"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{crop.location || 'India'}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text font-display">{crop.name}</h3>
                    <p className="text-xs text-text/50 mt-0.5">
                      Farmer: <span className="text-text font-medium">{crop.farmerName}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-text/40 block">Available Qty</span>
                      <span className="text-xs font-bold text-text">{crop.availableQuantity || '100 Qtl'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-text/40 block">Mandi Rate</span>
                      <span className="text-base font-extrabold text-indigo-400 font-display">
                        ₹{crop.price?.toLocaleString()} {crop.priceUnit || '/ Quintal'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => navigate('/buyer/browse')}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Crop Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
