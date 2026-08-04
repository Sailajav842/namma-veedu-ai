import { 
  Project, 
  UserProfile, 
  EngineerProfile, 
  EngineerBooking, 
  EngineerReview, 
  NotificationItem, 
  MaterialMarketPrice 
} from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_customer_1',
    email: 'karthik.s@example.com',
    name: 'Karthik Subramanian',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    organization: 'Anna Nagar Homeowners Union',
    phone: '+91 98401 23456',
    createdAt: '2026-01-15T08:00:00Z',
    lastLoginAt: '2026-07-28T09:00:00Z',
  },
  {
    id: 'usr_engineer_1',
    email: 'arumugam.pe@tn-engineers.in',
    name: 'Er. K. Arumugam, B.E., M.E. (Struct)',
    role: 'engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    licenseNumber: 'TN-PE-2018-0842',
    organization: 'Arumugam Structural & Civil Consultants (Chennai)',
    phone: '+91 94440 56789',
    createdAt: '2025-11-10T08:00:00Z',
    lastLoginAt: '2026-07-28T09:15:00Z',
  },
  {
    id: 'usr_admin_1',
    email: 'admin@buildai-tn.in',
    name: 'S. Rajendran (TN Platform Admin)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    organization: 'TN Housing & Civil Platform Division',
    phone: '+91 98940 11223',
    createdAt: '2025-08-01T08:00:00Z',
    lastLoginAt: '2026-07-28T09:20:00Z',
  },
];

export const MOCK_ENGINEERS: EngineerProfile[] = [
  {
    id: 'eng_001',
    name: 'Er. K. Arumugam, B.E., M.E. (Struct)',
    licenseNumber: 'TN-PE-2018-0842',
    specialization: 'Individual House & Duplex Frame Design (Vastu Compliant)',
    yearsExperience: 16,
    hourlyRate: 1200, // ₹1,200 per consultation
    rating: 4.9,
    reviewCount: 58,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Senior Civil & Structural Engineer registered with Tamil Nadu PWD. Specialist in G+2 Individual Houses, Vastu Shastra orientation, and soil pile foundations in Chennai & Chengalpattu.',
    isVerified: true,
    completedProjects: 112,
    location: 'Chennai (Anna Nagar & OMR)',
    availability: 'Available Today',
    phone: '+919444056789',
    email: 'arumugam.pe@tn-engineers.in',
    issuingAuthority: 'Tamil Nadu Licensed Structural Engineers Association',
  },
  {
    id: 'eng_002',
    name: 'Er. S. Palanisamy, M.Tech (Civil)',
    licenseNumber: 'TN-PE-2019-1420',
    specialization: 'Luxury Villas & Courtyard Houses (Kovai Style)',
    yearsExperience: 14,
    hourlyRate: 1500,
    rating: 4.9,
    reviewCount: 47,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Experienced Architect & Structural Consultant in Coimbatore & Tiruppur. Expert in eco-breeze ventilation, traditional Tamil Nadu courtyard homes, and solar roofing.',
    isVerified: true,
    completedProjects: 89,
    location: 'Coimbatore & Tiruppur',
    availability: 'Available Tomorrow',
    phone: '+919842233445',
    email: 'palanisamy.covai@gmail.com',
    issuingAuthority: 'Coimbatore Civil Engineers Guild',
  },
  {
    id: 'eng_003',
    name: 'Er. M. Muthukumar, B.E. (Civil)',
    licenseNumber: 'TN-PE-2020-0311',
    specialization: 'Multi-Portion Rental Buildings & Commercial Shops',
    yearsExperience: 12,
    hourlyRate: 1000,
    rating: 4.8,
    reviewCount: 39,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    bio: 'Madurai & Dindigul based structural expert for high-yield multi-family rental units, stilt parking design, and local municipal plan approvals.',
    isVerified: true,
    completedProjects: 74,
    location: 'Madurai & Dindigul',
    availability: 'Available Today',
    phone: '+919789012345',
    email: 'muthu.engg.mdu@gmail.com',
    issuingAuthority: 'Madurai Corporation Licensed Engineers Cell',
  },
  {
    id: 'eng_004',
    name: 'Er. N. Vijaykumar, M.E. (Structural)',
    licenseNumber: 'TN-PE-2017-0951',
    specialization: 'Steel Truss & Earth-Sustain Bricks (Salem & Erode)',
    yearsExperience: 15,
    hourlyRate: 1100,
    rating: 4.9,
    reviewCount: 52,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    bio: 'Specialist in Salem chamber red brick masonry load bearing walls, M-Sand mortar strength testing, and cost-optimized house blueprints.',
    isVerified: true,
    completedProjects: 96,
    location: 'Salem & Erode',
    availability: 'Available in 2 Days',
    phone: '+919443211223',
    email: 'vijay.salem.engineers@gmail.com',
    issuingAuthority: 'Salem District Civil Engineers Council',
  },
  {
    id: 'eng_005',
    name: 'Er. Anandhi Soundararajan, B.Arch, M.E.',
    licenseNumber: 'TN-PE-2021-2041',
    specialization: 'Modern Villa Elevations & Vastu Interior Planning',
    yearsExperience: 10,
    hourlyRate: 1300,
    rating: 5.0,
    reviewCount: 41,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Leading female architect and structural designer in Tiruchirappalli (Trichy) & Thanjavur. Known for elegant exterior 3D elevations and natural lighting design.',
    isVerified: true,
    completedProjects: 62,
    location: 'Tiruchirappalli (Trichy) & Thanjavur',
    availability: 'Available Today',
    phone: '+919894455667',
    email: 'anandhi.trichy.arch@gmail.com',
    issuingAuthority: 'Trichy Local Planning Authority (LPA)',
  },
  {
    id: 'eng_006',
    name: 'Er. V. Jayakumar, B.E., M.I.E.',
    licenseNumber: 'TN-PE-2016-0105',
    specialization: 'Foundation Design in Coastal Clay (Tirunelveli & Kanyakumari)',
    yearsExperience: 18,
    hourlyRate: 1400,
    rating: 4.8,
    reviewCount: 65,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Senior Structural Auditor in Tirunelveli & Kanyakumari. Expert in wind uplift shear walls for coastal winds and underground sump water tanks.',
    isVerified: true,
    completedProjects: 135,
    location: 'Tirunelveli & Kanyakumari',
    availability: 'Available Tomorrow',
    phone: '+919442188990',
    email: 'jayakumar.tvl@gmail.com',
    issuingAuthority: 'Institution of Engineers India (TN Chapter)',
  }
];

export const MOCK_BOOKINGS: EngineerBooking[] = [
  {
    id: 'bk_001',
    customerId: 'usr_customer_1',
    customerName: 'Karthik Subramanian',
    engineerId: 'eng_001',
    engineerName: 'Er. K. Arumugam, B.E., M.E. (Struct)',
    housePlanId: 'prj_001',
    housePlanTitle: '2 BHK Vastu Duplex House (Anna Nagar, Chennai)',
    bookingDate: '2026-08-02',
    timeSlot: '10:00 AM - 11:30 AM IST',
    serviceType: 'Full PE Structural Stamp',
    status: 'confirmed',
    feeUSD: 3500, // ₹3,500
    notes: 'Chennai Corporation Plan approval and Vastu Agni Moolai kitchen check.',
    createdAt: '2026-07-25T14:30:00Z',
  }
];

export const MOCK_REVIEWS: EngineerReview[] = [
  {
    id: 'rev_101',
    engineerId: 'eng_001',
    engineerName: 'Er. K. Arumugam, B.E., M.E.',
    customerName: 'Karthik Subramanian',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    comment: 'Er. Arumugam checked our plot in Anna Nagar, verified soil load capacity, and provided the Tamil Nadu PWD structural approval stamp in 2 days!',
    projectTitle: '2 BHK Vastu Duplex House (Chennai)',
    createdAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 'rev_102',
    engineerId: 'eng_002',
    engineerName: 'Er. S. Palanisamy',
    customerName: 'Venkatraman C.',
    customerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    rating: 5,
    comment: 'Great traditional Kovai courtyard house design with perfect ventilation. Highly professional consultation!',
    projectTitle: 'Coimbatore Courtyard Villa',
    createdAt: '2026-07-10T15:20:00Z',
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    title: 'TN Structural Approval Issued',
    message: 'Er. K. Arumugam has verified and digitally stamped 2 BHK Vastu Duplex House in Chennai.',
    type: 'approval',
    isRead: false,
    createdAt: '2026-07-28T08:30:00Z',
    linkTab: 'saved_plans',
  },
  {
    id: 'notif_002',
    title: 'Tamil Nadu Material Price Alert',
    message: 'Cement prices in Chennai & Coimbatore updated: UltraTech Cement ₹410/bag, M-Sand ₹55/cu ft.',
    type: 'system',
    isRead: false,
    createdAt: '2026-07-27T16:20:00Z',
    linkTab: 'material_prices',
  }
];

export const MOCK_MATERIAL_PRICES: MaterialMarketPrice[] = [
  { id: 'mp_1', name: 'UltraTech / Ramco OPC 53 Grade Cement', category: 'Structural', unit: '50kg Bag', currentPriceUSD: 410, trend: 'stable', trendPercent: 0.0, sustainabilityGrade: 'A', regionalIndex: 'Tamil Nadu Index (Chennai / Kovai)' },
  { id: 'mp_2', name: 'JSW / TATA Tiscon Fe-550D TMT Rebar Bars', category: 'Structural', unit: 'kg', currentPriceUSD: 68, trend: 'down', trendPercent: -1.5, sustainabilityGrade: 'A+', regionalIndex: 'Tamil Nadu Index (Trichy / Madurai)' },
  { id: 'mp_3', name: 'Manufactured Sand (M-Sand) for Concrete', category: 'Masonry', unit: 'cu ft', currentPriceUSD: 55, trend: 'stable', trendPercent: 0.0, sustainabilityGrade: 'A+', regionalIndex: 'Salem / Erode Quarries' },
  { id: 'mp_4', name: 'Plastering Sand (P-Sand) Smooth Finish', category: 'Masonry', unit: 'cu ft', currentPriceUSD: 65, trend: 'up', trendPercent: 1.1, sustainabilityGrade: 'A', regionalIndex: 'Tamil Nadu Central Zone' },
  { id: 'mp_5', name: 'Chamber Red Clay Bricks (First Class)', category: 'Masonry', unit: 'piece', currentPriceUSD: 11, trend: 'stable', trendPercent: 0.0, sustainabilityGrade: 'A', regionalIndex: 'Namakkal / Karur Kilns' },
  { id: 'mp_6', name: '20mm Coarse Stone Aggregate (Jalli)', category: 'Structural', unit: 'cu ft', currentPriceUSD: 42, trend: 'down', trendPercent: -0.8, sustainabilityGrade: 'A', regionalIndex: 'Krishnagiri / Dharmapuri' },
  { id: 'mp_7', name: 'Asian Paints Apex Exterior Emulsion', category: 'Finishing', unit: 'Liter', currentPriceUSD: 380, trend: 'stable', trendPercent: 0.0, sustainabilityGrade: 'A+', regionalIndex: 'Tamil Nadu Retail' },
  { id: 'mp_8', name: 'Tamil Nadu Skilled Mason Daily Wage', category: 'Labor & Permits', unit: 'day (per head)', currentPriceUSD: 950, trend: 'up', trendPercent: 2.0, sustainabilityGrade: 'A', regionalIndex: 'TN Labour Board Rates' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_001',
    title: '2 BHK Vastu Duplex House (Anna Nagar, Chennai)',
    description: 'A modern 2-story Vastu compliant Tamil Nadu residence featuring East-facing entrance, Kanni Moolai master bedroom, Agni Moolai kitchen, and rainwater sump tank.',
    buildingType: 'residential_villa',
    style: 'modern_minimalist',
    customerProfileId: 'usr_customer_1',
    customerName: 'Karthik Subramanian',
    customerEmail: 'karthik.s@example.com',
    assignedEngineerId: 'usr_engineer_1',
    assignedEngineerName: 'Er. K. Arumugam, B.E., M.E.',
    location: 'Chennai, Tamil Nadu (Zone 8 - Anna Nagar)',
    landWidthFt: 30,
    landLengthFt: 40,
    totalBudgetUSD: 3800000, // ₹38,00,000 (₹38 Lakhs)
    status: 'under_engineer_review',
    createdAt: '2026-06-12T10:30:00Z',
    updatedAt: '2026-07-27T16:45:00Z',
    blueprint: {
      version: 'v2.1',
      totalAreaSqFt: 1800, // 4.13 Cents
      floors: 2,
      gridColumns: 6,
      gridRows: 5,
      rooms: [
        { id: 'r1', name: 'Living Hall (Eesanya Moolai Entrance)', type: 'living', areaSqFt: 320, widthFt: 16, lengthFt: 20, x: 0, y: 0, color: '#10b981', features: ['East facing main doorway', 'Teak wood main frame', 'Vastu compliant seating'] },
        { id: 'r2', name: 'Agni Moolai Kitchen (SE)', type: 'kitchen', areaSqFt: 180, widthFt: 12, lengthFt: 15, x: 16, y: 0, color: '#f59e0b', features: ['East facing cooking stove platform', 'Granite countertop', 'Utility space wash area'] },
        { id: 'r3', name: 'Master Bedroom (Kanni Moolai SW)', type: 'bedroom', areaSqFt: 240, widthFt: 15, lengthFt: 16, x: 0, y: 20, color: '#8b5cf6', features: ['SW corner wardrobe position', 'Attached bath & toilet'] },
        { id: 'r4', name: 'Pooja Room (NE Corner)', type: 'office', areaSqFt: 60, widthFt: 6, lengthFt: 10, x: 28, y: 0, color: '#ec4899', features: ['Marble flooring', 'North-East auspicious position'] },
        { id: 'r5', name: 'First Floor Guest Bedroom', type: 'bedroom', areaSqFt: 220, widthFt: 14, lengthFt: 15, x: 15, y: 20, color: '#3b82f6', features: ['Balcony access', 'Cross ventilation windows'] },
        { id: 'r6', name: 'Car Parking & Sump Tank', type: 'garage', areaSqFt: 200, widthFt: 10, lengthFt: 20, x: 30, y: 20, color: '#64748b', features: ['12,000 Litres underground RCC sump', 'Covered portico parking'] }
      ],
      structuralNotes: [
        'Isolated RCC column footing designed for Chennai coastal clay soil composition.',
        'Fe-550D TMT reinforcement bars with M25 grade concrete.',
        'Anti-termite treatment ground level slab.'
      ],
      hvacNotes: [
        '5-Star inverter AC piping in all bedrooms.',
        'Cross-ventilation windows facing North & East.'
      ],
      electricalNotes: [
        '3-Phase TNEB connection wiring with Finolex / Havells copper cables.',
        'Solar rooftop inverter backup wiring.'
      ],
      solarFeasibilityScore: 92,
      rainwaterHarvestingCapable: true,
    },
    materials: [
      { id: 'm1', category: 'Structural', name: 'UltraTech OPC 53 Grade Cement', quantity: 450, unit: 'bags', estimatedUnitPrice: 410, totalCost: 184500, leadTimeDays: 2, sustainabilityGrade: 'A' },
      { id: 'm2', category: 'Structural', name: 'JSW Fe-550D TMT Steel Bars', quantity: 4200, unit: 'kg', estimatedUnitPrice: 68, totalCost: 285600, leadTimeDays: 3, sustainabilityGrade: 'A+' },
      { id: 'm3', category: 'Masonry', name: 'M-Sand Masonry Mortar & AAC Blocks', quantity: 2400, unit: 'cu ft', estimatedUnitPrice: 55, totalCost: 132000, leadTimeDays: 2, sustainabilityGrade: 'A+' },
      { id: 'm4', category: 'Masonry', name: 'First Quality Chamber Red Bricks', quantity: 18000, unit: 'pieces', estimatedUnitPrice: 11, totalCost: 198000, leadTimeDays: 5, sustainabilityGrade: 'A' },
      { id: 'm5', category: 'Finishing', name: 'Vitrified Tiles (2x2 ft) & Asian Emulsion Paint', quantity: 1800, unit: 'sq ft', estimatedUnitPrice: 120, totalCost: 216000, leadTimeDays: 5, sustainabilityGrade: 'A' },
      { id: 'm6', category: 'Labor & Permits', name: 'Tamil Nadu Mason & Helper Daily Wages', quantity: 1, unit: 'contract', estimatedUnitPrice: 950000, totalCost: 950000, leadTimeDays: 90, sustainabilityGrade: 'A' },
    ],
    engineeringChecks: [
      { id: 'c1', category: 'Seismic Load', status: 'passed', score: 94, title: 'Zone 3 Seismic Resistance (TN Coast)', description: 'RCC frame beam-column joints meet Bureau of Indian Standards IS 1893:2016 specifications.' },
      { id: 'c2', category: 'Wind Shear', status: 'passed', score: 96, title: '140 km/h Cyclone Wind Tolerance', description: 'Roof parapet wall ties and terrace water tank anchor certified for coastal cyclone forces.' },
      { id: 'c3', category: 'Foundation Soil Capacity', status: 'passed', score: 88, title: 'Safe Soil Bearing Capacity (SBC 180 kN/m2)', description: 'Isolated footings with 5ft excavation depth approved.' },
      { id: 'c4', category: 'Zoning Clearance', status: 'passed', score: 100, title: 'CMDA / TN Municipal Setback Compliance', description: 'Rear 5ft, side 3ft, and front 5ft setback fully compliant with TN Combined Development Building Rules.' },
    ],
    timeline: [
      { phase: 'Site Survey & Vastu Plan Approval', durationWeeks: 2, startWeek: 1, endWeek: 2, status: 'completed', keyMilestones: ['Plot measurement scan', 'Vastu orientation verified', 'CMDA plan draft complete'] },
      { phase: 'Foundation Excavation & RCC Footing', durationWeeks: 3, startWeek: 3, endWeek: 5, status: 'in_progress', keyMilestones: ['Underground sump tank RCC pour', 'Column starter casting'] },
      { phase: 'Brickwork & Plastering', durationWeeks: 6, startWeek: 6, endWeek: 11, status: 'upcoming', keyMilestones: ['Chamber brick walls', 'Electrical conduit laying', 'Inner smooth plastering'] },
      { phase: 'Flooring, Plumbing & Painting', durationWeeks: 4, startWeek: 12, endWeek: 15, status: 'upcoming', keyMilestones: ['Vitrified tile laying', 'Sanitary fittings', 'House warming (Grihap प्रवेश)'] },
    ],
    revisions: [
      { id: 'rev_1', authorId: 'usr_customer_1', authorName: 'Karthik Subramanian', authorRole: 'customer', timestamp: '2026-06-18T14:20:00Z', promptText: 'Ensure Kitchen is strictly in Agni Moolai (South East) with East-facing stove position', changeSummary: 'Aligned kitchen cooking stove platform to East according to Vastu Shastra.', blueprintVersion: 'v2.0' }
    ],
    estimatedTotalCostUSD: 3650000, // ₹36,50,000 (₹36.5 Lakhs)
    costBreakdown: {
      materials: 1950000,
      labor: 1200000,
      permitsAndFees: 200000,
      contingency: 300000,
    },
    sustainabilityRating: 94,
    estimatedDurationMonths: 5,
  }
];
