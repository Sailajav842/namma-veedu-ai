import React, { useState } from 'react';
import { EngineerLicense } from '../../types';
import { 
  FileCheck2, 
  UploadCloud, 
  ShieldCheck, 
  Trash2, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';

interface LicenseUploadSectionProps {
  licenses: EngineerLicense[];
  onSaveLicenses: (lics: EngineerLicense[]) => void;
}

export const LicenseUploadSection: React.FC<LicenseUploadSectionProps> = ({
  licenses,
  onSaveLicenses,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<EngineerLicense>>({
    licenseNumber: '',
    jurisdiction: 'California',
    licenseType: 'PE Structural',
    issueDate: '',
    expiryDate: '',
    documentName: '',
  });
  const [dragActive, setDragActive] = useState(false);

  const handleAddLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.licenseNumber || !form.jurisdiction) return;

    const newLicense: EngineerLicense = {
      id: `lic_${Date.now()}`,
      licenseNumber: form.licenseNumber || 'PE-89210-CIVIL',
      jurisdiction: form.jurisdiction || 'California',
      licenseType: form.licenseType || 'PE Structural',
      issueDate: form.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: form.expiryDate || '2028-12-31',
      status: 'active',
      documentName: form.documentName || `License_${form.jurisdiction}_${form.licenseNumber}.pdf`,
      fileSize: '2.1 MB',
    };

    onSaveLicenses([newLicense, ...licenses]);
    setIsModalOpen(false);
    setForm({
      licenseNumber: '',
      jurisdiction: 'California',
      licenseType: 'PE Structural',
      issueDate: '',
      expiryDate: '',
      documentName: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this engineering license record?')) {
      onSaveLicenses(licenses.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-amber-400" />
            <span>State Engineering Licenses & Wet Stamps</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload active Professional Engineer (PE) or Structural Engineer (SE) licenses to maintain digital wet seal verification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload New License
        </button>
      </div>

      {/* Upload Drag & Drop Sandbox */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setForm((prev) => ({ ...prev, documentName: file.name }));
            setIsModalOpen(true);
          }
        }}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
          dragActive ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Drag & drop PE License Certificate PDF</h4>
        <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG (Max 15MB). Instant verification by Board database.</p>
      </div>

      {/* Licenses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenses.map((lic) => (
          <div key={lic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 group hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {lic.jurisdiction} State Board
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  lic.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {lic.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white font-mono">{lic.licenseNumber}</h4>
                <p className="text-xs text-slate-400">{lic.licenseType}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate font-medium">{lic.documentName}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{lic.fileSize || '2.0 MB'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>Issued: <span className="text-slate-200 font-semibold">{lic.issueDate}</span></div>
                <div>Expires: <span className="text-amber-400 font-semibold">{lic.expiryDate}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <button 
                onClick={() => alert(`Opening license document: ${lic.documentName}`)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview Certificate
              </button>
              <button 
                onClick={() => handleDelete(lic.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                title="Remove license"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add License Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Upload New PE/SE License</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">×</button>
            </div>

            <form onSubmit={handleAddLicense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State Jurisdiction</label>
                <input
                  type="text"
                  value={form.jurisdiction}
                  onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
                  placeholder="e.g. California, Washington, Texas"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">License Number</label>
                <input
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="e.g. PE-CA-49281-CIVIL"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">License Type</label>
                <select
                  value={form.licenseType}
                  onChange={(e) => setForm({ ...form, licenseType: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="PE Civil & Structural">PE Civil & Structural</option>
                  <option value="SE Structural Engineer Specialist">SE Structural Engineer Specialist</option>
                  <option value="PE Geotechnical Engineering">PE Geotechnical Engineering</option>
                  <option value="PE Mechanical / MEP">PE Mechanical / MEP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document File Name</label>
                <input
                  type="text"
                  value={form.documentName}
                  onChange={(e) => setForm({ ...form, documentName: e.target.value })}
                  placeholder="e.g. CA_PE_License_DavidVance_Stamp.pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Confirm & Save License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
