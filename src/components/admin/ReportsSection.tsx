import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  FileText, 
  Download, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  Filter, 
  Printer, 
  Cpu, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

interface ReportsSectionProps {
  projects: Project[];
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ projects }) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'financial' | 'ai_synthesis' | 'pe_compliance' | 'material_inflation'
  >('financial');
  const [timeframe, setTimeframe] = useState<'this_month' | 'last_quarter' | 'ytd'>('this_month');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const reportsList = [
    {
      id: 'financial',
      title: 'Platform Gross Revenue & PE Commission Report',
      description: 'Breakdown of PE stamp fees, consultation commissions, and AI premium synthesis volume.',
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      metric: '$3,850,000 USD Volume',
    },
    {
      id: 'ai_synthesis',
      title: 'Gemini 3.6 Flash Synthesis & CAD Token Audit',
      description: 'Telemetry logs for spatial blueprint generation, room grid alignment, and API latency.',
      icon: Cpu,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      metric: '14,890 Total AI Invocations',
    },
    {
      id: 'pe_compliance',
      title: 'Structural PE Engineering & Zoning Compliance Report',
      description: 'Audit log of certified civil engineer stamps, seismic shear checks, and municipal setback passes.',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      metric: '98.4% Stamp Safety Rating',
    },
    {
      id: 'material_inflation',
      title: 'Regional Construction Material Inflation Index',
      description: 'Price volatility trends for structural steel rebar, high-strength concrete, and solar glass.',
      icon: BarChart3,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      metric: '-1.2% Overall Index Shift',
    },
  ];

  const handleExportCSV = () => {
    alert(`Exporting ${selectedReportType.toUpperCase()} Report dataset to CSV file...`);
  };

  const handlePrintPDF = () => {
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-500" />
            <span>Platform Executive Reports & Compliance Audits</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate printable PDF reports, export financial CSVs, and audit Gemini AI token performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Preview & Print PDF
          </button>
        </div>
      </div>

      {/* Report Type Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReportType === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id as any)}
              className={`p-5 rounded-3xl border text-left space-y-3 transition-all ${
                isSelected
                  ? 'bg-slate-900 border-rose-500 shadow-xl ring-2 ring-rose-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-2xl border w-fit ${rep.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-bold text-white text-sm leading-snug">{rep.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rep.description}</p>
              </div>

              <span className="text-[11px] font-mono font-bold text-rose-400 block pt-1 border-t border-slate-800/60">
                {rep.metric}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Report Preview Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">Report Audit View</span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {reportsList.find((r) => r.id === selectedReportType)?.title}
            </h4>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['this_month', 'last_quarter', 'ytd'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg uppercase transition-all ${
                  timeframe === t
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {selectedReportType === 'financial' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">PE Stamping Fee Revenue</span>
                <p className="text-2xl font-bold text-emerald-400">$215,400 USD</p>
                <span className="text-[10px] text-slate-500">Platform 15% Take Rate</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">Engineer Direct Consultations</span>
                <p className="text-2xl font-bold text-cyan-400">$168,200 USD</p>
                <span className="text-[10px] text-slate-500">Stripe Escrow Settled</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">AI Premium Subscriptions</span>
                <p className="text-2xl font-bold text-purple-400">$94,800 USD</p>
                <span className="text-[10px] text-slate-500">Enterprise AI Plan Tier</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Financial Transactions Log Summary</h5>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-white block">{p.title}</span>
                      <span className="text-slate-400 text-[10px]">Client: {p.customerName} • {p.location}</span>
                    </div>
                    <span className="font-bold text-emerald-400 text-sm">${p.estimatedTotalCostUSD?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'ai_synthesis' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">Total Invocations</span>
                <p className="text-2xl font-bold text-purple-400">14,890 Calls</p>
                <span className="text-[10px] text-slate-500">100% Success Rate</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">Average Response Latency</span>
                <p className="text-2xl font-bold text-cyan-400">420ms</p>
                <span className="text-[10px] text-slate-500">Sub-second generation</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                <span className="text-slate-400 font-medium">Total Tokens Processed</span>
                <p className="text-2xl font-bold text-emerald-400">142,800,000 Tokens</p>
                <span className="text-[10px] text-slate-500">Gemini 3.6 Flash SDK</span>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'pe_compliance' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
              <h5 className="font-bold text-white">Structural Safety Checks Verified by Civil Engineers</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold text-lg block">98.4%</span>
                  <span className="text-slate-400 text-[10px]">Seismic Resistance</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold text-lg block">99.1%</span>
                  <span className="text-slate-400 text-[10px]">Wind Shear Load</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-cyan-400 font-bold text-lg block">97.8%</span>
                  <span className="text-slate-400 text-[10px]">Foundation Soil Capacity</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-purple-400 font-bold text-lg block">100%</span>
                  <span className="text-slate-400 text-[10px]">Egress & Fire Clearance</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'material_inflation' && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2 text-xs">
            <h5 className="font-bold text-white">Global Construction Material Price Index Trends</h5>
            <p className="text-slate-400">
              Structural steel prices remained steady this month, while high-strength concrete experienced a -2.4% price reduction in the Texas regional market.
            </p>
          </div>
        )}
      </div>

      {/* Printable PDF Simulation Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-rose-500" />
                <h4 className="text-base font-bold text-white">Official BuildAI Executive Report Document</h4>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            {/* Document Sheet Preview */}
            <div className="p-8 bg-white text-slate-900 rounded-2xl space-y-6 shadow-inner font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">BuildAI Enterprise Systems</h2>
                  <p className="text-xs text-slate-500">Official Platform Audit & Operations Report</p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <p>Date: {new Date().toISOString().split('T')[0]}</p>
                  <p>Ref: REP-2026-BUILD-AI</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Report Type: {reportsList.find((r) => r.id === selectedReportType)?.title}
                </h3>
                <p className="text-xs text-slate-600">
                  This document certifies platform activity, structural PE stamping compliance, and Gemini AI synthesis telemetry metrics for the specified reporting window.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">Executive Summary Highlights:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  <li>Total Active Projects: {projects.length} Structural Blueprints</li>
                  <li>Total Platform Gross Volume: $3,850,000 USD</li>
                  <li>PE Stamp Safety Pass Rate: 98.4%</li>
                  <li>Gemini 3.6 Flash Server Latency: 420ms average</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>BuildAI Certified System Audit Document</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                  setPreviewModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
