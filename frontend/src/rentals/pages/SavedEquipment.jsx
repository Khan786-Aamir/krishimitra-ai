import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Eye, MapPin, Star, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Loader } from '../../components/ui';

export const SavedEquipment = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getSavedEquipment();
      setSavedList(data || []);
    } catch (err) {
      console.error('Error fetching saved equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (wishlistId) => {
    try {
      await equipmentService.removeSavedEquipment(wishlistId);
      addToast('Machinery removed from saved list', 'success');
      setSavedList(prev => prev.filter(item => item._id !== wishlistId));
    } catch (err) {
      addToast('Failed to remove saved machinery', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10" /> Saved Machinery Wishlist
        </h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Review listed heavy machinery you bookmarked for future lease reference.
        </p>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-lg mx-auto mt-6">
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl w-fit mx-auto mb-4">
            <Heart className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-white font-extrabold text-lg leading-tight">Your Wishlist is Empty</h3>
          <p className="text-gray-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Browse through available machinery listings and click the heart icon on their details pages to bookmark them here.
          </p>
          <Button onClick={() => navigate('/rentals/browse')} className="text-xs font-bold px-5 py-2.5 rounded-xl mt-6">
            Browse Available Fleet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedList.map(item => {
            const eq = item.equipment;
            if (!eq) return null;
            const image = eq.images && eq.images.length > 0 ? eq.images[0].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=300';
            
            return (
              <div key={item._id} className="bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all flex flex-col justify-between group">
                <div className="relative h-40 bg-surface overflow-hidden">
                  <img src={image} alt={eq.equipmentName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
                  
                  {/* Category */}
                  <div className="absolute top-2 left-2 flex gap-1 z-10 text-[9px] font-bold">
                    <span className="bg-indigo-500/90 text-white px-2 py-0.5 rounded-md">{eq.category}</span>
                  </div>

                  {/* Rating overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm text-[10px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{eq.rating || 5.0}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-white line-clamp-1 group-hover:text-primary transition-colors">{eq.equipmentName}</h4>
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {eq.location || 'Ludhiana, Punjab'}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-border/50 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-500 block">Rate / Day</span>
                      <span className="font-extrabold text-primary text-sm">₹{eq.rentalPricePerDay?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/rentals/listings/${eq._id || eq.id}`)}
                        className="rounded-xl px-2.5 py-1 bg-surface hover:bg-border text-text font-bold flex items-center gap-1 border border-border text-[10px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Button>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-1.5 bg-red-500/10 border border-red-500/25 text-rose-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
