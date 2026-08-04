import React, { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  FileSpreadsheet, 
  Ruler, 
  Zap, 
  Star, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  PhoneCall, 
  Mail, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Download,
  Award
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/units';

interface LandingPageProps {
  onOpenPlannerWizard: () => void;
  onExploreEngineers: () => void;
  onExploreEstimator: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenPlannerWizard,
  onExploreEngineers,
  onExploreEstimator,
  onOpenAuth,
}) => {
  const { isTamil, t } = useLanguage();

  // Interactive Demo State
  const [demoPlotSize, setDemoPlotSize] = useState<number>(1200); // 1200 sqft (~2.75 Cents)
  const [demoFacing, setDemoFacing] = useState<'East' | 'North' | 'South' | 'West'>('East');
  const [demoFloors, setDemoFloors] = useState<number>(2);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form State
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', district: 'Chennai', message: '' });

  // Sample Engineers Preview
  const sampleEngineers = [
    {
      id: 'eng_1',
      name: 'Er. R. Sundaralingam, M.E.',
      district: 'Chennai (Anna Nagar)',
      experience: 16,
      rating: 4.9,
      reviewsCount: 84,
      license: 'TN-PWD-PE-2012-0894',
      specialty: 'Structural Engineering & Vastu House Plans',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      id: 'eng_2',
      name: 'Ar. Ananya Krishnan, B.Arch',
      district: 'Coimbatore (RS Puram)',
      experience: 12,
      rating: 4.95,
      reviewsCount: 62,
      license: 'COA-CA-2015-7712',
      specialty: 'Eco Sustainable Courtyard & Modern Villas',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      id: 'eng_3',
      name: 'Er. M. Thirunavukkarasu, B.E.',
      district: 'Madurai (KK Nagar)',
      experience: 19,
      rating: 4.88,
      reviewsCount: 110,
      license: 'TN-PWD-PE-2008-0122',
      specialty: 'Commercial Shops & Multi-Portion Rentals',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      quote: isTamil 
        ? "நம்ம வீடு AI மூலம் சென்னை அண்ணாநகரில் எனது 2.75 சென்ட் நிலத்திற்கு வாஸ்துபடி வீடு வரைபடம் மற்றும் துல்லியமான செலவு மதிப்பீடு 5 நிமிடத்தில் கிடைத்தது!"
        : "Namma Veedu AI generated a perfectly compliant Vastu floor plan for my 2.75 Cent plot in Chennai in under 5 minutes with real-time Tamil Nadu material rates!",
      author: "Karthik Subramanian",
      location: "Chennai, Tamil Nadu",
      role: "Homeowner",
      rating: 5,
    },
    {
      quote: isTamil
        ? "தமிழ்நாடு சிமெண்ட் மற்றும் கம்பியின் இன்றைய சந்தை விலைகளை துல்லியமாக கணக்கிட்டு தரும் இந்த தளம் எங்கள் சிவில் பொறியாளர்களுக்கு பெரும் உதவியாக உள்ளது."
        : "As a registered civil engineer in Coimbatore, this platform saves me hours of manual CAD drafting and BOM cost calculation for clients.",
      author: "Er. S. Palanisamy",
      location: "Coimbatore, Tamil Nadu",
      role: "Consulting Civil Engineer",
      rating: 5,
    },
    {
      quote: isTamil
        ? "மதுரையில் வாடகை வீடு கட்ட எங்கள் நிலத்திற்கு ஏற்ற 3 போർഷன் பிளான் கிடைத்தது. உள்ளூர் பொறியாளரை நேரடியாக தொடர்புகொள்ள முடிந்தது."
        : "Got an excellent multi-portion rental building plan for our plot in Madurai and hired a verified PWD structural engineer directly through Namma Veedu AI.",
      author: "Meenakshi Sundaram",
      location: "Madurai, Tamil Nadu",
      role: "Property Owner",
      rating: 5,
    },
  ];

  // FAQ List
  const faqs = [
    {
      q: isTamil ? "நம்ம வீடு AI வாஸ்து சாஸ்திர விதிகளுக்கு கட்டுப்படுகிறதா?" : "Does Namma Veedu AI strictly follow Vastu Shastra principles?",
      a: isTamil 
        ? "ஆம். எங்கள் AI அல்காரிதம் அக்னி மூலை (தென்கிழக்கு) சமையலறை, கன்னி மூலை (தென்மேற்கு) மாஸ்டர் படுக்கையறை மற்றும் ஈசான்ய மூலை (வடகிழக்கு) நுழைவாயில் போன்ற தமிழ்நாடு வாஸ்து விதிகளின்படி வரைபடங்களை உருவாக்கும்."
        : "Yes! The AI engine adheres to authentic Tamil Nadu Vastu Shastra guidelines, including Agni Moolai (SE) kitchen, Kanni Moolai (SW) master bedroom, and Eesanya Moolai (NE) entrance placement.",
    },
    {
      q: isTamil ? "நில அளவுகளை சென்ட் மற்றும் கிரவுண்ட் கணக்கில் பார்க்க முடியுமா?" : "Can I input plot dimensions in Cent, Ground, or Sq Ft?",
      a: isTamil
        ? "நிச்சயமாக! சதுர அடி (Sq Ft), சென்ட் (Cent - 435.6 sq ft), கிரவுண்ட் (Ground - 2400 sq ft) மற்றும் ஏக்கர் (Acre) ஆகிய அனைத்து உள்ளூர் அளவுகளையும் நேரடியாக மாற்றும் வசதி உள்ளது."
        : "Absolutely. Namma Veedu AI natively supports Square Feet, Cent (435.6 sq ft), Ground (2,400 sq ft), and Acre with built-in instant unit conversion.",
    },
    {
      q: isTamil ? "கட்டுமான பொருள் விலைகள் எவ்வளவு நேரலையானவை?" : "How accurate and live are the material cost estimates?",
      a: isTamil
        ? "தமிழ்நாடு கட்டிட பொருள் சந்தை விலைகளான அல்ட்ராடெக் சிமெண்ட், JSW TMT கம்பி, எம்-சாண்ட் மணல் மற்றும் கொத்தனார் கூலிகள் தினமும் புதுப்பிக்கப்படுகின்றன."
        : "Our Material Price Service pulls spot market rates for UltraTech/Ramco Cement, JSW TMT Steel, M-Sand, chamber red bricks, and local mason daily wage rates across TN districts.",
    },
    {
      q: isTamil ? "வரைபடத்தை அரசு ஒப்புதலுக்கு பயன்படுத்த முடியுமா?" : "Can I use the generated CAD blueprint for municipal approval?",
      a: isTamil
        ? "எங்கள் தளத்தில் உள்ள தமிழ்நாடு அரசு பதிவு பெற்ற PWD சான்றளிக்கப்பட்ட சிவில் பொறியாளர்கள் வரைபடத்தை சரிபார்த்து டிஜிட்டல் கையொப்பமிட்டு உள்ளாட்சி அனுமதிக்கு தயாராக தருவார்கள்."
        : "Yes! You can connect with verified, licensed Tamil Nadu PWD registered structural engineers on our platform who review, sign, and stamp the CAD drawings for municipal building approval.",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', district: 'Chennai', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        
        {/* Glow background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide animate-fade-in shadow-sm dark:shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>{isTamil ? 'தமிழ்நாட்டின் #1 AI வீடு திட்டமிடும் தளம்' : '#1 AI Smart House Planning Platform for Tamil Nadu'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {isTamil ? (
              <>
                உங்கள் கனவு வீட்டிற்கு <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-700 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
                  வாஸ்து AI வரைபடம் & நேரலை செலவு
                </span>
              </>
            ) : (
              <>
                AI-Powered Smart House Planning Platform for <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-700 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
                  Tamil Nadu
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {isTamil
              ? 'தமிழ்நாடு கட்டுமான விதிகள், வாஸ்து சாஸ்திரம், சென்ட்/கிரவுண்ட் மனை அளவுகள் மற்றும் 38 மாவட்டங்களின் நேரலை பொருள் விலைகளுடன் உங்கள் வீட்டை நொடியில் திட்டமிடுங்கள்.'
              : 'Generate Vastu Shastra compliant CAD floor plans, real-time material & labour cost breakdown, and connect with 38-district verified Tamil Nadu civil engineers.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenPlannerWizard}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isTamil ? 'AI வீடு வரைபடம் உருவாக்கு' : 'Generate AI House Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreEstimator}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isTamil ? 'கட்டுமான செலவு கணக்கீட்டான்' : 'Cost Estimator'}</span>
            </button>

            <button
              onClick={onExploreEngineers}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isTamil ? 'மாவட்ட பொறியாளர்கள்' : 'District Engineers'}</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-md dark:shadow-lg transition-colors">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xl font-mono">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 38 Districts
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isTamil ? 'அனைத்து தமிழ்நாடு மாவட்டங்கள்' : 'Full Tamil Nadu Coverage'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-md dark:shadow-lg transition-colors">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-xl font-mono">
                <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" /> 100% Vastu
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isTamil ? 'வாஸ்து சாஸ்திர விதிகள்' : 'Authentic Vastu Alignment'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-md dark:shadow-lg transition-colors">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-extrabold text-xl font-mono">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Spot API
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isTamil ? 'நேரலை பொருள் கட்டணம்' : 'Live Daily Material Rates'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-md dark:shadow-lg transition-colors">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-extrabold text-xl font-mono">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" /> PWD Engineers
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isTamil ? 'அரசு பதிவு பெற்ற பொறியாளர்கள்' : 'Licensed Civil Engineers'}</p>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE DEMO WIDGET */}
      <section className="max-w-5xl mx-auto bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-2xl space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
              <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {isTamil ? 'நொடி வரைபட மாதிரி' : 'Instant AI Planning Preview'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {isTamil ? 'உங்கள் நிலத்தின் அளவை தேர்ந்தெடுத்து மாதிரி வரைபடத்தை பாருங்கள்' : 'Try the Instant Interactive Vastu CAD Simulator'}
            </h2>
          </div>
          <button
            onClick={onOpenPlannerWizard}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
          >
            <Sparkles className="w-4 h-4" /> {isTamil ? 'முழுமையான வரைபடம் உருவாக்க' : 'Launch Full AI Wizard'}
          </button>
        </div>

        {/* Demo Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          
          {/* Plot Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isTamil ? 'மனை அளவு (Square Feet)' : 'Plot Footprint Area'}:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="600"
                max="3600"
                step="100"
                value={demoPlotSize}
                onChange={(e) => setDemoPlotSize(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                {demoPlotSize} sq ft
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              = {(demoPlotSize / 435.6).toFixed(2)} Cent(s)
            </p>
          </div>

          {/* Vastu Facing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isTamil ? 'வாஸ்து திசை (Facing Direction)' : 'Vastu Entrance Facing'}:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['East', 'North', 'South', 'West'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDemoFacing(dir)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    demoFacing === dir
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Stories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isTamil ? 'தளங்கள் (Floors)' : 'Building Floors'}:
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((f) => (
                <button
                  key={f}
                  onClick={() => setDemoFloors(f)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    demoFloors === f
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  G+{f - 1} ({f})
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Demo Output Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Simulated 2D Layout Canvas Box */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Vastu CAD Preview ({demoFacing} Facing)
              </span>
              <span>{demoPlotSize} SQ FT • G+{demoFloors - 1}</span>
            </div>

            {/* Simulated Grid Layout */}
            <div className="grid grid-cols-3 gap-2 h-44 text-[11px] font-bold">
              
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[9px] uppercase">NW • Vaayu</span>
                <span className="text-slate-800 dark:text-slate-200">Guest Room / Staircase</span>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-blue-700 dark:text-blue-400 font-mono text-[9px] uppercase">N • Kuber</span>
                <span className="text-slate-800 dark:text-slate-200">Hall / Living Room</span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-amber-700 dark:text-amber-400 font-mono text-[9px] uppercase">NE • Eesanya</span>
                <span className="text-slate-800 dark:text-slate-200">Pooja Room & Main Gate</span>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-indigo-700 dark:text-indigo-400 font-mono text-[9px] uppercase">W • Varuna</span>
                <span className="text-slate-800 dark:text-slate-200">Dining Hall</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-slate-500 font-mono text-[9px] uppercase">Center • Brahma</span>
                <span className="text-slate-700 dark:text-slate-300">Open Courtyard</span>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-cyan-700 dark:text-cyan-400 font-mono text-[9px] uppercase">E • Indra</span>
                <span className="text-slate-800 dark:text-slate-200">Verandah / Thinnai</span>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-purple-700 dark:text-purple-400 font-mono text-[9px] uppercase">SW • Kanni</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold text-emerald-700 dark:text-emerald-300">Master Bedroom</span>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-rose-700 dark:text-rose-400 font-mono text-[9px] uppercase">S • Yama</span>
                <span className="text-slate-800 dark:text-slate-200">Attach Bathroom</span>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-orange-700 dark:text-orange-400 font-mono text-[9px] uppercase">SE • Agni</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold text-amber-700 dark:text-amber-300">Kitchen Room</span>
              </div>

            </div>
          </div>

          {/* Quick Instant Cost Calculation */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <h4 className="font-sans font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Estimated Cost Summary
            </h4>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Builtup:</span>
                <span className="font-bold text-slate-900 dark:text-white">{(demoPlotSize * demoFloors).toLocaleString()} sq ft</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Material Cost:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(demoPlotSize * demoFloors * 1150, isTamil)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Civil Labour Fee:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{formatINR(demoPlotSize * demoFloors * 750, isTamil)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-sans font-bold text-slate-800 dark:text-slate-200">Grand Total:</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatINR(demoPlotSize * demoFloors * 1900, isTamil)}
                </span>
              </div>
            </div>

            <button
              onClick={onExploreEstimator}
              className="w-full mt-3 py-2 bg-emerald-500/10 dark:bg-emerald-600/20 hover:bg-emerald-500/20 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 font-sans font-bold rounded-xl border border-emerald-500/30 text-xs transition-all flex items-center justify-center gap-1"
            >
              <span>{isTamil ? 'விரிவான கணக்கீடு பாருங்கள்' : 'View Full Itemized Estimator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isTamil ? 'ஏன் நம்ம வீடு AI சிறந்த தெரிவு?' : 'Designed Exclusively for Tamil Nadu Building Norms'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isTamil
              ? 'தமிழ்நாடு உள்ளாட்சி விதிமுறைகள், மாவட்ட சிவில் பொறியாளர்கள் மற்றும் வாஸ்து சாஸ்திரம் அனைத்தையும் ஒரே இடத்தில் இணைக்கும் நவீன தளம்.'
              : 'Complete smart platform bringing together Vastu principles, municipal approval CADs, local land units, and verified district engineers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? '100% தமிழ் வாஸ்து சாஸ்திரம்' : 'Authentic Vastu Auto-Alignment'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'அக்னி மூலை சமையலறை, கன்னி மூலை மாஸ்டர் படுக்கையறை மற்றும் ஈசான்ய மூலை வாசலுடன் வீட்டின் அமைப்பை AI தானாக வகுக்கிறது.'
                : 'Auto positions Agni Moolai kitchen (SE), Kanni Moolai master bed (SW), and Eesanya Moolai (NE) entrance according to Tamil Vastu tradition.'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? 'நேரலை சந்தை பொருள் API' : 'Spot Material & Labour Estimator'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'சிமெண்ட், கம்பி, செங்கல், மணல் மற்றும் கொத்தனார் கூலித் தொகைகளை தினமும் புதுப்பிக்கப்படும் நேரலை தகவல்களுடன் கணக்கிடுங்கள்.'
                : 'Pulls daily spot prices for UltraTech/Ramco Cement, JSW TMT Steel, M-Sand, and mason person-day rates across TN.'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? '38 மாவட்ட PWD பொறியாளர்கள்' : '38 District Verified Engineers'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'சென்னை, கோவை, மதுரை, திருச்சி உள்ளிட்ட அனைத்து 38 மாவட்டங்களின் அரசு சான்றளிக்கப்பட்ட சிவில் பொறியாளர்களை நேரடியாக தொடர்பு கொள்ளுங்கள்.'
                : 'Connect directly with verified licensed civil engineers across all 38 Tamil Nadu districts for municipal approvals.'}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? 'சென்ட் / கிரவுண்ட் மனை அளவுகள்' : 'Local Measurement Unit Support'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'சதுர அடி (Sq Ft), சென்ட் (Cent), கிரவுண்ட் (Ground) மற்றும் ஏக்கர் (Acre) ஆகிய அனைத்து உள்ளூர் அலகுகளையும் உடனடியாக மாற்றலாம்.'
                : 'Natively calculates layout boundaries in Square Feet, Cent (435.6 sq ft), Ground (2,400 sq ft), and Acre.'}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? '2D & 3D வரைபட Visualizer' : 'Interactive 2D/3D CAD Viewer'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'வீட்டின் அறைகளின் அளவுகள், கதவுகள், ஜன்னல்கள் மற்றும் தளங்களை சுலபமாக பார்வையிடலாம்.'
                : 'Inspect room dimensional boundaries, doorways, windows, stairwells, and structural columns interactively.'}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">
              {isTamil ? 'ஒரே கிளிக்கில் PDF & CSV பதிவிறக்கம்' : 'One-Click PDF & CSV Export'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isTamil
                ? 'உங்கள் வரைபடம் மற்றும் பொருள் செலவு பட்டியலை எக்செல் அல்லது பிடிஎஃப் அறிக்கையாக பதிவிறக்கலாம்.'
                : 'Export complete structural drawing notes, quantity takeoff sheets, and itemized bills of quantities in PDF or CSV format.'}
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-5xl mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isTamil ? 'எளிய 4 படிகள்' : '4 Simple Steps'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isTamil ? 'நம்ம வீடு AI எவ்வாறு செயல்படுகிறது?' : 'How Namma Veedu AI Works'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center font-mono">
              1
            </div>
            <h3 className="font-bold text-white text-sm">{isTamil ? '1. மனை அளவு உள்ளிடுக' : '1. Enter Plot Footprint'}</h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'உங்கள் நிலத்தின் அளவு (சென்ட்/சதுர அடி) மற்றும் மாவட்டத்தை தேர்வு செய்யுங்கள்.' : 'Provide plot size in Sq Ft, Cent, or Ground and choose your TN district.'}
            </p>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center font-mono">
              2
            </div>
            <h3 className="font-bold text-white text-sm">{isTamil ? '2. வாஸ்து விருப்பங்களை தேர்வு செய்க' : '2. Set Vastu Preferences'}</h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'திசை, தளங்களின் எண்ணிக்கை மற்றும் அறைகளின் தேவைகளை குறிப்பிடுங்கள்.' : 'Select main entrance facing, story count, and custom room requirements.'}
            </p>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center font-mono">
              3
            </div>
            <h3 className="font-bold text-white text-sm">{isTamil ? '3. AI வரைபடம் & செலவு பெறுக' : '3. Instant CAD & Estimate'}</h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'நொடியில் AI வரைபடம் மற்றும் இன்றைய சந்தை பொருள் செலவு பட்டியல் தயாராகும்.' : 'Gemini AI generates floor plan visualizer and live material/labour breakdown.'}
            </p>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center font-mono">
              4
            </div>
            <h3 className="font-bold text-white text-sm">{isTamil ? '4. மாவட்ட பொறியாளரை அணுகுக' : '4. Book Local Engineer'}</h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'உங்கள் மாவட்டத்தின் பதிவு பெற்ற சிவில் பொறியாளரை நேரடியாக தொடர்பு கொண்டு அனுமதி பெறலாம்.' : 'Connect with licensed district civil engineers for municipal drawing stamp & site visits.'}
            </p>
          </div>

        </div>
      </section>

      {/* ENGINEER MARKETPLACE PREVIEW */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {isTamil ? 'மாவட்ட பொறியாளர்கள் சந்தை' : 'Verified Engineer Marketplace'}
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">
              {isTamil ? 'தமிழ்நாடு அரசு அனுமதி பெற்ற சிவில் பொறியாளர்கள்' : 'Connect with Licensed District Civil Engineers'}
            </h2>
          </div>

          <button
            onClick={onExploreEngineers}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all"
          >
            <span>{isTamil ? 'அனைத்து பொறியாளர்களை காண்க' : 'Browse All 38 District Engineers'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleEngineers.map((eng) => (
            <div key={eng.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={eng.photo} alt={eng.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{eng.name}</h3>
                    <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {eng.district}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-white">{eng.experience} Years</span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Rating:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {eng.rating} ({eng.reviewsCount} reviews)
                    </span>
                  </div>

                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">Lic #:</span> {eng.license}
                  </div>
                </div>
              </div>

              <button
                onClick={onExploreEngineers}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTamil ? 'ஆலோசனை பெறுக' : 'Book Consultation'}</span>
              </button>

            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {isTamil ? 'பயனாளர் கருத்துகள்' : 'Homeowner Testimonials'}
          </span>
          <h2 className="text-2xl font-bold text-white">
            {isTamil ? 'தமிழ்நாடு மக்களின் நன்மதிப்பை பெற்ற தளம்' : 'Trusted by Homeowners & Contractors Across Tamil Nadu'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{t.author}</p>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-emerald-400 font-medium border border-slate-800">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isTamil ? 'உங்களின் சந்தேகங்களுக்கான பதில்கள்' : 'Got Questions? We Have Answers'}
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between gap-3 hover:text-emerald-400 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  {faq.q}
                </span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 border-t border-slate-800/60 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isTamil ? 'தொடர்பு கொள்ள' : 'Get In Touch'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isTamil ? 'தமிழ்நாடு பிராந்திய உதவி மையம்' : 'Contact Tamil Nadu Support Team'}
          </h2>
        </div>

        {contactSubmitted ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2 text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-base">{isTamil ? 'உங்கள் செய்தி பெறப்பட்டது!' : 'Inquiry Received Successfully!'}</h3>
            <p className="text-xs text-slate-300">
              {isTamil ? 'எங்கள் சிவில் பொறியாளர் குழு விரைவில் உங்களை தொடர்புகொள்ளும்.' : 'Our regional Tamil Nadu engineering helpdesk will reach out within 2 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'பெயர்' : 'Your Name'}</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'மின்னஞ்சல்' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="anand@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'செய்தி / கேள்வி' : 'Inquiry Details'}</label>
              <textarea
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder={isTamil ? 'உங்கள் நிலத்தின் அளவு மற்றும் தேவைப்பாடுகளை எழுதவும்...' : 'Describe your plot size, building requirements, or engineer inquiry...'}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isTamil ? 'செய்தி அனுப்புக' : 'Send Message to TN Support'}</span>
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
