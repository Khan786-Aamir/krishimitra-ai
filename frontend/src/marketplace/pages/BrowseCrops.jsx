import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Leaf, Star, Sparkles, MapPin, X, Save, ArrowUpDown } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import ProductCard from '../../buyer/components/cards/ProductCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../buyer/components/ui/StateViews';
import { Button, Modal, Input } from '../../components/ui';

export const BrowseCrops = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [freshHarvestOnly, setFreshHarvestOnly] = useState(false);
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  // Save Search Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Contact / Details Popup
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactModalProduct, setContactModalProduct] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchQuery,
        category: category,
        organic: organicOnly,
        freshHarvest: freshHarvestOnly,
        minPrice,
        maxPrice,
        state: stateFilter,
        district: districtFilter,
        minQuantity,
        sort: sortOption
      };

      const [listingsData, wishData] = await Promise.all([
        marketplaceService.getListings(filters),
        marketplaceService.getWishlist()
      ]);

      setListings(listingsData || []);
      setWishlistItems(wishData || []);
      
      const savedSet = new Set(
        (wishData || []).map(w => w.listing?._id || w.listing?.id || w.cropData?.id)
      );
      setWishlistIds(savedSet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [category, organicOnly, freshHarvestOnly, sortOption]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setOrganicOnly(false);
    setFreshHarvestOnly(false);
    setStateFilter('');
    setDistrictFilter('');
    setMinQuantity('');
    setSortOption('Newest');
    // Direct navigate reset
    navigate('/marketplace/browse');
  };

  const handleWishlistToggle = async (product) => {
    const pId = product._id || product.id;
    const isSaved = wishlistIds.has(pId);
    
    try {
      if (isSaved) {
        // Find wishlist entry ID
        const wishItem = wishlistItems.find(w => (w.listing?._id || w.listing?.id) === pId);
        if (wishItem) {
          await marketplaceService.removeFromWishlist(wishItem._id || wishItem.id);
        }
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(pId);
          return next;
        });
      } else {
        await marketplaceService.addToWishlist(pId);
        setWishlistIds(prev => new Set([...prev, pId]));
      }
      // Re-fetch wishlist items
      const wishData = await marketplaceService.getWishlist();
      setWishlistItems(wishData || []);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleSaveSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    try {
      await marketplaceService.saveSearch(searchName, {
        search: searchQuery,
        category,
        minPrice,
        maxPrice,
        organic: organicOnly,
        freshHarvest: freshHarvestOnly,
        state: stateFilter,
        district: districtFilter,
        minQuantity,
        sort: sortOption
      });
      setShowSaveModal(false);
      setSearchName('');
    } catch (err) {
      console.error('Error saving search template:', err);
    }
  };

  const handleViewProduct = (product) => {
    // Add product to recently viewed in localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('km_recently_viewed') || '[]');
      const filtered = recent.filter(item => item._id !== product._id && item.id !== product.id);
      filtered.unshift(product);
      localStorage.setItem('km_recently_viewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (err) {
      console.error(err);
    }
    // Open Details Modal
    setSelectedProduct(product);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight">
            Browse B2B Crop Listings
          </h1>
          <p className="text-gray-400 text-xs mt-1">Explore verified crop batches directly from regional accredited growers.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1.5 text-xs font-bold border-border text-gray-400 hover:text-white rounded-xl shadow-lg w-full sm:w-auto justify-center"
            onClick={() => setShowSaveModal(true)}
          >
            <Save className="w-4 h-4 text-primary" />
            <span>Save Search Template</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Filters + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs">
        
        {/* Filters Panel */}
        <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-5 space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-primary" />
              Filter parameters
            </span>
            <button onClick={handleClearFilters} className="text-[10px] text-primary font-bold hover:underline">
              Clear All
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Global Keyword</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Rice, Wheat, Nashik"
                  className="w-full pl-8 pr-3 py-2 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30 transition-colors"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Crop Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-xs py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="all">All Categories</option>
                <option value="Cereals">Cereals</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Pulses">Pulses</option>
                <option value="Oil Seeds">Oil Seeds</option>
                <option value="Spices">Spices</option>
                <option value="Flowers">Flowers</option>
                <option value="Organic Produce">Organic Produce</option>
              </select>
            </div>

            {/* Price Ranges */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Price Range (INR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full py-2 px-3 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full py-2 px-3 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30"
                />
              </div>
            </div>

            {/* Location (State/District) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">State</label>
                <input
                  type="text"
                  placeholder="Haryana"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">District</label>
                <input
                  type="text"
                  placeholder="Nashik"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30"
                />
              </div>
            </div>

            {/* Available Quantity */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Min Quantity (Quintals)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full py-2 px-3 bg-surface/50 border border-border/80 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-text placeholder:text-text/30"
              />
            </div>

            {/* Sorting Toggles */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Sort Mode</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-xs py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Newest">Newest Added</option>
                <option value="Lowest Price">Lowest Price First</option>
                <option value="Highest Price">Highest Price First</option>
                <option value="Most Popular">Most Popular / Reviews</option>
              </select>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2 border-t border-border/40 pt-3">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-text/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded bg-surface border-border text-primary focus:ring-0 cursor-pointer"
                />
                <span>Organic Produce Only</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-text/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={freshHarvestOnly}
                  onChange={(e) => setFreshHarvestOnly(e.target.checked)}
                  className="rounded bg-surface border-border text-primary focus:ring-0 cursor-pointer"
                />
                <span>Fresh Harvest Only</span>
              </label>
            </div>

            <Button type="submit" className="w-full pt-2">
              Apply Filters
            </Button>
          </form>
        </div>

        {/* Listings Catalog */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSkeleton type="cards" count={6} />
          ) : listings.length === 0 ? (
            <EmptyState
              title="No Crops Found"
              description="Adjust your search keywords or clear filters to see more crop listings."
              actionText="Reset Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ProductCard
                  key={listing._id || listing.id}
                  product={{
                    ...listing,
                    id: listing._id || listing.id,
                    image: listing.images && listing.images.length > 0 ? listing.images[0].url : ''
                  }}
                  isWishlisted={wishlistIds.has(listing._id || listing.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onViewDetails={handleViewProduct}
                  onContactFarmer={(p) => setContactModalProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SAVE SEARCH TEMPLATE MODAL */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Search Template"
      >
        <form onSubmit={handleSaveSearch} className="space-y-4 text-xs">
          <Input
            label="Template Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
            placeholder="e.g. Organic Nashik Wholesales"
          />
          <p className="text-gray-500 leading-relaxed text-[11px]">
            This will save your current keyword search, category, location, and sorting choices in MongoDB for one-click access.
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={() => setShowSaveModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Template
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONTACT / INQUIRY GATE POPUP (MAPPED TO DETAILS PAGE REDIRECT) */}
      {contactModalProduct && (
        <Modal
          isOpen={!!contactModalProduct}
          onClose={() => setContactModalProduct(null)}
          title="Direct procurement line"
        >
          <div className="space-y-4 text-xs text-center">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Contact {contactModalProduct.farmerName || 'Grower'}</h3>
              <p className="text-gray-500 mt-1">Direct crop trading details for {contactModalProduct.name}.</p>
            </div>
            <div className="p-4 bg-surface rounded-xl text-left border border-border/40 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Orchard/Farm:</span>
                <span className="text-white">{contactModalProduct.location}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Quality:</span>
                <span className="text-primary">Grade {contactModalProduct.qualityGrade || 'A+'}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setContactModalProduct(null);
                navigate(`/marketplace/listings/${contactModalProduct._id || contactModalProduct.id}`);
              }}
            >
              Send B2B Crop Inquiry
            </Button>
          </div>
        </Modal>
      )}

      {/* DETAILED DIALOG MODAL */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Quick Inspect Crop batch"
        >
          <div className="space-y-4 text-xs">
            <div className="flex gap-4 pb-4 border-b border-border/40">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                <img src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0].url : ''} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedProduct.name}</h3>
                <span className="text-gray-500 block">Category: {selectedProduct.category}</span>
                <span className="text-primary font-bold block mt-1">₹{selectedProduct.price} {selectedProduct.unit}</span>
              </div>
            </div>

            <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
              <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-1">Batch description</span>
              <p className="text-gray-300 font-medium leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface rounded-xl border border-border/40">
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Available volume</span>
                <span className="font-extrabold text-white text-sm">{selectedProduct.availableQuantity}</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border/40">
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Min Order threshold</span>
                <span className="font-extrabold text-primary text-sm">{selectedProduct.minOrder} {selectedProduct.unit}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Close</Button>
              <Button onClick={() => {
                setSelectedProduct(null);
                navigate(`/marketplace/listings/${selectedProduct._id || selectedProduct.id}`);
              }}>
                Full Specifications Page
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default BrowseCrops;
