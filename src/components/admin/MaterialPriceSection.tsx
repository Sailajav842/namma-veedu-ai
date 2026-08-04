import React, { useState } from 'react';
import { MaterialMarketPrice } from '../../types';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Search, 
  Edit3, 
  DollarSign, 
  Check, 
  Sparkles,
  Layers,
  Leaf
} from 'lucide-react';

interface MaterialPriceSectionProps {
  materials: MaterialMarketPrice[];
  onUpdateMaterials: (updated: MaterialMarketPrice[]) => void;
}

export const MaterialPriceSection: React.FC<MaterialPriceSectionProps> = ({
  materials,
  onUpdateMaterials,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MaterialMarketPrice | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Material Form State
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<MaterialMarketPrice['category']>('Structural');
  const [newUnit, setNewUnit] = useState('cubic yard');
  const [newPrice, setNewPrice] = useState(150);
  const [newTrend, setNewTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [newTrendPct, setNewTrendPct] = useState(0);
  const [newGrade, setNewGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A+');
  const [newRegion, setNewRegion] = useState('US-National');

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.regionalIndex.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Structural', 'Masonry', 'Roofing', 'MEP Plumbing', 'MEP Electrical', 'Finishing', 'Labor & Permits'];

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const updated = materials.map((m) => (m.id === editingItem.id ? editingItem : m));
    onUpdateMaterials(updated);
    setEditingItem(null);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: MaterialMarketPrice = {
      id: `mp_${Date.now()}`,
      name: newName,
      category: newCat,
      unit: newUnit,
      currentPriceUSD: newPrice,
      trend: newTrend,
      trendPercent: newTrendPct,
      sustainabilityGrade: newGrade,
      regionalIndex: newRegion,
    };

    onUpdateMaterials([...materials, newItem]);
    setIsAddModalOpen(false);
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>Regional Construction Material Price Index</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time market tracking for structural concrete, Grade 60 rebar, solar tiles, and low-E glass for AI Cost Estimators.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Material to Index
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search material name, category, region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Material Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-950 text-slate-300 border border-slate-800">
                  {mat.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{mat.regionalIndex}</span>
              </div>

              <h4 className="text-base font-bold text-white pt-1">{mat.name}</h4>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-850 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] font-semibold uppercase block">Unit Rate</span>
                <span className="text-base font-extrabold text-white">${mat.currentPriceUSD.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">per {mat.unit}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] font-semibold uppercase block">30D Trend</span>
                <div className={`flex items-center gap-1 font-bold pt-1 ${
                  mat.trend === 'up' ? 'text-rose-400' : mat.trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {mat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {mat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                  {mat.trend === 'stable' && <Minus className="w-4 h-4" />}
                  <span>{mat.trendPercent > 0 ? `+${mat.trendPercent}%` : `${mat.trendPercent}%`}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] font-semibold uppercase block">Eco Grade</span>
                <span className="px-2 py-0.5 mt-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                  <Leaf className="w-3 h-3 inline mr-1" />{mat.sustainabilityGrade}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => setEditingItem(mat)}
                className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Update Market Rate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Update Material Market Rate</span>
              </h4>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.currentPriceUSD}
                    onChange={(e) => setEditingItem({ ...editingItem, currentPriceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trend Direction</label>
                  <select
                    value={editingItem.trend}
                    onChange={(e) => setEditingItem({ ...editingItem, trend: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="up">Rising (+)</option>
                    <option value="down">Falling (-)</option>
                    <option value="stable">Stable (=)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trend Change (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.trendPercent}
                    onChange={(e) => setEditingItem({ ...editingItem, trendPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save Market Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddMaterial} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Add Material Item to Global Index</span>
              </h4>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Cross-Laminated Timber (CLT) Panels"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Structural">Structural</option>
                    <option value="Masonry">Masonry</option>
                    <option value="Roofing">Roofing</option>
                    <option value="MEP Plumbing">MEP Plumbing</option>
                    <option value="MEP Electrical">MEP Electrical</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Labor & Permits">Labor & Permits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="sq ft, ton, etc."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Regional Index</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    placeholder="US-National, US-West, etc."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
