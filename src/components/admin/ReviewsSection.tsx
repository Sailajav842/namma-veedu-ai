import React, { useState } from 'react';
import { EngineerReview } from '../../types';
import { 
  Star, 
  MessageSquare, 
  Search, 
  Flag, 
  Trash2, 
  Pin, 
  CheckCircle2, 
  CornerDownRight, 
  User, 
  HardHat, 
  ThumbsUp 
} from 'lucide-react';

interface ReviewsSectionProps {
  reviews: EngineerReview[];
  onUpdateReviews: (updated: EngineerReview[]) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onUpdateReviews,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [starFilter, setStarFilter] = useState<'all' | '5' | '4' | '3_below'>('all');
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStars = 
      starFilter === 'all' ||
      (starFilter === '5' && r.rating === 5) ||
      (starFilter === '4' && r.rating === 4) ||
      (starFilter === '3_below' && r.rating <= 3);

    return matchesSearch && matchesStars;
  });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleTogglePin = (reviewId: string) => {
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, verifiedBooking: !r.verifiedBooking } : r
    );
    onUpdateReviews(updated);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to remove this client review?')) {
      onUpdateReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  const handleSendAdminResponse = (reviewId: string) => {
    if (!adminResponseText.trim()) return;
    const updated = reviews.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            comment: `${r.comment}\n\n[Admin Note]: ${adminResponseText}`,
          }
        : r
    );
    onUpdateReviews(updated);
    setRespondingToId(null);
    setAdminResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Engineer Client Reviews & Moderation Center</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Monitor client feedback on Civil Engineer consultations, moderate flagged ratings, and pin verified testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-slate-300 font-semibold">
            Platform Avg: <strong className="text-amber-400 text-sm">{avgRating} / 5.0</strong> ({reviews.length} total)
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search review comment, client, engineer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Stars:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['all', '5', '4', '3_below'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStarFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  starFilter === st
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All' : st === '3_below' ? '≤ 3 Stars' : `${st} Stars`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{rev.customerName}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified PE Consultation
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Reviewed Engineer: <strong className="text-amber-400">{rev.engineerName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-white ml-1">{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-2xl border border-slate-850">
              "{rev.comment}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-800 pt-3">
              <span className="text-slate-500 text-[11px]">Project: {rev.projectTitle}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRespondingToId(rev.id)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold rounded-xl flex items-center gap-1 transition-all"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-amber-400" /> Admin Note
                </button>

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                  title="Remove Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {respondingToId === rev.id && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
                <label className="block text-xs font-bold text-white">Append Official Admin Note / Moderation Response</label>
                <textarea
                  rows={2}
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                  placeholder="Type official platform admin note..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setRespondingToId(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendAdminResponse(rev.id)}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
