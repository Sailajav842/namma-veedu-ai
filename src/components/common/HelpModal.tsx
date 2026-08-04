import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: isTamil ? 'Namma Veedu AI எவ்வாறு மனை வரைபடத்தை உருவாக்குகிறது?' : 'How does Namma Veedu AI generate 2D/3D floor plans?',
      a: isTamil
        ? 'எங்கள் AI எஞ்சின் தமிழ்நாடு கட்டிட விதிகளுக்கு (TNCDBR 2019) ஏற்ப உங்கள் மனை அளவு, அறை தேவைகள் மற்றும் வாஸ்து விதிகளை பகுப்பாய்வு செய்து துல்லியமான 2D வரைபடத்தையும் 3D மாதிரியையும் உடனடியாக உருவாக்குகிறது.'
        : 'Our AI engine processes your plot dimensions (width, length, facing direction) and applies Tamil Nadu Combined Development and Building Rules (TNCDBR 2019) alongside authentic Vastu Shastra algorithms to instantly layout wall-to-wall plans.'
    },
    {
      q: isTamil ? 'வரைபடத்தில் வாஸ்து சாஸ்திரம் எவ்வாறு பின்பற்றப்படுகிறது?' : 'How is Vastu Shastra compliance calculated?',
      a: isTamil
        ? 'சமையலறை தென்கிழக்கு (அக்னி மூலை), முதன்மை படுக்கையறை தென்மேற்கு (கன்னி மூலை) மற்றும் முதன்மை வாசல் வடகிழக்கு/கிழக்கு திசைகளில் அமைக்கப்பட்டு 100-புள்ளி மதிப்பீடு கணக்கிடப்படுகிறது.'
        : 'The algorithm evaluates room placement across the 8 Vastu directional zones—positioning Kitchen in Agni (SE), Master Bed in Kanni Moolai (SW), and Entrance in Eesanyan (NE) for a score out of 100.'
    },
    {
      q: isTamil ? 'அரசு அனுமதி மற்றும் வங்கி கடனுக்கு இந்த வரைபடம் போதுமானதா?' : 'Are these plans eligible for DTCP / CMDA approval & Bank Loans?',
      a: isTamil
        ? 'ஆம், எங்கள் பிளாட்ஃபாரத்தில் உள்ள தமிழ்நாடு பதிவு பெற்ற பொறியாளர்கள் (TN Registered PE) உங்கள் வரைபடத்தை சரிபார்த்து அதிகாரப்பூர்வ முத்திரையிட்டு தருகின்றனர்.'
        : 'Yes. You can request a certified PE Structural Stamping package. A registered Tamil Nadu Civil Engineer inspects, seals, and signs the drawing for CMDA/DTCP and bank loan dispatch.'
    },
    {
      q: isTamil ? 'பொருட்கள் விலை எவ்வாறு புதுப்பிக்கப்படுகிறது?' : 'How are local building material prices updated?',
      a: isTamil
        ? 'தமிழ்நாட்டின் 38 மாவட்டங்களில் நிலவும் சிமெண்ட், TMT கம்பி, ஆற்று மணல், செங்கல் மற்றும் தொழிலாளர் கூலி ஆகியவை தினமும் நேரலையாக புதுப்பிக்கப்படுகின்றன.'
        : 'Our platform aggregates daily market price feeds across all 38 TN districts for OPC/PPC Cement, 550D TMT Steel, Manufactured Sand (M-Sand), Red Bricks, and local mason wages.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto transition-colors duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'உதவி & அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Help Center & Building FAQ'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTamil ? 'கட்டிட வரைபடம் மற்றும் வழிகாட்டுதல்கள்' : ' Tamil Nadu Architectural & Engineering Guidance'}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/80 transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left font-bold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-2 text-[11px]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Need further technical assistance?</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
          >
            Ask Engineer
          </button>
        </div>

      </div>
    </div>
  );
};
