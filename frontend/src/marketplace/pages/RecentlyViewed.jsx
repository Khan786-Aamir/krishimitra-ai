import React, { useState, useEffect } from 'react';
import { History, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../buyer/components/cards/ProductCard';
import { Button } from '../../components/ui';

export const RecentlyViewed = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('km_recently_viewed') || '[]');
      setItems(recent);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem('km_recently_viewed');
    setItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Recently Viewed Batches
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit crop batches and farmer profiles you have recently inspected.</p>
        </div>
        
        {items.length > 0 && (
          <Button
            variant="outline"
            className="flex items-center gap-1.5 text-xs font-bold border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl shadow-lg w-full sm:w-auto justify-center"
            onClick={handleClear}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Browsing History</span>
          </Button>
        )}
      </div>

      {/* Grid listing */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-3xl space-y-3">
          <History className="w-12 h-12 text-text/30" />
          <div>
            <h3 className="text-sm font-bold text-white">No history recorded</h3>
            <p className="text-xs text-text/50 mt-1">Inspected crop detail pages will automatically be indexed here.</p>
          </div>
          <Button onClick={() => navigate('/marketplace/browse')} className="text-xs">
            Browse Crop Listings
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={{
                ...product,
                id: product._id || product.id,
                image: product.images && product.images.length > 0 ? product.images[0].url : ''
              }}
              isWishlisted={false}
              onWishlistToggle={null}
              onViewDetails={() => navigate(`/marketplace/listings/${product._id || product.id}`)}
              onContactFarmer={() => navigate(`/marketplace/listings/${product._id || product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
