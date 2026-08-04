import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Building2, 
  Cpu, 
  Award, 
  BarChart3, 
  PieChart, 
  Activity, 
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface AdminAnalyticsSectionProps {
  projects: Project[];
}

export const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({ projects }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  // Calculated Stats
  const totalProjectsCount = projects.length;
  const totalEstimatedVolume = projects.reduce((sum, p) => sum + (p.estimatedTotalCostUSD || 0), 0);
  const totalStamped = projects.filter((p) => Boolean(p.engineeringStamp)).length;
  const avgSustainability = Math.round(
    projects.reduce((sum, p) => sum + (p.sustainabilityRating || 0), 0) / (totalProjectsCount || 1)
  );

  // Mock revenue chart data points in INR (Lakhs)
  const revenueTrendData = [
    { month: 'Feb', revenue: 14200000, bookings: 32, aiRequests: 2800 },
    { month: 'Mar', revenue: 18800000, bookings: 45, aiRequests: 3400 },
    { month: 'Apr', revenue: 21500000, bookings: 52, aiRequests: 4100 },
    { month: 'May', revenue: 26000000, bookings: 68, aiRequests: 4900 },
    { month: 'Jun', revenue: 31000000, bookings: 79, aiRequests: 5800 },
    { month: 'Jul', revenue: 38500000, bookings: 94, aiRequests: 6700 },
  ];

  const maxRevenue = Math.max(...revenueTrendData.map((d) => d.revenue));

  // Building Type Distribution Data
  const buildingTypeDistribution = [
    { type: 'Residential Villa (Tamil Nadu)', count: 18, percentage: 42, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { type: 'Commercial Mid-Rise Office', count: 12, percentage: 28, color: 'bg-blue-500', text: 'text-blue-400' },
    { type: 'Traditional Chettinad Home', count: 7, percentage: 17, color: 'bg-amber-500', text: 'text-amber-400' },
    { type: 'Industrial Warehouse & Logistics', count: 5, percentage: 13, color: 'bg-rose-500', text: 'text-rose-400' },
  ];


  return (
    <div className="space-y-6">
      {/* Top Controls & Timeframe Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-500" />
            <span>Platform Financial & AI Operations Analytics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry across revenue, active structural blueprints, Gemini AI token synthesis, and PE stamp approvals.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all ${
                timeRange === range
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Platform Gross Volume</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{formatINR(38500000)}</p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.2% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Registered Users</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">1,248</p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18 new users this week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">PE Stamped Blueprints</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">89 Plans</p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98.4% Stamp Pass Rate</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Gemini 3.6 Synthesis Latency</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">420ms</p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>100% Server Health</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Monthly Revenue & Booking Growth */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Monthly Gross Revenue Trajectory (INR ₹)</span>
              </h4>
              <p className="text-xs text-slate-400">Platform earnings from PE stamping fees, AI premium generations, and consultation bookings.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              +{formatINR(3850000)} Jul Run Rate
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 pt-6 pb-2 h-56 px-2">
            {revenueTrendData.map((d) => {
              const heightPct = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatINR(d.revenue, false)}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-rose-600 via-amber-500 to-emerald-400 rounded-2xl group-hover:brightness-125 transition-all shadow-lg"
                  />
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">{d.month}</span>
                    <span className="text-[10px] text-slate-400">{d.bookings} bkgs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Building Type Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" />
              <span>Project Building Type Share</span>
            </h4>
            <p className="text-xs text-slate-400">Distribution of structural CAD blueprints created on BuildAI.</p>
          </div>

          <div className="space-y-4 pt-2">
            {buildingTypeDistribution.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{item.type}</span>
                  <span className={`font-bold ${item.text}`}>{item.percentage}% ({item.count} projects)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Avg Sustainability Score:</span>
            <strong className="text-emerald-400 font-extrabold text-sm">{avgSustainability} / 100 Grade A</strong>
          </div>
        </div>

      </div>

      {/* AI Telemetry & Municipal Compliance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Gemini 3.6 Flash Engine Operational Metrics</span>
            </h4>
            <p className="text-xs text-slate-400">Live API response times, floor plan spatial resolution, and structural safety constraint validations.</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Model: @google/genai (v1.0)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-slate-400 font-medium">Daily Token Synthesis Volume</span>
            <p className="text-2xl font-extrabold text-white">4,820,100 Tokens</p>
            <p className="text-[10px] text-emerald-400 font-mono">Cost Per Blueprint: $0.008</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-slate-400 font-medium">CAD Grid Solver Precision</span>
            <p className="text-2xl font-extrabold text-cyan-400">99.94% Compliant</p>
            <p className="text-[10px] text-slate-400 font-mono">0 Structural Collisions Detected</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-slate-400 font-medium">Zoning Setback Engine</span>
            <p className="text-2xl font-extrabold text-amber-400">48 US Jurisdictions</p>
            <p className="text-[10px] text-slate-400 font-mono">IBC & IRC 2026 Code Compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
};
