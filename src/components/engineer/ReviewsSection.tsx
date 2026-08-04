import React, { useState } from 'react';
import { EngineerReview } from '../../types';
import { 
  Star, 
  MessageSquare, 
  User, 
  Send, 
  CheckCircle2, 
  Building2, 
  Sparkles 
} from 'lucide-react';

interface ReviewsSectionProps {
  reviews: EngineerReview[];
  onSaveReviews: (revs: EngineerReview[]) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onSaveReviews,
}) => {
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const handleSendReply = (reviewId: string) => {
    const text = replyMap[reviewId];
    if (!text?.trim()) return;

    alert(`Reply published to client review: "${text}"`);
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Client Ratings & Structural Reviews</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Verified feedback from homeowners and general contractors who booked PE plan stamps and structural consultations.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-white">{avgRating}</span>
            <span className="text-xs text-slate-400 block">/ 5.0 Rating</span>
          </div>
          <div className="border-l border-slate-800 pl-4 space-y-0.5">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400 font-semibold">{reviews.length} Verified Reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.customerName}</h4>
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Project: {rev.projectTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-4 rounded-2xl border border-slate-850">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Review Date: {rev.createdAt}</span>

              <button
                onClick={() => setActiveReplyId(activeReplyId === rev.id ? null : rev.id)}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Reply to Review
              </button>
            </div>

            {activeReplyId === rev.id && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
                <label className="block text-xs font-semibold text-slate-300">Public Engineer Response</label>
                <textarea
                  rows={2}
                  value={replyMap[rev.id] || ''}
                  onChange={(e) => setReplyMap({ ...replyMap, [rev.id]: e.target.value })}
                  placeholder="Thank the client or clarify structural calculation details..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
                  >
                    <Send className="w-3 h-3" /> Publish Response
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
