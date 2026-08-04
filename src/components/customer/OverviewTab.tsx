import React, { useState } from 'react';
import { Project, ProjectRevision, CustomerTab } from '../../types';
import { BlueprintCanvas } from '../planner/BlueprintCanvas';
import { BOMCalculator } from '../planner/BOMCalculator';
import { EngineeringChecklist } from '../planner/EngineeringChecklist';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  Calendar, 
  DollarSign, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  HardHat,
  Calculator,
  Users,
  FolderHeart,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface OverviewTabProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onNavigateTab: (tab: CustomerTab) => void;
  onUpdateProject: (p: Project) => void;
  onOpenAIChat: () => void;
  onOpenNewWizard: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNavigateTab,
  onUpdateProject,
  onOpenAIChat,
  onOpenNewWizard,
}) => {
  const [subTab, setSubTab] = useState<'blueprint' | 'bom' | 'checks' | 'timeline'>('blueprint');
  const [revisionPrompt, setRevisionPrompt] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const handleApplyRevision = () => {
    if (!revisionPrompt.trim()) return;
    setIsApplying(true);

    setTimeout(() => {
      const newRev: ProjectRevision = {
        id: `rev_${Date.now()}`,
        authorId: activeProject.customerProfileId,
        authorName: activeProject.customerName,
        authorRole: 'customer',
        timestamp: new Date().toISOString(),
        promptText: revisionPrompt,
        changeSummary: `Applied AI adjustment: "${revisionPrompt}"`,
        blueprintVersion: `v${(parseFloat(activeProject.blueprint.version.replace('v', '')) + 0.1).toFixed(1)}`,
      };

      const updatedProject: Project = {
        ...activeProject,
        updatedAt: new Date().toISOString(),
        revisions: [newRev, ...activeProject.revisions],
        blueprint: {
          ...activeProject.blueprint,
          version: newRev.blueprintVersion,
        },
      };

      onUpdateProject(updatedProject);
      setRevisionPrompt('');
      setIsApplying(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner with Project Switcher */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Customer Portal Overview
            </span>
            <span className="text-xs text-slate-400">• Last modified {new Date(activeProject.updatedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{activeProject.title}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              activeProject.status === 'engineer_approved'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {activeProject.status.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">{activeProject.description}</p>
        </div>

        {/* Project Selector & Direct Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={activeProject.id}
            onChange={(e) => {
              const p = projects.find((x) => x.id === e.target.value);
              if (p) onSelectProject(p);
            }}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.blueprint.version})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewWizard}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> New AI Plan
          </button>

          <button
            onClick={onOpenAIChat}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" /> AI Assistant
          </button>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Estimated Total Cost</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">${activeProject.estimatedTotalCostUSD.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Target Budget: ${activeProject.totalBudgetUSD.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Floor Footprint</p>
          <p className="text-xl font-bold text-white mt-1">{activeProject.blueprint.totalAreaSqFt} sq ft</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{activeProject.blueprint.floors} Story Structure</p>
        </div>

        <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Eco Sustainability</p>
          <p className="text-xl font-bold text-cyan-400 mt-1">{activeProject.sustainabilityRating}/100</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Solar Feasibility {activeProject.blueprint.solarFeasibilityScore}%</p>
        </div>

        <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Civil PE Stamp</p>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {activeProject.engineeringStamp ? 'STAMPED' : 'UNDER REVIEW'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{activeProject.assignedEngineerName}</p>
        </div>
      </div>

      {/* Quick Access Shortcut Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('ai_generator')}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            <span>AI Generator Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Generate CAD blueprints with text prompts.</p>
        </button>

        <button
          onClick={() => onNavigateTab('cost_estimator')}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Calculator className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            <span>Cost Estimator</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Calculate material & labor breakdowns.</p>
        </button>

        <button
          onClick={() => onNavigateTab('browse_engineers')}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            <span>Browse PE Engineers</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Find verified civil engineering experts.</p>
        </button>

        <button
          onClick={() => onNavigateTab('material_prices')}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            <span>Material Prices</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Track regional concrete & steel indices.</p>
        </button>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('blueprint')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'blueprint' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> CAD Blueprint Visualizer
        </button>

        <button
          onClick={() => setSubTab('bom')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'bom' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Bill of Materials
        </button>

        <button
          onClick={() => setSubTab('checks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'checks' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <HardHat className="w-4 h-4" /> Engineering Checks
        </button>

        <button
          onClick={() => setSubTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'timeline' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Timeline Roadmap
        </button>
      </div>

      {/* Sub Tab View */}
      {subTab === 'blueprint' && (
        <div className="space-y-6">
          <BlueprintCanvas
            blueprint={activeProject.blueprint}
            projectTitle={activeProject.title}
            location={activeProject.location}
          />

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Prompt AI to Adjust Blueprint Specifications</span>
            </h3>
            <p className="text-xs text-slate-400">
              Type custom adjustments (e.g., "Add EV charger hub in garage", "Extend patio by 10ft", "Add solar roof array").
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={revisionPrompt}
                onChange={(e) => setRevisionPrompt(e.target.value)}
                placeholder="e.g. Add 200 sq ft office room and rainwater collection tank..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleApplyRevision}
                disabled={isApplying || !revisionPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isApplying ? 'Applying...' : 'Apply Revision'}
              </button>
            </div>

            {activeProject.revisions.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revision History:</p>
                {activeProject.revisions.map((rev) => (
                  <div key={rev.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{rev.promptText}</p>
                      <p className="text-[10px] text-slate-400">{rev.changeSummary} • Version {rev.blueprintVersion}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(rev.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'bom' && (
        <BOMCalculator
          materials={activeProject.materials}
          totalBudgetUSD={activeProject.totalBudgetUSD}
        />
      )}

      {subTab === 'checks' && (
        <EngineeringChecklist
          checks={activeProject.engineeringChecks}
          stamp={activeProject.engineeringStamp}
          project={activeProject}
          onApplyStamp={(stamp) => {
            onUpdateProject({
              ...activeProject,
              engineeringStamp: stamp,
              status: 'engineer_approved',
              updatedAt: new Date().toISOString()
            });
          }}
        />
      )}

      {subTab === 'timeline' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Estimated Construction Phase Roadmap ({activeProject.estimatedDurationMonths} Months)</span>
          </h3>

          <div className="space-y-3 pt-2">
            {activeProject.timeline.map((phase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : phase.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {phase.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Week {phase.startWeek} - {phase.endWeek} ({phase.durationWeeks} Weeks)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{phase.phase}</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {phase.keyMilestones.map((m, mIdx) => (
                      <span key={mIdx} className="text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
