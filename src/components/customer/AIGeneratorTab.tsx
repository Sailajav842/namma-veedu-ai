import React, { useState } from 'react';
import { Project, AIPlanResponse } from '../../types';
import { generateAIPlan } from '../../services/api';
import { PlanOutputDisplay } from '../planner/PlanOutputDisplay';
import { Sparkles, Play, CheckCircle2, Save, Layers, Zap, DollarSign, AlertCircle } from 'lucide-react';

interface AIGeneratorTabProps {
  onSaveGeneratedPlan: (p: Project) => void;
  customerName?: string;
  customerEmail?: string;
}

export const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({
  onSaveGeneratedPlan,
  customerName = 'Sarah Jenkins',
  customerEmail = 'sarah.jenkins@example.com',
}) => {
  const [promptText, setPromptText] = useState(
    'Design a 2-story sustainable luxury eco villa with solar roof tiles, 2-car EV charging garage, floor-to-ceiling thermal glass, and rainwater collection in Austin TX.'
  );
  const [energyTarget, setEnergyTarget] = useState(95);
  const [loadTolerance, setLoadTolerance] = useState('Seismic & High Wind Certified');
  const [costPriority, setCostPriority] = useState('Balanced High Quality');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedPlanData, setGeneratedPlanData] = useState<AIPlanResponse | null>(null);
  const [generatedProject, setGeneratedProject] = useState<Project | null>(null);

  const presetPrompts = [
    'Biophilic Eco Villa with Solar Roof Tiles and Rainwater Collection in Austin TX',
    'Contemporary Glass Commercial Office Hub with Underground EV Parking in Denver CO',
    'Modern Minimalist Single-Story Residence with Open Chef Kitchen in San Jose CA',
    'Eco Sustainable Tiny Home with Off-Grid Battery Power & Deck in Miami FL',
  ];

  const handleRunGenerator = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedPlanData(null);
    setGeneratedProject(null);

    try {
      const res = await generateAIPlan({
        plotLength: 80,
        plotWidth: 60,
        budget: 500000,
        floors: 2,
        houseType: 'Residential Eco Villa',
        bedrooms: 4,
        bathrooms: 3,
        parking: '2-Car EV Charging Garage',
        balcony: 'Yes (Terrace & Deck)',
        garden: 'Biophilic Landscaped Garden',
        style: promptText.toLowerCase().includes('glass') ? 'Contemporary Glass' : 'Modern Minimalist',
        location: 'Austin, TX (Hill Country Zone)',
        specialRequirements: promptText,
      });

      setGeneratedPlanData(res);

      const project: Project = {
        id: `prj_ai_${Date.now()}`,
        title: 'AI Synthesized Eco Villa Specification',
        description: promptText,
        buildingType: 'residential_villa',
        style: 'modern_minimalist',
        customerProfileId: 'usr_customer_1',
        customerName,
        customerEmail,
        assignedEngineerId: 'eng_001',
        assignedEngineerName: 'David Vance, PE',
        location: 'Austin, TX - Hill Country Zone',
        landWidthFt: 60,
        landLengthFt: 80,
        totalBudgetUSD: 500000,
        status: 'under_engineer_review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blueprint: res.blueprint,
        materials: res.materials,
        engineeringChecks: res.engineeringChecks,
        timeline: res.timeline,
        revisions: [],
        estimatedTotalCostUSD: res.estimatedTotalCostUSD,
        costBreakdown: res.costBreakdown,
        sustainabilityRating: res.sustainabilityRating,
        estimatedDurationMonths: res.estimatedDurationMonths,
      };

      setGeneratedProject(project);
    } catch (err: any) {
      console.error('Failed to run AI generator:', err);
      setErrorMessage(err?.message || 'Unable to connect to Gemini AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Prompt-Driven CAD Studio
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" /> AI Prompt Generator Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Describe your building concept in natural language. Gemini 3.6 Flash synthesizes full CAD floor plans, room arrangements, room dimensions, construction suggestions, budget optimization, and Vastu suggestions in seconds.
          </p>
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <label className="block text-xs font-bold text-white">Describe Your Architectural Vision</label>
        
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={3}
          placeholder="Type your design prompt here..."
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium leading-relaxed"
        />

        {/* Preset Prompt Pills */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 mb-2">Inspiration Prompt Presets:</p>
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPromptText(preset)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all text-left"
              >
                ✨ {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Synthesis Fine-tuning Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Sustainability Rating</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={70}
                max={100}
                value={energyTarget}
                onChange={(e) => setEnergyTarget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs font-bold text-cyan-400 font-mono">{energyTarget}/100</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Structural Load Protocol</label>
            <select
              value={loadTolerance}
              onChange={(e) => setLoadTolerance(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Seismic & High Wind Certified">Seismic & High Wind Certified</option>
              <option value="Standard IRC Residential">Standard IRC Residential</option>
              <option value="Heavy Cantilever Steel Frame">Heavy Cantilever Steel Frame</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cost Optimization Balance</label>
            <select
              value={costPriority}
              onChange={(e) => setCostPriority(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Balanced High Quality">Balanced High Quality</option>
              <option value="Maximum Eco Efficiency">Maximum Eco Efficiency</option>
              <option value="Budget Savings First">Budget Savings First</option>
            </select>
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

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunGenerator}
            disabled={isGenerating || !promptText.trim()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate AI Plan Now'}</span>
          </button>
        </div>

      </div>

      {/* Loading Progress State */}
      {isGenerating && (
        <div className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-white">Synthesizing CAD coordinates, Vastu alignment, and civil load checks...</p>
        </div>
      )}

      {/* Generated Result Output */}
      {generatedPlanData && !isGenerating && (
        <PlanOutputDisplay
          planData={generatedPlanData}
          projectTitle={generatedProject?.title || 'AI Synthesized Architectural Plan'}
          onSavePlan={generatedProject ? () => {
            if (typeof onSaveGeneratedPlan === 'function') {
              onSaveGeneratedPlan(generatedProject);
            }
          } : undefined}
        />
      )}

    </div>
  );
};
