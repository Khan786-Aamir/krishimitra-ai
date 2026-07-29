import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Share2, MapPin, Star, Calendar, 
  Layers, Database, Truck, Inbox, Phone, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import marketplaceService from '../../services/marketplaceService';
import { Button, Modal, Input, Textarea, Badge } from '../../components/ui';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Inquiry Modal Form State
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Regular Purchase');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [listingData, wishData] = await Promise.all([
        marketplaceService.getListingDetails(id),
        marketplaceService.getWishlist()
      ]);
      setProduct(listingData);
      setWishlistItems(wishData || []);
      const saved = (wishData || []).some(w => (w.listing?._id || w.listing?.id) === id);
      setIsSaved(saved);

      // Auto-prefill expected price
      if (listingData) {
        setExpectedPrice(listingData.price);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      if (isSaved) {
        const wishItem = wishlistItems.find(w => (w.listing?._id || w.listing?.id) === id);
        if (wishItem) {
          await marketplaceService.removeFromWishlist(wishItem._id || wishItem.id);
        }
        setIsSaved(false);
      } else {
        await marketplaceService.addToWishlist(id);
        setIsSaved(true);
      }
      // Re-fetch wishlist items
      const wishData = await marketplaceService.getWishlist();
      setWishlistItems(wishData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await marketplaceService.sendInquiry({
        listingId: id,
        buyerName,
        phone,
        requiredQuantity: Number(requiredQuantity),
        expectedPrice: Number(expectedPrice),
        message,
        inquiryType
      });
      setInquirySuccess(true);
      setPhone('');
      setRequiredQuantity('');
      setMessage('');
      setTimeout(() => {
        setInquirySuccess(false);
        setShowInquiryModal(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !product) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-card w-1/4 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-card rounded-3xl" />
          <div className="h-96 bg-card rounded-3xl" />
        </div>
      </div>
    );
  }

  // Multi images fallbacks
  const images = product.images && product.images.length > 0 ? product.images : [
    { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600', filename: 'Front View' }
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-border bg-surface">
            <img 
              src={images[activeImageIdx]?.url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Organic/Grade Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isOrganic && (
                <span className="bg-emerald-500/90 text-white font-bold px-3 py-1 rounded-xl shadow-lg">Organic</span>
              )}
              {product.qualityGrade && (
                <span className="bg-amber-500/90 text-slate-950 font-black px-3 py-1 rounded-xl shadow-lg">Grade {product.qualityGrade}</span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 bg-surface transition-all ${
                    activeImageIdx === idx ? 'border-primary' : 'border-border/60 hover:border-border'
                  }`}
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Specifications Summary */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{product.category}</span>
                <h1 className="text-2xl font-extrabold text-white font-display tracking-tight mt-1">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.averageRating || '4.8'}</span>
                  </span>
                  <span className="text-gray-500">({product.totalReviews || '0'} reviews)</span>
                </div>
              </div>

              {/* Wishlist toggle */}
              <button 
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSaved 
                    ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 shadow-lg' 
                    : 'border-border bg-surface text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="mt-4 flex items-center gap-1.5 text-gray-300 font-semibold">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{product.location}, {product.district}, {product.state}</span>
            </div>
          </div>

          {/* Price details and Available Volume */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-border/40 py-5">
            <div>
              <span className="text-gray-500 block text-[9px] uppercase font-bold tracking-wider">Procurement rate</span>
              <span className="text-2xl font-black text-primary mt-1 block">
                ₹{product.price?.toLocaleString()} 
                <span className="text-xs text-gray-500 font-normal ml-1">{product.unit}</span>
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px] uppercase font-bold tracking-wider">Available Batch Qty</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {product.availableQuantity} 
                <span className="text-xs text-gray-500 font-normal ml-1">{product.unit}</span>
              </span>
            </div>
          </div>

          {/* Details Lists */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Harvest Date</span>
                <span className="text-gray-400">{new Date(product.harvestDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Warehouse Storage Specs</span>
                <span className="text-gray-400">{product.storageInfo || 'Stored in aerated dry grain bags.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Transportation/Shipping Details</span>
                <span className="text-gray-400">{product.transportationDetails || 'Ex-farm gate loading arranged via tractor transport.'}</span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-4 pt-4 border-t border-border/40">
            <Button 
              className="flex-1 flex justify-center items-center gap-1.5 py-3 rounded-2xl font-bold shadow-lg shadow-primary/10"
              onClick={() => setShowInquiryModal(true)}
            >
              <Inbox className="w-4 h-4" />
              <span>Send B2B Procurement Inquiry</span>
            </Button>
          </div>
        </div>

      </div>

      {/* Full length Description */}
      <div className="bg-card border border-border rounded-3xl p-6 text-xs space-y-4">
        <h3 className="text-sm font-bold text-white font-display">Crop offering details</h3>
        <p className="text-gray-300 leading-relaxed font-medium">
          {product.description}
        </p>
      </div>

      {/* B2B INQUIRY FORM MODAL */}
      <Modal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title="Procurement Inquiry Request"
      >
        {inquirySuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Inquiry Sent Successfully</h3>
              <p className="text-xs text-gray-500 mt-1">The grower has been notified of your offer parameters.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name / business Name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
              />
              <Input
                label="Direct Hotline / Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label={`Required Qty (units)`}
                type="number"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                required
                placeholder={`e.g. 50`}
              />
              <Input
                label={`Expected Price (${product.unit})`}
                type="number"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Inquiry Type</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="Regular Purchase">Regular Purchase</option>
                  <option value="Bulk Purchase">Bulk Purchase</option>
                  <option value="Urgent Requirement">Urgent Requirement</option>
                </select>
              </div>
            </div>

            <Textarea
              label="B2B Negotiation Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Detail your transport scheduling or custom grade packaging demands..."
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setShowInquiryModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default ProductDetailsPage;
