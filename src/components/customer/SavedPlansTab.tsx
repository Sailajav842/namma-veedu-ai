import React, { useState } from 'react';
import { Project, CustomerTab } from '../../types';
import { FolderHeart, Search, Filter, Layers, DollarSign, Award, CheckCircle2, Trash2, ArrowRight, Download, Plus } from 'lucide-react';

interface SavedPlansTabProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onNavigateTab: (tab: CustomerTab) => void;
  onOpenNewWizard: () => void;
  onDeleteProject?: (id: string) => void;
}

export const SavedPlansTab: React.FC<SavedPlansTabProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNavigateTab,
  onOpenNewWizard,
  onDeleteProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || p.buildingType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownloadJSON = (project: Project) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.title.replace(/\s+/g, '_')}_CAD_Blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-blue-400" /> Saved House Plans & Designs ({projects.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse your saved structural blueprints, inspect engineering review statuses, and export CAD files.
          </p>
        </div>

        <button
          onClick={onOpenNewWizard}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New AI Plan
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans by title or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-full md:w-auto"
          >
            <option value="all">All Building Types</option>
            <option value="residential_villa">Residential Villa</option>
            <option value="multi_family_apartment">Multi-Family Apartment</option>
            <option value="commercial_office">Commercial Office</option>
            <option value="retail_store">Retail Store</option>
            <option value="industrial_warehouse">Industrial Warehouse</option>
            <option value="eco_tiny_home">Eco Tiny Home</option>
          </select>
        </div>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => {
          const isActive = p.id === activeProject.id;
          return (
            <div
              key={p.id}
              className={`bg-slate-900/60 backdrop-blur-md border rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-all ${
                isActive ? 'border-blue-500/80 ring-1 ring-blue-500/50' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {p.blueprint.version}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{p.title}</h3>
                    <p className="text-xs text-slate-400">{p.location}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap ${
                    p.status === 'engineer_approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{p.description}</p>

                {/* Key Stats Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Area Footprint</p>
                    <p className="text-xs font-bold text-white mt-0.5">{p.blueprint.totalAreaSqFt} sq ft</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Est. Total Cost</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">${(p.estimatedTotalCostUSD / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Eco Score</p>
                    <p className="text-xs font-bold text-cyan-400 mt-0.5">{p.sustainabilityRating}/100</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                
                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => onSelectProject(p)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
                    >
                      Set as Active
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectProject(p);
                      onNavigateTab('overview');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
                  >
                    Inspect Plan
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadJSON(p)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                    title="Export CAD JSON Data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  {onDeleteProject && projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
