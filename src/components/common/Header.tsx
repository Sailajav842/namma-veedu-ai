import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { UnitConverterModal } from './UnitConverterModal';
import { PricingModal } from './PricingModal';
import { ContactModal } from './ContactModal';
import { SettingsModal } from './SettingsModal';
import { HelpModal } from './HelpModal';
import { AboutModal } from './AboutModal';
import { NavigationDrawer } from './NavigationDrawer';
import { NotificationsPopover } from './NotificationsPopover';
import { INDIAN_STATES } from '../../config/regionConfig';

import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  PlusCircle, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  HardHat,
  Globe,
  Calculator,
  MapPin,
  Check,
  Sun,
  Moon,
  Menu,
  Bell,
  User,
  Settings,
  HelpCircle,
  KeyRound,
  Edit,
  DollarSign,
  PhoneCall,
  Home,
  Users
} from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenDocs: () => void;
  onOpenAuth: () => void;
  onNavigateTab?: (tabId: string) => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProject,
  onOpenDocs,
  onOpenAuth,
  onNavigateTab,
  activeTab = 'landing'
}) => {
  const { user, role, switchDemoUser, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, isTamil, t } = useLanguage();
  const { theme, toggleTheme: toggleAppTheme } = useTheme();

  // Dropdowns, Drawers & Modals State
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dedicated Dialog Modals
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [aboutModalMode, setAboutModalMode] = useState<'about' | 'privacy' | null>(null);

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'engineer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <HardHat className="w-3 h-3" /> TN PE
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <UserCheck className="w-3 h-3" /> Customer
          </span>
        );
    }
  };

  const handleNavClick = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LEFT SIDE: Brand Logo & Regional Badge */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavClick('landing')}
                className="flex items-center space-x-2.5 text-left group focus:outline-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    Namma Veedu <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 text-[10px] sm:text-xs font-mono font-bold">AI</span>
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden xl:block">
                    {isTamil ? 'தமிழ்நாடு AI கட்டிட வரைபடங்கள்' : 'Tamil Nadu Architectural Engine'}
                  </p>
                </div>
              </button>

              {/* Regional Badge */}
              <button
                onClick={() => setIsStateModalOpen(true)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all"
                title="Active Region: Tamil Nadu (Click to view roadmap)"
              >
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{isTamil ? 'தமிழ்நாடு' : 'Tamil Nadu'}</span>
              </button>
            </div>

            {/* CENTER: Clean Minimal SaaS Primary Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleNavClick('landing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'landing'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isTamil ? 'முகப்பு' : 'Home'}</span>
              </button>

              <button
                onClick={() => handleNavClick('create_plan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'create_plan' || activeTab === 'ai_generator'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isTamil ? 'AI வரைபடம்' : 'AI Planner'}</span>
              </button>

              <button
                onClick={() => handleNavClick('browse_engineers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'browse_engineers' || activeTab === 'book_engineer'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isTamil ? 'பொறியாளர்கள்' : 'Engineers'}</span>
              </button>

              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isTamil ? 'கட்டணம்' : 'Pricing'}</span>
              </button>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                <span>{isTamil ? 'தொடர்பு' : 'Contact'}</span>
              </button>
            </nav>

            {/* RIGHT SIDE: Controls, Notifications, Theme Toggle, Profile Avatar & Hamburger Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 relative">
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all relative"
                  title="Notifications & Construction Alerts"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    3
                  </span>
                </button>

                <NotificationsPopover
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  onNavigateTab={onNavigateTab}
                />
              </div>

              {/* Theme Toggle (Light 🌞 / Dark 🌙) */}
              <button
                onClick={toggleAppTheme}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                title={theme === 'dark' ? 'Switch to Light Mode 🌞' : 'Switch to Dark Mode 🌙'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Primary Call To Action - Create New Plan */}
              <button
                onClick={onOpenNewProject}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('new_plan_btn')}</span>
              </button>

              {/* User Profile Avatar Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all"
                    aria-label="User profile options"
                  >
                    <img
                      src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user?.name || 'User Avatar'}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs text-slate-800 dark:text-slate-100 animate-fade-in">
                      
                      {/* User Info Card */}
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{user?.email}</p>
                        <div className="mt-1.5">{getRoleBadge(role)}</div>
                      </div>

                      {/* Profile Options */}
                      <div className="py-1 px-1 space-y-0.5">
                        <button
                          onClick={() => {
                            handleNavClick('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all"
                        >
                          <User className="w-4 h-4 text-emerald-500" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            handleNavClick('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsSettingsModalOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all"
                        >
                          <KeyRound className="w-4 h-4 text-amber-500" />
                          <span>Change Password</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsSettingsModalOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all"
                        >
                          <Settings className="w-4 h-4 text-purple-500" />
                          <span>Account Settings</span>
                        </button>
                      </div>

                      {/* Role Switcher in Dropdown */}
                      <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 my-1">
                        <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">
                          Switch Active View
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { switchDemoUser('customer'); setProfileDropdownOpen(false); }}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              role === 'customer' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            Customer
                          </button>
                          <button
                            onClick={() => { switchDemoUser('engineer'); setProfileDropdownOpen(false); }}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              role === 'engineer' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            PE Engineer
                          </button>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1 px-1">
                        <button
                          onClick={() => { logout(); setProfileDropdownOpen(false); onOpenAuth(); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-800 shadow-sm"
                >
                  {isTamil ? 'உள்நுழைக' : 'Sign In'}
                </button>
              )}

              {/* HAMBURGER MENU BUTTON (☰) - Opens Navigation Drawer */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 shadow-md transition-all hover:scale-105"
                title="Open Navigation Menu ☰"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Hamburger Navigation Drawer (Slide-Out) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateTab={onNavigateTab}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenAbout={() => setAboutModalMode('about')}
        onOpenPrivacy={() => setAboutModalMode('privacy')}
        onOpenUnitConverter={() => setIsUnitConverterOpen(true)}
        onOpenPlannerWizard={onOpenNewProject}
      />

      {/* Land Unit Converter Modal */}
      <UnitConverterModal
        isOpen={isUnitConverterOpen}
        onClose={() => setIsUnitConverterOpen(false)}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPlan={() => {
          setIsPricingModalOpen(false);
          setIsContactModalOpen(true);
        }}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Help & FAQ Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* About & Privacy Modal */}
      <AboutModal
        isOpen={aboutModalMode !== null}
        onClose={() => setAboutModalMode(null)}
        mode={aboutModalMode || 'about'}
      />

      {/* State & Region Selector Modal */}
      {isStateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-100">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {isTamil ? 'இந்திய மாநிலங்கள் தேர்வு' : 'Indian Regional Building Directory'}
                </h3>
              </div>
              <button onClick={() => setIsStateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              {isTamil
                ? 'இந்த செயலி முதன்மையாக தமிழ்நாடு மாநில கட்டுமான விதிகள், உள்ளூர் மனையளவுகள் (சென்ட், கிரவுண்ட்) மற்றும் 38 மாவட்ட பொறியாளர்களுக்காக வடிவமைக்கப்பட்டுள்ளது.'
                : 'This MVP release is optimized exclusively for Tamil Nadu Combined Development and Building Rules (TNCDBR 2019) and all 38 districts.'}
            </p>

            <div className="space-y-2">
              {Object.values(INDIAN_STATES).map((st) => (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    st.isMvpActive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 opacity-75'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs flex items-center gap-2">
                      <span>{isTamil ? st.nameTa : st.nameEn}</span>
                      {st.isMvpActive && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active MVP
                        </span>
                      )}
                    </h4>
                  </div>

                  {st.isMvpActive && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsStateModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/30"
            >
              {isTamil ? 'தமிழ்நாடு தொடர்ந்து பயன்படுத்துக' : 'Continue with Tamil Nadu MVP'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
