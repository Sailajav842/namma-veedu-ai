import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  PieChart, 
  Download, 
  Sparkles, 
  Building2, 
  Layers, 
  RefreshCw, 
  Layers3, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Hammer, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Zap, 
  Droplet, 
  Palette, 
  Box, 
  Users,
  Info,
  ArrowRight,
  Ruler
} from 'lucide-react';
import { 
  MaterialPriceService, 
  MaterialRate, 
  QuantityBreakdown, 
  calculateQuantitiesFromArea, 
  computeDetailedEstimate, 
  exportEstimateCSV, 
  exportEstimatePDF 
} from '../../services/costEstimatorService';
import { useLanguage } from '../../context/LanguageContext';
import { AreaUnit, convertToSqFt, convertFromSqFt, formatINR } from '../../utils/units';

export const CostEstimatorTab: React.FC = () => {
  const { isTamil, t } = useLanguage();
  const [selectedUnit, setSelectedUnit] = useState<AreaUnit>('sqft');
  const [unitValue, setUnitValue] = useState<number>(2000); // 2000 Sq Ft ~ 4.59 Cents
  const [areaSqFt, setAreaSqFt] = useState<number>(2000);
  const [qualityGrade, setQualityGrade] = useState<'standard' | 'premium' | 'luxury'>('premium');
  const [projectName, setProjectName] = useState<string>('Tamil Nadu Residential House');
  
  // Material Rates from API Provider
  const [rates, setRates] = useState<Record<string, MaterialRate>>({});
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);
  const [apiMetadata, setApiMetadata] = useState<{ name: string; isLiveApiConnected: boolean; lastSyncTime: string }>({
    name: 'Tamil Nadu Building Material Spot API (v2.4)',
    isLiveApiConnected: false,
    lastSyncTime: new Date().toISOString(),
  });

  // Quantities State
  const [quantities, setQuantities] = useState<QuantityBreakdown>(calculateQuantitiesFromArea(2000, 1.15));

  // Custom unit price overrides (optional)
  const [customRates, setCustomRates] = useState<Record<string, number>>({});

  // Active view tab in cost estimator
  const [activeView, setActiveView] = useState<'breakdown' | 'line_items' | 'api_config'>('breakdown');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Quality multipliers
  const qualityMultipliers = {
    standard: 1.0,
    premium: 1.15,
    luxury: 1.40,
  };

  // Sync unit value to areaSqFt
  const handleUnitValueChange = (val: number, unit: AreaUnit) => {
    setUnitValue(val);
    const inSqFt = convertToSqFt(val, unit);
    setAreaSqFt(inSqFt);
  };

  const handleUnitChange = (newUnit: AreaUnit) => {
    setSelectedUnit(newUnit);
    const converted = convertFromSqFt(areaSqFt, newUnit);
    setUnitValue(Number(converted.toFixed(2)));
  };

  // Fetch initial live rates from provider
  useEffect(() => {
    loadLiveRates();
  }, []);

  // Whenever areaSqFt or qualityGrade changes, auto-update standard quantities
  useEffect(() => {
    const mult = qualityMultipliers[qualityGrade];
    setQuantities(calculateQuantitiesFromArea(areaSqFt, mult));
  }, [areaSqFt, qualityGrade]);

  const loadLiveRates = async () => {
    setIsLoadingRates(true);
    const liveRates = await MaterialPriceService.getLiveMaterialRates();
    setRates(liveRates);
    setApiMetadata(MaterialPriceService.getProviderMetadata());
    setIsLoadingRates(false);
  };

  // Effective rates merging API provider default and user custom overrides
  const effectiveRates: Record<string, MaterialRate> = { ...rates };
  Object.keys(effectiveRates).forEach((k) => {
    if (customRates[k] !== undefined) {
      effectiveRates[k] = {
        ...effectiveRates[k],
        marketRateUSD: customRates[k],
      };
    }
  });

  // Compute final calculation
  const estimateResult = computeDetailedEstimate(areaSqFt, quantities, effectiveRates);

  const handleQuantityChange = (key: keyof QuantityBreakdown, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleRateOverrideChange = (key: string, value: number) => {
    setCustomRates((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleExportCSV = () => {
    exportEstimateCSV(projectName, areaSqFt, estimateResult, effectiveRates);
    setDownloadSuccessMessage(isTamil ? 'அறிக்கை வெற்றிபெற்றது! CSV பதிவிறக்கம் செய்யப்பட்டது.' : 'CSV Estimate Report downloaded successfully!');
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  const handleExportPDF = () => {
    exportEstimatePDF('printable-cost-report-card', `${projectName.toLowerCase().replace(/\s+/g, '_')}_cost_report.pdf`);
    setDownloadSuccessMessage(isTamil ? 'PDF அறிக்கை பதிவிறக்கம் செய்யப்பட்டது!' : 'PDF Cost Report exported successfully!');
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {isTamil ? 'நேரலை சந்தை விலை API' : 'Pluggable Material Price API Engine'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-slate-400 bg-slate-950 border border-slate-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {apiMetadata.name}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" /> {t('cost_estimator_title')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTamil
              ? 'தமிழ்நாடு கட்டிடப் பொருட்களின் சந்தை விலைகளுடன் துல்லியமான பொருள் செலவு, கூலி மற்றும் மொத்த தொகையைக் கணக்கிடுங்கள்.'
              : 'Calculate material costs, labor fees, and total house construction estimates with real-time Tamil Nadu material market rates.'}
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all shadow-md"
            title="Download Excel / CSV Estimate Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
            title="Export Downloadable PDF Estimate Report"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {downloadSuccessMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Primary Navigation / View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveView('breakdown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeView === 'breakdown'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" /> {isTamil ? 'செலவு அறிக்கை & வரைபடம்' : 'Cost Summary & Breakdown'}
        </button>

        <button
          onClick={() => setActiveView('line_items')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeView === 'line_items'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers3 className="w-4 h-4" /> {isTamil ? 'பொருட்கள் & கூலி விவரங்கள்' : 'Material & Labour Line Items'}
        </button>

        <button
          onClick={() => setActiveView('api_config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeView === 'api_config'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-300" /> {isTamil ? 'விலை API வடிவமைப்பு' : 'Real-time Price API Integration'}
        </button>
      </div>

      {/* Main Calculation Overview Cards (Material Cost, Labour Cost, Total Cost) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Material Cost */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-blue-400" /> {t('material_cost')}
          </p>
          <p className="text-2xl font-extrabold text-blue-400 mt-1">
            {formatINR(estimateResult.totalMaterialCost, isTamil)}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            {isTamil ? 'சிமெண்ட், கம்பி, மணல், செங்கல், ஜல்லி, பெயிண்ட், எலக்ட்ரிக்கல்' : 'Cement, Steel, Sand, Bricks, Aggregate, Paint, MEP'}
          </p>
        </div>

        {/* Labour Cost */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" /> {t('labour_cost')}
          </p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">
            {formatINR(estimateResult.totalLabourCost, isTamil)}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            {quantities.labourPersonDays} {isTamil ? 'கொத்தனார் / கூலி நாட்கள்' : 'person-days'} @ ₹{rates.labour?.marketRateUSD || 950}/day
          </p>
        </div>

        {/* Total Cost */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {t('total_cost')}
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {formatINR(estimateResult.totalCost, isTamil)}
          </p>
          <p className="text-[10px] text-emerald-300/80 font-medium">
            {isTamil ? 'பொருட்கள் + கூலி மொத்த செலவு' : `Material (${formatINR(estimateResult.totalMaterialCost, isTamil)}) + Labour`}
          </p>
        </div>

        {/* Unit Cost / Footprint Rate */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-400" /> {isTamil ? 'சதுர அடி செலவு' : 'Unit Rate per Sq Ft'}
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">
            ₹{estimateResult.costPerSqFt} <span className="text-xs font-normal text-slate-400">/ sq ft</span>
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            For {areaSqFt.toLocaleString()} sq ft ({(areaSqFt / 435.6).toFixed(2)} Cents)
          </p>
        </div>

      </div>

      {/* VIEW TAB 1: SUMMARY & BREAKDOWN */}
      {activeView === 'breakdown' && (
        <div id="printable-cost-report-card" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Column (with local units: Sq Ft, Cent, Ground, Acre) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5 lg:col-span-1">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-400" /> {isTamil ? 'இட அளவு & விவரங்கள்' : 'Land Measurement & Specs'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'வீட்டின் பெயர்' : 'Project Title'}</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Unit Selector (Sq Ft, Cent, Ground, Acre) */}
              <div className="space-y-2 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <label className="block text-xs font-bold text-emerald-400">
                  {isTamil ? 'நில அளவு அலகு (Unit)' : 'Measurement Unit'}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(['sqft', 'cent', 'ground', 'acre'] as AreaUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleUnitChange(u)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedUnit === u
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {u === 'sqft' ? (isTamil ? 'சதுர அடி' : 'Sq Ft') :
                       u === 'cent' ? (isTamil ? 'சென்ட்' : 'Cent') :
                       u === 'ground' ? (isTamil ? 'கிரவுண்ட்' : 'Ground') :
                       (isTamil ? 'ஏக்கர்' : 'Acre')}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-300">
                      {isTamil ? 'அளவு (Value)' : 'Input Value'}:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {unitValue} {selectedUnit.toUpperCase()}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={unitValue}
                    onChange={(e) => handleUnitValueChange(Number(e.target.value), selectedUnit)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    = {areaSqFt.toLocaleString()} sq ft ({(areaSqFt / 435.6).toFixed(2)} Cents)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isTamil ? 'கட்டுமான தரம் (Grade)' : 'Construction Grade'}</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="standard">{isTamil ? 'சாதாரண கட்டுமானம் (1.0x)' : 'Standard Residential Grade (1.0x)'}</option>
                  <option value="premium">{isTamil ? 'பிரீமியம் பசுமை வீடு (1.15x)' : 'Premium Vastu Green Home (1.15x)'}</option>
                  <option value="luxury">{isTamil ? 'லக்ஸரி வில்லா தரம் (1.40x)' : 'Ultra-Luxury Custom Villa (1.40x)'}</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">TN Market Spot API:</span>
                  <span className="text-emerald-400 font-mono font-bold">Active</span>
                </div>
                <button
                  onClick={loadLiveRates}
                  disabled={isLoadingRates}
                  className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoadingRates ? 'animate-spin' : ''}`} />
                  <span>{isTamil ? 'நேரலை கட்டணத்தை புதுப்பி' : 'Refresh Live API Rates'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Visual Breakdown Column */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 lg:col-span-2">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" /> {isTamil ? 'விரிவான செலவு பகுப்பாய்வு' : 'Detailed Cost Breakdown'}
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Total: {formatINR(estimateResult.totalCost, isTamil)}
              </span>
            </div>

            {/* Proportional Stacked Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                <div 
                  style={{ width: `${(estimateResult.itemCosts.cement / estimateResult.totalCost) * 100}%` }}
                  className="bg-blue-500 h-full"
                  title="Cement"
                />
                <div 
                  style={{ width: `${(estimateResult.itemCosts.steel / estimateResult.totalCost) * 100}%` }}
                  className="bg-cyan-400 h-full"
                  title="Steel"
                />
                <div 
                  style={{ width: `${((estimateResult.itemCosts.sand + estimateResult.itemCosts.bricks + estimateResult.itemCosts.aggregate) / estimateResult.totalCost) * 100}%` }}
                  className="bg-amber-500 h-full"
                  title="Masonry"
                />
                <div 
                  style={{ width: `${((estimateResult.itemCosts.electrical + estimateResult.itemCosts.plumbing) / estimateResult.totalCost) * 100}%` }}
                  className="bg-purple-500 h-full"
                  title="MEP"
                />
                <div 
                  style={{ width: `${(estimateResult.itemCosts.paint / estimateResult.totalCost) * 100}%` }}
                  className="bg-pink-500 h-full"
                  title="Paint"
                />
                <div 
                  style={{ width: `${(estimateResult.totalLabourCost / estimateResult.totalCost) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title="Labour"
                />
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {isTamil ? 'சிமெண்ட்' : 'Cement'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> {isTamil ? 'கம்பி (Steel)' : 'Steel'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {isTamil ? 'மணல் & செங்கல் & ஜல்லி' : 'Sand & Bricks'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> {isTamil ? 'எலக்ட்ரிக்கல் & பிளம்பிங்' : 'MEP'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> {isTamil ? 'பெயிண்ட்' : 'Paint'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {isTamil ? 'கூலி' : 'Labour'}</span>
              </div>
            </div>

            {/* List of 9 Key Categories with Tamil/English names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              
              {/* Cement */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'சிமெண்ட் (UltraTech / Ramco)' : 'Cement'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.cementBags} bags @ ₹{effectiveRates.cement?.marketRateUSD}/bag</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.cement, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.cement / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Steel */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'டிஎம்டி கம்பிகள் (JSW Steel)' : 'Steel Rebars'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.steelKg.toLocaleString()} kg @ ₹{effectiveRates.steel?.marketRateUSD}/kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.steel, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.steel / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Sand */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'எம்-சாண்ட் / பி-சாண்ட் மணல்' : 'M-Sand / River Sand'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.sandCuFt.toLocaleString()} cu ft @ ₹{effectiveRates.sand?.marketRateUSD}/cu ft</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.sand, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.sand / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Bricks */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'சேம்பர் செங்கல் (Chamber Bricks)' : 'Red Bricks'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.bricksCount.toLocaleString()} pcs @ ₹{effectiveRates.bricks?.marketRateUSD}/pc</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.bricks, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.bricks / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Aggregate */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-300 border border-slate-500/20 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? '20மிமீ ஜல்லி (Aggregate)' : 'Coarse Aggregate'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.aggregateCuFt.toLocaleString()} cu ft @ ₹{effectiveRates.aggregate?.marketRateUSD}/cu ft</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.aggregate, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.aggregate / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Paint */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'ஏசியன் பெயிண்ட் (Apex Paint)' : 'Paint & Finishes'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{quantities.paintLiters.toLocaleString()} liters @ ₹{effectiveRates.paint?.marketRateUSD}/liter</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.paint, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.paint / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Electrical */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'பினோலெக்ஸ் எலக்ட்ரிக்கல் வயரிங்' : 'Electrical Wiring'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{areaSqFt} sq ft @ ₹{effectiveRates.electrical?.marketRateUSD}/sq ft</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.electrical, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.electrical / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Plumbing */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'ஆசிர்வாத் பிளம்பிங் & CPVC' : 'Plumbing Systems'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{areaSqFt} sq ft @ ₹{effectiveRates.plumbing?.marketRateUSD}/sq ft</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xs">{formatINR(estimateResult.itemCosts.plumbing, isTamil)}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{((estimateResult.itemCosts.plumbing / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Labour */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{isTamil ? 'தமிழ்நாடு கொத்தனார் & சித்தாள் கூலி' : 'Civil Labour & Masons'}</h4>
                    <p className="text-[10px] text-emerald-300 font-mono">{quantities.labourPersonDays.toLocaleString()} {isTamil ? 'மனித நாட்கள்' : 'person-days'} @ ₹{effectiveRates.labour?.marketRateUSD}/day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400 text-sm">{formatINR(estimateResult.itemCosts.labour, isTamil)}</p>
                  <p className="text-[10px] text-emerald-300/80 font-mono">{((estimateResult.itemCosts.labour / estimateResult.totalCost) * 100).toFixed(1)}%</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW TAB 2: LINE ITEMS EDITABLE TABLE */}
      {activeView === 'line_items' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-emerald-400" /> {isTamil ? 'அளவு மற்றும் சந்தை விலை திருத்தி' : 'Interactive Quantity & Unit Rate Editor'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTamil ? 'உங்கள் உள்ளூர் தேவைகளுக்கு ஏற்ப பொருட்களின் அளவை நேரடியாக மாற்றலாம்.' : 'Adjust specific quantities or market unit rates to see real-time recalculations.'}
              </p>
            </div>

            <button
              onClick={() => {
                const mult = qualityMultipliers[qualityGrade];
                setQuantities(calculateQuantitiesFromArea(areaSqFt, mult));
                setCustomRates({});
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> {isTamil ? 'மீட்டமை' : 'Reset to API Standards'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/50">
                  <th className="p-3">{isTamil ? 'பொருள் பெயர்' : 'Line Item Name'}</th>
                  <th className="p-3">{isTamil ? 'பிரிவு' : 'Category'}</th>
                  <th className="p-3">{isTamil ? 'அளவு' : 'Quantity'}</th>
                  <th className="p-3">{isTamil ? 'அலகு' : 'Unit'}</th>
                  <th className="p-3">{isTamil ? 'அலகு விலை (₹)' : 'Unit Rate (₹)'}</th>
                  <th className="p-3 text-right">{isTamil ? 'மொத்த தொகை' : 'Subtotal Cost'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                
                {/* Cement */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-400 shrink-0" /> {isTamil ? 'சிமெண்ட் பை (50kg)' : 'Cement Bags'}
                  </td>
                  <td className="p-3 text-slate-400">Structural</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.cementBags}
                      onChange={(e) => handleQuantityChange('cementBags', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">bags</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.cement?.marketRateUSD || 410}
                      onChange={(e) => handleRateOverrideChange('cement', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.cement, isTamil)}</td>
                </tr>

                {/* Steel */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" /> {isTamil ? 'TMT கம்பி' : 'Steel Rebar'}
                  </td>
                  <td className="p-3 text-slate-400">Structural</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.steelKg}
                      onChange={(e) => handleQuantityChange('steelKg', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">kg</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.steel?.marketRateUSD || 68}
                      onChange={(e) => handleRateOverrideChange('steel', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.steel, isTamil)}</td>
                </tr>

                {/* Sand */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0" /> {isTamil ? 'எம்-சாண்ட் / மணல்' : 'M-Sand'}
                  </td>
                  <td className="p-3 text-slate-400">Masonry</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.sandCuFt}
                      onChange={(e) => handleQuantityChange('sandCuFt', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">cu ft</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.sand?.marketRateUSD || 55}
                      onChange={(e) => handleRateOverrideChange('sand', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.sand, isTamil)}</td>
                </tr>

                {/* Bricks */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-400 shrink-0" /> {isTamil ? 'சேம்பர் செங்கல்' : 'Red Bricks'}
                  </td>
                  <td className="p-3 text-slate-400">Masonry</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.bricksCount}
                      onChange={(e) => handleQuantityChange('bricksCount', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">pieces</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.bricks?.marketRateUSD || 11}
                      onChange={(e) => handleRateOverrideChange('bricks', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.bricks, isTamil)}</td>
                </tr>

                {/* Aggregate */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400 shrink-0" /> {isTamil ? '20மிமீ ஜல்லி' : 'Aggregate'}
                  </td>
                  <td className="p-3 text-slate-400">Structural</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.aggregateCuFt}
                      onChange={(e) => handleQuantityChange('aggregateCuFt', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">cu ft</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.aggregate?.marketRateUSD || 42}
                      onChange={(e) => handleRateOverrideChange('aggregate', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.aggregate, isTamil)}</td>
                </tr>

                {/* Paint */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-400 shrink-0" /> {isTamil ? 'பெயிண்ட்' : 'Paint'}
                  </td>
                  <td className="p-3 text-slate-400">Finishing</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.paintLiters}
                      onChange={(e) => handleQuantityChange('paintLiters', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">liters</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.paint?.marketRateUSD || 380}
                      onChange={(e) => handleRateOverrideChange('paint', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.paint, isTamil)}</td>
                </tr>

                {/* Electrical */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 shrink-0" /> {isTamil ? 'எலக்ட்ரிக்கல் வயரிங்' : 'Electrical Wiring'}
                  </td>
                  <td className="p-3 text-slate-400">MEP Systems</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.electricalUnitsSqFt}
                      onChange={(e) => handleQuantityChange('electricalUnitsSqFt', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">sq ft area</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.electrical?.marketRateUSD || 180}
                      onChange={(e) => handleRateOverrideChange('electrical', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.electrical, isTamil)}</td>
                </tr>

                {/* Plumbing */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-purple-400 shrink-0" /> {isTamil ? 'பிளம்பிங்' : 'Plumbing'}
                  </td>
                  <td className="p-3 text-slate-400">MEP Systems</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.plumbingUnitsSqFt}
                      onChange={(e) => handleQuantityChange('plumbingUnitsSqFt', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-slate-400">sq ft area</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.plumbing?.marketRateUSD || 160}
                      onChange={(e) => handleRateOverrideChange('plumbing', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-white text-right font-mono">{formatINR(estimateResult.itemCosts.plumbing, isTamil)}</td>
                </tr>

                {/* Labour */}
                <tr className="bg-emerald-500/10 hover:bg-emerald-500/20">
                  <td className="p-3 font-bold text-emerald-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" /> {isTamil ? 'கொத்தனார் கூலி' : 'Civil Labour'}
                  </td>
                  <td className="p-3 text-emerald-300/80 font-medium">Workforce</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={quantities.labourPersonDays}
                      onChange={(e) => handleQuantityChange('labourPersonDays', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-emerald-300/80 font-medium">person-days</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={effectiveRates.labour?.marketRateUSD || 950}
                      onChange={(e) => handleRateOverrideChange('labour', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="p-3 font-bold text-emerald-400 text-right font-mono text-sm">{formatINR(estimateResult.itemCosts.labour, isTamil)}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB 3: PRICE API INTEGRATION DESIGN */}
      {activeView === 'api_config' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Zero UI Modification Pluggable Architecture
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" /> Real-time Tamil Nadu Material Price API Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The estimator is designed with an isolated <code className="text-purple-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">MaterialPriceProvider</code> interface layer. 
              Connecting a live external vendor API (e.g. Tamil Nadu Building Material Spot API or custom REST backend) requires updating only the service provider file without making any changes to UI components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" /> Active Provider Metadata
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Provider Service:</span>
                  <span className="text-white font-mono font-bold">{apiMetadata.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Environment Endpoint Variable:</span>
                  <span className="text-purple-400 font-mono">VITE_TN_MATERIAL_PRICE_API_URL</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Live API Status:</span>
                  <span className="text-emerald-400 font-bold">Ready / Standby</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Last Sync Time:</span>
                  <span className="text-slate-300 font-mono text-[10px]">{apiMetadata.lastSyncTime}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Plug-in REST Interface Spec
              </h4>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`// Sample JSON response from live Tamil Nadu API endpoint:
{
  "cement": { "marketRateUSD": 410, "unit": "50kg bag" },
  "steel": { "marketRateUSD": 68, "unit": "kg" },
  "sand": { "marketRateUSD": 55, "unit": "cu ft" },
  "bricks": { "marketRateUSD": 11, "unit": "pieces" },
  "aggregate": { "marketRateUSD": 42, "unit": "cu ft" },
  "paint": { "marketRateUSD": 380, "unit": "liters" },
  "electrical": { "marketRateUSD": 180, "unit": "sq ft" },
  "plumbing": { "marketRateUSD": 160, "unit": "sq ft" },
  "labour": { "marketRateUSD": 950, "unit": "day" }
}`}
              </pre>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
