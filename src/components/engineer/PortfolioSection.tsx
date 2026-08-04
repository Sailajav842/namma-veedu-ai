import React, { useState } from 'react';
import { EngineerPortfolioItem, BuildingType } from '../../types';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Check, 
  Trash2, 
  DollarSign, 
  Layers 
} from 'lucide-react';

interface PortfolioSectionProps {
  portfolio: EngineerPortfolioItem[];
  onSavePortfolio: (items: EngineerPortfolioItem[]) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio,
  onSavePortfolio,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<EngineerPortfolioItem>>({
    title: '',
    buildingType: 'residential_villa',
    location: '',
    completionYear: 2024,
    areaSqFt: 3500,
    imageUrl: '',
    description: '',
    highlights: ['Deep Concrete Caissons', 'Seismic Shear Wall Assembly'],
    costUSD: 1200000,
  });
  const [highlightInput, setHighlightInput] = useState('');

  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    const newItem: EngineerPortfolioItem = {
      id: `port_${Date.now()}`,
      title: form.title,
      buildingType: form.buildingType || 'residential_villa',
      location: form.location,
      completionYear: form.completionYear || 2024,
      areaSqFt: form.areaSqFt || 3000,
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      description: form.description || 'Custom structural PE calculation package and site inspection completed.',
      highlights: form.highlights || ['Seismic Retrofit', 'Foundation Engineering'],
      costUSD: form.costUSD || 850000,
    };

    onSavePortfolio([newItem, ...portfolio]);
    setIsModalOpen(false);
    setForm({
      title: '',
      buildingType: 'residential_villa',
      location: '',
      completionYear: 2024,
      areaSqFt: 3500,
      imageUrl: '',
      description: '',
      highlights: ['Deep Concrete Caissons', 'Seismic Shear Wall Assembly'],
      costUSD: 1200000,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project item from your public portfolio?')) {
      onSavePortfolio(portfolio.filter((p) => p.id !== id));
    }
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), highlightInput.trim()],
    }));
    setHighlightInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span>Structural Engineering Portfolio Showcase</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Display your stamped structural & civil engineering projects to clients booking your review services.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Project to Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                {item.buildingType.replace(/_/g, ' ')}
              </span>

              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-950/80 text-slate-400 hover:text-rose-400 transition-colors backdrop-blur-md"
                title="Remove project"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.completionYear}</span>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Engineering Highlights</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.highlights.map((h, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" /> {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Footprint</span>
                <span className="font-bold text-white">{item.areaSqFt.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Add Structural Engineering Project</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">×</button>
            </div>

            <form onSubmit={handleAddPortfolioItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Marin Coastal Cantilever Villa"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Building Category</label>
                  <select
                    value={form.buildingType}
                    onChange={(e) => setForm({ ...form, buildingType: e.target.value as BuildingType })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="residential_villa">Residential Villa</option>
                    <option value="multi_family_apartment">Multi-Family Apartment</option>
                    <option value="commercial_office">Commercial Office</option>
                    <option value="retail_store">Retail Store</option>
                    <option value="industrial_warehouse">Industrial Warehouse</option>
                    <option value="eco_tiny_home">Eco Tiny Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Footprint (sq ft)</label>
                  <input
                    type="number"
                    value={form.areaSqFt}
                    onChange={(e) => setForm({ ...form, areaSqFt: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Completion Year</label>
                  <input
                    type="number"
                    value={form.completionYear}
                    onChange={(e) => setForm({ ...form, completionYear: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Photo URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & PE Calculation Work</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe structural loads, soil capacity, steel rebar specs..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Structural Features / Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g. Grade 60 Rebar Grid"
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {form.highlights?.map((h, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Portfolio Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
