import React, { useState } from 'react';
import { AIPlanRequest, AIPlanResponse, Project } from '../../types';
import { generateAIPlan } from '../../services/api';
import { PlanOutputDisplay } from '../planner/PlanOutputDisplay';
import { 
  Sparkles, 
  Ruler, 
  IndianRupee, 
  Layers, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Sun, 
  TreePine, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface CreatePlanTabProps {
  onPlanCreated: (project: Project) => void;
  customerName?: string;
  customerEmail?: string;
}

export const CreatePlanTab: React.FC<CreatePlanTabProps> = ({
  onPlanCreated,
  customerName = 'Karthik Subramanian',
  customerEmail = 'karthik.s@example.com',
}) => {
  // 11 User Input Fields
  const [plotLength, setPlotLength] = useState<number>(60);
  const [plotWidth, setPlotWidth] = useState<number>(40);
  const [budget, setBudget] = useState<number>(3500000); // Default ₹35 Lakhs
  const [floors, setFloors] = useState<number>(2);
  const [houseType, setHouseType] = useState<string>('Ground + 1 Floor (G+1)');
  const [vastuEnabled, setVastuEnabled] = useState<boolean>(true);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [parking, setParking] = useState<string>('2-Car Covered Garage');
  const [balcony, setBalcony] = useState<string>('Yes (Private Terrace)');
  const [garden, setGarden] = useState<string>('Front & Backyard Lawn');
  const [style, setStyle] = useState<string>('Modern Minimalist');

  const [title, setTitle] = useState('Namma Veedu Dream Residence');
  const [location, setLocation] = useState('Chennai, TN - OMR Tech Corridor');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedPlanData, setGeneratedPlanData] = useState<AIPlanResponse | null>(null);

  const budgetPresets = [
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹20 Lakh', value: 2000000 },
    { label: '₹35 Lakh', value: 3500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
  ];


  const houseTypes = [
    'Ground Floor Only (G+0)',
    'Ground + 1 Floor (G+1)',
    'Ground + 2 Floors (G+2)',
    'Ground + 3 Floors (G+3)',
    'Independent Villa',
    'Duplex Residence',
    'Rental Apartment',
    'Commercial Office & Living'
  ];

  const architecturalStyles = [
    'Modern Minimalist',
    'Mediterranean Luxury',
    'Industrial Steel & Glass',
    'Eco Sustainable Biophilic',
    'Classic Colonial',
    'Contemporary Urban',
    'Traditional Vastu Harmonized'
  ];

  const parkingOptions = [
    '2-Car Covered Garage',
    '1-Car Garage & Carport',
    'Underground Basement Parking',
    'Open Driveway Parking',
    'No Parking'
  ];

  const balconyOptions = [
    'Yes (Private Terrace)',
    'Yes (2 Balconies)',
    'Yes (Rooftop Deck)',
    'No Balcony'
  ];

  const gardenOptions = [
    'Front & Backyard Lawn',
    'Courtyard Central Garden',
    'Rooftop Organic Garden',
    'No Garden'
  ];

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend Input Validation
    if (!plotLength || plotLength <= 0) {
      setErrorMessage('Plot length must be greater than zero.');
      return;
    }
    if (!plotWidth || plotWidth <= 0) {
      setErrorMessage('Plot width must be greater than zero.');
      return;
    }
    if (!budget || budget <= 0) {
      setErrorMessage('Budget must be greater than zero.');
      return;
    }
    if (!houseType || !houseType.trim()) {
      setErrorMessage('House type is required.');
      return;
    }

    setIsGenerating(true);
    setGeneratedPlanData(null);

    try {
      const request: AIPlanRequest = {
        title,
        plotLength,
        plotWidth,
        budget,
        floors,
        houseType,
        vastuEnabled,
        bedrooms,
        bathrooms,
        parking,
        balcony,
        garden,
        style,
        location,
        // Legacy aliases
        landLengthFt: plotLength,
        landWidthFt: plotWidth,
        budgetUSD: budget,
        floorsCount: floors,
        desiredRoomsCount: bedrooms + bathrooms + 2,
      };

      const res = await generateAIPlan(request);
      setGeneratedPlanData(res);
    } catch (err: any) {
      console.error('Failed to generate AI floor plan:', err);
      setErrorMessage(err?.message || 'Unable to connect to Gemini AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToWorkspace = () => {
    if (!generatedPlanData) return;

    const newProject: Project = {
      id: `prj_${Date.now()}`,
      title: title || `${style} ${houseType}`,
      description: `${floors}-story ${style} ${houseType} on ${plotLength}' x ${plotWidth}' lot. Includes ${bedrooms} Bed, ${bathrooms} Bath, ${parking}, ${balcony}, and ${garden}.`,
      buildingType: 'residential_villa',
      style: 'modern_minimalist',
      customerProfileId: 'usr_customer_1',
      customerName,
      customerEmail,
      assignedEngineerId: 'eng_001',
      assignedEngineerName: 'David Vance, PE',
      location,
      landWidthFt: plotWidth,
      landLengthFt: plotLength,
      totalBudgetUSD: budget,
      status: 'under_engineer_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blueprint: generatedPlanData.blueprint,
      materials: generatedPlanData.materials,
      engineeringChecks: generatedPlanData.engineeringChecks,
      timeline: generatedPlanData.timeline,
      revisions: [],
      estimatedTotalCostUSD: generatedPlanData.estimatedTotalCostUSD,
      costBreakdown: generatedPlanData.costBreakdown,
      sustainabilityRating: generatedPlanData.sustainabilityRating,
      estimatedDurationMonths: generatedPlanData.estimatedDurationMonths,
    };

    if (typeof onPlanCreated === 'function') {
      onPlanCreated(newProject);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Gemini 3.6 Flash Floor Plan Engine
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" /> AI Building Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter your site plot dimensions, budget, room requirements, and style preferences to generate structured CAD floor plans, Vastu Shastra directives, and budget optimizations.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGeneratePlan} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-400" /> 11 Parameter Site & Building Specifications
          </h2>
          <span className="text-[11px] text-slate-400">All fields processed directly by Gemini API</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. Plot Length */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-400" /> Plot Length (Ft)
            </label>
            <input
              type="number"
              min={15}
              max={500}
              value={plotLength}
              onChange={(e) => setPlotLength(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
            />
          </div>

          {/* 2. Plot Width */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-400" /> Plot Width (Ft)
            </label>
            <input
              type="number"
              min={15}
              max={500}
              value={plotWidth}
              onChange={(e) => setPlotWidth(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
            />
          </div>

          {/* Lot Area Calculator Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Calculated Lot Footprint</label>
            <div className="px-4 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-emerald-400 font-mono font-bold flex items-center justify-between">
              <span>Total Plot Area:</span>
              <span>{(plotLength * plotWidth).toLocaleString()} sq ft</span>
            </div>
          </div>

          {/* 3. Budget */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Estimated Budget (INR)
              </label>
              <span className="font-mono text-xs font-extrabold text-emerald-400">
                {formatINR(budget, false)} ({formatFullINR(budget)})
              </span>
            </div>
            <input
              type="number"
              min={100000}
              step={50000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-emerald-400"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {budgetPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setBudget(preset.value)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    budget === preset.value
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Floors */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Floors
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
            />
          </div>

          {/* 5. House Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-400" /> House Type
            </label>
            <select
              value={houseType}
              onChange={(e) => setHouseType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {houseTypes.map((ht) => (
                <option key={ht} value={ht}>{ht}</option>
              ))}
            </select>
          </div>

          {/* Vastu Shastra Compliance Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Vastu Shastra Compliance
            </label>
            <button
              type="button"
              onClick={() => setVastuEnabled(!vastuEnabled)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                vastuEnabled
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <span>{vastuEnabled ? '✓ Vastu Enabled (Tamil Nadu Rules)' : '✕ Standard Floor Plan'}</span>
              <span className={`w-3 h-3 rounded-full ${vastuEnabled ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
            </button>
          </div>

          {/* 6. Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-blue-400" /> Bedrooms
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
            />
          </div>

          {/* 7. Bathrooms */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-cyan-400" /> Bathrooms
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
            />
          </div>

          {/* 8. Parking */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" /> Parking
            </label>
            <select
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {parkingOptions.map((pk) => (
                <option key={pk} value={pk}>{pk}</option>
              ))}
            </select>
          </div>

          {/* 9. Balcony */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Balcony
            </label>
            <select
              value={balcony}
              onChange={(e) => setBalcony(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {balconyOptions.map((bal) => (
                <option key={bal} value={bal}>{bal}</option>
              ))}
            </select>
          </div>

          {/* 10. Garden */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" /> Garden
            </label>
            <select
              value={garden}
              onChange={(e) => setGarden(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {gardenOptions.map((gdn) => (
                <option key={gdn} value={gdn}>{gdn}</option>
              ))}
            </select>
          </div>

          {/* 11. Style */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" /> Architectural Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {architecturalStyles.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Project Title & Location Optional Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Project Name (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Location Zone (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

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

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Floor Plan with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Synthesize New Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Result Output Section */}
      {generatedPlanData && !isGenerating && (
        <PlanOutputDisplay
          planData={generatedPlanData}
          projectTitle={title || `${style} ${houseType}`}
          onSavePlan={handleSaveToWorkspace}
        />
      )}

    </div>
  );
};
