import React, { useState } from 'react';
import { NotificationItem, CustomerTab } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { Bell, CheckCheck, Trash2, ArrowRight, ShieldCheck, Calendar, TrendingUp, Sparkles } from 'lucide-react';

interface NotificationsTabProps {
  onNavigateTab: (tab: CustomerTab) => void;
  onClearUnreadCount?: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  onNavigateTab,
  onClearUnreadCount,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    if (onClearUnreadCount) onClearUnreadCount();
  };

  const handleClearAll = () => {
    setNotifications([]);
    if (onClearUnreadCount) onClearUnreadCount();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'approval':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'info':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'system':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'revision':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Activity Stream
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" /> System Alerts & Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track PE stamp updates, consultation schedules, and building cost index changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <CheckCheck className="w-4 h-4 text-blue-400" /> Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-red-500/10 text-xs font-semibold text-slate-400 hover:text-red-400 border border-slate-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No active notifications in stream.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.linkTab) onNavigateTab(notif.linkTab);
              }}
              className={`p-5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-900/80 border-blue-500/50 shadow-lg shadow-blue-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-slate-500 hover:text-blue-400 text-xs font-semibold">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
