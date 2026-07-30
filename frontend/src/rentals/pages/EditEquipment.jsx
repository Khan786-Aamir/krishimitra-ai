import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tractor, ArrowLeft, Loader, Plus, Trash } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, ImageUpload } from '../../components/ui';

export const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [category, setCategory] = useState('Tractors');
  const [description, setDescription] = useState('');
  const [rentalPricePerDay, setRentalPricePerDay] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [minRentalDays, setMinRentalDays] = useState(1);
  const [maxRentalDays, setMaxRentalDays] = useState(30);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [condition, setCondition] = useState('Good');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [yearOfPurchase, setYearOfPurchase] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');

  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState(['']);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoadingDetails(true);
        const data = await equipmentService.getEquipmentDetails(id);
        if (data && data.equipment) {
          const eq = data.equipment;
          setEquipmentName(eq.equipmentName || '');
          setCategory(eq.category || 'Tractors');
          setDescription(eq.description || '');
          setRentalPricePerDay(eq.rentalPricePerDay !== undefined ? eq.rentalPricePerDay.toString() : '');
          setSecurityDeposit(eq.securityDeposit !== undefined ? eq.securityDeposit.toString() : '');
          setMinRentalDays(eq.minRentalDays || 1);
          setMaxRentalDays(eq.maxRentalDays || 30);
          setLocation(eq.location || '');
          setDistrict(eq.district || '');
          setState(eq.state || '');
          setContactNumber(eq.contactNumber || '');
          setCondition(eq.condition || 'Good');
          setBrand(eq.brand || '');
          setModel(eq.model || '');
          setYearOfPurchase(eq.yearOfPurchase !== undefined ? eq.yearOfPurchase.toString() : '');
          setWorkingHours(eq.workingHours !== undefined ? eq.workingHours.toString() : '0');
          setFuelType(eq.fuelType || 'Diesel');

          if (eq.images && eq.images.length > 0) {
            setImages(eq.images);
          } else {
            setImages([]);
          }

          if (eq.attachments && eq.attachments.length > 0) {
            setAttachments(eq.attachments);
          } else {
            setAttachments(['']);
          }
        }
      } catch (err) {
        addToast('Failed to load equipment details for editing', 'error');
        navigate('/rentals/my-equipment');
      } finally {
        setLoadingDetails(false);
      }
    };
    loadDetails();
  }, [id]);

  // Removed handleAddImageUrlField, handleRemoveImageUrlField, and handleImageUrlChange

  const handleAddAttachmentField = () => {
    setAttachments([...attachments, '']);
  };

  const handleRemoveAttachmentField = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleAttachmentChange = (idx, val) => {
    const updated = [...attachments];
    updated[idx] = val;
    setAttachments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(rentalPricePerDay) <= 0) {
      addToast('Rental price must be a positive number', 'error');
      return;
    }

    if (Number(securityDeposit) < 0) {
      addToast('Security deposit cannot be negative', 'error');
      return;
    }

    if (Number(minRentalDays) <= 0 || Number(maxRentalDays) <= 0) {
      addToast('Rental day limits must be positive numbers', 'error');
      return;
    }

    if (Number(minRentalDays) > Number(maxRentalDays)) {
      addToast('Minimum rental days cannot exceed maximum rental days', 'error');
      return;
    }

    const phonePattern = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phonePattern.test(contactNumber.replace(/\s+/g, ''))) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const filteredImages = images.length > 0 ? images : [
      {
        url: 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=600',
        filename: 'placeholder'
      }
    ];

    const filteredAttachments = attachments.filter(at => at.trim() !== '');

    const payload = {
      equipmentName,
      category,
      description,
      rentalPricePerDay: Number(rentalPricePerDay),
      securityDeposit: Number(securityDeposit),
      minRentalDays: Number(minRentalDays),
      maxRentalDays: Number(maxRentalDays),
      location,
      district,
      state,
      contactNumber,
      condition,
      brand,
      model,
      yearOfPurchase: yearOfPurchase ? Number(yearOfPurchase) : undefined,
      workingHours: workingHours ? Number(workingHours) : 0,
      fuelType,
      images: filteredImages,
      attachments: filteredAttachments
    };

    try {
      setLoading(true);
      const res = await equipmentService.updateEquipment(id, payload);
      if (res.success) {
        addToast('Machinery listing updated successfully!', 'success');
        navigate('/rentals/my-equipment');
      }
    } catch (err) {
      addToast(err.error?.message || 'Failed to update machinery listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Tractors',
    'Harvesters',
    'Tillers & Cultivators',
    'Seeders & Planters',
    'Irrigation Equipment',
    'Sprayers',
    'Hand Tools',
    'Other'
  ];

  const conditions = ['Excellent', 'Good', 'Fair', 'Needs Repair'];
  const fuels = ['Diesel', 'Petrol', 'Electric', 'CNG', 'Manual', 'None'];

  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/rentals/my-equipment')}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to inventory
      </button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Edit Machinery Listing</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Modify lease rates, pick-up availability states, and add accessories descriptions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-6 text-xs font-semibold">
        
        {/* Basic Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border/40 pb-2">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Equipment Name *</label>
              <input
                type="text"
                required
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Description *</label>
            <textarea
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface border border-border/80 rounded-xl py-2 px-3 text-text focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing & Deposit */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-white pb-1">Rental Terms & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Daily Rate (₹) *</label>
              <input
                type="number"
                required
                value={rentalPricePerDay}
                onChange={(e) => setRentalPricePerDay(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Security Deposit (₹) *</label>
              <input
                type="number"
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Min Rental Days *</label>
              <input
                type="number"
                required
                min="1"
                value={minRentalDays}
                onChange={(e) => setMinRentalDays(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Max Rental Days *</label>
              <input
                type="number"
                required
                min="1"
                value={maxRentalDays}
                onChange={(e) => setMaxRentalDays(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-white pb-1">Technical Specs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Year of Purchase</label>
              <input
                type="number"
                value={yearOfPurchase}
                onChange={(e) => setYearOfPurchase(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Working Hours</label>
              <input
                type="number"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              >
                {fuels.map((f, i) => (
                  <option key={i} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-white pb-1">Location & Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Pick-Up Address *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Contact Phone *</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
              >
                {conditions.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Images Upload */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-white pb-1">Equipment Images</h3>
          <ImageUpload images={images} onChange={setImages} maxImages={5} />
        </div>

        {/* Dynamic Attachments Fields */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-sm font-bold text-white">Included Accessories / Attachments</h3>
            <button
              type="button"
              onClick={handleAddAttachmentField}
              className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Attachment
            </button>
          </div>
          <div className="space-y-3">
            {attachments.map((at, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="e.g. PTO Shaft, Rotavator coupling, Sprayer hose..."
                  value={at}
                  onChange={(e) => handleAttachmentChange(idx, e.target.value)}
                  className="flex-1 bg-surface border border-border/80 rounded-xl py-2.5 px-3 text-text focus:outline-none"
                />
                {attachments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachmentField(idx)}
                    className="p-2.5 bg-red-500/10 border border-red-500/20 text-rose-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 flex justify-end gap-3 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/rentals/my-equipment')}
            className="border-border hover:bg-surface text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader size="xs" />
                <span>Saving updates...</span>
              </>
            ) : (
              <>
                <Tractor className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
};
