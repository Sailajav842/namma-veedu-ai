import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
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
} from '../types';
import { MOCK_ENGINEERS, MOCK_BOOKINGS, MOCK_REVIEWS } from '../data/mockData';

// Environment variables for Supabase (client side)
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

const isValidHttpUrl = (urlString: string): boolean => {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidHttpUrl(supabaseUrl) &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabaseClient = null;
  }
}

export const supabase: SupabaseClient | null = supabaseClient;

// Initial Mock Seed Data
export const INITIAL_ENGINEER_PROFILE: EngineerProfile = {
  id: 'eng_david_vance',
  name: 'David Vance, PE',
  licenseNumber: 'PE-CA-49281-CIVIL',
  specialization: 'Structural & Seismic Engineering',
  yearsExperience: 14,
  hourlyRate: 185,
  rating: 4.9,
  reviewCount: 48,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  bio: 'Licensed Professional Structural Engineer specializing in seismic shear wall analysis, timber framing, concrete footing design, and IBC building code compliance.',
  isVerified: true,
  completedProjects: 142,
  location: 'San Francisco, CA',
  availability: 'Mon-Fri, 9am - 5pm PST',
  phone: '+1 (415) 892-3041',
  email: 'david.vance@vancestructural.com',
  issuingAuthority: 'California Board for Professional Engineers',
};

export const INITIAL_ENGINEER_LICENSES: EngineerLicense[] = [
  {
    id: 'lic_1',
    licenseNumber: 'PE-CA-49281-CIVIL',
    jurisdiction: 'California',
    licenseType: 'PE Civil & Structural',
    issueDate: '2012-04-15',
    expiryDate: '2028-06-30',
    status: 'active',
    documentName: 'CA_PE_License_DavidVance_Stamp.pdf',
    fileSize: '2.4 MB',
  },
  {
    id: 'lic_2',
    licenseNumber: 'PE-WA-88192-STRUCT',
    jurisdiction: 'Washington State',
    licenseType: 'SE Structural Specialist',
    issueDate: '2016-09-10',
    expiryDate: '2027-11-30',
    status: 'active',
    documentName: 'WA_SE_Structural_License.pdf',
    fileSize: '1.8 MB',
  },
];

export const INITIAL_ENGINEER_CERTIFICATES: EngineerCertificate[] = [
  {
    id: 'cert_1',
    title: 'NCEES Model Law Engineer (MLE) Designation',
    issuingOrganization: 'National Council of Examiners for Engineering',
    issueDate: '2015-08-20',
    credentialId: 'NCEES-98214',
    category: 'Structural',
    documentName: 'NCEES_MLE_Certificate.pdf',
  },
  {
    id: 'cert_2',
    title: 'ATC-20 Rapid Post-Earthquake Safety Evaluation',
    issuingOrganization: 'Applied Technology Council',
    issueDate: '2018-03-12',
    credentialId: 'ATC-CAL-2041',
    category: 'Seismic',
    documentName: 'ATC20_Post_Quake_Cert.pdf',
  },
  {
    id: 'cert_3',
    title: 'OSHA 30-Hour Construction Safety Certification',
    issuingOrganization: 'US Dept of Labor',
    issueDate: '2021-01-10',
    credentialId: 'OSHA30-88192-US',
    category: 'Safety',
    documentName: 'OSHA30_Safety_Cert.pdf',
  },
];

export const INITIAL_PORTFOLIO_ITEMS: EngineerPortfolioItem[] = [
  {
    id: 'port_1',
    title: 'Pacific Heights Hillside Modern Villa',
    buildingType: 'residential_villa',
    location: 'San Francisco, CA',
    completionYear: 2024,
    areaSqFt: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'Calculated continuous deep caisson footings into rock hillside with moment-resisting steel frames to withstand Magnitude 7.8 seismic loading.',
    highlights: ['Deep Caisson Footings', 'Steel Moment Frames', 'Cantilevered Ocean Deck'],
    clientName: 'Harrison Meyer',
    costUSD: 2400000,
  },
  {
    id: 'port_2',
    title: 'Silicon Valley Eco-Tech Office & Showroom',
    buildingType: 'commercial_office',
    location: 'Palo Alto, CA',
    completionYear: 2023,
    areaSqFt: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    description: 'Engineered mass timber glued-laminated beam network with solar array roof integration achieving LEED Platinum certification.',
    highlights: ['Mass Timber Glulam', 'LEED Platinum Structural', 'Rooftop Solar Sub-frame'],
    clientName: 'Verde Tech LLC',
    costUSD: 5800000,
  },
  {
    id: 'port_3',
    title: 'Marin Coastal Eco Tiny Home Cluster',
    buildingType: 'eco_tiny_home',
    location: 'Sausalito, CA',
    completionYear: 2024,
    areaSqFt: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    description: 'Off-grid modular steel-framed eco tiny home setup with hurricane wind-resistant tie-downs and rainwater tank floor load distribution.',
    highlights: ['Wind-Shear Anchors', 'Light-Gauge Steel Studs', 'Zero-Waste Foundation'],
    clientName: 'Sausalito Living',
    costUSD: 450000,
  },
];

export const INITIAL_AVAILABILITY: EngineerAvailability = {
  isAcceptingBookings: true,
  emergencyAuditAvailable: true,
  consultationSlotMinutes: 45,
  weeklySchedule: [
    { day: 'Monday', active: true, slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
    { day: 'Tuesday', active: true, slots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:30 PM'] },
    { day: 'Wednesday', active: true, slots: ['09:00 AM', '11:00 AM', '02:00 PM'] },
    { day: 'Thursday', active: true, slots: ['09:00 AM', '10:30 AM', '01:30 PM', '04:00 PM'] },
    { day: 'Friday', active: true, slots: ['09:00 AM', '11:00 AM', '01:00 PM'] },
    { day: 'Saturday', active: false, slots: [] },
    { day: 'Sunday', active: false, slots: [] },
  ],
};

export const INITIAL_QUOTATIONS: EngineerQuotation[] = [
  {
    id: 'q_1001',
    quotationNumber: 'QT-2026-081',
    projectId: 'proj_1',
    projectTitle: 'Grand Modern Villa 2026',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    createdAt: '2026-07-20',
    validUntil: '2026-08-20',
    items: [
      { id: 'qi_1', description: 'PE Full Structural Calculations & Seismic Load Analysis', quantity: 1, unitPriceUSD: 1450, totalUSD: 1450 },
      { id: 'qi_2', description: 'Wet Seal & Official California PE Stamp on Blueprints', quantity: 1, unitPriceUSD: 850, totalUSD: 850 },
      { id: 'qi_3', description: 'On-site Geotechnical Soil Capacity Verification', quantity: 1, unitPriceUSD: 500, totalUSD: 500 },
    ],
    subtotalUSD: 2800,
    taxRatePercent: 8.5,
    taxUSD: 238,
    totalUSD: 3038,
    status: 'accepted',
    notes: 'Includes 2 structural revision cycles prior to final city permit submission.',
  },
  {
    id: 'q_1002',
    quotationNumber: 'QT-2026-088',
    projectId: 'proj_2',
    projectTitle: 'Coastal Glass House',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@coastal.org',
    createdAt: '2026-07-26',
    validUntil: '2026-08-26',
    items: [
      { id: 'qi_4', description: 'Wind Load Shear Wall Audit & Glass Envelope Tie-down Assessment', quantity: 1, unitPriceUSD: 1200, totalUSD: 1200 },
      { id: 'qi_5', description: '1-on-1 Engineering Consultation Session (2 Hours)', quantity: 2, unitPriceUSD: 185, totalUSD: 370 },
    ],
    subtotalUSD: 1570,
    taxRatePercent: 8.5,
    taxUSD: 133.45,
    totalUSD: 1703.45,
    status: 'sent',
    notes: 'Awaiting client approval for wind shear audit.',
  },
];

export const INITIAL_CHAT_MESSAGES: EngineerChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_customer_1',
    senderName: 'Sarah Jenkins',
    senderRole: 'customer',
    recipientId: 'eng_david_vance',
    recipientName: 'David Vance, PE',
    projectId: 'proj_1',
    projectTitle: 'Grand Modern Villa 2026',
    messageText: 'Hi David! We updated the primary master bedroom dimensions in the floor planner. Could you check if the cantilever beam span still meets seismic shear limits?',
    timestamp: '2026-07-27T10:15:00Z',
    isRead: true,
  },
  {
    id: 'msg_2',
    senderId: 'eng_david_vance',
    senderName: 'David Vance, PE',
    senderRole: 'engineer',
    recipientId: 'usr_customer_1',
    recipientName: 'Sarah Jenkins',
    projectId: 'proj_1',
    projectTitle: 'Grand Modern Villa 2026',
    messageText: 'Hello Sarah! I reviewed the revised CAD grid. The 22ft cantilever span requires W12x26 structural steel I-beams instead of timber joists. I have updated the engineering checklist.',
    timestamp: '2026-07-27T10:42:00Z',
    isRead: true,
  },
  {
    id: 'msg_3',
    senderId: 'usr_customer_1',
    senderName: 'Sarah Jenkins',
    senderRole: 'customer',
    recipientId: 'eng_david_vance',
    recipientName: 'David Vance, PE',
    projectId: 'proj_1',
    projectTitle: 'Grand Modern Villa 2026',
    messageText: 'Awesome! Can you issue the formal PE stamp once the foundation calculation is signed off?',
    timestamp: '2026-07-28T08:30:00Z',
    isRead: false,
  },
];

export const INITIAL_EARNINGS: EngineerEarningRecord[] = [
  { id: 'earn_1', clientName: 'Sarah Jenkins', serviceType: 'Full PE Structural Stamp', amountUSD: 2300, date: '2026-07-25', status: 'paid_out', payoutMethod: 'Direct Deposit (Chase ****4912)' },
  { id: 'earn_2', clientName: 'Michael Chen', serviceType: 'Wind Shear Wall Audit', amountUSD: 1200, date: '2026-07-26', status: 'in_escrow', payoutMethod: 'Stripe Escrow' },
  { id: 'earn_3', clientName: 'Robert Vance', serviceType: 'Foundation Soil Inspection', amountUSD: 850, date: '2026-07-22', status: 'paid_out', payoutMethod: 'Direct Deposit (Chase ****4912)' },
  { id: 'earn_4', clientName: 'Elena Rostova', serviceType: '1-on-1 Structural Consultation', amountUSD: 370, date: '2026-07-18', status: 'paid_out', payoutMethod: 'Direct Deposit (Chase ****4912)' },
  { id: 'earn_5', clientName: 'David K. Miller', serviceType: 'Retaining Wall & Soil Calculation', amountUSD: 1650, date: '2026-07-12', status: 'paid_out', payoutMethod: 'Direct Deposit (Chase ****4912)' },
];

// Persistent LocalStorage Keys as graceful fallback
const KEYS = {
  PROFILE: 'eng_db_profile_v1',
  LICENSES: 'eng_db_licenses_v1',
  CERTIFICATES: 'eng_db_certificates_v1',
  PORTFOLIO: 'eng_db_portfolio_v1',
  AVAILABILITY: 'eng_db_availability_v1',
  BOOKINGS: 'eng_db_bookings_v1',
  QUOTATIONS: 'eng_db_quotations_v1',
  CHAT: 'eng_db_chat_v1',
  EARNINGS: 'eng_db_earnings_v1',
  REVIEWS: 'eng_db_reviews_v1',
};

// Generic LocalStorage helper with initial seed
function getStored<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Failed to store key ${key}:`, err);
  }
}

// Data Store Provider Object with API Methods
export const SupabaseEngineerStore = {
  // 1. Profile
  async getProfile(): Promise<EngineerProfile> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_profiles').select('*').single();
        if (!error && data) return data as EngineerProfile;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
      }
    }
    return getStored(KEYS.PROFILE, INITIAL_ENGINEER_PROFILE);
  },

  async saveProfile(profile: EngineerProfile): Promise<EngineerProfile> {
    setStored(KEYS.PROFILE, profile);
    if (supabase) {
      try {
        await supabase.from('engineer_profiles').upsert([profile]);
      } catch (err) {
        console.warn('Supabase upsert failed:', err);
      }
    }
    return profile;
  },

  // 2. Licenses
  async getLicenses(): Promise<EngineerLicense[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_licenses').select('*');
        if (!error && data && data.length > 0) return data as EngineerLicense[];
      } catch (err) {
        console.warn('Supabase fetch licenses failed:', err);
      }
    }
    return getStored(KEYS.LICENSES, INITIAL_ENGINEER_LICENSES);
  },

  async saveLicenses(licenses: EngineerLicense[]): Promise<EngineerLicense[]> {
    setStored(KEYS.LICENSES, licenses);
    if (supabase) {
      try {
        await supabase.from('engineer_licenses').upsert(licenses);
      } catch (err) {
        console.warn('Supabase save licenses failed:', err);
      }
    }
    return licenses;
  },

  // 3. Certificates
  async getCertificates(): Promise<EngineerCertificate[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_certificates').select('*');
        if (!error && data && data.length > 0) return data as EngineerCertificate[];
      } catch (err) {
        console.warn('Supabase fetch certificates failed:', err);
      }
    }
    return getStored(KEYS.CERTIFICATES, INITIAL_ENGINEER_CERTIFICATES);
  },

  async saveCertificates(certs: EngineerCertificate[]): Promise<EngineerCertificate[]> {
    setStored(KEYS.CERTIFICATES, certs);
    if (supabase) {
      try {
        await supabase.from('engineer_certificates').upsert(certs);
      } catch (err) {
        console.warn('Supabase save certs failed:', err);
      }
    }
    return certs;
  },

  // 4. Portfolio
  async getPortfolio(): Promise<EngineerPortfolioItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_portfolio').select('*');
        if (!error && data && data.length > 0) return data as EngineerPortfolioItem[];
      } catch (err) {
        console.warn('Supabase fetch portfolio failed:', err);
      }
    }
    return getStored(KEYS.PORTFOLIO, INITIAL_PORTFOLIO_ITEMS);
  },

  async savePortfolio(portfolio: EngineerPortfolioItem[]): Promise<EngineerPortfolioItem[]> {
    setStored(KEYS.PORTFOLIO, portfolio);
    if (supabase) {
      try {
        await supabase.from('engineer_portfolio').upsert(portfolio);
      } catch (err) {
        console.warn('Supabase save portfolio failed:', err);
      }
    }
    return portfolio;
  },

  // 5. Availability
  async getAvailability(): Promise<EngineerAvailability> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_availability').select('*').single();
        if (!error && data) return data as EngineerAvailability;
      } catch (err) {
        console.warn('Supabase fetch availability failed:', err);
      }
    }
    return getStored(KEYS.AVAILABILITY, INITIAL_AVAILABILITY);
  },

  async saveAvailability(availability: EngineerAvailability): Promise<EngineerAvailability> {
    setStored(KEYS.AVAILABILITY, availability);
    if (supabase) {
      try {
        await supabase.from('engineer_availability').upsert([{ id: 'eng_avail_default', ...availability }]);
      } catch (err) {
        console.warn('Supabase save availability failed:', err);
      }
    }
    return availability;
  },

  // 6 & 7. Bookings & Accept/Reject
  async getBookings(): Promise<EngineerBooking[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_bookings').select('*');
        if (!error && data && data.length > 0) return data as EngineerBooking[];
      } catch (err) {
        console.warn('Supabase fetch bookings failed:', err);
      }
    }
    return getStored(KEYS.BOOKINGS, MOCK_BOOKINGS);
  },

  async saveBookings(bookings: EngineerBooking[]): Promise<EngineerBooking[]> {
    setStored(KEYS.BOOKINGS, bookings);
    if (supabase) {
      try {
        await supabase.from('engineer_bookings').upsert(bookings);
      } catch (err) {
        console.warn('Supabase save bookings failed:', err);
      }
    }
    return bookings;
  },

  // 8. Chat Messages
  async getChatMessages(): Promise<EngineerChatMessage[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_chat').select('*').order('timestamp', { ascending: true });
        if (!error && data && data.length > 0) return data as EngineerChatMessage[];
      } catch (err) {
        console.warn('Supabase fetch chat failed:', err);
      }
    }
    return getStored(KEYS.CHAT, INITIAL_CHAT_MESSAGES);
  },

  async saveChatMessages(messages: EngineerChatMessage[]): Promise<EngineerChatMessage[]> {
    setStored(KEYS.CHAT, messages);
    if (supabase) {
      try {
        await supabase.from('engineer_chat').upsert(messages);
      } catch (err) {
        console.warn('Supabase save chat failed:', err);
      }
    }
    return messages;
  },

  // 9. Quotations
  async getQuotations(): Promise<EngineerQuotation[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_quotations').select('*');
        if (!error && data && data.length > 0) return data as EngineerQuotation[];
      } catch (err) {
        console.warn('Supabase fetch quotations failed:', err);
      }
    }
    return getStored(KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
  },

  async saveQuotations(quotations: EngineerQuotation[]): Promise<EngineerQuotation[]> {
    setStored(KEYS.QUOTATIONS, quotations);
    if (supabase) {
      try {
        await supabase.from('engineer_quotations').upsert(quotations);
      } catch (err) {
        console.warn('Supabase save quotations failed:', err);
      }
    }
    return quotations;
  },

  // 10. Earnings
  async getEarnings(): Promise<EngineerEarningRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_earnings').select('*');
        if (!error && data && data.length > 0) return data as EngineerEarningRecord[];
      } catch (err) {
        console.warn('Supabase fetch earnings failed:', err);
      }
    }
    return getStored(KEYS.EARNINGS, INITIAL_EARNINGS);
  },

  async saveEarnings(earnings: EngineerEarningRecord[]): Promise<EngineerEarningRecord[]> {
    setStored(KEYS.EARNINGS, earnings);
    if (supabase) {
      try {
        await supabase.from('engineer_earnings').upsert(earnings);
      } catch (err) {
        console.warn('Supabase save earnings failed:', err);
      }
    }
    return earnings;
  },

  // 11. Reviews
  async getReviews(): Promise<EngineerReview[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('engineer_reviews').select('*');
        if (!error && data && data.length > 0) return data as EngineerReview[];
      } catch (err) {
        console.warn('Supabase fetch reviews failed:', err);
      }
    }
    return getStored(KEYS.REVIEWS, MOCK_REVIEWS);
  },

  async saveReviews(reviews: EngineerReview[]): Promise<EngineerReview[]> {
    setStored(KEYS.REVIEWS, reviews);
    if (supabase) {
      try {
        await supabase.from('engineer_reviews').upsert(reviews);
      } catch (err) {
        console.warn('Supabase save reviews failed:', err);
      }
    }
    return reviews;
  },
};
