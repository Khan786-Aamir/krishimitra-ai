import React, { useState } from 'react';
import { Settings, Bell, Shield, Moon, Globe, Save, Check } from 'lucide-react';

export const ExpertSettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    reviewAlerts: true,
    consultationAlerts: true,
    emailDigest: true,
    twoFactor: false,
    preferredLanguage: 'English'
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Expert Portal Settings</h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Configure advisory notification alerts, security parameters, and regional preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Bell className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-text font-display">Notification Settings</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">AI Diagnosis Review Queue Alerts</h5>
              <p className="text-text/50 text-[11px]">Notify immediately when high-severity leaf scans enter your validation queue.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reviewAlerts}
              onChange={() => handleToggle('reviewAlerts')}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Direct Consultation Notifications</h5>
              <p className="text-text/50 text-[11px]">Receive instant popups for urgent farmer consultation requests.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.consultationAlerts}
              onChange={() => handleToggle('consultationAlerts')}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-text font-display">Security & Credentials Protection</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Two-Factor Authentication (2FA)</h5>
              <p className="text-text/50 text-[11px]">Require SMS/Email OTP verification when signing into the expert panel.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactor}
              onChange={() => handleToggle('twoFactor')}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ExpertSettingsPage;
