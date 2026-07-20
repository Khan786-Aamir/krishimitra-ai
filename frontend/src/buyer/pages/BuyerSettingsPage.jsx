import React, { useState } from 'react';
import { Settings, Bell, Shield, Moon, Save, Check } from 'lucide-react';

export const BuyerSettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailAlerts: true,
    priceDropAlerts: true,
    wishlistRestock: true,
    twoFactor: false
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Buyer Account Settings</h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Manage system notification preferences, security protocols, and platform defaults.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Account settings updated successfully!</span>
        </div>
      )}

      {/* Notifications Panel */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-text font-display">Notification Preferences</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Price Drop Alerts</h5>
              <p className="text-text/50 text-[11px]">Receive alerts when saved wishlist crop prices decrease.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.priceDropAlerts}
              onChange={() => handleToggle('priceDropAlerts')}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Wishlist Restock Notifications</h5>
              <p className="text-text/50 text-[11px]">Get notified when out-of-stock crops are replenished by farmers.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.wishlistRestock}
              onChange={() => handleToggle('wishlistRestock')}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Email Order Status Updates</h5>
              <p className="text-text/50 text-[11px]">Receive dispatch tracking updates via registered email.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={() => handleToggle('emailAlerts')}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Security Panel */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-text font-display">Security & Authentication</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-text">Two-Factor Authentication (2FA)</h5>
              <p className="text-text/50 text-[11px]">Require OTP verification during login sessions.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactor}
              onChange={() => handleToggle('twoFactor')}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default BuyerSettingsPage;
