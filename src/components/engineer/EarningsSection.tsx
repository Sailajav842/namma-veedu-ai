import React from 'react';
import { EngineerEarningRecord } from '../../types';
import { 
  IndianRupee, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight, 
  CreditCard 
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface EarningsSectionProps {
  earnings: EngineerEarningRecord[];
}

export const EarningsSection: React.FC<EarningsSectionProps> = ({ earnings }) => {
  const totalRevenue = earnings.reduce((sum, e) => sum + e.amountUSD, 0);
  const totalPaidOut = earnings.filter((e) => e.status === 'paid_out').reduce((sum, e) => sum + e.amountUSD, 0);
  const totalEscrow = earnings.filter((e) => e.status === 'in_escrow').reduce((sum, e) => sum + e.amountUSD, 0);

  // Monthly breakdown mock calculations (INR)
  const monthlyData = [
    { month: 'Jan', revenue: 38000 },
    { month: 'Feb', revenue: 42000 },
    { month: 'Mar', revenue: 51000 },
    { month: 'Apr', revenue: 49000 },
    { month: 'May', revenue: 63000 },
    { month: 'Jun', revenue: 58000 },
    { month: 'Jul', revenue: totalRevenue > 0 ? totalRevenue : 75000 },
  ];

  const maxRev = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-emerald-400" />
            <span>Structural Consultation & PE Stamp Earnings</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time track record of completed PE plan stamps, consultation payouts, and Razorpay Escrow balances.
          </p>
        </div>

        <button 
          onClick={() => alert('Direct NEFT / UPI Payout triggered to State Bank of India (SBI) Account ending ****4912.')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <CreditCard className="w-4 h-4" /> Request Payout Now
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Gross Revenue</span>
          <p className="text-2xl font-extrabold text-white">{formatINR(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs last month
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Deposited (Paid)</span>
          <p className="text-2xl font-extrabold text-emerald-400">{formatINR(totalPaidOut)}</p>
          <span className="text-[10px] text-slate-400 font-medium pt-1 block">SBI OMR Branch ****4912</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In Escrow (Pending Review)</span>
          <p className="text-2xl font-extrabold text-amber-400">{formatINR(totalEscrow)}</p>
          <span className="text-[10px] text-slate-400 font-medium pt-1 block">Releases upon client stamp sign-off</span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Monthly Engineering Earnings Trajectory (2026)</span>
        </h4>

        <div className="flex items-end justify-between gap-3 pt-6 pb-2 h-48 px-4">
          {monthlyData.map((d) => {
            const heightPct = Math.round((d.revenue / maxRev) * 100);
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatINR(d.revenue, false)}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full bg-gradient-to-t from-emerald-600 to-amber-500 rounded-xl group-hover:brightness-125 transition-all shadow-md"
                />
                <span className="text-xs font-semibold text-slate-400">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Recent Payout & Consultation Log</span>
        </h4>

        <div className="space-y-2">
          {earnings.map((rec) => (
            <div key={rec.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm">{rec.serviceType}</h5>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    rec.status === 'paid_out' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rec.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-slate-400">Client: <strong className="text-slate-200">{rec.clientName}</strong> • Date: {rec.date}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-extrabold text-emerald-400">+{formatINR(rec.amountUSD)}</p>
                <p className="text-[10px] text-slate-500">{rec.payoutMethod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
