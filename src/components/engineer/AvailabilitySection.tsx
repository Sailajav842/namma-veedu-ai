import React, { useState } from 'react';
import { EngineerAvailability } from '../../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Save, 
  Plus, 
  Trash2,
  ShieldCheck
} from 'lucide-react';

interface AvailabilitySectionProps {
  availability: EngineerAvailability;
  onSaveAvailability: (avail: EngineerAvailability) => void;
}

export const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  availability,
  onSaveAvailability,
}) => {
  const [form, setForm] = useState<EngineerAvailability>(availability);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    const updatedSchedule = [...form.weeklySchedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      active: !updatedSchedule[dayIndex].active,
    };
    setForm({ ...form, weeklySchedule: updatedSchedule });
  };

  const handleAddSlot = (dayIndex: number) => {
    const time = prompt('Enter consultation time slot (e.g. 03:00 PM):', '03:00 PM');
    if (!time) return;

    const updatedSchedule = [...form.weeklySchedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      slots: [...updatedSchedule[dayIndex].slots, time],
    };
    setForm({ ...form, weeklySchedule: updatedSchedule });
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSchedule = [...form.weeklySchedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      slots: updatedSchedule[dayIndex].slots.filter((_, idx) => idx !== slotIndex),
    };
    setForm({ ...form, weeklySchedule: updatedSchedule });
  };

  const handleSave = () => {
    onSaveAvailability(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Consultation & PE Review Availability Schedule</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure time slots for 1-on-1 client consultation calls and instant PE blueprint sign-off queues.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" /> Save Schedule
        </button>
      </div>

      {isSaved && (
        <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Availability settings successfully synced to Supabase database!
          </span>
        </div>
      )}

      {/* Global Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Accepting Client Bookings</h4>
            <p className="text-xs text-slate-400 mt-0.5">Toggle new consultation requests</p>
          </div>
          <button
            onClick={() => setForm({ ...form, isAcceptingBookings: !form.isAcceptingBookings })}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              form.isAcceptingBookings ? 'bg-amber-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              form.isAcceptingBookings ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Emergency Structural Audits
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">24-hour turnaround for job-site calls</p>
          </div>
          <button
            onClick={() => setForm({ ...form, emergencyAuditAvailable: !form.emergencyAuditAvailable })}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              form.emergencyAuditAvailable ? 'bg-amber-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              form.emergencyAuditAvailable ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Slot Duration</h4>
            <p className="text-xs text-slate-400 mt-0.5">Default call duration</p>
          </div>
          <select
            value={form.consultationSlotMinutes}
            onChange={(e) => setForm({ ...form, consultationSlotMinutes: parseInt(e.target.value) || 45 })}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-500"
          >
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>
      </div>

      {/* Days Schedule Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Weekly Time Slots</span>
        </h4>

        <div className="space-y-3">
          {form.weeklySchedule.map((dayItem, dayIdx) => (
            <div key={dayItem.day} className={`p-4 rounded-2xl border transition-all ${
              dayItem.active ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/30 border-slate-900 opacity-60'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleDay(dayIdx)}
                    className={`w-10 h-5 rounded-full relative transition-colors p-0.5 ${
                      dayItem.active ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      dayItem.active ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                  <span className={`text-sm font-bold ${dayItem.active ? 'text-white' : 'text-slate-500'}`}>
                    {dayItem.day}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {dayItem.active ? (
                    <>
                      {dayItem.slots.map((slot, slotIdx) => (
                        <span key={slotIdx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-amber-400 flex items-center gap-1.5 group">
                          {slot}
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(dayIdx, slotIdx)}
                            className="text-slate-500 group-hover:text-rose-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddSlot(dayIdx)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Slot
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Off Day (No Consultations)</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
