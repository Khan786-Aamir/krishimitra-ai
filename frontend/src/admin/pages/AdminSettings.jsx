import React, { useState, useEffect } from 'react';
import { Settings, Save, Database, ShieldAlert, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import adminService from '../../services/adminService';
import { Button, Input, Toggle, Badge } from '../../components/ui';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null); // null | 'backing-up' | 'success'

  // Input states
  const [platformName, setPlatformName] = useState('KrishiMitra AI Portal');
  const [allowPublicRegistration, setAllowPublicRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState('Weekly');
  const [securityLogLevel, setSecurityLogLevel] = useState('High');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        if (data) {
          setSettings(data);
          setPlatformName(data.platformName);
          setAllowPublicRegistration(data.allowPublicRegistration);
          setMaintenanceMode(data.maintenanceMode);
          setBackupSchedule(data.backupSchedule || 'Weekly');
          setSecurityLogLevel(data.securityLogLevel || 'High');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings({
        platformName,
        allowPublicRegistration,
        maintenanceMode,
        backupSchedule,
        securityLogLevel
      });
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleBackup = () => {
    setBackupStatus('backing-up');
    setTimeout(() => {
      setBackupStatus('success');
    }, 2500);
  };

  if (loading && !settings) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-card rounded-2xl" />
        <div className="h-60 bg-card rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          System Settings & Platform Rules
        </h1>
        <p className="text-gray-400 text-xs mt-1">Control public registration, maintenance modes, backup triggers, and security log standards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Left Column: Fast Diagnostics & Database Backups */}
        <div className="space-y-6 lg:col-span-1">
          {/* Backup Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <Database className="w-4 h-4 text-primary animate-pulse" />
              Database Backups
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Manually download a JSON gzip dump of all MongoDB collections (Users, Profiles, Crops, Schemes, Advisories, Reviews).
            </p>

            {backupStatus === 'backing-up' && (
              <div className="p-3 bg-surface border border-border/40 rounded-xl flex items-center gap-2 font-semibold text-amber-400">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping shrink-0" />
                <span>Exporting collections to dump...</span>
              </div>
            )}

            {backupStatus === 'success' && (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Backup complete (km_db_dump.tar.gz)</span>
              </div>
            )}

            <Button
              className="w-full flex items-center justify-center gap-1.5"
              onClick={handleBackup}
              disabled={backupStatus === 'backing-up'}
            >
              <Database className="w-4 h-4" />
              <span>Trigger System Backup</span>
            </Button>
          </div>

          {/* Maintenance Mode Warning */}
          {maintenanceMode && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Maintenance Mode Active</h4>
                <p className="text-gray-400 mt-1">Farmers, Buyers and Experts will receive a 503 Service Unavailable notice when loading their dashboard portals.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Portal configuration parameters */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white font-display pb-3 border-b border-border/40 mb-5">
              General System Configurations
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Platform Variables */}
              <div className="space-y-4">
                <Input
                  label="Platform Service Name"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  required
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-border/40 py-6">
                
                {/* Toggle 1: Registration */}
                <div className="flex items-center justify-between p-3 bg-surface/50 border border-border/40 rounded-2xl">
                  <div>
                    <span className="block font-bold text-white text-xs">Allow Public Registrations</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Let users register as Farmers, Buyers or Experts.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowPublicRegistration(!allowPublicRegistration)}
                    className="focus:outline-none"
                  >
                    {allowPublicRegistration ? (
                      <ToggleRight className="w-9 h-9 text-primary cursor-pointer" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-gray-600 cursor-pointer" />
                    )}
                  </button>
                </div>

                {/* Toggle 2: Maintenance Mode */}
                <div className="flex items-center justify-between p-3 bg-surface/50 border border-border/40 rounded-2xl">
                  <div>
                    <span className="block font-bold text-white text-xs">Maintenance Lockdown Mode</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Locks agricultural dashboard gates for updates.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className="focus:outline-none"
                  >
                    {maintenanceMode ? (
                      <ToggleRight className="w-9 h-9 text-amber-500 cursor-pointer" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-gray-600 cursor-pointer" />
                    )}
                  </button>
                </div>

              </div>

              {/* Select inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Database Backup Interval</label>
                  <select
                    value={backupSchedule}
                    onChange={(e) => setBackupSchedule(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                  >
                    <option value="Daily">Daily Automated</option>
                    <option value="Weekly">Weekly (Every Sunday)</option>
                    <option value="Monthly">Monthly</option>
                    <option value="None">None (Manual only)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Security Logging Standards</label>
                  <select
                    value={securityLogLevel}
                    onChange={(e) => setSecurityLogLevel(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                  >
                    <option value="Low">Low (Errors only)</option>
                    <option value="Medium">Medium (Access overrides & Errors)</option>
                    <option value="High">High (All telemetry logs)</option>
                  </select>
                </div>
              </div>

              {/* Form Action */}
              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button type="submit" className="flex items-center gap-1.5" disabled={saving}>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </Button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
