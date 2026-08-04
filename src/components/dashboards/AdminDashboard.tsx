import React, { useState } from 'react';
import { Project, UserProfile, EngineerProfile, EngineerBooking, MaterialMarketPrice, NotificationItem, EngineerReview } from '../../types';
import { 
  DEMO_USERS, 
  MOCK_ENGINEERS, 
  MOCK_BOOKINGS, 
  MOCK_MATERIAL_PRICES, 
  MOCK_NOTIFICATIONS, 
  MOCK_REVIEWS, 
  INITIAL_PROJECTS 
} from '../../data/mockData';

import { AdminAnalyticsSection } from '../admin/AdminAnalyticsSection';
import { UserManagementSection } from '../admin/UserManagementSection';
import { EngineerVerificationSection } from '../admin/EngineerVerificationSection';
import { BookingManagementSection } from '../admin/BookingManagementSection';
import { MaterialPriceSection } from '../admin/MaterialPriceSection';
import { ReportsSection } from '../admin/ReportsSection';
import { NotificationsSection } from '../admin/NotificationsSection';
import { ReviewsSection } from '../admin/ReviewsSection';

import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  CalendarCheck, 
  Building2, 
  FileText, 
  Bell, 
  Star, 
  Activity, 
  Cpu, 
  DollarSign, 
  CheckCircle2, 
  Award,
  Layers
} from 'lucide-react';

interface AdminDashboardProps {
  projects?: Project[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects = INITIAL_PROJECTS,
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'users' | 'verification' | 'bookings' | 'materials' | 'reports' | 'notifications' | 'reviews'
  >('analytics');

  // Central State Management for Admin Operations
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [engineers, setEngineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);
  const [bookings, setBookings] = useState<EngineerBooking[]>(MOCK_BOOKINGS);
  const [materials, setMaterials] = useState<MaterialMarketPrice[]>(MOCK_MATERIAL_PRICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [reviews, setReviews] = useState<EngineerReview[]>(MOCK_REVIEWS);

  const pendingVerificationsCount = engineers.filter((e) => !e.isVerified).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Admin Executive Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Ambient Light Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">• BuildAI v2.6 Admin Suite</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">Enterprise System & Operations Dashboard</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time control over user directory roles, Civil Engineer PE verifications, consultation bookings, material price index, and Gemini 3.6 AI synthesis telemetry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">System Telemetry</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400">100% Operational</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Gemini 3.6 Latency</span>
            <p className="font-mono font-bold text-purple-400">420ms / call</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics & Stats
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
              activeTab === 'verification'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Engineer PE Audit
            {pendingVerificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                {pendingVerificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-cyan-400" /> Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'materials'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" /> Material Prices
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" /> Reports & PDF
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" /> Broadcasts
            {unreadNotificationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'reviews'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Main Tab View Containers */}
      <div className="transition-all duration-300">
        {activeTab === 'analytics' && (
          <AdminAnalyticsSection projects={projects} />
        )}

        {activeTab === 'users' && (
          <UserManagementSection
            users={users}
            onUpdateUsers={setUsers}
          />
        )}

        {activeTab === 'verification' && (
          <EngineerVerificationSection
            engineers={engineers}
            onUpdateEngineers={setEngineers}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingManagementSection
            bookings={bookings}
            onUpdateBookings={setBookings}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialPriceSection
            materials={materials}
            onUpdateMaterials={setMaterials}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsSection projects={projects} />
        )}

        {activeTab === 'notifications' && (
          <NotificationsSection
            notifications={notifications}
            onUpdateNotifications={setNotifications}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection
            reviews={reviews}
            onUpdateReviews={setReviews}
          />
        )}
      </div>

    </div>
  );
};
