import React, { useState } from 'react';
import { Check, Zap, Sparkles, Building2, HardHat, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const { isTamil } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: isTamil ? 'இலவச தொடக்க திட்டம்' : 'Starter Free Tier',
      priceMonthly: 0,
      priceYearly: 0,
      badge: isTamil ? 'இலவசம்' : 'Free Forever',
      popular: false,
      color: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80',
      buttonBg: 'bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white',
      icon: Building2,
      features: [
        isTamil ? '1 AI 2D மனை வரைபடம் (வடிவமைப்பு)' : '1 AI 2D Blueprint Floor Plan',
        isTamil ? 'அடிப்படைக் கட்டுமானச் செலவு மதிப்பீடு' : 'Basic Cost & Material Estimator',
        isTamil ? 'தமிழ்நாடு வாஸ்து வழிகாட்டுதல்' : 'Tamil Nadu Vastu Compliance Check',
        isTamil ? 'குறைந்த தெளிவுத்திறன் PDF பதிவிறக்கம்' : 'Standard Resolution PNG Download'
      ]
    },
    {
      id: 'pro',
      name: isTamil ? 'ப்ரோ பில்டர் பாஸ்' : 'Pro Builder AI Pass',
      priceMonthly: 1499,
      priceYearly: 12999,
      badge: isTamil ? 'மிகவும் பிரபலம்' : 'Most Popular',
      popular: true,
      color: 'border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30',
      icon: Sparkles,
      features: [
        isTamil ? 'வரம்பற்ற AI 2D & 3D மாதிரி வரைபடங்கள்' : 'Unlimited AI 2D & 3D Interactive Models',
        isTamil ? 'முழுமையான பொருள் விலைப் பட்டியல் (BOQ Excel)' : 'Complete Material Bill of Quantities (BOQ)',
        isTamil ? '3D உயர்தர உட்புற / வெளிப்புற ரெண்டர்' : 'Photorealistic 3D Exterior/Interior Renderings',
        isTamil ? '38 மாவட்ட பொருட்கள் விலை புதுப்பிப்புகள்' : 'Real-time 38 Districts Material Price Feeds',
        isTamil ? 'உயர் தெளிவுத்திறன் CAD & PDF ஏற்றுமதி' : 'High-Res CAD & Structural Vector PDF Export',
        isTamil ? 'முன்னுரிமை பொறியாளர் சந்திப்பு பதிவு' : 'Priority Civil Engineer Booking Window'
      ]
    },
    {
      id: 'pe_stamp',
      name: isTamil ? 'அரசு பதிவு பெற்ற PE சான்றொப்பம்' : 'PE Structural Stamping',
      priceMonthly: 4999,
      priceYearly: 4999,
      badge: isTamil ? 'அரசு அங்கீகாரம்' : 'Govt DTCP/CMDA Ready',
      popular: false,
      color: 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20',
      buttonBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20',
      icon: HardHat,
      features: [
        isTamil ? 'தமிழ்நாடு பதிவு பெற்ற பொறியாளர் கையொப்பம்' : 'TN Registered PE Official Seal & Digital Signature',
        isTamil ? 'வங்கி கடன் அங்கீகார வரைபடம்' : 'Bank Home Loan Approved Blueprints Package',
        isTamil ? 'இட ஆய்வு & மண் பரிசோதனை அறிக்கை' : 'Site Physical Inspection & Soil Bearing Capacity Report',
        isTamil ? 'DTCP / CMDA கட்டிட அனுமதி விண்ணப்பத் தாள்கள்' : 'DTCP / CMDA Building Permit Application File Set',
        isTamil ? '1-on-1 நேரடி பொறியாளர் ஆலோசனைகள்' : 'Dedicated 1-on-1 Structural Engineer Guidance'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>{isTamil ? 'வெளிப்படையான கட்டணங்கள்' : 'Transparent Structural Pricing'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isTamil ? 'உங்கள் கனவு இல்லத்திற்கான திட்டத்தை தேர்வு செய்க' : 'Choose Your Ideal Building Plan Package'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isTamil
              ? 'AI மனை வரைபடங்கள் முதல் தமிழ்நாடு அரசு பதிவு பெற்ற பொறியாளர்களின் அதிகாரப்பூர்வ சான்றொப்பம் வரை.'
              : 'From AI-powered instant floor plans to official PE-stamped DTCP/CMDA bank loan packages.'}
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isTamil ? 'மாதாந்திரம்' : 'Monthly'}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{isTamil ? 'ஆண்டுத் திட்டம்' : 'Yearly Pass'}</span>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-400 text-slate-950 uppercase">
                  {isTamil ? '20% தள்ளுபடி' : 'Save 20%'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.02] ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    {!plan.popular && (
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {price === 0 ? '₹0' : `₹${price.toLocaleString('en-IN')}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {plan.id === 'pe_stamp' ? '/ plan' : billingCycle === 'yearly' ? '/ year' : '/ month'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      if (onSelectPlan) onSelectPlan(plan.name);
                      onClose();
                    }}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${plan.buttonBg}`}
                  >
                    {price === 0 ? (isTamil ? 'இலவசமாகத் தொடங்குக' : 'Get Started Free') : (isTamil ? 'இப்போதே தேர்வு செய்க' : 'Select Package')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          <p>
            {isTamil
              ? 'அனைத்து திட்டங்களுக்கும் 100% திருப்தி உத்தரவாதம். தமிழ்நாடு 2019 ஒருங்கிணைந்த கட்டிட விதிமுறைகளுக்குட்பட்டது.'
              : 'All designs strictly adhere to Tamil Nadu Combined Development and Building Rules (TNCDBR 2019).'}
          </p>
        </div>

      </div>
    </div>
  );
};
