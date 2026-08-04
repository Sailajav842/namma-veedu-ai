import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  MessageSquare, 
  Users, 
  HardHat, 
  Search, 
  Plus, 
  Check, 
  Radio, 
  Clock 
} from 'lucide-react';

interface NotificationsSectionProps {
  notifications: NotificationItem[];
  onUpdateNotifications: (updated: NotificationItem[]) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  onUpdateNotifications,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Broadcast Form State
  const [targetAudience, setTargetAudience] = useState<'all' | 'customer' | 'engineer'>('all');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<NotificationItem['type']>('info');

  const filteredNotifications = notifications.filter((n) => {
    return (
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    onUpdateNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    onUpdateNotifications(updated);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `[BROADCAST - ${targetAudience.toUpperCase()}] ${broadcastTitle}`,
      message: broadcastMessage,
      type: broadcastType,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    onUpdateNotifications([newNotif, ...notifications]);
    setIsBroadcastModalOpen(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>System Notifications & Platform Broadcast Center</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements to customers and engineers, monitor system health warnings, and audit log events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
          >
            Mark All Read
          </button>
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" /> Compose Broadcast
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search notification title, message, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notification Stream List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
              n.isRead
                ? 'bg-slate-900/50 border-slate-800 text-slate-300'
                : 'bg-slate-900 border-amber-500/30 text-white shadow-xl ring-1 ring-amber-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-2xl border shrink-0 mt-0.5 ${
                n.type === 'approval' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                n.type === 'revision' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                n.type === 'warning' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {n.type === 'approval' && <CheckCircle2 className="w-5 h-5" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {n.type === 'revision' && <MessageSquare className="w-5 h-5" />}
                {n.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>

            {!n.isRead && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-xl transition-all shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Broadcast Announcement Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSendBroadcast} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Compose Broadcast Announcement</span>
              </h4>
              <button type="button" onClick={() => setIsBroadcastModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="all">All Platform Users (Customers & Engineers)</option>
                  <option value="customer">Customers Only</option>
                  <option value="engineer">Verified PE Engineers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notification Category</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="info">System Info / Update</option>
                  <option value="approval">Feature Approval Announcement</option>
                  <option value="warning">Maintenance / Code Update Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Headline *</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. 2026 IBC Zoning Code Update Patch Active"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Body Message *</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type message content here..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Dispatch Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
