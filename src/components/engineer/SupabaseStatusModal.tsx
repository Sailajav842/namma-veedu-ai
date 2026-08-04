import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../services/supabase';
import { Database, ShieldCheck, Check, Copy, Code, Sparkles, ExternalLink } from 'lucide-react';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_SCHEMA = `-- BUILD AI ENGINEER DASHBOARD SUPABASE POSTGRES SCHEMA

-- 1. Engineer Profiles Table
CREATE TABLE IF NOT EXISTS engineer_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  specialization TEXT,
  years_experience INT,
  hourly_rate NUMERIC,
  rating NUMERIC,
  review_count INT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT true,
  completed_projects INT,
  location TEXT,
  availability TEXT,
  phone TEXT,
  email TEXT
);

-- 2. Engineer Licenses Table
CREATE TABLE IF NOT EXISTS engineer_licenses (
  id TEXT PRIMARY KEY,
  license_number TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  license_type TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  document_name TEXT,
  document_url TEXT,
  file_size TEXT
);

-- 3. Engineer Certificates Table
CREATE TABLE IF NOT EXISTS engineer_certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  category TEXT,
  document_name TEXT
);

-- 4. Engineer Portfolio Table
CREATE TABLE IF NOT EXISTS engineer_portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  building_type TEXT,
  location TEXT,
  completion_year INT,
  area_sq_ft NUMERIC,
  image_url TEXT,
  description TEXT,
  highlights JSONB,
  cost_usd NUMERIC
);

-- 5. Engineer Bookings Table
CREATE TABLE IF NOT EXISTS engineer_bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT,
  engineer_id TEXT,
  house_plan_title TEXT,
  booking_date DATE,
  time_slot TEXT,
  service_type TEXT,
  status TEXT DEFAULT 'requested',
  fee_usd NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Engineer Quotations Table
CREATE TABLE IF NOT EXISTS engineer_quotations (
  id TEXT PRIMARY KEY,
  quotation_number TEXT UNIQUE NOT NULL,
  project_title TEXT,
  customer_name TEXT,
  customer_email TEXT,
  created_at DATE,
  valid_until DATE,
  items JSONB,
  subtotal_usd NUMERIC,
  tax_rate_percent NUMERIC,
  tax_usd NUMERIC,
  total_usd NUMERIC,
  status TEXT DEFAULT 'draft',
  notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE engineer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON engineer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON engineer_portfolio FOR SELECT USING (true);
`;

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Supabase Cloud Database Synchronization</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">×</button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Database Engine Connection Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              {isSupabaseConfigured ? 'Connected to Supabase Cloud Postgres' : 'Active Local Persistence Engine'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isSupabaseConfigured 
              ? 'Your Engineer Dashboard is live-connected to Supabase! All profile edits, license uploads, portfolios, bookings, chat messages, quotations, earnings, and reviews sync instantly.'
              : 'The dashboard is running with full persistent client/memory storage fallback. To bind a live Supabase project, populate VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
          </p>
        </div>

        {/* SQL Schema Copy Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-amber-400" />
              <span>Supabase SQL Migration Script</span>
            </h4>

            <button
              onClick={handleCopySchema}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SQL Copied!' : 'Copy Schema SQL'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Supabase Console
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
