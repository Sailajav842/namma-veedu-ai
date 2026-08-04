import React, { useState } from 'react';
import { Project, EngineerProfile, EngineerBooking } from '../../types';
import { MOCK_ENGINEERS, MOCK_BOOKINGS } from '../../data/mockData';
import { CalendarCheck, Calendar, Clock, IndianRupee, CheckCircle2, ShieldCheck, User, Building2, FileText, AlertCircle } from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface BookEngineerTabProps {
  projects: Project[];
  activeProject: Project;
  selectedEngineer?: EngineerProfile | null;
  onBookingComplete?: (booking: EngineerBooking) => void;
}

export const BookEngineerTab: React.FC<BookEngineerTabProps> = ({
  projects,
  activeProject,
  selectedEngineer,
  onBookingComplete,
}) => {
  const [engineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
  const [bookings, setBookings] = useState<EngineerBooking[]>(MOCK_BOOKINGS);

  const [chosenEngineerId, setChosenEngineerId] = useState<string>(
    selectedEngineer ? selectedEngineer.id : engineers[0]?.id || ''
  );
  const [chosenHousePlanId, setChosenHousePlanId] = useState<string>(activeProject.id);
  const [serviceType, setServiceType] = useState<'Full PE Structural Stamp' | 'Foundation & Soil Assessment' | 'Zoning & Code Audit' | '1-on-1 Consultation Call'>(
    'Full PE Structural Stamp'
  );
  const [bookingDate, setBookingDate] = useState<string>('2026-08-05');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 11:30 AM IST');
  const [notes, setNotes] = useState<string>(
    'Requesting Tamil Nadu PWD registered engineer structural stamp and Vastu orientation review.'
  );

  const [isSuccess, setIsSuccess] = useState(false);

  const engineerObj = engineers.find((e) => e.id === chosenEngineerId) || engineers[0];
  const projectObj = projects.find((p) => p.id === chosenHousePlanId) || activeProject;

  const serviceFees = {
    'Full PE Structural Stamp': 15000,
    'Foundation & Soil Assessment': 5000,
    'Zoning & Code Audit': 3500,
    '1-on-1 Consultation Call': 1000,
  };

  const calculatedFee = serviceFees[serviceType] || 15000;

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: EngineerBooking = {
      id: `bk_${Date.now()}`,
      customerId: 'usr_customer_1',
      customerName: 'Karthik Subramanian',
      engineerId: engineerObj.id,
      engineerName: engineerObj.name,
      housePlanId: projectObj.id,
      housePlanTitle: projectObj.title,
      bookingDate,
      timeSlot,
      serviceType,
      status: 'confirmed',
      feeUSD: calculatedFee,
      notes,
      createdAt: new Date().toISOString(),
    };

    setBookings([newBooking, ...bookings]);
    if (onBookingComplete) onBookingComplete(newBooking);

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Professional Engineering Service
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-purple-400" /> Book Civil Engineering Review & Stamp
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Schedule an official PE structural consultation or full blueprint digital seal stamp.
          </p>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Consultation booking confirmed! Notification sent to engineer.
        </div>
      )}

      {/* Booking Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking Form */}
        <form onSubmit={handleCreateBooking} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" /> Consultation Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select House Plan</label>
              <select
                value={chosenHousePlanId}
                onChange={(e) => setChosenHousePlanId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.blueprint.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select PE Civil Engineer</label>
              <select
                value={chosenEngineerId}
                onChange={(e) => setChosenEngineerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} - ${eng.hourlyRate}/hr ({eng.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="Full PE Structural Stamp">Full PE Structural Stamp ($450)</option>
                <option value="Foundation & Soil Assessment">Foundation & Soil Assessment ($350)</option>
                <option value="Zoning & Code Audit">Zoning & Code Audit ($250)</option>
                <option value="1-on-1 Consultation Call">1-on-1 Consultation Call ($185)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Consultation Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="09:00 AM - 10:30 AM IST">09:00 AM - 10:30 AM IST</option>
                <option value="10:00 AM - 11:30 AM IST">10:00 AM - 11:30 AM IST</option>
                <option value="02:00 PM - 03:30 PM IST">02:00 PM - 03:30 PM IST</option>
                <option value="04:00 PM - 05:30 PM IST">04:00 PM - 05:30 PM IST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Structural Review Notes & Specific Guidance</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Provide specific notes regarding site soil test reports, cantilever beams, or roof solar weight distribution..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Confirm & Schedule Session ({formatINR(calculatedFee)})</span>
            </button>
          </div>
        </form>

        {/* Engineer Profile & Fee Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Review Summary</h3>

          <div className="flex items-center gap-3">
            <img
              src={engineerObj.avatarUrl}
              alt={engineerObj.name}
              className="w-12 h-12 rounded-xl object-cover border border-purple-500/40"
            />
            <div>
              <p className="font-bold text-white text-xs">{engineerObj.name}</p>
              <p className="text-[10px] text-purple-400 font-mono font-semibold">{engineerObj.licenseNumber}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Target Plan:</span>
              <span className="font-semibold text-white truncate max-w-[150px]">{projectObj.title}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Service Fee:</span>
              <span className="font-mono font-bold text-emerald-400">{formatINR(calculatedFee)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Scheduled Date:</span>
              <span className="font-semibold text-slate-200">{bookingDate}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>Includes official PE digital signature hash verification and municipal permit submission payload.</span>
          </div>
        </div>

      </div>

      {/* Active Bookings History */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" /> Active & Past Consultation Bookings
        </h3>

        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    b.status === 'confirmed'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : b.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {b.status}
                  </span>
                  <span className="font-semibold text-white">{b.serviceType}</span>
                </div>
                <p className="text-slate-300 font-medium">Plan: {b.housePlanTitle}</p>
                <p className="text-[11px] text-slate-400">Engineer: {b.engineerName} • Date: {b.bookingDate} ({b.timeSlot})</p>
              </div>

              <div className="text-right">
                <p className="font-mono font-bold text-emerald-400 text-sm">{formatINR(b.feeUSD)}</p>
                <p className="text-[10px] text-slate-500">Scheduled</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
