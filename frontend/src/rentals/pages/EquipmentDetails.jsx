import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tractor,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  Heart,
  CheckCircle,
  Phone,
  Mail,
  User,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Badge, Loader } from '../../components/ui';

export const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [renterNotes, setRenterNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Load details
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getEquipmentDetails(id);
        if (data && data.equipment) {
          setEquipment(data.equipment);
          setReviews(data.reviews || []);
          
          // Cache recently viewed to localStorage
          saveToRecentlyViewed(data.equipment);
        }
      } catch (err) {
        console.error('Error fetching equipment details:', err);
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      try {
        const savedList = await equipmentService.getSavedEquipment();
        const found = savedList.find(item => item.equipment?._id === id || item.equipment?.id === id);
        if (found) {
          setIsSaved(true);
          setSavedId(found._id);
        }
      } catch (err) {
        console.warn('Error loading wishlist state:', err);
      }
    };

    loadDetails();
    if (user) {
      checkWishlist();
    }
  }, [id, user]);

  // Save to recently viewed function
  const saveToRecentlyViewed = (item) => {
    try {
      const stored = localStorage.getItem('recentlyViewedEquipment');
      let list = stored ? JSON.parse(stored) : [];
      
      // Remove duplicates
      list = list.filter(e => e._id !== item._id);
      
      // Prepend and slice to maximum 5 items
      list.unshift({
        _id: item._id,
        equipmentName: item.equipmentName,
        rentalPricePerDay: item.rentalPricePerDay,
        category: item.category,
        image: item.images && item.images.length > 0 ? item.images[0].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=300',
        rating: item.rating
      });
      list = list.slice(0, 5);
      
      localStorage.setItem('recentlyViewedEquipment', JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to save to recently viewed:', err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      addToast('Please login to save equipment', 'error');
      return;
    }

    try {
      if (isSaved) {
        await equipmentService.removeSavedEquipment(savedId);
        setIsSaved(false);
        setSavedId(null);
        addToast('Equipment removed from wishlist', 'success');
      } else {
        const res = await equipmentService.saveEquipment(equipment._id || id);
        if (res.success) {
          setIsSaved(true);
          setSavedId(res.data?._id || 'temp-id');
          addToast('Equipment saved to wishlist', 'success');
        }
      }
    } catch (err) {
      addToast('Failed to update wishlist state', 'error');
    }
  };

  // Date and duration calculations
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays();
  const minDays = equipment?.minRentalDays || 1;
  const maxDays = equipment?.maxRentalDays || 30;
  const totalAmount = days * (equipment?.rentalPricePerDay || 0);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please log in to rent equipment', 'error');
      navigate('/login');
      return;
    }

    if (days <= 0) {
      addToast('End date must be after start date', 'error');
      return;
    }

    // Min and Max Rental Days Validation
    if (days < minDays) {
      addToast(`Minimum booking is ${minDays} days for this equipment`, 'error');
      return;
    }

    if (days > maxDays) {
      addToast(`Maximum booking is ${maxDays} days for this equipment`, 'error');
      return;
    }

    try {
      setIsBooking(true);
      const res = await equipmentService.createRentalRequest({
        equipmentId: equipment._id || id,
        startDate,
        endDate,
        purpose,
        message,
        renterNotes
      });

      if (res.success) {
        addToast('Booking request sent successfully to the owner!', 'success');
        navigate('/rentals/my-rentals');
      }
    } catch (err) {
      const errMsg = err.error?.message || 'Failed to submit rental request';
      addToast(errMsg, 'error');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Equipment not found.</p>
        <Button onClick={() => navigate('/rentals')} className="mt-4">Back to Rentals</Button>
      </div>
    );
  }

  const mainImage = equipment.images && equipment.images.length > 0 ? equipment.images[activeImageIdx].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=600';
  const ownerName = equipment.owner ? equipment.owner.name : ' Gurpreet Singh';
  const isOwner = user && equipment.owner && equipment.owner._id === user.id;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Product Gallery & specs */}
        <div className="flex-1 space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-6">
            
            {/* Gallery */}
            <div className="space-y-3">
              <div className="h-96 rounded-2xl overflow-hidden bg-surface relative">
                <img src={mainImage} alt={equipment.equipmentName} className="w-full h-full object-cover" />
                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-white backdrop-blur-sm transition-all cursor-pointer ${
                    isSaved ? 'text-rose-500 fill-rose-500' : ''
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              {equipment.images && equipment.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {equipment.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                        activeImageIdx === idx ? 'border-primary' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Header info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold">
                  {equipment.category}
                </span>
                <span className="bg-surface border border-border text-gray-400 px-2 py-0.5 rounded-md">
                  Condition: {equipment.condition}
                </span>
                <span className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {equipment.rating} ({equipment.totalReviews} reviews)
                </span>
              </div>

              <h1 className="text-2xl font-black text-white font-display tracking-tight leading-tight">
                {equipment.equipmentName}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{equipment.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-white font-display">Description</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {equipment.description}
              </p>
            </div>

            {/* Specifications Details Grid */}
            <div className="space-y-3 pt-3 border-t border-border/50">
              <h3 className="text-sm font-bold text-white font-display">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Brand</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.brand || 'N/A'}</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Model</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.model || 'N/A'}</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Year of Purchase</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.yearOfPurchase || 'N/A'}</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Working Hours</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.workingHours ? `${equipment.workingHours} Hours` : 'N/A'}</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Fuel Type</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.fuelType || 'None'}</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Views</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.views || 0} clicks</span>
                </div>
                <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
                  <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">Times Booked</span>
                  <span className="block text-white font-bold mt-0.5">{equipment.bookingCount || 0} times</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {equipment.attachments && equipment.attachments.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-border/50">
                <h3 className="text-sm font-bold text-white font-display">Included Attachments</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {equipment.attachments.map((at, idx) => (
                    <span key={idx} className="bg-surface border border-border/70 text-gray-300 px-3 py-1.5 rounded-xl font-bold">
                      {at}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Owner Profile Card */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="text-sm font-bold text-white font-display">Owner Information</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-xl font-black shrink-0">
                  {ownerName[0].toUpperCase()}
                </div>
                <div className="min-w-0 text-xs">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{ownerName}</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-400 fill-indigo-400/10" />
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{equipment.owner?.location || 'Verified Lender'}</p>
                  
                  {/* Rating indicator */}
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-md mt-1.5">
                    Premium Machinery Owner
                  </span>
                </div>
              </div>

              {/* Owner Stats panel */}
              <div className="grid grid-cols-3 gap-6 text-center border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-6 text-xs">
                <div>
                  <span className="block text-gray-500 text-[9px] uppercase font-bold tracking-wider">Total Rentals</span>
                  <span className="block text-white font-black text-sm mt-0.5">
                    {equipment.owner?.totalRentals || '18 Bookings'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-[9px] uppercase font-bold tracking-wider">Lender Since</span>
                  <span className="block text-white font-black text-sm mt-0.5">
                    {equipment.owner?.createdAt ? new Date(equipment.owner.createdAt).getFullYear() : '2024'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-[9px] uppercase font-bold tracking-wider">Avg Response</span>
                  <span className="block text-primary font-black text-sm mt-0.5">
                    {equipment.owner?.avgResponseTime || '< 2 Hrs'}
                  </span>
                </div>
              </div>

            </div>

            {/* Direct communication contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-border/40">
              <div className="flex items-center gap-2 p-2.5 bg-surface border border-border/60 rounded-xl text-gray-300">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>{equipment.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-surface border border-border/60 rounded-xl text-gray-300">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{equipment.owner?.email || 'lender@krishimitra.com'}</span>
              </div>
            </div>

          </div>

          {/* Reviews logs list */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="text-sm font-bold text-white font-display">User Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold italic">No reviews posted yet for this machine.</p>
            ) : (
              <div className="space-y-4 divide-y divide-border/40">
                {reviews.map((rev, i) => (
                  <div key={i} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                          {rev.reviewer?.name ? rev.reviewer.name[0].toUpperCase() : 'R'}
                        </div>
                        <span className="font-extrabold text-white">{rev.reviewer?.name || 'Accredited Farmer'}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-400 leading-relaxed font-semibold">{rev.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Booking Form (Sticky Sidebar style) */}
        <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 space-y-6">
          
          {/* Rate card header */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-border/50">
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-500 tracking-wider">Lease Rate</span>
                <span className="text-2xl font-black text-primary font-display flex items-baseline gap-1">
                  ₹{equipment.rentalPricePerDay?.toLocaleString()}
                  <span className="text-xs text-gray-500 font-normal">/ day</span>
                </span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-1 font-bold text-[10px]">
                {equipment.availabilityStatus}
              </Badge>
            </div>

            {/* Booking fields */}
            {isOwner ? (
              <div className="p-4 bg-surface/80 border border-border/80 rounded-2xl text-center space-y-2 text-xs">
                <AlertCircle className="w-6 h-6 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white">This is your machinery listing</h4>
                <p className="text-gray-500 text-[10px] font-semibold leading-relaxed">
                  Owners cannot book their own equipment. Go to Owner Dashboard or My Machinery to manage details.
                </p>
                <Button onClick={() => navigate('/rentals/my-equipment')} className="w-full text-[10px] py-2 rounded-xl mt-2 font-bold">
                  Manage Listing
                </Button>
              </div>
            ) : equipment.availabilityStatus !== 'Available' ? (
              <div className="p-4 bg-surface/80 border border-border/80 rounded-2xl text-center space-y-2 text-xs">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <h4 className="font-extrabold text-white">Currently Unavailable</h4>
                <p className="text-gray-500 text-[10px] font-semibold leading-relaxed">
                  This machine is state: <span className="font-bold text-amber-500">{equipment.availabilityStatus}</span>. Lease reservations are blocked until it returns.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Dates pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Min / Max indicator */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 bg-surface/40 p-2 border border-border/40 rounded-lg">
                  <span>Min limit: <span className="font-bold text-white">{minDays} Days</span></span>
                  <span>Max limit: <span className="font-bold text-white">{maxDays} Days</span></span>
                </div>

                {/* Additional inputs */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Purpose of Booking</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sowing wheat crop"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2.5 px-3 text-text placeholder-text/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Additional Message</label>
                  <textarea
                    rows="2"
                    placeholder="Message to owner..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none"
                  />
                </div>

                {/* pricing summaries */}
                {days > 0 && (
                  <div className="p-3 bg-surface border border-border/80 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-gray-400">
                      <span>Daily rate</span>
                      <span>₹{equipment.rentalPricePerDay} x {days} days</span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-400">
                      <span>Security Deposit</span>
                      <span>₹{equipment.securityDeposit}</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 flex justify-between font-extrabold text-white">
                      <span>Total (P2P agreement)</span>
                      <span className="text-primary text-sm">₹{(totalAmount + equipment.securityDeposit).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isBooking || days <= 0}
                  className="w-full text-xs font-bold py-3 rounded-xl mt-2 flex justify-center items-center gap-1.5 shadow-lg shadow-primary/10"
                >
                  {isBooking ? (
                    <>
                      <Loader size="xs" />
                      <span>Sending Booking...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Book Equipment Lease</span>
                    </>
                  )}
                </Button>

                <p className="text-[9px] text-gray-500 text-center leading-relaxed font-semibold">
                  This transaction is handled directly peer-to-peer at pick-up.
                </p>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
