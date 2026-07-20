import React, { useState } from 'react';
import { Settings, Lock, Bell, Eye, Save, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [success, setSuccess] = useState(false);
  const [notifs, setNotifs] = useState({
    smsAlerts: true,
    emailAlerts: false,
    diseaseAlerts: true,
    marketUpdates: true
  });

  const handleToggle = (key) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">System Settings</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Adjust portal preferences, security alerts, and system notification rules.
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-bold">
          Settings configuration successfully saved!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation list stub */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-2 h-fit">
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-primary bg-primary/10 border-l-2 border-primary rounded-xl text-left">
            <Settings className="w-4.5 h-4.5" /> General Preferences
          </button>
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-text/60 hover:text-text hover:bg-surface/50 rounded-xl text-left cursor-pointer">
            <Lock className="w-4.5 h-4.5" /> Security & Passwords
          </button>
          <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-text/60 hover:text-text hover:bg-surface/50 rounded-xl text-left cursor-pointer">
            <Bell className="w-4.5 h-4.5" /> Notifications setup
          </button>
        </div>

        {/* Content detail panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium">
            <h3 className="font-bold text-sm text-text mb-4">UI Theme Options</h3>
            <div className="flex items-center justify-between p-4 bg-surface/50 border border-border/40 rounded-xl text-xs font-semibold">
              <div>
                <span className="block text-text">Platform Layout Theme</span>
                <span className="block text-[10px] text-text/40 mt-0.5">Toggle between sleek dark and light interfaces</span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-surface hover:bg-border border border-border font-bold rounded-xl transition-all capitalize cursor-pointer text-text"
              >
                {theme} Mode
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium">
            <h3 className="font-bold text-sm text-text mb-4">Notification Subscriptions</h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-text/80">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span>Hyperlocal SMS weather warnings</span>
                  <input
                    type="checkbox"
                    checked={notifs.smsAlerts}
                    onChange={() => handleToggle('smsAlerts')}
                    className="accent-primary cursor-pointer w-4 h-4"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Weekly email harvest summaries</span>
                  <input
                    type="checkbox"
                    checked={notifs.emailAlerts}
                    onChange={() => handleToggle('emailAlerts')}
                    className="accent-primary cursor-pointer w-4 h-4"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Disease blight scanning warnings</span>
                  <input
                    type="checkbox"
                    checked={notifs.diseaseAlerts}
                    onChange={() => handleToggle('diseaseAlerts')}
                    className="accent-primary cursor-pointer w-4 h-4"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Market crop price bid alerts</span>
                  <input
                    type="checkbox"
                    checked={notifs.marketUpdates}
                    onChange={() => handleToggle('marketUpdates')}
                    className="accent-primary cursor-pointer w-4 h-4"
                  />
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 mt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/10 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
