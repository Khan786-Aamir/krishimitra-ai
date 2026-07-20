import React, { useState, useEffect } from 'react';
import { User, Building2, MapPin, Phone, Mail, FileText, Edit3, Save, X, ShieldCheck, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import buyerService from '../services/buyerService';
import { LoadingSkeleton, ErrorState } from '../components/ui/StateViews';

export const BuyerProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    businessType: 'Wholesaler',
    gstNumber: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    preferredCrops: ''
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const dash = await buyerService.getDashboard();
      const prof = dash.profile || {};
      setProfileData(prof);
      setFormData({
        name: user?.name || 'AgriCorp Buyer',
        companyName: prof.companyName || 'AgriCorp Trading Co.',
        businessType: prof.businessType || 'Wholesaler',
        gstNumber: prof.gstNumber || '06AAAAC1234H1Z5',
        phone: user?.phone || '+91 98765 00000',
        street: prof.address?.street || 'GT Road Wholesale Hub',
        city: prof.address?.city || 'Karnal',
        state: prof.address?.state || 'Haryana',
        pincode: prof.address?.pincode || '132001',
        preferredCrops: (prof.preferredCrops || []).join(', ')
      });
    } catch (err) {
      setError('Unable to load buyer profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        name: formData.name,
        companyName: formData.companyName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        preferredCrops: formData.preferredCrops.split(',').map((c) => c.trim()).filter(Boolean)
      };

      await buyerService.updateProfile(updated);
      setProfileData((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loading) return <LoadingSkeleton type="cards" count={2} />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/30 flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text font-display">{user?.name || 'Buyer Account'}</h1>
                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Wholesale Buyer
                </span>
              </div>
              <p className="text-xs text-text/50 flex items-center gap-1.5 mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{profileData?.companyName} ({profileData?.businessType})</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile Details */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-text font-display pb-3 border-b border-border/60">Business Information</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-text/50">Company Name:</span>
              <span className="font-bold text-text">{profileData?.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Business Category:</span>
              <span className="font-semibold text-text">{profileData?.businessType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">GST Identification Number:</span>
              <span className="font-mono font-semibold text-indigo-400">{profileData?.gstNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Contact Phone:</span>
              <span className="font-semibold text-text">{user?.phone || '+91 98765 00000'}</span>
            </div>
          </div>
        </div>

        {/* Address & Delivery Locations */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-text font-display pb-3 border-b border-border/60">Warehouse & Address</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-text/50 block text-[10px]">Registered Address</span>
                <span className="font-semibold text-text leading-relaxed">
                  {profileData?.address?.street}, {profileData?.address?.city}, {profileData?.address?.state} - {profileData?.address?.pincode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-text font-display">Edit Buyer Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 text-text/40 hover:text-text cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text/60 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-text/60 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text/60 block mb-1">GST Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-text/60 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-text/60 block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-text/60 block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-text/60 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-surface hover:bg-border text-text font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfilePage;
