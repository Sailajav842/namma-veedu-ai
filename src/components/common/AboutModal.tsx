import React from 'react';
import { X, Building2, ShieldCheck, Award, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'about' | 'privacy';
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, mode = 'about' }) => {
  const { isTamil } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative transition-colors duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'about' ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  About Building Planner AI (Namma Veedu AI)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tamil Nadu Architectural Engine v3.2</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Namma Veedu AI</strong> is Tamil Nadu’s premier AI-powered structural planning and civil engineering platform. Designed specifically for Indian homebuilders, property developers, and registered professional engineers.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TNCDBR 2019 Compliant</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  All AI room layouts, setbacks, stair clearances, and load calculations adhere to the Tamil Nadu Combined Development and Building Rules.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Verified PE Network</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Connect directly with verified civil engineers across Chennai, Coimbatore, Madurai, Trichy, Salem, and all 38 districts.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy & Data Policy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Security & Blueprint Protection</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Your land survey data, floor plan blueprints, and personal contact details are stored securely. We do not sell or expose your site coordinates to third parties.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                <li>Blueprints are encrypted and accessible only by you and chosen engineers.</li>
                <li>Material price feed data is anonymized and aggregated across Tamil Nadu.</li>
                <li>100% compliant with Indian Data Protection Act standards.</li>
              </ul>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
        >
          Close
        </button>

      </div>
    </div>
  );
};
