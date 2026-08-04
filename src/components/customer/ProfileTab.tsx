import React, { useState } from 'react';
import { UserProfile, ArchitecturalStyle } from '../../types';
import { User, Mail, Phone, Building2, MapPin, Shield, Bell, Check, Save, Sparkles, Camera } from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile | null;
  onSaveProfile?: (updated: Partial<UserProfile>) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onSaveProfile }) => {
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.jenkins@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (512) 555-0192');
  const [organization, setOrganization] = useState(user?.organization || 'Jenkins Eco Living LLC');
  const [location, setLocation] = useState('Austin, TX (Hill Country Zone)');
  const [preferredStyle, setPreferredStyle] = useState<ArchitecturalStyle>('modern_minimalist');
  const [budgetRange, setBudgetRange] = useState('$300k - $600k');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [stampAlerts, setStampAlerts] = useState(true);
  const [priceDigest, setPriceDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({
        name,
        email,
        phone,
        organization,
        avatarUrl,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Customer Account Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal contact details, organizational metadata, and alert preferences.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Verified Customer
        </span>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
          <div className="relative inline-block">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-blue-500/50 shadow-xl mx-auto"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{organization}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-300">
              Customer ID: {user?.id || 'usr_customer_1'}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left space-y-3">
            <p className="text-xs font-semibold text-slate-300">Choose Avatar Preset:</p>
            <div className="flex justify-center gap-2">
              {sampleAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i}`}
                  onClick={() => setAvatarUrl(url)}
                  className={`w-10 h-10 rounded-full cursor-pointer object-cover border-2 transition-all ${
                    avatarUrl === url ? 'border-blue-500 scale-110' : 'border-slate-800 hover:border-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Form */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" /> Personal & Building Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization / LLC</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Construction Region</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Architectural Style</label>
                <select
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value as ArchitecturalStyle)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="modern_minimalist">Modern Minimalist</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="industrial_loft">Industrial Loft</option>
                  <option value="eco_sustainable">Eco Sustainable</option>
                  <option value="classic_colonial">Classic Colonial</option>
                  <option value="contemporary_glass">Contemporary Glass</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences & Security Box */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Notifications & Security Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-white">Email Digest & System Alerts</p>
                  <p className="text-[11px] text-slate-400">Receive notifications when PE stamp is issued or plan status updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-white">Engineering Review Alerts</p>
                  <p className="text-[11px] text-slate-400">Instant SMS/email alert when engineer submits structural notes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={stampAlerts}
                  onChange={(e) => setStampAlerts(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-400">Protect account with authenticator app or SMS code.</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
