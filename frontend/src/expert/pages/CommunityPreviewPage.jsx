import React from 'react';
import { MessageCircle, Users, Sparkles, Pin, CheckCircle2, MessageSquare } from 'lucide-react';

export const CommunityPreviewPage = () => {
  const pinnedQuestions = [
    {
      id: 'pin-1',
      title: 'How to manage Fall Armyworm in late-sown Maize crops?',
      askedBy: 'Devender Singh (Farmer)',
      repliesCount: 18,
      isAnswered: true
    },
    {
      id: 'pin-2',
      title: 'Recommended preventive sprays before high humidity monsoon spells?',
      askedBy: 'Rajendra Prasad (Farmer)',
      repliesCount: 24,
      isAnswered: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Expert Community Forum</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Provide expert answers to pinned farmer queries and participate in advisory discussions.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold self-start sm:self-auto">
          Advisory Moderation Preview
        </div>
      </div>

      {/* Pinned Questions Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-text font-display flex items-center gap-2">
          <Pin className="w-4 h-4 text-emerald-400" />
          <span>Pinned Farmer Advisory Requests</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pinnedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold rounded-full">
                  Pending Expert Answer
                </span>
                <span className="text-text/40">{q.repliesCount} Replies</span>
              </div>
              <h4 className="text-base font-bold text-text font-display">{q.title}</h4>
              <p className="text-xs text-text/50">Submitted by {q.askedBy}</p>
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">
                Submit Expert Answer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPreviewPage;
