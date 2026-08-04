import React, { useState } from 'react';
import { MOCK_MATERIAL_PRICES } from '../../data/mockData';
import { MaterialMarketPrice } from '../../types';
import { TrendingUp, TrendingDown, Minus, Search, Filter, Leaf, Calculator, ArrowUpRight } from 'lucide-react';

export const MaterialPricesTab: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialMarketPrice[]>(MOCK_MATERIAL_PRICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive Material Estimator state
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [quantityInput, setQuantityInput] = useState<number>(100);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const calculatedEstimate = selectedMaterial ? Math.round(selectedMaterial.currentPriceUSD * quantityInput) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Market Intelligence
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" /> Building Material Price Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time market price indices for civil structural materials, sustainable finishes, and labor rates.
          </p>
        </div>
      </div>

      {/* Quick Material Estimator Tool */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" /> Instant Material Quantity Cost Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Material</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.currentPriceUSD}/{m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity ({selectedMaterial?.unit})</label>
            <input
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Subtotal Cost</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">${calculatedEstimate.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search material by name or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="Structural">Structural</option>
            <option value="Masonry">Masonry</option>
            <option value="Roofing">Roofing</option>
            <option value="MEP Plumbing">MEP Plumbing</option>
            <option value="MEP Electrical">MEP Electrical</option>
            <option value="Finishing">Finishing</option>
            <option value="Labor & Permits">Labor & Permits</option>
          </select>
        </div>
      </div>

      {/* Material Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                  {m.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" /> Grade {m.sustainabilityGrade}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm mt-1">{m.name}</h3>
              <p className="text-[11px] text-slate-400">Region: {m.regionalIndex}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-extrabold text-white">${m.currentPriceUSD.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400">per {m.unit}</p>

              <div className="mt-1 flex items-center justify-end gap-1">
                {m.trend === 'down' && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="w-3 h-3" /> {m.trendPercent}%
                  </span>
                )}
                {m.trend === 'up' && (
                  <span className="text-[11px] font-bold text-rose-400 flex items-center">
                    <TrendingUp className="w-3 h-3" /> +{m.trendPercent}%
                  </span>
                )}
                {m.trend === 'stable' && (
                  <span className="text-[11px] font-bold text-slate-400 flex items-center">
                    <Minus className="w-3 h-3" /> Stable
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
