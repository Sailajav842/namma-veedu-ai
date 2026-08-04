import React from 'react';
import { Bell, ArrowRight, X, Sparkles, TrendingUp, CalendarCheck } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { isTamil } = useLanguage();
  const [items, setItems] = React.useState(MOCK_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'revision':
        return <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'warning':
        return <CalendarCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-14 mt-1 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-4 space-y-3 animate-fade-in text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">
            {isTamil ? 'அறிவிப்புகள்' : 'Live Construction Alerts'}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {items.filter((n) => !n.isRead).length} New
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (onNavigateTab) {
                if (n.linkTab) onNavigateTab(n.linkTab);
                else onNavigateTab('notifications');
              }
              onClose();
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
              !n.isRead
                ? 'bg-slate-50 dark:bg-slate-950 border-emerald-500/30 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
              {getNotificationIcon(n.type)}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] leading-tight">{n.title}</p>
                <span className="text-[9px] text-slate-400">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today'}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (onNavigateTab) onNavigateTab('notifications');
          onClose();
        }}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
      >
        <span>View Notification Center</span>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      </button>
    </div>
  );
};
