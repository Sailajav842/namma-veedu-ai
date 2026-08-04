import React, { useState } from 'react';
import { MaterialItem } from '../../types';
import { 
  Calculator, 
  IndianRupee, 
  TrendingUp, 
  Download, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Leaf
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface BOMCalculatorProps {
  materials: MaterialItem[];
  totalBudgetUSD: number;
}

export const BOMCalculator: React.FC<BOMCalculatorProps> = ({
  materials,
  totalBudgetUSD,
}) => {
  const [inflationMultiplier, setInflationMultiplier] = useState<number>(1.0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Structural', 'Masonry', 'Roofing', 'MEP Plumbing', 'MEP Electrical', 'Finishing', 'Labor & Permits'];

  const filteredMaterials = selectedCategory === 'All'
    ? materials
    : materials.filter((m) => m.category === selectedCategory);

  const calculateTotal = () => {
    return filteredMaterials.reduce((acc, m) => acc + m.totalCost * inflationMultiplier, 0);
  };

  const grandTotal = calculateTotal();
  const budgetVariance = totalBudgetUSD - grandTotal;

  const exportCSV = () => {
    const csvRows = [
      ['Category', 'Material Name', 'Quantity', 'Unit', 'Unit Price (INR ₹)', 'Adjusted Total (INR ₹)', 'Sustainability Grade'],
      ...filteredMaterials.map((m) => [
        m.category,
        `"${m.name}"`,
        m.quantity,
        m.unit,
        `₹${m.estimatedUnitPrice}`,
        `₹${Math.round(m.totalCost * inflationMultiplier).toLocaleString('en-IN')}`,
        m.sustainabilityGrade,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Namma_Veedu_Bill_of_Materials_TN.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md dark:shadow-xl text-slate-800 dark:text-slate-100 space-y-6 transition-colors">
      
      {/* Header & Adjusters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Bill of Materials (BOM) & Cost Calculator</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Itemized quantity survey, Tamil Nadu market price index, and sustainability score
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Inflation/Market Variance Slider */}
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Material Price Index:
            </span>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={inflationMultiplier}
              onChange={(e) => setInflationMultiplier(parseFloat(e.target.value))}
              className="w-24 accent-emerald-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {Math.round(inflationMultiplier * 100)}%
            </span>
          </div>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-800 dark:text-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Project Budget</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatINR(totalBudgetUSD)}</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Calculated Total BOM Cost</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(grandTotal)}</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Budget Variance Reserve</p>
          <p className={`text-2xl font-bold ${budgetVariance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {budgetVariance >= 0 ? `+${formatINR(budgetVariance)} (Under Budget)` : `-${formatINR(Math.abs(budgetVariance))} (Surplus Needed)`}
          </p>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Material / Item</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Unit Rate</th>
              <th className="py-3 px-4">Adjusted Total (₹)</th>
              <th className="py-3 px-4">Eco Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
            {filteredMaterials.map((item) => {
              const adjustedTotal = item.totalCost * inflationMultiplier;

              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {formatFullINR(item.estimatedUnitPrice)} / {item.unit}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatFullINR(Math.round(adjustedTotal))}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <Leaf className="w-3 h-3" /> Grade {item.sustainabilityGrade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

