import React, { useState } from 'react';
import { X, Calculator, Copy, Check, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AreaUnit, TAMILNADU_AREA_UNITS, convertFromSqFt, convertToSqFt, formatAreaSummary } from '../../utils/units';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAreaSqFt?: (sqFt: number) => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  onApplyAreaSqFt,
}) => {
  const { isTamil } = useLanguage();
  const [inputValue, setInputValue] = useState<number>(2400); // Default 1 Ground
  const [inputUnit, setInputUnit] = useState<AreaUnit>('sqft');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSqFt = convertToSqFt(inputValue, inputUnit);
  const cents = convertFromSqFt(currentSqFt, 'cent');
  const grounds = convertFromSqFt(currentSqFt, 'ground');
  const acres = convertFromSqFt(currentSqFt, 'acre');

  const handleCopySummary = () => {
    const summary = formatAreaSummary(currentSqFt, isTamil);
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyAreaSqFt) {
      onApplyAreaSqFt(currentSqFt);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isTamil ? 'தமிழ்நாடு மனை அளவு மாற்றி' : 'Tamil Nadu Land Unit Converter'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sq Ft ↔ Cent ↔ Ground ↔ Acre</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Controls */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isTamil ? 'அளவு சேர்க்கவும்' : 'Enter Land Area Value'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={1}
                value={inputValue || ''}
                onChange={(e) => setInputValue(Math.max(0, Number(e.target.value)))}
                className="col-span-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as AreaUnit)}
                className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs focus:outline-none focus:border-emerald-500"
              >
                {TAMILNADU_AREA_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {isTamil ? u.nameTa : u.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              {isTamil
                ? '1 சென்ட் = 435.6 ச.அடி | 1 கிரவுண்ட் = 2,400 ச.அடி | 1 ஏக்கர் = 100 சென்ட்'
                : '1 Cent = 435.6 Sq Ft | 1 Ground = 2,400 Sq Ft | 1 Acre = 100 Cents'}
            </span>
          </div>
        </div>

        {/* Real-time Converted Results Cards */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {isTamil ? 'சதுர அடி (Sq Ft)' : 'Square Feet'}
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {currentSqFt.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400">sq ft</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {isTamil ? 'சென்ட் (Cent)' : 'Cents'}
            </span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {cents} <span className="text-xs text-emerald-700 dark:text-emerald-300">Cents</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {isTamil ? 'கிரவுண்ட் (Ground)' : 'Grounds'}
            </span>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              {grounds} <span className="text-xs text-blue-700 dark:text-blue-300">Grounds</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {isTamil ? 'ஏக்கர் (Acre)' : 'Acres'}
            </span>
            <p className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              {acres} <span className="text-xs text-purple-700 dark:text-purple-300">Acres</span>
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? (isTamil ? 'பிரதி செய்யப்பட்டது!' : 'Copied!') : (isTamil ? 'நகலெடு (Copy)' : 'Copy Value')}</span>
          </button>

          {onApplyAreaSqFt && (
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>{isTamil ? 'அளவை வரைபடத்தில் பயன்படுத்துக' : 'Apply Area to Planner'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
