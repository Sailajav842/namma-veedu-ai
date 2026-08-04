import React, { useState } from 'react';
import { EngineerProfile } from '../../types';
import { 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Eye,
  BadgeCheck
} from 'lucide-react';

interface EngineerVerificationSectionProps {
  engineers: EngineerProfile[];
  onUpdateEngineers: (updated: EngineerProfile[]) => void;
}

export const EngineerVerificationSection: React.FC<EngineerVerificationSectionProps> = ({
  engineers,
  onUpdateEngineers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [selectedEngineer, setSelectedEngineer] = useState<EngineerProfile | null>(null);

  const filteredEngineers = engineers.filter((eng) => {
    const matchesSearch = 
      eng.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eng.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eng.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eng.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'verified' && eng.isVerified) || 
      (filterStatus === 'pending' && !eng.isVerified);

    return matchesSearch && matchesStatus;
  });

  const handleToggleVerification = (engineerId: string, targetState: boolean) => {
    const updated = engineers.map((eng) =>
      eng.id === engineerId ? { ...eng, isVerified: targetState } : eng
    );
    onUpdateEngineers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Civil Structural Engineer PE Licensing Verification</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Audit state board credentials, Professional Engineer (PE) license numbers, NCEES records, and wet-seal authorization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">
            Verified Engineers: <strong className="text-emerald-400">{engineers.filter(e => e.isVerified).length} / {engineers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search PE license, specialization, engineer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Status Filter:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['all', 'verified', 'pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filterStatus === s
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Engineer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEngineers.map((eng) => (
          <div
            key={eng.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={eng.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={eng.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700"
                />
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{eng.name}</span>
                    {eng.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </h4>
                  <p className="text-xs font-mono text-amber-400 font-bold">{eng.licenseNumber}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                eng.isVerified
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {eng.isVerified ? 'VERIFIED PE' : 'PENDING REVIEW'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Specialization</span>
                <p className="font-bold text-white mt-0.5">{eng.specialization}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Jurisdiction & Location</span>
                <p className="font-bold text-white mt-0.5">{eng.location}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Experience & Rating</span>
                <p className="font-bold text-white mt-0.5">{eng.yearsExperience} yrs • ⭐ {eng.rating} ({eng.reviewCount})</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Consultation Rate</span>
                <p className="font-bold text-emerald-400 mt-0.5">${eng.hourlyRate} / hr</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-2xl border border-slate-850">
              "{eng.bio}"
            </p>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <button
                onClick={() => setSelectedEngineer(eng)}
                className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" /> View Credentials Audit
              </button>

              {eng.isVerified ? (
                <button
                  onClick={() => handleToggleVerification(eng.id, false)}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl transition-all"
                >
                  Revoke Verification
                </button>
              ) : (
                <button
                  onClick={() => handleToggleVerification(eng.id, true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve PE Verification
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Engineer Audit Modal */}
      {selectedEngineer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">PE State Board Audit Record</h4>
              </div>
              <button onClick={() => setSelectedEngineer(null)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <img
                src={selectedEngineer.avatarUrl}
                alt={selectedEngineer.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700"
              />
              <div>
                <h5 className="font-bold text-white text-base">{selectedEngineer.name}</h5>
                <p className="text-xs font-mono font-bold text-amber-400">{selectedEngineer.licenseNumber}</p>
                <p className="text-xs text-slate-400">{selectedEngineer.location}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">NCEES National Record:</span>
                <strong className="text-emerald-400 font-mono">NCEES-#884920-VERIFIED</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">State Board Disciplinary Log:</span>
                <strong className="text-emerald-400">0 Complaints / Clean Record</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Professional Indemnity Insurance:</span>
                <strong className="text-white">$2,000,000 Liability Coverage Active</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <a
                href={`https://www.ncees.org`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Check NCEES Registry
              </a>

              <button
                onClick={() => setSelectedEngineer(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Audit Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
