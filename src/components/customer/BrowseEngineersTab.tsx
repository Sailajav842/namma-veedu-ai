import React, { useState, useEffect } from 'react';
import { MOCK_ENGINEERS, INITIAL_PROJECTS } from '../../data/mockData';
import { EngineerProfile, CustomerTab, EngineerPortfolioItem, EngineerBooking } from '../../types';
import { SupabaseEngineerStore, INITIAL_PORTFOLIO_ITEMS } from '../../services/supabase';
import { INDIAN_STATES } from '../../config/regionConfig';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/units';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Award, 
  Calendar, 
  IndianRupee, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Briefcase, 
  X, 
  Check, 
  ExternalLink,
  Clock,
  Sparkles,
  Copy,
  Building,
  FileText
} from 'lucide-react';

interface BrowseEngineersTabProps {
  onSelectEngineerForBooking: (engineer: EngineerProfile) => void;
  onNavigateTab: (tab: CustomerTab) => void;
}

export const BrowseEngineersTab: React.FC<BrowseEngineersTabProps> = ({
  onSelectEngineerForBooking,
  onNavigateTab,
}) => {
  const { isTamil, t } = useLanguage();
  const [engineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [expFilter, setExpFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');

  // Modals state
  const [portfolioEngineer, setPortfolioEngineer] = useState<EngineerProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<EngineerPortfolioItem[]>(INITIAL_PORTFOLIO_ITEMS);
  const [callEngineer, setCallEngineer] = useState<EngineerProfile | null>(null);
  const [whatsAppEngineer, setWhatsAppEngineer] = useState<EngineerProfile | null>(null);
  const [bookingEngineer, setBookingEngineer] = useState<EngineerProfile | null>(null);

  // Booking Form Modal state
  const [bookingDate, setBookingDate] = useState<string>('2026-08-05');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 11:30 AM IST');
  const [serviceType, setServiceType] = useState<string>('Full PE Structural Stamp');
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>(INITIAL_PROJECTS[0]?.title || 'Custom House Plan');
  const [notes, setNotes] = useState<string>('Requesting Tamil Nadu PWD structural approval review and Vastu orientation check.');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const tnDistricts = INDIAN_STATES.TN.districts;

  // Load portfolio items from store
  useEffect(() => {
    SupabaseEngineerStore.getPortfolio().then((items) => {
      if (items && items.length > 0) {
        setPortfolioItems(items);
      }
    });
  }, []);

  // Filter engineers by search, district, experience, rating, budget
  const filteredEngineers = engineers.filter((e) => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.specialization.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = 
      selectedDistrict === 'all' || 
      e.location.toLowerCase().includes(selectedDistrict.toLowerCase());

    const matchesExp = 
      expFilter === 'all' || 
      (expFilter === '15' && e.yearsExperience >= 15) ||
      (expFilter === '10' && e.yearsExperience >= 10);

    const matchesRating = 
      ratingFilter === 'all' || 
      (ratingFilter === '4.8' && e.rating >= 4.8);

    const matchesBudget = 
      budgetFilter === 'all' || 
      (budgetFilter === '1200' && e.hourlyRate <= 1200) ||
      (budgetFilter === '1500' && e.hourlyRate <= 1500);

    return matchesSearch && matchesDistrict && matchesExp && matchesRating && matchesBudget;
  });

  const handleCopyPhone = (phoneNum: string) => {
    navigator.clipboard.writeText(phoneNum);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleConfirmBookingFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEngineer) return;

    const feesMap: Record<string, number> = {
      'Full PE Structural Stamp': 3500,
      'Foundation & Soil Assessment': 2500,
      'Zoning & Code Audit': 1800,
      '1-on-1 Consultation Call': 1200,
    };

    const newBooking: EngineerBooking = {
      id: `bk_${Date.now()}`,
      customerId: 'usr_customer_1',
      customerName: 'Karthik Subramanian',
      engineerId: bookingEngineer.id,
      engineerName: bookingEngineer.name,
      housePlanId: 'prj_001',
      housePlanTitle: selectedProjectTitle,
      bookingDate,
      timeSlot,
      serviceType: serviceType as any,
      status: 'confirmed',
      feeUSD: feesMap[serviceType] || 3500,
      notes,
      createdAt: new Date().toISOString(),
    };

    SupabaseEngineerStore.getBookings().then((existing) => {
      SupabaseEngineerStore.saveBookings([newBooking, ...existing]);
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingEngineer(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {isTamil ? 'தமிழ்நாடு அரசு அங்கீகரிக்கப்பட்ட பொறியாளர்கள் network' : 'Tamil Nadu Licensed Engineers & Architects'}
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            {t('engineer_title')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTamil
              ? 'தமிழ்நாடு 38 மாவட்டங்களை சேர்ந்த உரிமம் பெற்ற சிவில் பொறியாளர்கள் மற்றும் ஆர்க்கிடெக்ட்கள். நேரடியாக அழைக்கலாம் அல்லது வாட்ஸ்அப் செய்யலாம்.'
              : 'Hire verified civil engineers and architects from Tamil Nadu districts for structural stamps, Vastu consultation, and municipal plan approvals.'}
          </p>
        </div>
      </div>

      {/* District & Comprehensive Multi-Filter Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
        
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Text Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isTamil ? 'பொறியாளர் பெயர், மாவட்டம் அல்லது பதிவு எண் தேடுக...' : 'Search engineer by name, district, license number...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Filter by Tamil Nadu District */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{t('all_districts')}</option>
              {tnDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isTamil ? d.nameTa : d.nameEn}
                </option>
              ))}
            </select>

            {/* Filter by Experience */}
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{isTamil ? 'அனைத்து அனுபவமும்' : 'All Experience'}</option>
              <option value="15">{isTamil ? '15+ ஆண்டுகள் அனுபவம்' : '15+ Years Experience'}</option>
              <option value="10">{isTamil ? '10+ ஆண்டுகள் அனுபவம்' : '10+ Years Experience'}</option>
            </select>

            {/* Filter by Rating */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{isTamil ? 'அனைத்து மதிப்பீடும்' : 'All Ratings'}</option>
              <option value="4.8">4.8★ & Above</option>
            </select>

            {/* Filter by Budget (INR) */}
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{isTamil ? 'அனைத்து கட்டணமும்' : 'All Budget Rates'}</option>
              <option value="1200">{isTamil ? '₹1,200 வரை / ஆலோசனை' : 'Up to ₹1,200 / call'}</option>
              <option value="1500">{isTamil ? '₹1,500 வரை / ஆலோசனை' : 'Up to ₹1,500 / call'}</option>
            </select>

          </div>
        </div>

        {/* Filter Stats Badge */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            {isTamil
              ? `${engineers.length} பொறியாளர்களில் ${filteredEngineers.length} பேர் காட்டப்படுகின்றனர்`
              : `Showing ${filteredEngineers.length} of ${engineers.length} Tamil Nadu licensed engineers`}
          </span>
          {(searchTerm || selectedDistrict !== 'all' || expFilter !== 'all' || ratingFilter !== 'all' || budgetFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('all');
                setExpFilter('all');
                setRatingFilter('all');
                setBudgetFilter('all');
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              {isTamil ? 'வடிகட்டிகளை மீட்டமை' : 'Reset Filters'}
            </button>
          )}
        </div>

      </div>

      {/* Engineer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEngineers.map((eng) => {
          const engPhone = (eng as any).phone || '+919444056789';
          const engWhatsApp = engPhone.replace(/[^0-9]/g, '');

          return (
            <div
              key={eng.id}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
            >
              <div className="space-y-4">
                
                <div className="flex items-start gap-4">
                  <img
                    src={eng.avatarUrl}
                    alt={eng.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl shrink-0"
                  />
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-white text-base truncate">{eng.name}</h3>
                        {eng.isVerified && (
                          <span title="Tamil Nadu PE Registered">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{eng.rating} ({eng.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-emerald-400 font-semibold">{eng.licenseNumber}</p>
                    <p className="text-xs text-slate-300 font-medium truncate">{eng.specialization}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{eng.bio}</p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">{isTamil ? 'அனுபவம்' : 'Experience'}</p>
                    <p className="font-bold text-white mt-0.5">{eng.yearsExperience} Yrs</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">{isTamil ? 'கட்டணம்' : 'Fee / Call'}</p>
                    <p className="font-bold text-emerald-400 mt-0.5">{formatINR(eng.hourlyRate, isTamil)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">{isTamil ? 'வரைபடங்கள்' : 'Approved'}</p>
                    <p className="font-bold text-cyan-400 mt-0.5">{eng.completedProjects}+ Plans</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 truncate text-slate-300 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {eng.location}
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0">{eng.availability}</span>
                </div>

              </div>

              {/* ACTION TOOLBAR: Call, WhatsApp, Book Consultation */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* View Portfolio */}
                  <button
                    onClick={() => setPortfolioEngineer(eng)}
                    className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    title="View Engineering Portfolio"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isTamil ? 'தொகுப்பு' : 'Portfolio'}</span>
                  </button>

                  {/* CALL BUTTON */}
                  <a
                    href={`tel:${engPhone.replace(/[^0-9+]/g, '')}`}
                    className="px-2.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('btn_call')}</span>
                  </a>

                  {/* WHATSAPP BUTTON */}
                  <a
                    href={`https://wa.me/${engWhatsApp}?text=${encodeURIComponent(`வணக்கம் ${eng.name}, BuildAI மூலம் எனது வீட்டின் வரைபடம் மற்றும் வாஸ்து ஆலோசனைக் குறித்து தொடர்பு கொள்கிறேன்.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    title="WhatsApp Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('btn_whatsapp')}</span>
                  </a>

                </div>

                {/* BOOK CONSULTATION BUTTON */}
                <button
                  onClick={() => setBookingEngineer(eng)}
                  className="w-full px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('btn_book_consultation')}</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* PORTFOLIO MODAL */}
      {portfolioEngineer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={portfolioEngineer.avatarUrl}
                  alt={portfolioEngineer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
                />
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    {portfolioEngineer.name} <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono font-medium">
                    {isTamil ? 'தமிழ்நாடு வரைபட சான்றளிக்கப்பட்ட திட்டங்கள்' : 'Tamil Nadu Stamped House Plans'} ({portfolioEngineer.completedProjects}+)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPortfolioEngineer(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full md:w-48 h-32 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.buildingType.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-white text-base mt-1">{item.title}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          {formatINR(item.costUSD || 3500000, isTamil)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.highlights.map((h, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300">
                            ✓ {h}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                        <span>Location: {item.location} • Area: {item.areaSqFt} sq ft</span>
                        <span>Completed: {item.completionYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setBookingEngineer(portfolioEngineer);
                  setPortfolioEngineer(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> {isTamil ? 'ஆலோசனை பதிவு செய்க' : 'Book Consultation'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BOOK CONSULTATION MODAL */}
      {bookingEngineer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-fade-in relative">
            
            <button
              onClick={() => setBookingEngineer(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isTamil ? 'ஆலோசனை பதிவு உறுதி செய்யப்பட்டது!' : 'Consultation Booking Confirmed!'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isTamil
                    ? `${bookingEngineer.name} அவர்களுடன் உங்கள் ஆலோசனை வெற்றிகரமாக பதிவு செய்யப்பட்டது.`
                    : `Your consultation request with ${bookingEngineer.name} has been confirmed.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBookingFromModal} className="space-y-4">
                
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <img
                    src={bookingEngineer.avatarUrl}
                    alt={bookingEngineer.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm">{bookingEngineer.name}</h3>
                    <p className="text-xs text-emerald-400 font-mono font-semibold">{bookingEngineer.licenseNumber}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isTamil ? 'வீடு வரைபட தலைப்பு' : 'House Plan Title'}
                    </label>
                    <input
                      type="text"
                      value={selectedProjectTitle}
                      onChange={(e) => setSelectedProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isTamil ? 'சேவை வகை' : 'Service Type'}
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="Full PE Structural Stamp">{isTamil ? 'முழு தமிழ்நாடு PWD வரைபட அங்கீகாரம் (₹3,500)' : 'Full Structural Approval Stamp (₹3,500)'}</option>
                      <option value="Foundation & Soil Assessment">{isTamil ? 'மண் பரிசோதனை மற்றும் அஸ்திவாரம் (₹2,500)' : 'Foundation & Soil Assessment (₹2,500)'}</option>
                      <option value="Zoning & Code Audit">{isTamil ? 'நகராட்சி கட்டிட அனுமதி கணக்கீடு (₹1,800)' : 'Municipal Zoning Audit (₹1,800)'}</option>
                      <option value="1-on-1 Consultation Call">{isTamil ? 'வாஸ்து மற்றும் கட்டமைப்பு ஆலோசனை (₹1,200)' : '1-on-1 Vastu Consultation Call (₹1,200)'}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'தேதி' : 'Date'}</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'நேரம்' : 'Time Slot'}</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="10:00 AM - 11:30 AM IST">10:00 AM - 11:30 AM IST</option>
                        <option value="02:00 PM - 03:30 PM IST">02:00 PM - 03:30 PM IST</option>
                        <option value="05:00 PM - 06:30 PM IST">05:00 PM - 06:30 PM IST</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'குறிப்புகள் / தேவை' : 'Notes'}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingEngineer(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    {isTamil ? 'ரத்து செய்க' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <Calendar className="w-4 h-4" /> {isTamil ? 'பதிவை உறுதி செய்க' : 'Confirm Booking'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
