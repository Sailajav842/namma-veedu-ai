import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { 
  User, 
  Award, 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  DollarSign, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Sparkles,
  Camera
} from 'lucide-react';

interface ProfileSectionProps {
  profile: EngineerProfile;
  onSaveProfile: (p: EngineerProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onSaveProfile }) => {
  const [form, setForm] = useState<EngineerProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={form.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={form.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/30 shadow-lg"
              />
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt('Enter new Avatar Image URL:', form.avatarUrl);
                  if (url) setForm({ ...form, avatarUrl: url });
                }}
                className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-semibold text-white gap-1"
              >
                <Camera className="w-4 h-4 text-amber-400" /> Change
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{form.name}</h2>
                {form.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified PE
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400 font-semibold">{form.specialization}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-slate-500" /> {form.licenseNumber}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {form.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {form.yearsExperience} Yrs Exp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rate</span>
              <p className="text-lg font-extrabold text-amber-400">${form.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
            </div>
            <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</span>
              <p className="text-lg font-extrabold text-white">{form.completedProjects}+ <span className="text-xs font-normal text-slate-400">Plans</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Engineer Profile & Credentials</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your public credentials, engineering bio, contact information, and hourly consultation rate.
            </p>
          </div>

          {isSaved && (
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Profile Synced to Database!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name & Post-nominals</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary PE License Number</label>
            <input
              type="text"
              value={form.licenseNumber}
              onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Engineering Specialization</label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder="e.g. Structural & Seismic Engineering"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Years of Practice Experience</label>
            <input
              type="number"
              value={form.yearsExperience}
              onChange={(e) => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Consultation Hourly Rate ($ USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: parseInt(e.target.value) || 0 })}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Office Practice Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Engineering Email</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Bio & Structural Philosophy</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            placeholder="Describe your structural expertise, foundation modeling preferences, and codes handled..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile & Sync
          </button>
        </div>
      </form>
    </div>
  );
};
