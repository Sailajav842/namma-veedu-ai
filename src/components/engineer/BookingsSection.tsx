import React, { useState } from 'react';
import { EngineerBooking } from '../../types';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Building2, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface BookingsSectionProps {
  bookings: EngineerBooking[];
  onSaveBookings: (bookings: EngineerBooking[]) => void;
  onOpenChatWithClient?: (clientName: string, projectTitle: string) => void;
}

export const BookingsSection: React.FC<BookingsSectionProps> = ({
  bookings,
  onSaveBookings,
  onOpenChatWithClient,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleUpdateStatus = (id: string, newStatus: EngineerBooking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    onSaveBookings(updated);
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-amber-400" />
            <span>Client Booking & Review Requests</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming structural consultation calls, PE wet stamp approvals, and soil foundation requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {['all', 'requested', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === st ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List Grid */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Bookings in this status category</h4>
            <p className="text-xs text-slate-400">Client booking requests will appear here in real-time.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {b.serviceType}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'requested' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                      b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      b.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white tracking-tight">{b.housePlanTitle}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /> Client: <strong className="text-slate-200">{b.customerName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> Requested Slot: <strong className="text-amber-400">{b.bookingDate} at {b.timeSlot}</strong></span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Service Fee</span>
                  <p className="text-2xl font-extrabold text-white">${b.feeUSD}</p>
                </div>
              </div>

              {b.notes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-300">
                  <strong className="text-amber-400">Client Note / Project Scope:</strong> "{b.notes}"
                </div>
              )}

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {onOpenChatWithClient && (
                    <button
                      onClick={() => onOpenChatWithClient(b.customerName, b.housePlanTitle)}
                      className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Message Client
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'requested' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Booking
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject Request
                      </button>
                    </>
                  )}

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'completed')}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
