import React, { useState } from 'react';
import { 
  X, 
  FolderTree, 
  Terminal, 
  Key, 
  FileText, 
  GitCommit, 
  Database, 
  Copy, 
  Check,
  Code
} from 'lucide-react';

interface DevDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDocsModal: React.FC<DevDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'schema' | 'env' | 'install' | 'readme' | 'git'>('schema');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const supabaseSqlSchema = `-- ====================================================================
-- NAMMA VEEDU AI - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Tables: users, engineers, house_plans, rooms, bookings, reviews,
--         material_prices, notifications, saved_designs
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'engineer', 'admin')),
    phone VARCHAR(50),
    avatar_url TEXT,
    organization VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. ENGINEERS TABLE
CREATE TABLE engineers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL DEFAULT 'Structural Civil Engineering',
    years_experience INT NOT NULL DEFAULT 5 CHECK (years_experience >= 0),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 150.00 CHECK (hourly_rate >= 0),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. HOUSE_PLANS TABLE
CREATE TABLE house_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    building_type VARCHAR(100) NOT NULL CHECK (building_type IN ('residential_villa', 'multi_family_apartment', 'commercial_office', 'retail_store', 'industrial_warehouse', 'eco_tiny_home')),
    architectural_style VARCHAR(100) NOT NULL CHECK (architectural_style IN ('modern_minimalist', 'mediterranean', 'industrial_loft', 'eco_sustainable', 'classic_colonial', 'contemporary_glass')),
    location VARCHAR(255) NOT NULL,
    land_width_ft NUMERIC(10, 2) NOT NULL CHECK (land_width_ft > 0),
    land_length_ft NUMERIC(10, 2) NOT NULL CHECK (land_length_ft > 0),
    total_area_sq_ft NUMERIC(12, 2) GENERATED ALWAYS AS (land_width_ft * land_length_ft) STORED,
    floors_count INT NOT NULL DEFAULT 1 CHECK (floors_count BETWEEN 1 AND 20),
    budget_usd NUMERIC(12, 2) NOT NULL CHECK (budget_usd >= 0),
    estimated_cost_usd NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (estimated_cost_usd >= 0),
    sustainability_rating INT NOT NULL DEFAULT 85 CHECK (sustainability_rating BETWEEN 0 AND 100),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_engineer_review', 'changes_requested', 'engineer_approved', 'completed')),
    assigned_engineer_id UUID REFERENCES engineers(id) ON DELETE SET NULL,
    engineering_stamp_hash TEXT,
    stamped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ROOMS TABLE
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    room_type VARCHAR(100) NOT NULL DEFAULT 'living_room',
    width_ft NUMERIC(10, 2) NOT NULL CHECK (width_ft > 0),
    length_ft NUMERIC(10, 2) NOT NULL CHECK (length_ft > 0),
    area_sq_ft NUMERIC(10, 2) GENERATED ALWAYS AS (width_ft * length_ft) STORED,
    floor_number INT NOT NULL DEFAULT 1 CHECK (floor_number >= 1),
    color_code VARCHAR(30) NOT NULL DEFAULT '#3b82f6',
    position_x NUMERIC(10, 2) NOT NULL DEFAULT 0,
    position_y NUMERIC(10, 2) NOT NULL DEFAULT 0,
    features TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. BOOKINGS TABLE
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    engineer_id UUID NOT NULL REFERENCES engineers(id) ON DELETE CASCADE,
    house_plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    booking_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
    fee_usd NUMERIC(10, 2) NOT NULL CHECK (fee_usd >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. REVIEWS TABLE
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    engineer_id UUID NOT NULL REFERENCES engineers(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. MATERIAL_PRICES TABLE
CREATE TABLE material_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Structural', 'Masonry', 'Roofing', 'MEP Plumbing', 'MEP Electrical', 'Finishing', 'Labor & Permits')),
    unit VARCHAR(50) NOT NULL,
    base_unit_price NUMERIC(10, 2) NOT NULL CHECK (base_unit_price >= 0),
    current_market_index NUMERIC(5, 2) NOT NULL DEFAULT 1.00 CHECK (current_market_index > 0),
    sustainability_grade VARCHAR(10) NOT NULL DEFAULT 'A' CHECK (sustainability_grade IN ('A+', 'A', 'B', 'C', 'D')),
    region VARCHAR(100) NOT NULL DEFAULT 'US-National',
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'approval', 'revision', 'warning', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. SAVED_DESIGNS TABLE
CREATE TABLE saved_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_house_plan UNIQUE (user_id, house_plan_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineers ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users reading" ON users FOR SELECT USING (true);
CREATE POLICY "Public engineers reading" ON engineers FOR SELECT USING (true);
CREATE POLICY "Users read own house plans" ON house_plans FOR SELECT USING (user_id = auth.uid() OR assigned_engineer_id IN (SELECT id FROM engineers WHERE user_id = auth.uid()));
CREATE POLICY "Customers create house plans" ON house_plans FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public material prices reading" ON material_prices FOR SELECT USING (true);
`;

  const folderStructure = `
buildai-building-planner/
├── .env.example                     # Environment Variables Template
├── .gitignore                        # Git exclusion rules
├── index.html                        # HTML Entry point
├── metadata.json                     # AI Studio Metadata & Server Capabilities
├── package.json                      # Dependencies & NPM scripts (dev, build, start)
├── server.ts                         # Express + Vite backend server (Gemini AI API routes)
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite build configuration with Tailwind CSS v4
└── src/
    ├── main.tsx                      # Client React 19 entry point
    ├── App.tsx                       # Main Application Shell & View Routing
    ├── index.css                     # Global Tailwind CSS imports (@import "tailwindcss")
    ├── types/
    │   └── index.ts                  # TypeScript interfaces (User, Project, Blueprint, Material)
    ├── data/
    │   └── mockData.ts               # Sample users (Customer, Engineer, Admin) & projects
    ├── context/
    │   └── AuthContext.tsx           # Role-based authentication state & session switcher
    ├── services/
    │   └── api.ts                    # Client REST service interfacing with Express server
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx            # Top header navigation with role switcher
    │   │   └── DevDocsModal.tsx      # Project Documentation & Installation guide modal
    │   ├── auth/
    │   │   └── AuthModal.tsx         # Login, Signup (Role-based), Google OAuth, Reset Password
    │   ├── planner/
    │   │   ├── PlannerWizard.tsx     # AI Building Plan Generator Wizard
    │   │   ├── BlueprintCanvas.tsx   # Interactive 2D/3D Floor Plan CAD visualizer & SVG export
    │   │   ├── BOMCalculator.tsx     # Bill of Materials cost & inflation estimation calculator
    │   │   ├── EngineeringChecklist.tsx # Structural load checks & PE engineering stamp approval
    │   │   └── AIChatDrawer.tsx      # AI Architectural & Building Code Assistant
    │   └── dashboards/
    │       ├── CustomerDashboard.tsx # Client portal, milestone timeline, revision manager
    │       ├── EngineerDashboard.tsx # Structural PE review queue, stress analysis, sign-off
    │       └── AdminDashboard.tsx    # User role management, AI token analytics, system logs
`;

  const envExampleContent = `# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
GEMINI_API_KEY="AIzaSyYourSecretGeminiKey"

# APP_URL: Hosted Cloud Run application URL
APP_URL="https://ais-dev-uqc53e2hyysqjr7yjxx2at-545188874270.asia-east1.run.app"

# Supabase Realtime & Auth Credentials
SUPABASE_URL="https://xyzcompany.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Node Environment
NODE_ENV="development"
PORT=3000
`;

  const installSteps = `# Step 1: Clone the Repository
git clone https://github.com/buildai-org/buildai-building-planner.git
cd buildai-building-planner

# Step 2: Install Dependencies
npm install

# Step 3: Configure Environment Variables
cp .env.example .env
# Open .env and insert your GEMINI_API_KEY or SUPABASE_URL if using cloud auth

# Step 4: Run Development Server (Express + Vite on Port 3000)
npm run dev

# Step 5: Build for Production
npm run build

# Step 6: Start Production Server
npm run start
`;

  const readmeContent = `# BuildAI – AI Building Planner

BuildAI is a full-stack, enterprise-grade AI architectural planning and structural civil engineering platform.

## Key Capabilities

- **AI Architectural Generator**: Powered by Gemini 3.6 Flash via server-side Express API, converting land dimensions, architectural styles, and budget constraints into detailed CAD blueprints, itemized Bill of Materials (BOM), and engineering load checklists.
- **Interactive 2D / 3D Blueprint Canvas**: Renders scalable CAD vector floor plans with room color coding, structural walls, columns, doors, windows, and isometric 3D perspective previews.
- **Role-Based Workflows**:
  - **Customer**: Submit design prompts, request AI revisions, track real-time construction milestones.
  - **Civil Engineer (PE)**: Perform structural load analysis (seismic, wind shear, soil bearing), review compliance, apply digital PE Engineering Stamps.
  - **Admin**: Manage user roles, monitor AI token usage, adjust regional zoning parameters.
- **Supabase & Express Backend Architecture**: Clean separation between server-side AI key proxies and client interfaces.
`;

  const gitCommitLog = `commit 7f3a19b2e49a0218b0c24d1a523b18c891a27110
Author: BuildAI Senior Engineer <dev@buildai.io>
Date:   Tue Jul 28 09:22:00 2026 -0700

    feat(core): release BuildAI - AI Building Planner v2.4 PE
    
    - Integrated Gemini 3.6 Flash server-side AI API for CAD blueprint generation
    - Implemented interactive 2D vector CAD & 3D floor plan visualizer with SVG export
    - Added Role-Based Access Control (RBAC) for Customer, Engineer, and Admin dashboards
    - Created Bill of Materials (BOM) cost estimator with inflation adjustment
    - Built PE Civil Engineering compliance checklist & digital engineering stamp approval station
    - Configured Express + Vite production setup with Supabase auth architecture
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-200 transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">BuildAI Project Documentation & Source Blueprint</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Complete setup guide, folder structure, environment config & git logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'schema' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Supabase SQL Schema
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'structure' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> Folder Structure
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'env' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Environment (.env)
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'install' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Installation Steps
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'readme' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> README.md
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'git' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Git Commit Log
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          
          {activeTab === 'schema' && (
            <div>
              <div className="flex items-center justify-between mb-3 font-sans text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Supabase PostgreSQL Schema SQL</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">9 Core Tables: users, engineers, house_plans, rooms, bookings, reviews, material_prices, notifications, saved_designs</p>
                </div>
                <button
                  onClick={() => handleCopy(supabaseSqlSchema, 'sql')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  {copiedIndex === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy SQL DDL</span>
                </button>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-emerald-400 dark:text-emerald-300 border border-slate-800 leading-relaxed overflow-x-auto max-h-[500px]">
                {supabaseSqlSchema}
              </pre>
            </div>
          )}
          
          {activeTab === 'structure' && (
            <div>
              <div className="flex items-center justify-between mb-3 font-sans text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">Full Source Directory Map</span>
                <button
                  onClick={() => handleCopy(folderStructure, 'str')}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5"
                >
                  {copiedIndex === 'str' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Tree</span>
                </button>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-slate-200 dark:text-slate-300 border border-slate-800 leading-relaxed overflow-x-auto">
                {folderStructure}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div>
              <div className="flex items-center justify-between mb-3 font-sans text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">Environment Configuration (.env.example)</span>
                <button
                  onClick={() => handleCopy(envExampleContent, 'env')}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5"
                >
                  {copiedIndex === 'env' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy .env</span>
                </button>
              </div>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-3">
                Place this file at the project root as <code className="text-blue-600 dark:text-blue-400 bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code>. Secrets are safely isolated on the Express backend server.
              </p>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-cyan-400 dark:text-cyan-300 border border-slate-800 leading-relaxed overflow-x-auto">
                {envExampleContent}
              </pre>
            </div>
          )}

          {activeTab === 'install' && (
            <div>
              <div className="flex items-center justify-between mb-3 font-sans text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">CLI Setup & Local Execution Steps</span>
                <button
                  onClick={() => handleCopy(installSteps, 'cli')}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5"
                >
                  {copiedIndex === 'cli' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Commands</span>
                </button>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-green-400 dark:text-green-400 border border-slate-800 leading-relaxed overflow-x-auto">
                {installSteps}
              </pre>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="font-sans space-y-4 text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">BuildAI Platform Specs</h3>
                <button
                  onClick={() => handleCopy(readmeContent, 'rm')}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5 font-mono"
                >
                  {copiedIndex === 'rm' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy README</span>
                </button>
              </div>
              <p className="text-sm">
                BuildAI combines server-side Gemini 3.6 generative intelligence with CAD floor plan visualization and structural engineering stress checks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 text-xs mb-1">Customer Dashboard</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Generate floor plans, prompt custom room changes, track milestone progress.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 text-xs mb-1">Engineer Dashboard</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verify seismic & wind loads, inspect room dimensions, issue digital PE stamps.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-rose-600 dark:text-rose-400 text-xs mb-1">Admin Dashboard</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage user roles, track AI token usage, configure regional building codes.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'git' && (
            <div>
              <div className="flex items-center justify-between mb-3 font-sans text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">Latest Git Commit History</span>
                <button
                  onClick={() => handleCopy(gitCommitLog, 'git')}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs flex items-center gap-1.5"
                >
                  {copiedIndex === 'git' ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Log</span>
                </button>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-yellow-400 dark:text-yellow-300 border border-slate-800 leading-relaxed overflow-x-auto">
                {gitCommitLog}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>BuildAI Architecture Engine • Node.js + Express + React 19 + Tailwind v4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
