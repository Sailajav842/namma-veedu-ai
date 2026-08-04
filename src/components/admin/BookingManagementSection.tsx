import React, { useState } from 'react';
import { EngineerBooking } from '../../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  User, 
  HardHat, 
  IndianRupee, 
  Building2, 
  CalendarCheck, 
  Filter 
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface BookingManagementSectionProps {
  bookings: EngineerBooking[];
  onUpdateBookings: (updated: EngineerBooking[]) => void;
}

export const BookingManagementSection: React.FC<BookingManagementSectionProps> = ({
  bookings,
  onUpdateBookings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EngineerBooking['status']>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Booking Form State
  const [custName, setCustName] = useState('Karthik Subramanian');
  const [engName, setEngName] = useState('Er. S. Rajasekar, PE');
  const [planTitle, setPlanTitle] = useState('Namma Veedu Dream Residence');
  const [serviceType, setServiceType] = useState<EngineerBooking['serviceType']>('Full PE Structural Stamp');
  const [feeUSD, setFeeUSD] = useState(15000);
  const [bookingDate, setBookingDate] = useState('2026-08-05');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM IST');
  const [notes, setNotes] = useState('Admin scheduled consultation session.');


  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.housePlanTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalFeeVolume = bookings.reduce((sum, b) => sum + b.feeUSD, 0);
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const handleStatusChange = (bookingId: string, newStatus: EngineerBooking['status']) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b));
    onUpdateBookings(updated);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBkg: EngineerBooking = {
      id: `bk_admin_${Date.now()}`,
      customerId: `usr_customer_${Date.now()}`,
      customerName: custName,
      engineerId: `eng_${Date.now()}`,
      engineerName: engName,
      housePlanId: `prj_${Date.now()}`,
      housePlanTitle: planTitle,
      bookingDate,
      timeSlot,
      serviceType,
      status: 'confirmed',
      feeUSD,
      notes,
      createdAt: new Date().toISOString(),
    };

    onUpdateBookings([newBkg, ...bookings]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-cyan-400" />
            <span>Platform Engineer Booking & Consultation Hub</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Monitor 1-on-1 civil engineer consultations, PE wet stamp sessions, escrow funds, and scheduling status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Manual Booking
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Booking Volume</span>
          <p className="text-3xl font-extrabold text-white">{formatINR(totalFeeVolume)}</p>
          <span className="text-[10px] text-emerald-400 font-bold block pt-1">Across {bookings.length} Sessions</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confirmed Upcoming</span>
          <p className="text-3xl font-extrabold text-cyan-400">{confirmedCount} Sessions</p>
          <span className="text-[10px] text-slate-400 font-medium block pt-1">Escrow Funds Reserved</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Consultations</span>
          <p className="text-3xl font-extrabold text-emerald-400">{completedCount} Sessions</p>
          <span className="text-[10px] text-slate-400 font-medium block pt-1">PE Stamps Issued</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customer, engineer, project, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['all', 'requested', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Cards List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{b.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    b.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    b.status === 'requested' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">{b.serviceType}</h4>
                <p className="text-xs text-slate-400">Blueprint: <strong className="text-slate-200">{b.housePlanTitle}</strong></p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</span>
                <p className="text-2xl font-extrabold text-emerald-400">{formatINR(b.feeUSD)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-0.5">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Client Name</span>
                <p className="font-bold text-white">{b.customerName}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-0.5">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Assigned Engineer</span>
                <p className="font-bold text-amber-400">{b.engineerName}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-0.5">
                <span className="text-slate-500 font-medium text-[10px] uppercase">Scheduled Slot</span>
                <p className="font-bold text-white">{b.bookingDate} ({b.timeSlot})</p>
              </div>
            </div>

            {b.notes && (
              <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-2xl border border-slate-850">
                "{b.notes}"
              </p>
            )}

            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <span className="text-slate-500 text-[11px]">Booked on: {b.createdAt ? b.createdAt.split('T')[0] : '2026-07-28'}</span>

              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value as EngineerBooking['status'])}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="requested">Requested</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBooking} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Create Manual Engineer Booking</span>
              </h4>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Engineer</label>
                <input
                  type="text"
                  required
                  value={engName}
                  onChange={(e) => setEngName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Full PE Structural Stamp">Full PE Structural Stamp</option>
                    <option value="Foundation & Soil Assessment">Foundation & Soil Assessment</option>
                    <option value="Zoning & Code Audit">Zoning & Code Audit</option>
                    <option value="1-on-1 Consultation Call">1-on-1 Consultation Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={feeUSD}
                    onChange={(e) => setFeeUSD(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
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
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
