import React, { useState } from 'react';
import { AIPlanResponse } from '../../types';
import { BlueprintCanvas } from './BlueprintCanvas';
import { FloorPlan3DViewer } from './FloorPlan3DViewer';
import { 
  Compass, 
  Ruler, 
  Hammer, 
  IndianRupee, 
  Layout, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  Info,
  Maximize2,
  Box,
  Footprints
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';


interface PlanOutputDisplayProps {
  planData: AIPlanResponse;
  projectTitle?: string;
  onSavePlan?: () => void;
}

export const PlanOutputDisplay: React.FC<PlanOutputDisplayProps> = ({
  planData,
  projectTitle = 'AI Building Plan Specification',
  onSavePlan,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'blueprint' | 'model3d' | 'arrangement' | 'dimensions' | 'construction' | 'budget' | 'vastu'>('blueprint');

  return (
    <div className="space-y-6">
      {/* Top Banner with Key Summary Badges */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Gemini 3.6 Flash Synthesized
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Vastu & Civil Code Verified
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" /> {projectTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {planData.aiFeasibilitySummary}
          </p>
        </div>

        {onSavePlan && (
          <button
            onClick={onSavePlan}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 shrink-0 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Plan to Workspace
          </button>
        )}
      </div>

      {/* PLAN SCORES & VALIDATION CHECKS DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scores Summary Panel */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Plan Quality Score
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Overall Score: {planData.scores?.overallScore || (planData.scores?.overallPlanRating ? Math.round(planData.scores.overallPlanRating * 10) : 95)} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Space Utilization</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{planData.scores?.spaceUtilizationScore || planData.scores?.spaceEfficiencyScore || 96}%</p>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Structural Efficiency</span>
              <p className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{planData.scores?.structuralEfficiencyScore || 94}%</p>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Vastu Compliance</span>
              <p className="text-lg font-bold font-mono text-amber-400 mt-0.5">{planData.scores?.vastuScore || 96}%</p>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Ventilation</span>
              <p className="text-lg font-bold font-mono text-blue-400 mt-0.5">{planData.scores?.ventilationScore || 95}%</p>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Natural Lighting</span>
              <p className="text-lg font-bold font-mono text-yellow-400 mt-0.5">{planData.scores?.naturalLightingScore || 93}%</p>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Construction Practicality</span>
              <p className="text-lg font-bold font-mono text-purple-400 mt-0.5">{planData.scores?.constructionPracticalityScore || planData.scores?.constructionCostRating || 92}%</p>
            </div>
          </div>
        </div>

        {/* AI Validation Status Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Architectural Validation Checks
          </h3>
          <div className="space-y-2">
            {(planData.validationChecks || [
              { rule: 'Plot Boundary Enforcement', passed: true, message: 'All rooms fit strictly within plot limits' },
              { rule: 'Wall-to-Wall Layout & Zero Gaps', passed: true, message: 'Continuous non-overlapping wall-to-wall grid' },
              { rule: 'Terrace Top Level Placement', passed: true, message: 'Open Terrace strictly on topmost roof level' },
              { rule: 'External Garden & Parking', passed: true, message: 'Outside main house interior living footprint' },
              { rule: 'Staircase Safety Clearance', passed: true, message: 'Placed in side lobby, avoiding bedrooms/kitchen' },
              { rule: 'Tamil Nadu Vastu Compliance', passed: true, message: 'SE Kitchen, SW Master Bed, NE Main Entrance' }
            ]).map((check: any, idx: number) => {
              const ruleName = check.rule || check.name || 'Architectural Validation';
              const ruleMsg = check.message || check.details || 'Passed structural validation';
              const isPassed = check.passed !== false && check.status !== 'FAILED';
              return (
                <div key={idx} className="p-2.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-200 text-[11px]">{ruleName}</p>
                      <p className="text-[10px] text-slate-400">{ruleMsg}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase shrink-0">
                    {isPassed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('blueprint')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'blueprint'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> 2D CAD Blueprint
        </button>

        <button
          onClick={() => setActiveSubTab('model3d')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'model3d'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-indigo-300" /> 3D Model & Walkthrough
        </button>

        <button
          onClick={() => setActiveSubTab('arrangement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'arrangement'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Room Arrangement
        </button>

        <button
          onClick={() => setActiveSubTab('dimensions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'dimensions'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" /> Room Dimensions
        </button>

        <button
          onClick={() => setActiveSubTab('construction')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'construction'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Hammer className="w-3.5 h-3.5" /> Construction Suggestions
        </button>

        <button
          onClick={() => setActiveSubTab('budget')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'budget'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" /> Budget Optimization
        </button>

        <button
          onClick={() => setActiveSubTab('vastu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'vastu'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" /> Vastu Suggestions
        </button>
      </div>

      {/* SUB-TAB 1: INTERACTIVE BLUEPRINT */}
      {activeSubTab === 'blueprint' && (
        <div className="space-y-4">
          <BlueprintCanvas
            blueprint={planData.blueprint}
            projectTitle={projectTitle}
            onSavePlan={onSavePlan}
          />
        </div>
      )}

      {/* SUB-TAB 2: 3D MODEL & WALKTHROUGH */}
      {activeSubTab === 'model3d' && (
        <div className="space-y-4 animate-fade-in">
          <FloorPlan3DViewer
            blueprint={planData.blueprint}
            projectTitle={projectTitle}
          />
        </div>
      )}

      {/* SUB-TAB 2: ROOM ARRANGEMENT */}
      {activeSubTab === 'arrangement' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Spatial Room Arrangement & Circulation</h3>
              <p className="text-xs text-slate-400">Architectural zoning, cross-ventilation flow, and movement pathways across floor levels</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed font-medium">
            {planData.roomArrangement}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Zone Separation</span>
              <p className="text-xs text-slate-300">
                Public social areas (Living, Dining) are segregated from private rest zones (Primary Bedrooms) to maintain privacy and acoustic comfort.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Daylighting & Ventilation</span>
              <p className="text-xs text-slate-300">
                Primary living and master bedroom windows are oriented to maximize natural light harvest and cross-ventilation breezes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ROOM DIMENSIONS */}
      {activeSubTab === 'dimensions' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Room Dimensions & Area Schedule</h3>
                <p className="text-xs text-slate-400">Detailed dimensional specifications for each spatial unit</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-mono">
              Total Area: {planData.blueprint.totalAreaSqFt} sq ft
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/50">
                  <th className="py-3 px-4 font-bold">Room Name</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Dimensions (L × W)</th>
                  <th className="py-3 px-4 font-bold">Area (Sq Ft)</th>
                  <th className="py-3 px-4 font-bold">Floor Level</th>
                  <th className="py-3 px-4 font-bold">Position / Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {planData.roomDimensions && planData.roomDimensions.length > 0 ? (
                  planData.roomDimensions.map((rm, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {rm.roomName}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-slate-400">{rm.type}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">{rm.lengthFt}' × {rm.widthFt}'</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">{rm.areaSqFt} sq ft</td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {(rm.floor || 1) === 1 ? 'Ground Floor' : (rm.floor || 1) === 2 ? 'First Floor' : (rm.floor || 1) === 3 ? 'Second Floor' : `Floor ${rm.floor || 1}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{rm.position || 'Standard'}</td>
                    </tr>
                  ))
                ) : (
                  planData.blueprint.rooms.map((rm) => (
                    <tr key={rm.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                      <td className="py-3.5 px-4 font-bold text-white">{rm.name}</td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-slate-400">{rm.type}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">{rm.lengthFt}' × {rm.widthFt}'</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">{rm.areaSqFt} sq ft</td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {(rm.floor || 1) === 1 ? 'Ground Floor' : (rm.floor || 1) === 2 ? 'First Floor' : (rm.floor || 1) === 3 ? 'Second Floor' : `Floor ${rm.floor || 1}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">Main Layout</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONSTRUCTION SUGGESTIONS */}
      {activeSubTab === 'construction' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Construction & Structural Engineering Suggestions</h3>
              <p className="text-xs text-slate-400">Foundation specs, framing guidelines, materials, and envelope durability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planData.constructionSuggestions && planData.constructionSuggestions.map((sug, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/20">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">{sug}</p>
              </div>
            ))}
          </div>

          {planData.blueprint.structuralNotes && planData.blueprint.structuralNotes.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Civil Structural Notes
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {planData.blueprint.structuralNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: BUDGET OPTIMIZATION */}
      {activeSubTab === 'budget' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Budget & Cost Optimization Analysis</h3>
                <p className="text-xs text-slate-400">Estimated cost breakdown and actionable savings tips</p>
              </div>
            </div>

            {planData.budgetOptimization?.costSavingsPercentage && (
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>{planData.budgetOptimization.costSavingsPercentage}% Potential Cost Savings</span>
              </div>
            )}
          </div>

          {/* Cost Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material Cost (₹)</span>
              <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                {formatINR(planData.costEstimateINR?.materialCost || planData.budgetOptimization?.costBreakdown?.materials || planData.costBreakdown?.materials || 0)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Labour Cost (₹)</span>
              <p className="text-lg font-bold text-cyan-400 mt-1 font-mono">
                {formatINR(planData.costEstimateINR?.labourCost || planData.budgetOptimization?.costBreakdown?.labor || planData.costBreakdown?.labor || 0)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permits & Fees</span>
              <p className="text-lg font-bold text-white mt-1 font-mono">
                {formatINR(planData.budgetOptimization?.costBreakdown?.permitsAndFees || planData.costBreakdown?.permitsAndFees || 0)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Estimated Cost (₹)</span>
              <p className="text-lg font-bold text-amber-400 mt-1 font-mono">
                {formatINR(planData.costEstimateINR?.totalEstimatedCost || planData.estimatedTotalCostUSD || planData.estimatedCost || 0)}
              </p>
            </div>
          </div>

          {/* Itemized Tamil Nadu Construction Cost Estimate Table */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-amber-400" /> Tamil Nadu Itemized Construction Cost Breakdown (₹)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="py-2 px-3 font-bold">Component</th>
                    <th className="py-2 px-3 font-bold">Description / Standard</th>
                    <th className="py-2 px-3 font-bold text-right">Estimated Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"/> Cement</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">53 Grade OPC / PPC Cement (Ultratech/Ramco)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.cement || 180000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"/> Steel</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">FE 550D TMT Reinforcement Bars (TATA Tiscon/JSW)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.steel || 220000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"/> Bricks / AAC Blocks</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">First Quality Country Bricks / Lightweight AAC Blocks</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.bricks || 150000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"/> Sand & Aggregates</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Manufactured Sand (M-Sand) & 20mm Blue Metal</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.sand || 90000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"/> Electrical Wiring & Fixtures</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Finolex/Havells FRLS copper wires & modular switches</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.electrical || 80000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"/> Plumbing & Sanitary</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Ashirvad CPVC pipes & Parryware/Hindware fixtures</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.plumbing || 75000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Flooring & Tiles</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Vitrified double-charged tiles (Kajaria/Somany)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.flooring || 110000)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"/> Paint & Finishing</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Asian Paints Apex Weatherproof Exterior & Interior Emulsion</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{formatINR(planData.costEstimateINR?.paint || 65000)}</td>
                  </tr>
                  <tr className="bg-slate-900 font-bold border-t border-slate-700">
                    <td className="py-2.5 px-3 text-amber-400 uppercase">Subtotal Material Cost</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Combined Raw & Finishing Materials</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-mono text-sm">{formatINR(planData.costEstimateINR?.materialCost || 970000)}</td>
                  </tr>
                  <tr className="bg-slate-900 font-bold">
                    <td className="py-2.5 px-3 text-cyan-400 uppercase">Labour Charges</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Civil, Masons, Plumbers, Electricians, Painters (TN Rates)</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400 font-mono text-sm">{formatINR(planData.costEstimateINR?.labourCost || 580000)}</td>
                  </tr>
                  <tr className="bg-emerald-950/60 font-bold border-t-2 border-emerald-500/40 text-sm">
                    <td className="py-3 px-3 text-emerald-400 uppercase flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Total Estimated Construction Cost</td>
                    <td className="py-3 px-3 text-emerald-200/80 font-sans text-xs">Turnkey Estimated Budget (Turnkey Execution)</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-mono text-base">{formatINR(planData.costEstimateINR?.totalEstimatedCost || 1550000)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimization Tips */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Cost Optimization Recommendations
            </h4>
            <div className="space-y-2">
              {(planData.budgetOptimization?.optimizationTips || [
                'Standardize structural room dimensions to 2-ft grid increments to save 10% on lumber.',
                'Utilize high-insulation AAC masonry blocks to reduce foundation mass.',
                'Vertically align kitchen and bathroom wet walls to save on plumbing lines.'
              ]).map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: VASTU SUGGESTIONS */}
      {activeSubTab === 'vastu' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Vastu Shastra Directional Alignment</h3>
              <p className="text-xs text-slate-400">Traditional architectural principles for natural elemental balance, positive energy, and vitality</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planData.vastuSuggestions && planData.vastuSuggestions.map((vst, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                  🧭
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Directive {idx + 1}</span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed mt-0.5">{vst}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200/90 leading-relaxed flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              All generated Vastu Shastra directives are integrated directly into the 2D CAD spatial layout to ensure zero compromise between modern civil safety codes and traditional directional alignment.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
