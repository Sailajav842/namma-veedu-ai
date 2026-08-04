import React, { useState } from 'react';
import { EngineeringCheck, EngineeringStamp, Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  HardHat, 
  Award, 
  FileCheck2, 
  Clock, 
  Lock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface EngineeringChecklistProps {
  checks: EngineeringCheck[];
  stamp?: EngineeringStamp;
  project: Project;
  onApplyStamp: (stamp: EngineeringStamp) => void;
}

export const EngineeringChecklist: React.FC<EngineeringChecklistProps> = ({
  checks,
  stamp,
  project,
  onApplyStamp,
}) => {
  const { user, role } = useAuth();
  const [stampNotes, setStampNotes] = useState<string>('Structural frame, lateral wind shear, and foundation footings verified and certified by Lead PE.');
  const [isStamping, setIsStamping] = useState<boolean>(false);

  const handleStamp = () => {
    setIsStamping(true);
    setTimeout(() => {
      const newStamp: EngineeringStamp = {
        engineerId: user?.id || 'usr_engineer_1',
        engineerName: user?.name || 'David Vance, PE',
        licenseNumber: user?.licenseNumber || 'PE-CA-49281-CIVIL',
        stampedAt: new Date().toISOString(),
        signatureHash: `e3b0c442${Date.now()}855`,
        notes: stampNotes,
      };
      onApplyStamp(newStamp);
      setIsStamping(false);
    }, 600);
  };

  const passCount = checks.filter((c) => c.status === 'passed').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <span>Structural Civil Engineering Compliance & PE Stamping</span>
          </h3>
          <p className="text-xs text-slate-400">
            IBC 2024 Building Code compliance checks & Professional Engineer digital sign-off
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            {passCount} Passed
          </span>
          {warningCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {warningCount} Code Warnings
            </span>
          )}
        </div>
      </div>

      {/* PE Engineering Stamp Badge Banner */}
      {stamp ? (
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950 border-2 border-amber-500/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">OFFICIALLY STAMPED & APPROVED FOR CONSTRUCTION</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  PE CERTIFIED
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                Engineer: <span className="font-bold text-white">{stamp.engineerName}</span> ({stamp.licenseNumber})
              </p>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                "{stamp.notes}"
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                Digital Signature Hash: {stamp.signatureHash} • Stamped At: {new Date(stamp.stampedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-bold text-white">Pending Professional Engineer (PE) Sign-off</p>
              <p className="text-slate-400">Review the structural items below before issuing digital PE seal.</p>
            </div>
          </div>
          {(role === 'engineer' || role === 'admin') && (
            <button
              onClick={handleStamp}
              disabled={isStamping}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <Award className="w-4 h-4" /> Apply Digital PE Stamp
            </button>
          )}
        </div>
      )}

      {/* Structural Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`p-4 rounded-xl border transition-all ${
              check.status === 'passed'
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {check.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  check.status === 'passed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {check.status === 'passed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>Score: {check.score}/100</span>
              </span>
            </div>

            <h4 className="font-bold text-white text-sm mb-1">{check.title}</h4>
            <p className="text-xs text-slate-300">{check.description}</p>

            {check.recommendation && (
              <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                <strong>Engineer Note:</strong> {check.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
