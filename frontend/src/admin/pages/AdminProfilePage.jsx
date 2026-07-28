import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Award, FileText, CheckCircle, Save, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import adminService from '../../services/adminService';
import { Button, Input, Textarea, Badge } from '../../components/ui';

export const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [department, setDepartment] = useState('Ecosystem Operations');
  const [role, setRole] = useState('Super Admin');
  const [bio, setBio] = useState('');
  const [permissionsInput, setPermissionsInput] = useState('User Management, Marketplace Audits, Scheme Publishing, System Settings');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProfile();
      if (res && res.success) {
        setProfileExists(res.profileExists);
        if (res.profileExists && res.data) {
          setProfile(res.data);
          setDepartment(res.data.department);
          setRole(res.data.role);
          setBio(res.data.bio || '');
          setPermissionsInput((res.data.permissions || []).join(', '));
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const permsArray = permissionsInput.split(',').map(p => p.trim()).filter(Boolean);
      await adminService.saveProfile({
        department,
        role,
        bio,
        permissions: permsArray
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile && !profileExists) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-card rounded-2xl" />
        <div className="h-60 bg-card rounded-2xl" />
      </div>
    );
  }

  const completionPercentage = profileExists ? 100 : 30;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Admin System Profile
        </h1>
        <p className="text-gray-400 text-xs mt-1">Configure your department details, role clearance, and biographic summary.</p>
      </div>

      {/* Complete Profile Warning Banner if Profile is Missing */}
      {!profileExists && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-white">Complete Your Admin Profile</h4>
            <p className="text-gray-400 mt-1">Your administrator profile database record is incomplete. Please submit your department details, clearance level, and permissions below to finalize authorization.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Profile & Status Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl font-black mx-auto">
              {profile?.name ? profile.name[0].toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{profile?.name || 'Administrator'}</h3>
              <span className="text-[10px] text-gray-500 block font-mono">{profile?.email || 'admin@krishimitra.com'}</span>
            </div>
            
            <div className="w-full bg-surface border border-border/60 rounded-2xl p-3 text-left space-y-1.5 text-[11px]">
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Security Clearence</span>
                <span className="text-primary">{role}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Department</span>
                <span className="text-white">{department}</span>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-gray-400">Profile Completion</span>
                <span className="text-primary">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Audit Trail Metadata */}
          {profileExists && (
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4 text-xs">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Security Access Log</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-gray-500 tracking-wider">Last Login Session</span>
                    <span className="text-white font-medium">{new Date(profile.lastLogin || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-gray-500 tracking-wider">Last Password Change</span>
                    <span className="text-white font-medium">{new Date(profile.lastPasswordChange || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Settings & Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white font-display pb-3 border-b border-border/40 mb-5">
              Edit Operation Profile
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Department Division"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  placeholder="e.g. Ecosystem Operations"
                />
                <Input
                  label="Administrative Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Super Admin"
                />
              </div>

              <Input
                label="Assigned System Permissions (comma separated)"
                value={permissionsInput}
                onChange={(e) => setPermissionsInput(e.target.value)}
                placeholder="e.g. User Management, Marketplace Audits"
              />

              <Textarea
                label="Operation Bio / Role Description"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Enter a brief biographic description of your operation parameters..."
              />

              {/* Permissions Preview badging */}
              {permissionsInput && (
                <div className="space-y-2">
                  <span className="block text-gray-400 font-bold uppercase tracking-wider text-[9px]">Permissions Badges</span>
                  <div className="flex flex-wrap gap-1">
                    {permissionsInput.split(',').map((p, idx) => {
                      const text = p.trim();
                      if (!text) return null;
                      return (
                        <Badge key={idx} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                          {text}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button type="submit" className="flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Save Operational Profile</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfilePage;
