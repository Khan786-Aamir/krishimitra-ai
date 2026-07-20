import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Scale, Award, Calendar, Layers, ShieldCheck, Save, Globe } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

export const FarmerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    farmSize: 5,
    location: '',
    membership: 'Basic',
    experience: 5,
    primaryCrops: '',
    preferredLanguage: 'English'
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboard();
      if (res.success) {
        const prof = res.data.profile;
        setProfile(prof);
        setFormData({
          name: res.data.profile.name || 'Farmer Client', // Fallback name
          phone: res.data.profile.phone || '',
          farmSize: prof.farmSize || 5,
          location: prof.location || '',
          membership: prof.membership || 'Basic',
          experience: prof.experience || 5,
          primaryCrops: prof.primaryCrops ? prof.primaryCrops.join(', ') : '',
          preferredLanguage: prof.preferredLanguage || 'English'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      
      const payload = {
        ...formData,
        primaryCrops: formData.primaryCrops.split(',').map(c => c.trim()).filter(Boolean)
      };

      const res = await dashboardService.updateProfile(payload);
      if (res.success) {
        setSuccessMsg('Farmer profile successfully updated in database ledger!');
        // Refresh local cache
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-1/4 bg-card rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-card rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-80 bg-card rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Farmer Profile Configuration</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Customize your farming details, crops expertise, and platform privileges.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-premium space-y-5 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-3xl">
            {formData.name ? formData.name[0].toUpperCase() : 'F'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">{formData.name}</h3>
            <span className="inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary mt-1">
              Role: Farmer • {profile?.membership}
            </span>
          </div>

          <div className="w-full text-xs text-text/60 font-semibold border-t border-border/40 pt-4 space-y-3.5 text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>Location: {profile?.location || 'Not Specified'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-primary shrink-0" />
              <span>Farm Size: {profile?.farmSize || 0} Acres</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>Experience: {profile?.experience || 0} Years Sowing</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">Crops: {profile?.primaryCrops ? profile.primaryCrops.join(', ') : 'None'}</span>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-premium">
          <h3 className="font-bold text-sm text-text mb-5">Configure Farm Details</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Farmer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Farm Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana, Punjab"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Farm Size (Acres)</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={formData.farmSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Primary Crops (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat, Paddy Rice"
                  value={formData.primaryCrops}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryCrops: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Preferred Language
                </label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/10 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving ledgers...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
