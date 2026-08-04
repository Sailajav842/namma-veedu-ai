import React, { useState } from 'react';
import { AIPlanRequest, ArchitecturalStyle, BuildingType, Project } from '../../types';
import { generateAIPlan } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_STATES } from '../../config/regionConfig';
import { useLanguage } from '../../context/LanguageContext';
import { AreaUnit, convertToSqFt, formatINR } from '../../utils/units';
import { 
  Building2, 
  Ruler, 
  IndianRupee, 
  Sparkles, 
  MapPin, 
  Home, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  X,
  Compass,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface PlannerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

export const PlannerWizard: React.FC<PlannerWizardProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const { user } = useAuth();
  const { isTamil, t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tnDistricts = INDIAN_STATES.TN.districts;

  const [unit, setUnit] = useState<AreaUnit>('sqft');
  const [unitVal, setUnitVal] = useState<number>(1800);

  const [formData, setFormData] = useState<AIPlanRequest>({
    plotLength: 40,
    plotWidth: 30,
    budget: 3800000,
    floors: 2,
    houseType: 'residential_villa',
    bedrooms: 2,
    bathrooms: 2,
    parking: 'garage',
    balcony: 'yes',
    garden: 'yes',
    style: 'modern_minimalist',
    title: '2 BHK Vastu Residential House',
    buildingType: 'residential_villa',
    landWidthFt: 30,
    landLengthFt: 40,
    budgetUSD: 3800000, // ₹38 Lakhs
    location: 'Chennai, Tamil Nadu (Anna Nagar)',
    desiredRoomsCount: 4,
    floorsCount: 2,
    specialRequirements: 'Strict Vastu Shastra layout: East main entrance, Agni Moolai kitchen (SE), Kanni Moolai master bedroom (SW), and 12,000L underground RCC sump.',
  });

  if (!isOpen) return null;

  const handleUnitValueChange = (val: number, currentUnit: AreaUnit) => {
    setUnitVal(val);
    const sqft = convertToSqFt(val, currentUnit);
    // calculate width/length approx 3:4 ratio for grid
    const width = Math.round(Math.sqrt(sqft * 0.75));
    const length = Math.round(sqft / width);
    setFormData((prev) => ({
      ...prev,
      landWidthFt: width,
      landLengthFt: length,
    }));
  };

  const handleGenerate = async () => {
    setErrorMessage(null);

    if (!formData.landWidthFt || formData.landWidthFt <= 0 || !formData.landLengthFt || formData.landLengthFt <= 0) {
      setErrorMessage('Plot dimensions must be greater than zero.');
      return;
    }
    if (!formData.budgetUSD || formData.budgetUSD <= 0) {
      setErrorMessage('Budget must be greater than zero.');
      return;
    }

    setIsGenerating(true);
    try {
      const aiResponse = await generateAIPlan(formData);

      const newProject: Project = {
        id: `prj_${Date.now()}`,
        title: formData.title,
        description: `AI Vastu Generated ${formData.style.replace('_', ' ')} for ${formData.location}. Plot area: ${formData.landWidthFt * formData.landLengthFt} sq ft (${((formData.landWidthFt * formData.landLengthFt)/435.6).toFixed(2)} Cents).`,
        buildingType: formData.buildingType as any,
        style: formData.style as any,
        customerProfileId: user?.id || 'usr_customer_1',
        customerName: user?.name || 'Karthik Subramanian',
        customerEmail: user?.email || 'karthik.s@example.com',
        location: formData.location,
        landWidthFt: formData.landWidthFt,
        landLengthFt: formData.landLengthFt,
        totalBudgetUSD: formData.budgetUSD,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        blueprint: aiResponse.blueprint,
        materials: aiResponse.materials,
        engineeringChecks: aiResponse.engineeringChecks,
        timeline: aiResponse.timeline,
        revisions: [],
        
        estimatedTotalCostUSD: aiResponse.estimatedTotalCostUSD,
        costBreakdown: aiResponse.costBreakdown,
        sustainabilityRating: aiResponse.sustainabilityRating,
        estimatedDurationMonths: aiResponse.estimatedDurationMonths,
      };

      if (typeof onProjectCreated === 'function') {
        onProjectCreated(newProject);
      }
      setIsGenerating(false);
      onClose();
    } catch (err: any) {
      console.error('PlannerWizard generate error:', err);
      setErrorMessage(err?.message || 'Unable to connect to Gemini AI.');
      setIsGenerating(false);
    }
  };

  const buildingTypesList: { type: BuildingType; labelEn: string; labelTa: string; desc: string }[] = [
    { type: 'residential_villa', labelEn: 'Individual House / Villa', labelTa: 'தனி வீடு / வில்லா', desc: 'G+1 / G+2 Vastu residential home' },
    { type: 'multi_family_apartment', labelEn: 'Multi-Portion Rental', labelTa: 'வாடகை குடியிருப்பு', desc: 'High yield rental portions' },
    { type: 'commercial_office', labelEn: 'Commercial Shops & Office', labelTa: 'வணிகக் கடை & அலுவலகம்', desc: 'Retail store & office floors' },
  ];

  const stylesList: { style: ArchitecturalStyle; labelEn: string; labelTa: string }[] = [
    { style: 'modern_minimalist', labelEn: 'Modern Tamil Nadu Minimalist', labelTa: 'நவீன தமிழ் பாணி' },
    { style: 'mediterranean', labelEn: 'Traditional Courtyard (Thinnai)', labelTa: 'திண்ணை பாரம்பரிய வீடு' },
    { style: 'eco_sustainable', labelEn: 'Eco Solar & Breeze Home', labelTa: 'சுற்றுச்சூழல் சூரிய ஒளி வீடு' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">
                {isTamil ? 'தமிழ்நாடு AI வீடு திட்டமிடுபவர்' : 'AI Tamil Nadu House Planner Wizard'}
              </h2>
              <p className="text-xs text-slate-400">Step {step} of 3 • Vastu Shastra & TN Municipal Building Codes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isTamil ? 'வீட்டின் தலைப்பு *' : 'House Plan Title *'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 2 BHK Vastu Duplex House"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isTamil ? 'கட்டிட வகை *' : 'Select Building Type *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {buildingTypesList.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, buildingType: item.type })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.buildingType === item.type
                          ? 'bg-emerald-600/20 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 mb-1.5 ${formData.buildingType === item.type ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <p className="text-xs font-semibold text-slate-200">{isTamil ? item.labelTa : item.labelEn}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isTamil ? 'கட்டிடக்கலை பாணி *' : 'Architectural Style *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {stylesList.map((item) => (
                    <button
                      key={item.style}
                      type="button"
                      onClick={() => setFormData({ ...formData, style: item.style })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                        formData.style === item.style
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isTamil ? item.labelTa : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              
              {/* Local Area Unit selector */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-emerald-400">
                  {isTamil ? 'நில அளவு அலகுகள் (Local Units)' : 'Land Footprint Unit'}
                </label>

                <div className="flex gap-2">
                  {(['sqft', 'cent', 'ground', 'acre'] as AreaUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUnit(u);
                        handleUnitValueChange(unitVal, u);
                      }}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        unit === u ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {u === 'sqft' ? (isTamil ? 'சதுர அடி' : 'Sq Ft') :
                       u === 'cent' ? (isTamil ? 'சென்ட்' : 'Cent') :
                       u === 'ground' ? (isTamil ? 'கிரவுண்ட்' : 'Ground') :
                       (isTamil ? 'ஏக்கர்' : 'Acre')}
                    </button>
                  ))}
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{isTamil ? 'நில அளவு' : 'Land Area Value'}</label>
                    <input
                      type="number"
                      value={unitVal}
                      onChange={(e) => handleUnitValueChange(Number(e.target.value), unit)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-emerald-400">= {formData.landWidthFt * formData.landLengthFt} Sq Ft</p>
                    <p className="text-[10px] text-slate-400">Approx ({formData.landWidthFt} ft x {formData.landLengthFt} ft)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isTamil ? 'மதிப்பிடப்பட்ட பட்ஜெட் (₹ INR)' : 'Target Budget (INR)'}
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="number"
                      value={formData.budgetUSD}
                      onChange={(e) => setFormData({ ...formData, budgetUSD: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                    {formatINR(formData.budgetUSD, isTamil)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isTamil ? 'தமிழ்நாடு மாவட்டம்' : 'Tamil Nadu District'}
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {tnDistricts.map((d) => (
                      <option key={d.id} value={`${d.nameEn}, Tamil Nadu`}>
                        {isTamil ? d.nameTa : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isTamil ? 'அறைகளின் எண்ணிக்கை' : 'Desired Room Count'}
                  </label>
                  <input
                    type="number"
                    value={formData.desiredRoomsCount}
                    onChange={(e) => setFormData({ ...formData, desiredRoomsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isTamil ? 'தளங்கள் (Floors)' : 'Floors / Stories'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.floorsCount}
                    onChange={(e) => setFormData({ ...formData, floorsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isTamil ? 'வாஸ்து சாஸ்திரம் மற்றும் சிறப்பு தேவைகள்' : 'Vastu Shastra & Custom Structural Directives'}
                </label>
                <textarea
                  rows={4}
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  placeholder="e.g. East main door facing, Kanni Moolai master bedroom, Agni Moolai kitchen."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Review Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" /> Vastu House Synthesis Summary
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div>• Building: <span className="font-medium text-white capitalize">{formData.buildingType.replace('_', ' ')}</span></div>
                  <div>• Style: <span className="font-medium text-white capitalize">{formData.style.replace('_', ' ')}</span></div>
                  <div>• Footprint: <span className="font-medium text-emerald-400">{formData.landWidthFt * formData.landLengthFt} sq ft</span></div>
                  <div>• Budget: <span className="font-medium text-emerald-400">{formatINR(formData.budgetUSD, isTamil)}</span></div>
                  <div>• Stories: <span className="font-medium text-white">{formData.floorsCount} Floor(s)</span></div>
                  <div>• Location: <span className="font-medium text-white truncate">{formData.location}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start justify-between gap-3 text-red-300 text-xs shadow-lg animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-200">Unable to generate AI plan</p>
                  <p className="text-red-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> {isTamil ? 'பின்னால்' : 'Back'}
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              {isTamil ? 'அடுத்த நிலை' : 'Next Step'} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isTamil ? 'வரைபடம் உருவாக்கப்படுகிறது...' : 'Synthesizing Gemini Vastu CAD Plan...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isTamil ? 'AI வீடு வரைபடம் உருவாக்கு' : 'Generate AI CAD Floor Plan'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
