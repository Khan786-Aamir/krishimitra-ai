import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Building2, Award, DollarSign, Clock, Phone, FileText, Save, Edit3, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import expertService from '../services/expertService';
import { LoadingSkeleton, ErrorState } from '../components/ui/StateViews';

export const ExpertProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for creating / editing profile
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    institute: '',
    experienceYears: '',
    specializations: '',
    languages: 'English, Hindi',
    consultationFee: '500',
    workingHours: '09:00 AM - 05:00 PM (Mon - Sat)',
    phone: '',
    bio: ''
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const prof = await expertService.getProfile();
      if (prof) {
        setProfile(prof);
        setFormData({
          name: user?.name || '',
          qualification: prof.qualification || '',
          institute: prof.institute || '',
          experienceYears: prof.experienceYears || '',
          specializations: Array.isArray(prof.specializations) ? prof.specializations.join(', ') : prof.specializations || '',
          languages: Array.isArray(prof.languages) ? prof.languages.join(', ') : prof.languages || '',
          consultationFee: prof.consultationFee || '500',
          workingHours: prof.workingHours || '09:00 AM - 05:00 PM (Mon - Sat)',
          phone: prof.phone || user?.phone || '',
          bio: prof.bio || ''
        });
      } else {
        setProfile(null);
        setFormData((prev) => ({
          ...prev,
          name: user?.name || '',
          phone: user?.phone || ''
        }));
      }
    } catch (err) {
      setError('Unable to load expert profile.');
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
      const payload = {
        name: formData.name,
        qualification: formData.qualification,
        institute: formData.institute,
        experienceYears: Number(formData.experienceYears),
        specializations: formData.specializations.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
        consultationFee: Number(formData.consultationFee),
        workingHours: formData.workingHours,
        phone: formData.phone,
        bio: formData.bio
      };

      const updated = await expertService.updateProfile(payload);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save profile to MongoDB.');
    }
  };

  if (loading) return <LoadingSkeleton type="cards" count={2} />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  // Case 1: Profile does not exist OR user clicked Edit -> Show "Complete Your Expert Profile" Form
  if (!profile || isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">
                {!profile ? 'Complete Your Expert Profile' : 'Edit Professional Credentials'}
              </h2>
              <p className="text-xs text-text/50">
                Provide certified credentials, degrees, and consulting parameters to activate your expert advisory account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-text/60 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Dr. Ramesh Sharma"
                />
              </div>

              <div>
                <label className="text-text/60 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-text/60 font-semibold block mb-1">Highest Qualification</label>
                <input
                  type="text"
                  required
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Ph.D. in Plant Pathology / M.Sc. Agronomy"
                />
              </div>

              <div>
                <label className="text-text/60 font-semibold block mb-1">Institute / University</label>
                <input
                  type="text"
                  required
                  value={formData.institute}
                  onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Punjab Agricultural University (PAU)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-text/60 font-semibold block mb-1">Years of Experience</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 12"
                />
              </div>

              <div>
                <label className="text-text/60 font-semibold block mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="text-text/60 font-semibold block mb-1">Languages Spoken</label>
                <input
                  type="text"
                  required
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                  placeholder="English, Hindi, Punjabi"
                />
              </div>
            </div>

            <div>
              <label className="text-text/60 font-semibold block mb-1">Specializations (Comma separated)</label>
              <input
                type="text"
                required
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                placeholder="Cereal Crop Diseases, Organic Bio-Pesticides, Precision Irrigation"
              />
            </div>

            <div>
              <label className="text-text/60 font-semibold block mb-1">Working Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                placeholder="09:00 AM - 05:00 PM (Mon - Sat)"
              />
            </div>

            <div>
              <label className="text-text/60 font-semibold block mb-1">Professional Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-emerald-500"
                placeholder="Brief summary of your research background, crop field experience, and advisory focus..."
              />
            </div>

            <div className="flex gap-3 pt-3">
              {profile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-surface hover:bg-border text-text font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Expert Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Case 2: Profile exists -> Display dynamic MongoDB profile
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text font-display">{user?.name || 'Dr. Expert'}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Agronomist
                </span>
              </div>
              <p className="text-xs text-text/50 flex items-center gap-1.5 mt-1 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.qualification} • {profile.institute}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Credentials</span>
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-text font-display pb-3 border-b border-border/60">Expertise & Consulting Parameters</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-text/50">Experience:</span>
              <span className="font-bold text-text">{profile.experienceYears} Years Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Consultation Fee:</span>
              <span className="font-extrabold text-emerald-400">₹{profile.consultationFee} / session</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Working Hours:</span>
              <span className="font-semibold text-text">{profile.workingHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Languages:</span>
              <span className="font-semibold text-text">
                {Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/50">Direct Phone:</span>
              <span className="font-semibold text-text">{profile.phone || user?.phone || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-text font-display pb-3 border-b border-border/60">Specializations & Bio</h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-text/50 block mb-1.5">Focus Areas:</span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(profile.specializations) ? profile.specializations : [profile.specializations]).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {profile.bio && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-text/50 block mb-1">Professional Bio:</span>
                <p className="text-text/80 leading-relaxed bg-surface/50 p-3 rounded-xl border border-border/40">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;
