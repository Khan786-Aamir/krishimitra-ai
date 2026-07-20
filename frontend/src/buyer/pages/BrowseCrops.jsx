import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Leaf, ShieldCheck, Phone, X, AlertCircle } from 'lucide-react';
import buyerService from '../services/buyerService';
import ProductCard from '../components/cards/ProductCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const BrowseCrops = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactModalProduct, setContactModalProduct] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodsData, wishData] = await Promise.all([
        buyerService.getProducts(),
        buyerService.getWishlist()
      ]);
      setProducts(prodsData || []);
      const wishSet = new Set((wishData || []).map((w) => w.cropData?.id || w.cropData?._id || w._id));
      setWishlistIds(wishSet);
    } catch (err) {
      setError('Unable to fetch product catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWishlistToggle = async (product) => {
    const pId = product.id || product._id;
    const isSaved = wishlistIds.has(pId);

    const updatedSet = new Set(wishlistIds);
    if (isSaved) {
      updatedSet.delete(pId);
    } else {
      updatedSet.add(pId);
      await buyerService.addToWishlist(product);
    }
    setWishlistIds(updatedSet);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesQuery =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'grains' && (prod.name.includes('Wheat') || prod.name.includes('Rice') || prod.name.includes('Corn'))) ||
      (categoryFilter === 'spices' && (prod.name.includes('Saffron') || prod.name.includes('Turmeric') || prod.name.includes('Chilli'))) ||
      (categoryFilter === 'vegetables' && (prod.name.includes('Onions') || prod.name.includes('Potato')));

    const matchesOrganic = !organicOnly || prod.isOrganic;

    return matchesQuery && matchesCategory && matchesOrganic;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Browse Harvest Crops</h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Explore verified bulk crop listings sourced directly from regional accredited farmers.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop name, farmer, or farm location..."
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

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Crops' },
              { id: 'grains', label: 'Grains & Cereals' },
              { id: 'spices', label: 'Spices' },
              { id: 'vegetables', label: 'Vegetables' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-surface hover:bg-border text-text/70'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Organic Checkbox Toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                organicOnly
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-surface border-border text-text/60 hover:text-text'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Organic Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No Matching Crops Found"
          description="Try adjusting your search queries or clearing category filter settings."
          actionText="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setOrganicOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id || prod._id}
              product={prod}
              isWishlisted={wishlistIds.has(prod.id || prod._id)}
              onWishlistToggle={handleWishlistToggle}
              onViewDetails={(p) => setSelectedProduct(p)}
              onContactFarmer={(p) => setContactModalProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text rounded-xl bg-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-28 h-28 rounded-2xl object-cover border border-border shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Quality Grade {selectedProduct.qualityGrade}
                </span>
                <h3 className="text-xl font-bold text-text font-display">{selectedProduct.name}</h3>
                <p className="text-xs text-text/50 mt-1">Farmer: {selectedProduct.farmerName}</p>
                <p className="text-xs text-text/50">Origin: {selectedProduct.location}</p>
              </div>
            </div>

            <div className="p-4 bg-surface/50 border border-border/60 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-text uppercase tracking-wider">Crop Details</h4>
              <p className="text-xs text-text/70 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-surface/30 rounded-xl border border-border/50">
                <span className="text-text/40 block text-[10px] uppercase">Available Harvest</span>
                <span className="font-bold text-text text-sm">{selectedProduct.availableQuantity}</span>
              </div>
              <div className="p-3 bg-surface/30 rounded-xl border border-border/50">
                <span className="text-text/40 block text-[10px] uppercase">Est. Mandi Rate</span>
                <span className="font-extrabold text-indigo-400 text-sm">
                  ₹{selectedProduct.price?.toLocaleString()} {selectedProduct.priceUnit}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setContactModalProduct(selectedProduct);
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Farmer Directly</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Farmer Modal */}
      {contactModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setContactModalProduct(null)}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text rounded-xl bg-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Phone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-text font-display">Contact Producer</h3>
              <p className="text-xs text-text/50 mt-1">
                Direct procurement line for <span className="text-text font-semibold">{contactModalProduct.name}</span>
              </p>
            </div>

            <div className="p-4 bg-surface/60 border border-border/80 rounded-2xl space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-text/50">Farmer Name:</span>
                <span className="font-bold text-text">{contactModalProduct.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">Location:</span>
                <span className="font-semibold text-text">{contactModalProduct.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">Verification:</span>
                <span className="font-bold text-emerald-400">Government Accredited</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
              <p className="text-[11px] text-text/50">Direct Phone Hotline</p>
              <p className="text-xl font-extrabold text-indigo-400 font-display mt-0.5">+91 98765 43210</p>
            </div>

            <button
              onClick={() => setContactModalProduct(null)}
              className="w-full py-2.5 bg-surface hover:bg-border text-text text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCrops;
