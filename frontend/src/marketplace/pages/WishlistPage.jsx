import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import marketplaceService from '../../services/marketplaceService';
import ProductCard from '../../buyer/components/cards/ProductCard';
import { LoadingSkeleton, EmptyState } from '../../buyer/components/ui/StateViews';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (product) => {
    // Direct product contains the wishlist item ID
    const wishItem = wishlist.find(w => 
      (w.listing?._id || w.listing?.id) === (product._id || product.id)
    );
    
    if (wishItem) {
      try {
        await marketplaceService.removeFromWishlist(wishItem._id || wishItem.id);
        fetchWishlist();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10" />
          My B2B Wishlist
        </h1>
        <p className="text-gray-400 text-xs mt-1">Keep track of crop listings and harvest offerings you want to monitor or procure.</p>
      </div>

      {/* Main Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={3} />
      ) : wishlist.length === 0 ? (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Click the heart icon on any crop card to save it here for quick access later."
          actionText="Browse Crops"
          onAction={() => navigate('/marketplace/browse')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => {
            const prod = item.listing || item.cropData || {};
            // Make sure ID is set for product card compatibility
            const cardProduct = {
              ...prod,
              _id: prod._id || item.cropData?._id || item._id,
              id: prod.id || item.cropData?.id || item._id
            };
            
            return (
              <ProductCard
                key={item._id || item.id}
                product={cardProduct}
                isWishlisted={true}
                onWishlistToggle={handleRemove}
                onViewDetails={() => navigate(`/marketplace/listings/${cardProduct._id || cardProduct.id}`)}
                onContactFarmer={() => navigate(`/marketplace/listings/${cardProduct._id || cardProduct.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
