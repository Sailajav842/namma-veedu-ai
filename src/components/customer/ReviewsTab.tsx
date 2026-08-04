import React, { useState } from 'react';
import { EngineerReview, EngineerProfile } from '../../types';
import { MOCK_REVIEWS, MOCK_ENGINEERS } from '../../data/mockData';
import { Star, MessageSquare, Plus, CheckCircle2, User, Building2 } from 'lucide-react';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<EngineerReview[]>(MOCK_REVIEWS);
  const [engineers] = useState<EngineerProfile[]>(MOCK_ENGINEERS);

  const [selectedEngineerId, setSelectedEngineerId] = useState<string>(engineers[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [projectTitle, setProjectTitle] = useState('Horizon Ridge Modern Eco Villa');
  const [comment, setComment] = useState(
    'Engineer Vance provided an outstanding soil bearing capacity analysis and approved our PE structural stamp in less than 24 hours!'
  );

  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const engObj = engineers.find((e) => e.id === selectedEngineerId) || engineers[0];

    const newReview: EngineerReview = {
      id: `rev_${Date.now()}`,
      engineerId: engObj.id,
      engineerName: engObj.name,
      customerName: 'Sarah Jenkins',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating,
      comment,
      projectTitle,
      createdAt: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setComment('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Community Trust
          </span>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Professional Engineer Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Read verified feedback from home builders, commercial developers, and architects.
          </p>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Thank you! Your engineer review was posted successfully.
        </div>
      )}

      {/* Add Review Form */}
      <form onSubmit={handleAddReview} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Submit Review for Civil PE Engineer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Engineer</label>
            <select
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name} ({eng.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Rating Stars</label>
            <div className="flex items-center gap-1 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback & Experience</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Submit Review
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerAvatar}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white text-xs">{rev.customerName}</h4>
                  <p className="text-[10px] text-slate-400">Reviewed <span className="text-amber-400 font-semibold">{rev.engineerName}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
              <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800 font-medium">
                Project: {rev.projectTitle}
              </span>
              <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
