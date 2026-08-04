export type UserRole = 'customer' | 'engineer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  licenseNumber?: string; // For Engineers
  organization?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
}

export type BuildingType = 
  | 'residential_villa' 
  | 'multi_family_apartment' 
  | 'commercial_office' 
  | 'retail_store' 
  | 'industrial_warehouse' 
  | 'eco_tiny_home';

export type ArchitecturalStyle = 
  | 'modern_minimalist' 
  | 'mediterranean' 
  | 'industrial_loft' 
  | 'eco_sustainable' 
  | 'classic_colonial' 
  | 'contemporary_glass';

export interface RoomSpec {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'living' | 'kitchen' | 'office' | 'garage' | 'balcony' | 'utility' | 'dining' | 'staircase' | 'hallway' | 'courtyard' | 'garden' | 'terrace';
  areaSqFt: number;
  widthFt: number;
  lengthFt: number;
  x: number; // grid coordinate in ft
  y: number; // grid coordinate in ft
  floor?: number; // 1 = Ground Floor, 2 = First Floor, etc.
  color: string;
  features: string[];
  doorPosition?: string;
  windowPosition?: string;
  wallCoordinates?: { x: number; y: number; w: number; h: number };
  stairCoordinates?: { x: number; y: number; w: number; h: number; direction?: string };
}

export interface MaterialItem {
  id: string;
  category: 'Structural' | 'Masonry' | 'Roofing' | 'MEP Plumbing' | 'MEP Electrical' | 'Finishing' | 'Labor & Permits';
  name: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  totalCost: number;
  leadTimeDays: number;
  sustainabilityGrade: 'A+' | 'A' | 'B' | 'C';
}

export interface EngineeringCheck {
  id: string;
  category: 'Seismic Load' | 'Wind Shear' | 'Foundation Soil Capacity' | 'Fire Rating' | 'Egress & Accessibility' | 'Zoning Clearance';
  status: 'passed' | 'warning' | 'critical' | 'pending';
  score: number; // 0 - 100
  title: string;
  description: string;
  recommendation?: string;
}

export interface TimelinePhase {
  phase: string;
  durationWeeks: number;
  startWeek: number;
  endWeek: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  keyMilestones: string[];
}

export interface BlueprintData {
  version: string;
  totalAreaSqFt: number;
  floors: number;
  gridColumns: number;
  gridRows: number;
  rooms: RoomSpec[];
  structuralNotes: string[];
  hvacNotes: string[];
  electricalNotes: string[];
  solarFeasibilityScore: number;
  rainwaterHarvestingCapable: boolean;
}

export type ProjectStatus = 'draft' | 'under_engineer_review' | 'changes_requested' | 'engineer_approved' | 'in_construction' | 'completed';

export interface EngineeringStamp {
  engineerId: string;
  engineerName: string;
  licenseNumber: string;
  stampedAt: string;
  signatureHash: string;
  notes: string;
}

export interface ProjectRevision {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  timestamp: string;
  promptText: string;
  changeSummary: string;
  blueprintVersion: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  buildingType: BuildingType;
  style: ArchitecturalStyle;
  customerProfileId: string;
  customerName: string;
  customerEmail: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  location: string;
  landWidthFt: number;
  landLengthFt: number;
  totalBudgetUSD: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  
  // AI Generated / Calculated fields
  blueprint: BlueprintData;
  materials: MaterialItem[];
  engineeringChecks: EngineeringCheck[];
  timeline: TimelinePhase[];
  engineeringStamp?: EngineeringStamp;
  revisions: ProjectRevision[];
  
  // Overall Summary Metrics
  estimatedTotalCostUSD: number;
  costBreakdown: {
    materials: number;
    labor: number;
    permitsAndFees: number;
    contingency: number;
  };
  sustainabilityRating: number; // 0 - 100
  estimatedDurationMonths: number;
}

export interface RoomDimensionDetail {
  roomName: string;
  type: string;
  lengthFt: number;
  widthFt: number;
  areaSqFt: number;
  floor?: number;
  position?: string;
  doorPosition?: string;
  windowPosition?: string;
  wallCoordinates?: { x: number; y: number; w: number; h: number };
  stairCoordinates?: { x: number; y: number; w: number; h: number; direction?: string };
}

export interface ValidationCheck {
  rule?: string;
  name?: string;
  passed?: boolean;
  status?: string;
  message?: string;
  details?: string;
}

export interface FloorPlanScores {
  spaceUtilizationScore?: number; // e.g. 96
  structuralEfficiencyScore?: number; // e.g. 94
  vastuScore?: number; // e.g. 96
  ventilationScore?: number; // e.g. 95
  naturalLightingScore?: number; // e.g. 93
  constructionPracticalityScore?: number; // e.g. 92
  overallScore?: number; // e.g. 95 (out of 100)
  
  // Legacy fields fallback
  spaceEfficiencyScore?: number;
  constructionCostRating?: number;
  futureExpansionScore?: number;
  overallPlanRating?: number;
}

export interface BudgetOptimizationDetail {
  totalEstimatedCostUSD: number;
  costSavingsPercentage?: number;
  costBreakdown: {
    materials: number;
    labor: number;
    permitsAndFees: number;
    contingency: number;
  };
  optimizationTips: string[];
}

export interface AIPlanRequest {
  plotLength: number;
  plotWidth: number;
  budget: number;
  floors: number;
  houseType: string; // 'ground_only' | 'ground_first' | 'ground_two' | 'ground_three' | 'villa' | 'duplex' | 'commercial' | 'apartment'
  bedrooms: number;
  bathrooms: number;
  parking: string;
  balcony: string;
  garden: string;
  style: string;
  vastuEnabled?: boolean;
  
  // Optional / Legacy Fields
  title?: string;
  location?: string;
  specialRequirements?: string;
  buildingType?: BuildingType;
  landWidthFt?: number;
  landLengthFt?: number;
  budgetUSD?: number;
  desiredRoomsCount?: number;
  floorsCount?: number;
}

export interface TNCostEstimateINR {
  cement: number;
  steel: number;
  bricks: number;
  sand: number;
  electrical: number;
  plumbing: number;
  flooring: number;
  paint: number;
  materialCost: number;
  labourCost: number;
  totalEstimatedCost: number;
}

export interface AIPlanResponse {
  roomArrangement: string;
  roomDimensions: RoomDimensionDetail[];
  constructionSuggestions: string[];
  budgetOptimization: BudgetOptimizationDetail;
  vastuSuggestions: string[];
  scores?: FloorPlanScores;
  validationChecks?: ValidationCheck[];
  costEstimateINR?: TNCostEstimateINR;

  // Blueprint & Analysis Data
  blueprint: BlueprintData;
  materials: MaterialItem[];
  engineeringChecks: EngineeringCheck[];
  timeline: TimelinePhase[];
  estimatedTotalCostUSD: number;
  estimatedCost?: number;
  costBreakdown: {
    materials: number;
    labor: number;
    permitsAndFees: number;
    contingency: number;
  };
  sustainabilityRating: number;
  estimatedDurationMonths: number;
  aiFeasibilitySummary: string;
}

export type CustomerTab = 
  | 'landing'
  | 'overview'
  | 'profile'
  | 'create_plan'
  | 'saved_plans'
  | 'ai_generator'
  | 'cost_estimator'
  | 'material_prices'
  | 'browse_engineers'
  | 'book_engineer'
  | 'reviews'
  | 'notifications';

export interface EngineerProfile {
  id: string;
  name: string;
  licenseNumber: string;
  specialization: string;
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
  completedProjects: number;
  location: string;
  availability: string;
  phone?: string;
  email?: string;
  issuingAuthority?: string;
}

export interface EngineerLicense {
  id: string;
  licenseNumber: string;
  jurisdiction: string; // e.g. California, Texas
  licenseType: string; // PE Structural, PE Civil, SE
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'pending_verification' | 'expired';
  documentName: string;
  documentUrl?: string;
  fileSize?: string;
}

export interface EngineerCertificate {
  id: string;
  title: string;
  issuingOrganization: string; // e.g., NCEES, ASCE, ICC
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  documentName: string;
  documentUrl?: string;
  category: 'Structural' | 'Seismic' | 'Safety' | 'Environmental' | 'CAD/BIM';
}

export interface EngineerPortfolioItem {
  id: string;
  title: string;
  buildingType: BuildingType;
  location: string;
  completionYear: number;
  areaSqFt: number;
  imageUrl: string;
  description: string;
  highlights: string[];
  clientName?: string;
  costUSD?: number;
}

export interface EngineerQuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceUSD: number;
  totalUSD: number;
}

export interface EngineerQuotation {
  id: string;
  quotationNumber: string;
  projectId?: string;
  projectTitle: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  validUntil: string;
  items: EngineerQuotationItem[];
  subtotalUSD: number;
  taxRatePercent: number;
  taxUSD: number;
  totalUSD: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'paid';
  notes?: string;
}

export interface EngineerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'engineer' | 'customer' | 'system';
  recipientId: string;
  recipientName: string;
  projectId?: string;
  projectTitle?: string;
  messageText: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: string }[];
  isRead: boolean;
}

export interface EngineerAvailability {
  isAcceptingBookings: boolean;
  emergencyAuditAvailable: boolean;
  consultationSlotMinutes: number;
  weeklySchedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    active: boolean;
    slots: string[]; // e.g. ["09:00 AM", "11:00 AM", "02:00 PM"]
  }[];
}

export interface EngineerEarningRecord {
  id: string;
  bookingId?: string;
  clientName: string;
  serviceType: string;
  amountUSD: number;
  date: string;
  status: 'completed' | 'in_escrow' | 'payout_processing' | 'paid_out';
  payoutMethod: string;
}

export interface EngineerBooking {
  id: string;
  customerId: string;
  customerName: string;
  engineerId: string;
  engineerName: string;
  housePlanId: string;
  housePlanTitle: string;
  bookingDate: string;
  timeSlot: string;
  serviceType: 'Full PE Structural Stamp' | 'Foundation & Soil Assessment' | 'Zoning & Code Audit' | '1-on-1 Consultation Call';
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  feeUSD: number;
  notes?: string;
  createdAt: string;
}

export interface EngineerReview {
  id: string;
  bookingId?: string;
  engineerId: string;
  engineerName: string;
  customerName: string;
  customerAvatar: string;
  rating: number; // 1-5
  comment: string;
  projectTitle: string;
  createdAt: string;
  verifiedBooking?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'approval' | 'revision' | 'warning' | 'system';
  isRead: boolean;
  createdAt: string;
  linkTab?: CustomerTab;
}

export interface MaterialMarketPrice {
  id: string;
  name: string;
  category: 'Structural' | 'Masonry' | 'Roofing' | 'MEP Plumbing' | 'MEP Electrical' | 'Finishing' | 'Labor & Permits';
  unit: string;
  currentPriceUSD: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  sustainabilityGrade: 'A+' | 'A' | 'B' | 'C';
  regionalIndex: string;
}

