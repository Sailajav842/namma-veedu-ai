import React, { useState } from 'react';
import { EngineerQuotation, EngineerQuotationItem } from '../../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Send, 
  Printer, 
  CheckCircle2, 
  IndianRupee, 
  Calculator, 
  Clock, 
  Sparkles,
  Download
} from 'lucide-react';
import { formatINR, formatFullINR } from '../../utils/currency';

interface QuotationSectionProps {
  quotations: EngineerQuotation[];
  onSaveQuotations: (quotes: EngineerQuotation[]) => void;
}

export const QuotationSection: React.FC<QuotationSectionProps> = ({
  quotations,
  onSaveQuotations,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // Form State for Quotation Generator
  const [clientName, setClientName] = useState('Karthik Subramanian');
  const [clientEmail, setClientEmail] = useState('karthik.s@example.com');
  const [projectTitle, setProjectTitle] = useState('Grand Chennai Villa 2026');
  const [taxRatePercent, setTaxRatePercent] = useState(18.0); // GST 18%
  const [notes, setNotes] = useState('Includes 2 structural calculation revisions prior to TN PWD approval submission.');
  
  const [items, setItems] = useState<EngineerQuotationItem[]>([
    { id: 'item_1', description: 'TN PWD Structural Design & Seismic Load Calculation (G+2)', quantity: 1, unitPriceUSD: 15000, totalUSD: 15000 },
    { id: 'item_2', description: 'Licensed Structural Engineer Seal & Plan Sign-off Stamp', quantity: 1, unitPriceUSD: 5000, totalUSD: 5000 },
    { id: 'item_3', description: 'On-site Foundation Soil Bearing Capacity Test & Report', quantity: 1, unitPriceUSD: 2500, totalUSD: 2500 },
  ]);

  const subtotalUSD = items.reduce((sum, item) => sum + item.totalUSD, 0);
  const taxUSD = (subtotalUSD * taxRatePercent) / 100;
  const totalUSD = subtotalUSD + taxUSD;

  const handleAddItem = () => {
    const newItem: EngineerQuotationItem = {
      id: `item_${Date.now()}`,
      description: 'Engineering Review Service Line',
      quantity: 1,
      unitPriceUSD: 2000,
      totalUSD: 2000,
    };
    setItems([...items, newItem]);
  };


  const handleItemChange = (id: string, field: keyof EngineerQuotationItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPriceUSD') {
            updated.totalUSD = (updated.quantity || 0) * (updated.unitPriceUSD || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCreateQuotation = (status: EngineerQuotation['status']) => {
    const newQuote: EngineerQuotation = {
      id: `q_${Date.now()}`,
      quotationNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectTitle,
      customerName: clientName,
      customerEmail: clientEmail,
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items,
      subtotalUSD,
      taxRatePercent,
      taxUSD,
      totalUSD,
      status,
      notes,
    };

    onSaveQuotations([newQuote, ...quotations]);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-amber-400" />
            <span>Structural Fee Quotation & Proposal Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Create itemized PE engineering quotes, wet seal fee schedules, and tax-calculated proposals for clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'list' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Saved Quotes ({quotations.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> Generate New Quote
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Drafting Engineering Proposal</span>
            </h4>
            <span className="text-xs font-mono font-bold text-amber-400">QT-2026-DRAFT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itemized Engineering Services</h5>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Service Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-850 items-center text-xs">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.unitPriceUSD}
                      onChange={(e) => handleItemChange(item.id, 'unitPriceUSD', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-1 text-right font-bold text-white">
                    {formatINR(item.totalUSD)}
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotals & Tax Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proposal Terms & Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Services</span>
                <span className="font-bold text-white">{formatINR(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>GST Tax Rate (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-right text-white font-bold"
                />
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST Tax (18%)</span>
                <span className="font-bold text-white">{formatINR(taxUSD)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-amber-400">
                <span>Total Engineering Quote</span>
                <span>{formatINR(totalUSD)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => handleCreateQuotation('draft')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleCreateQuotation('sent')}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Proposal to Client
            </button>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-4">
          {quotations.map((q) => (
            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{q.quotationNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      q.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      q.status === 'sent' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{q.projectTitle}</h4>
                  <p className="text-xs text-slate-400">Client: {q.customerName} ({q.customerEmail}) • Created: {q.createdAt}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Fee</span>
                  <p className="text-2xl font-extrabold text-white">{formatINR(q.totalUSD)}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                {q.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-slate-300 p-2 bg-slate-950 rounded-xl border border-slate-850">
                    <span>{item.description} (x{item.quantity})</span>
                    <span className="font-bold text-white">{formatINR(item.totalUSD)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <span className="text-slate-400">Valid Until: <strong className="text-slate-200">{q.validUntil}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Printing Quotation ${q.quotationNumber}...`)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
