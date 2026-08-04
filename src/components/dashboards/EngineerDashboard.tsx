import React, { useState, useEffect } from 'react';
import { 
  Project, 
  EngineeringStamp, 
  EngineerProfile, 
  EngineerLicense, 
  EngineerCertificate, 
  EngineerPortfolioItem, 
  EngineerAvailability, 
  EngineerBooking, 
  EngineerChatMessage, 
  EngineerQuotation, 
  EngineerEarningRecord, 
  EngineerReview 
} from '../../types';
import { BlueprintCanvas } from '../planner/BlueprintCanvas';
import { EngineeringChecklist } from '../planner/EngineeringChecklist';

// Sub-sections
import { ProfileSection } from '../engineer/ProfileSection';
import { LicenseUploadSection } from '../engineer/LicenseUploadSection';
import { CertificateUploadSection } from '../engineer/CertificateUploadSection';
import { PortfolioSection } from '../engineer/PortfolioSection';
import { AvailabilitySection } from '../engineer/AvailabilitySection';
import { BookingsSection } from '../engineer/BookingsSection';
import { ChatSection } from '../engineer/ChatSection';
import { QuotationSection } from '../engineer/QuotationSection';
import { EarningsSection } from '../engineer/EarningsSection';
import { ReviewsSection } from '../engineer/ReviewsSection';
import { SupabaseStatusModal } from '../engineer/SupabaseStatusModal';

import { SupabaseEngineerStore, isSupabaseConfigured } from '../../services/supabase';

import { 
  HardHat, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileCheck2, 
  Send, 
  Sparkles,
  ShieldCheck,
  User,
  Clock,
  Calendar,
  CalendarCheck,
  MessageSquare,
  Calculator,
  DollarSign,
  Star,
  Database,
  Building2
} from 'lucide-react';

interface EngineerDashboardProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
}

export const EngineerDashboard: React.FC<EngineerDashboardProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onUpdateProject,
}) => {
  type TabType = 
    | 'review' 
    | 'profile' 
    | 'licenses' 
    | 'certificates' 
    | 'portfolio' 
    | 'availability' 
    | 'bookings' 
    | 'chat' 
    | 'quotations' 
    | 'earnings' 
    | 'reviews';

  const [activeTab, setActiveTab] = useState<TabType>('review');
  const [engineerNotes, setEngineerNotes] = useState<string>('');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Store States
  const [profile, setProfile] = useState<EngineerProfile>(SupabaseEngineerStore.getProfile as any);
  const [licenses, setLicenses] = useState<EngineerLicense[]>([]);
  const [certificates, setCertificates] = useState<EngineerCertificate[]>([]);
  const [portfolio, setPortfolio] = useState<EngineerPortfolioItem[]>([]);
  const [availability, setAvailability] = useState<EngineerAvailability | null>(null);
  const [bookings, setBookings] = useState<EngineerBooking[]>([]);
  const [messages, setMessages] = useState<EngineerChatMessage[]>([]);
  const [quotations, setQuotations] = useState<EngineerQuotation[]>([]);
  const [earnings, setEarnings] = useState<EngineerEarningRecord[]>([]);
  const [reviews, setReviews] = useState<EngineerReview[]>([]);

  const [activeChatClient, setActiveChatClient] = useState('Sarah Jenkins');
  const [activeChatProject, setActiveChatProject] = useState('Grand Modern Villa 2026');

  // Async initial load from Supabase store
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const p = await SupabaseEngineerStore.getProfile();
      const l = await SupabaseEngineerStore.getLicenses();
      const c = await SupabaseEngineerStore.getCertificates();
      const port = await SupabaseEngineerStore.getPortfolio();
      const avail = await SupabaseEngineerStore.getAvailability();
      const b = await SupabaseEngineerStore.getBookings();
      const msg = await SupabaseEngineerStore.getChatMessages();
      const q = await SupabaseEngineerStore.getQuotations();
      const earn = await SupabaseEngineerStore.getEarnings();
      const rev = await SupabaseEngineerStore.getReviews();

      if (isMounted) {
        setProfile(p);
        setLicenses(l);
        setCertificates(c);
        setPortfolio(port);
        setAvailability(avail);
        setBookings(b);
        setMessages(msg);
        setQuotations(q);
        setEarnings(earn);
        setReviews(rev);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Save Handlers
  const handleSaveProfile = async (updated: EngineerProfile) => {
    setProfile(updated);
    await SupabaseEngineerStore.saveProfile(updated);
  };

  const handleSaveLicenses = async (updated: EngineerLicense[]) => {
    setLicenses(updated);
    await SupabaseEngineerStore.saveLicenses(updated);
  };

  const handleSaveCertificates = async (updated: EngineerCertificate[]) => {
    setCertificates(updated);
    await SupabaseEngineerStore.saveCertificates(updated);
  };

  const handleSavePortfolio = async (updated: EngineerPortfolioItem[]) => {
    setPortfolio(updated);
    await SupabaseEngineerStore.savePortfolio(updated);
  };

  const handleSaveAvailability = async (updated: EngineerAvailability) => {
    setAvailability(updated);
    await SupabaseEngineerStore.saveAvailability(updated);
  };

  const handleSaveBookings = async (updated: EngineerBooking[]) => {
    setBookings(updated);
    await SupabaseEngineerStore.saveBookings(updated);
  };

  const handleSaveMessages = async (updated: EngineerChatMessage[]) => {
    setMessages(updated);
    await SupabaseEngineerStore.saveChatMessages(updated);
  };

  const handleSaveQuotations = async (updated: EngineerQuotation[]) => {
    setQuotations(updated);
    await SupabaseEngineerStore.saveQuotations(updated);
  };

  const handleSaveReviews = async (updated: EngineerReview[]) => {
    setReviews(updated);
    await SupabaseEngineerStore.saveReviews(updated);
  };

  const handleApplyStamp = (stamp: EngineeringStamp) => {
    const updated: Project = {
      ...activeProject,
      engineeringStamp: stamp,
      status: 'engineer_approved',
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const handleSendFeedback = () => {
    if (!engineerNotes.trim()) return;
    const updated: Project = {
      ...activeProject,
      status: 'changes_requested',
      updatedAt: new Date().toISOString(),
      revisions: [
        {
          id: `rev_eng_${Date.now()}`,
          authorId: 'usr_engineer_1',
          authorName: profile?.name || 'David Vance, PE',
          authorRole: 'engineer',
          timestamp: new Date().toISOString(),
          promptText: engineerNotes,
          changeSummary: 'Engineer structural review feedback added.',
          blueprintVersion: activeProject.blueprint.version,
        },
        ...activeProject.revisions,
      ],
    };
    onUpdateProject(updated);
    setEngineerNotes('');
  };

  const handleOpenChat = (clientName: string, projectTitle: string) => {
    setActiveChatClient(clientName);
    setActiveChatProject(projectTitle);
    setActiveTab('chat');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" /> Structural Civil Engineer Portal
            </span>
            <span className="text-xs text-slate-400">• License: {profile?.licenseNumber || 'PE-CA-49281-CIVIL'}</span>
            
            {/* Supabase Status Pill */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-1"
            >
              <Database className="w-3 h-3" /> Supabase: {isSupabaseConfigured ? 'Live Synced' : 'Local Storage'}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            {profile?.name || 'David Vance, PE'} Engineering Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Verify structural loads, upload PE licenses, issue quotations, manage client bookings & sync data in Supabase.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Active Blueprint:</span>
          <select
            value={activeProject.id}
            onChange={(e) => {
              const p = projects.find((x) => x.id === e.target.value);
              if (p) onSelectProject(p);
            }}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-semibold shadow-inner"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.engineeringStamp ? '✅ Stamped' : '⏳ Pending Review'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'review', label: 'PE Review & Stamp', icon: Award },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'licenses', label: 'Upload License', icon: FileCheck2 },
          { id: 'certificates', label: 'Upload Certificate', icon: Award },
          { id: 'portfolio', label: 'Portfolio', icon: Building2 },
          { id: 'availability', label: 'Availability', icon: Calendar },
          { id: 'bookings', label: 'Booking Requests', icon: CalendarCheck, count: bookings.filter(b => b.status === 'requested').length },
          { id: 'chat', label: 'Chat', icon: MessageSquare },
          { id: 'quotations', label: 'Quotation Generator', icon: Calculator },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'reviews', label: 'Reviews', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {Boolean(tab.count) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-extrabold animate-pulse">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: PE Plan Review Station */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{activeProject.title}</h3>
                  <p className="text-xs text-slate-400">Client: {activeProject.customerName} ({activeProject.customerEmail})</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeProject.engineeringStamp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {activeProject.engineeringStamp ? 'STAMPED & APPROVED' : 'REVIEW PENDING'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-slate-400 font-medium">Building Footprint</p>
                  <p className="font-bold text-white text-sm mt-0.5">{activeProject.blueprint.totalAreaSqFt} sq ft</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-slate-400 font-medium">Structural Rebar Est.</p>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">14.5 Tons Grade 60</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-slate-400 font-medium">Soil Bearing Capacity</p>
                  <p className="font-bold text-cyan-400 text-sm mt-0.5">2,800 psf ( Clay )</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-white">AI-Generated Structural Engineering Assumptions:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {activeProject.blueprint.structuralNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <EngineeringChecklist
              checks={activeProject.engineeringChecks}
              stamp={activeProject.engineeringStamp}
              project={activeProject}
              onApplyStamp={handleApplyStamp}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Issue Engineer Revisions / Directives</span>
              </h3>
              <p className="text-xs text-slate-400">
                Submit specific engineering directives for the client to update footing depth or framing dimensions.
              </p>

              <textarea
                rows={4}
                value={engineerNotes}
                onChange={(e) => setEngineerNotes(e.target.value)}
                placeholder="e.g. Recommend deepening north corner pier footings to 18ft due to expansive clay soil profile."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />

              <button
                onClick={handleSendFeedback}
                disabled={!engineerNotes.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <span>Send Revision Request to Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <ProfileSection profile={profile} onSaveProfile={handleSaveProfile} />
      )}

      {/* Tab 3: Upload License */}
      {activeTab === 'licenses' && (
        <LicenseUploadSection licenses={licenses} onSaveLicenses={handleSaveLicenses} />
      )}

      {/* Tab 4: Upload Certificate */}
      {activeTab === 'certificates' && (
        <CertificateUploadSection certificates={certificates} onSaveCertificates={handleSaveCertificates} />
      )}

      {/* Tab 5: Portfolio */}
      {activeTab === 'portfolio' && (
        <PortfolioSection portfolio={portfolio} onSavePortfolio={handleSavePortfolio} />
      )}

      {/* Tab 6: Availability */}
      {activeTab === 'availability' && availability && (
        <AvailabilitySection availability={availability} onSaveAvailability={handleSaveAvailability} />
      )}

      {/* Tab 7: Booking Requests */}
      {activeTab === 'bookings' && (
        <BookingsSection bookings={bookings} onSaveBookings={handleSaveBookings} onOpenChatWithClient={handleOpenChat} />
      )}

      {/* Tab 8: Chat */}
      {activeTab === 'chat' && (
        <ChatSection 
          messages={messages} 
          onSaveMessages={handleSaveMessages} 
          activeClientName={activeChatClient} 
          activeProjectTitle={activeChatProject} 
        />
      )}

      {/* Tab 9: Quotations */}
      {activeTab === 'quotations' && (
        <QuotationSection quotations={quotations} onSaveQuotations={handleSaveQuotations} />
      )}

      {/* Tab 10: Earnings */}
      {activeTab === 'earnings' && (
        <EarningsSection earnings={earnings} />
      )}

      {/* Tab 11: Reviews */}
      {activeTab === 'reviews' && (
        <ReviewsSection reviews={reviews} onSaveReviews={handleSaveReviews} />
      )}

      {/* Supabase Connection Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
};
