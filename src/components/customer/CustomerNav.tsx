import React from 'react';
import { CustomerTab } from '../../types';
import { 
  Home,
  LayoutDashboard, 
  User, 
  PlusCircle, 
  FolderHeart, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Star, 
  Bell 
} from 'lucide-react';

interface CustomerNavProps {
  activeTab: CustomerTab;
  onSelectTab: (tab: CustomerTab) => void;
  unreadCount: number;
}

export const CustomerNav: React.FC<CustomerNavProps> = ({
  activeTab,
  onSelectTab,
  unreadCount
}) => {
  const navItems: { id: CustomerTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'landing', label: 'Home / Showcase', icon: Home },
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'create_plan', label: 'Create House Plan', icon: PlusCircle },
    { id: 'saved_plans', label: 'Saved Plans', icon: FolderHeart },
    { id: 'ai_generator', label: 'AI Generator Studio', icon: Sparkles },
    { id: 'cost_estimator', label: 'Cost Estimator', icon: Calculator },
    { id: 'material_prices', label: 'Material Prices', icon: TrendingUp },
    { id: 'browse_engineers', label: 'Browse Engineers', icon: Users },
    { id: 'book_engineer', label: 'Book Engineer', icon: CalendarCheck },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm dark:shadow-2xl transition-colors duration-300">
      <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
