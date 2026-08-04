import React, { useEffect } from 'react';
import { 
  X, 
  Home, 
  LayoutDashboard, 
  FolderHeart, 
  PlusCircle, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  LogOut, 
  HardHat, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Rss, 
  DollarSign, 
  Star, 
  BarChart3, 
  Sliders, 
  Building2, 
  Zap, 
  MapPin,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
  onOpenPricing?: () => void;
  onOpenContact?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenAbout?: () => void;
  onOpenPrivacy?: () => void;
  onOpenUnitConverter?: () => void;
  onOpenPlannerWizard?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenPricing,
  onOpenContact,
  onOpenSettings,
  onOpenHelp,
  onOpenAbout,
  onOpenPrivacy,
  onOpenUnitConverter,
  onOpenPlannerWizard
}) => {
  const { user, role, switchDemoUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isTamil } = useLanguage();

  const [engineerStatus, setEngineerStatus] = React.useState<'Available' | 'Away'>('Available');

  // Listen for Escape key press to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = (callback?: () => void) => {
    if (callback) callback();
    onClose();
  };

  const handleTabSelect = (tabId: string) => {
    if (onNavigateTab) onNavigateTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-sm sm:max-w-md w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Namma Veedu <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">AI</span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Building Planner & PE Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700/60"
            aria-label="Close Navigation Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">{user?.email}</p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              role === 'admin' 
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : role === 'engineer'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}>
              {role}
            </span>
          </div>

          {/* Quick Role Switcher Buttons */}
          <div className="pt-1 flex items-center justify-between bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/60 dark:border-slate-800/80 text-[11px]">
            <button
              onClick={() => switchDemoUser('customer')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all text-center ${
                role === 'customer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTamil ? 'வாடிக்கையாளர்' : 'Customer'}
            </button>
            <button
              onClick={() => switchDemoUser('engineer')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all text-center ${
                role === 'engineer' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTamil ? 'பொறியாளர்' : 'Engineer'}
            </button>
            <button
              onClick={() => switchDemoUser('admin')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all text-center ${
                role === 'admin' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTamil ? 'நிர்வாகி' : 'Admin'}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">

          {/* 1. CUSTOMER MENU */}
          {role === 'customer' && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Customer Operations Menu
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleTabSelect('landing')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Home & Showcase</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>My Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('saved_plans')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderHeart className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>Saved Floor Plans</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('create_plan')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>2D & 3D AI Planner Studio</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    AI Studio
                  </span>
                </button>

                <button
                  onClick={() => handleTabSelect('cost_estimator')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Construction Cost Estimator</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('material_prices')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>38 Districts Material Prices</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">Live</span>
                </button>

                <button
                  onClick={() => handleTabSelect('browse_engineers')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Engineer Marketplace</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('book_engineer')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>My Consultation Bookings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>

                <button
                  onClick={() => handleTabSelect('notifications')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span>Notifications & Alerts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                    3 New
                  </span>
                </button>

                <button
                  onClick={() => handleTabSelect('profile')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                    <span>My Profile & Preferences</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                </button>
              </div>
            </div>
          )}

          {/* 2. ENGINEER MENU */}
          {role === 'engineer' && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <HardHat className="w-3 h-3" /> Civil Engineer Portal
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Engineer Workspace</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                </button>

                {/* Availability Toggle */}
                <div className="p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between text-xs my-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${engineerStatus === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Consultation Status</span>
                  </div>
                  <button
                    onClick={() => setEngineerStatus(engineerStatus === 'Available' ? 'Away' : 'Available')}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                      engineerStatus === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {engineerStatus === 'Available' ? 'Online ✓' : 'Away 🌙'}
                  </button>
                </div>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Client Drawing Requests</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                    5 Pending
                  </span>
                </button>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Consultation Earnings</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">₹48,500</span>
                </button>

                <button
                  onClick={() => handleTabSelect('reviews')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Client Reviews & Ratings</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    4.9 ★
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 3. ADMIN MENU */}
          {role === 'admin' && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Platform Administration
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Admin Control Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                </button>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Manage Registered Users</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300">
                    1,248
                  </span>
                </button>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <HardHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Verify Civil Engineers</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    14 Pending
                  </span>
                </button>

                <button
                  onClick={() => handleTabSelect('overview')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>System Analytics & Reports</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Links & Platform Support Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Platform & Legal Resources
            </div>

            <button
              onClick={() => handleAction(onOpenPricing)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Pricing & Plan Packages</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                View Plans
              </span>
            </button>

            <button
              onClick={() => handleAction(onOpenContact)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Contact Engineering Team</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => handleAction(onOpenSettings)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Account & Site Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => handleAction(onOpenHelp)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Help Center & FAQ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => handleAction(onOpenAbout)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>About Namma Veedu AI</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => handleAction(onOpenPrivacy)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                <span>Privacy & Security Policy</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            </button>
          </div>

        </div>

        {/* Drawer Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/90 space-y-3">
          
          <div className="flex items-center justify-between">
            {/* Theme Toggle in Footer */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Land Unit Converter Quick Button */}
            {onOpenUnitConverter && (
              <button
                onClick={() => handleAction(onOpenUnitConverter)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Unit Converter</span>
              </button>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>

          <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
            © 2026 Namma Veedu AI • Tamil Nadu Civil Engineering Engine v3.2
          </p>
        </div>

      </div>
    </div>
  );
};
