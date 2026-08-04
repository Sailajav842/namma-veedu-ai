import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'Chennai',
    subject: 'AI Floor Plan Query',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isTamil ? 'பொறியாளர்கள் ஆலோசனை' : 'Architectural Support'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isTamil ? 'எங்களை தொடர்பு கொள்க' : 'Contact Civil Engineering Team'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isTamil
              ? 'மனை வரைபடம், வாஸ்து ஆலோசனை அல்லது DTCP அனுமதி தொடர்பாக எங்களை தொடர்பு கொள்ளவும்.'
              : 'Have questions about floor plans, Vastu compliance, or DTCP approval? Our Tamil Nadu civil engineering team is here to assist.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'செய்தி பெறப்பட்டது!' : 'Inquiry Submitted Successfully!'}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {isTamil
                ? 'எங்கள் பொறியாளர் உங்களை விரைவில் தொடர்பு கொள்வார்.'
                : 'Our registered Civil Engineer will call or WhatsApp you within 2 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isTamil ? 'பெயர்' : 'Your Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Annamalai S."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isTamil ? 'கைபேசி எண்' : 'Mobile / WhatsApp'} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isTamil ? 'மாவட்டம்' : 'District (Tamil Nadu)'}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Erode">Erode</option>
                  <option value="Other">Other 38 Districts</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isTamil ? 'தலைப்பு' : 'Inquiry Subject'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="AI Floor Plan Query">AI Floor Plan Query</option>
                  <option value="PE Engineer Approval">PE Engineer Stamping Approval</option>
                  <option value="DTCP / CMDA Loan Plan">DTCP / CMDA Loan Plan</option>
                  <option value="Material Price Estimate">Material Price Estimate</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isTamil ? 'விவரம் / செய்திகள்' : 'Message Details'}
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isTamil ? 'உங்கள் கேள்விகளை இங்கு குறிப்பிடவும்...' : 'Describe your plot size or building requirement...'}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isTamil ? 'செய்தி அனுப்புக' : 'Send Message'}</span>
            </button>
          </form>
        )}

        {/* Quick Contact Direct Options */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 grid grid-cols-2 gap-3 text-xs">
          <a
            href="tel:+919876543210"
            className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 hover:border-emerald-500/50 transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Direct Helpline</p>
              <p className="font-bold text-slate-900 dark:text-white text-[11px]">+91 98765 43210</p>
            </div>
          </a>

          <a
            href="mailto:support@nammaveeduai.in"
            className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 hover:border-blue-500/50 transition-all"
          >
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Email Support</p>
              <p className="font-bold text-slate-900 dark:text-white text-[11px]">support@nammaveeduai.in</p>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
};
