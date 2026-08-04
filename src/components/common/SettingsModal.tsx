import React, { useState } from 'react';
import { X, Settings, Moon, Globe, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isTamil } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [district, setDistrict] = useState('Chennai');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative transition-colors duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'கணக்கு அமைப்புகள்' : 'Account & App Preferences'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Guest Session'}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Theme & Language quick toggles */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                {isTamil ? 'திரை வண்ணம் (வண்ண தீம்)' : 'Theme Mode'}
              </span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-all border border-slate-300 dark:border-slate-700 capitalize"
              >
                {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode 🌞'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {isTamil ? 'UI மொழி' : 'Interface Language'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-600/30 rounded-xl font-bold transition-all border border-emerald-500/30"
              >
                {language === 'ta' ? 'தமிழ் (TN)' : 'English (US)'}
              </button>
            </div>
          </div>

          {/* District & Region Settings */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isTamil ? 'முதன்மை கட்டுமான மாவட்டம்' : 'Primary Construction District'}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Chennai">Chennai (CMDA Jurisdiction)</option>
              <option value="Coimbatore">Coimbatore (DTCP)</option>
              <option value="Madurai">Madurai (DTCP)</option>
              <option value="Tiruchirappalli">Tiruchirappalli (DTCP)</option>
              <option value="Salem">Salem (DTCP)</option>
              <option value="Tirunelveli">Tirunelveli (DTCP)</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              {isTamil ? 'அறிவிப்பு அமைப்புகள்' : 'Notification Feeds'}
            </span>
            <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">Email Price Drop & Plan Alerts</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">WhatsApp PE Booking Alerts</span>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{isTamil ? 'சேமிக்கப்பட்டது!' : 'Preferences Saved!'}</span>
              </>
            ) : (
              <span>{isTamil ? 'அமைப்புகளை சேமி' : 'Save Preferences'}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
