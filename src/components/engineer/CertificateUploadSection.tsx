import React, { useState } from 'react';
import { EngineerCertificate } from '../../types';
import { 
  Award, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  FileCheck,
  Tag
} from 'lucide-react';

interface CertificateUploadSectionProps {
  certificates: EngineerCertificate[];
  onSaveCertificates: (certs: EngineerCertificate[]) => void;
}

export const CertificateUploadSection: React.FC<CertificateUploadSectionProps> = ({
  certificates,
  onSaveCertificates,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<EngineerCertificate>>({
    title: '',
    issuingOrganization: 'NCEES',
    issueDate: '',
    credentialId: '',
    category: 'Structural',
    documentName: '',
  });

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.issuingOrganization) return;

    const newCert: EngineerCertificate = {
      id: `cert_${Date.now()}`,
      title: form.title,
      issuingOrganization: form.issuingOrganization,
      issueDate: form.issueDate || new Date().toISOString().split('T')[0],
      credentialId: form.credentialId || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      category: form.category || 'Structural',
      documentName: form.documentName || `${form.title.replace(/\s+/g, '_')}_Cert.pdf`,
    };

    onSaveCertificates([newCert, ...certificates]);
    setIsModalOpen(false);
    setForm({
      title: '',
      issuingOrganization: 'NCEES',
      issueDate: '',
      credentialId: '',
      category: 'Structural',
      documentName: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this engineering certificate from your profile?')) {
      onSaveCertificates(certificates.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Specialized Certifications & Accreditation</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Display certifications for post-earthquake safety, OSHA 30-hour safety, NCEES Model Law Engineer, or BIM/Revit accreditation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {cert.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{cert.credentialId || 'ACTIVE'}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white line-clamp-2">{cert.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cert.issuingOrganization}</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-2 text-xs text-slate-300">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate text-[11px]">{cert.documentName}</span>
              </div>

              <p className="text-[11px] text-slate-500">Issued Date: <span className="text-slate-300 font-semibold">{cert.issueDate}</span></p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <button 
                onClick={() => alert(`Viewing certificate: ${cert.title}`)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Credential
              </button>
              <button 
                onClick={() => handleDelete(cert.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Upload New Special Certificate</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">×</button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. ATC-20 Post-Earthquake Inspector"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={form.issuingOrganization}
                  onChange={(e) => setForm({ ...form, issuingOrganization: e.target.value })}
                  placeholder="e.g. NCEES, ASCE, Applied Technology Council"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="Structural">Structural</option>
                    <option value="Seismic">Seismic</option>
                    <option value="Safety">Safety</option>
                    <option value="Environmental">Environmental</option>
                    <option value="CAD/BIM">CAD/BIM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={form.credentialId}
                    onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="e.g. NCEES-8812"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document File Name</label>
                <input
                  type="text"
                  value={form.documentName}
                  onChange={(e) => setForm({ ...form, documentName: e.target.value })}
                  placeholder="e.g. ATC20_Certificate.pdf"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
