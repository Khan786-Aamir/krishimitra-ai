import React from 'react';
import { MessageSquare, Users, Sparkles, GraduationCap, ArrowRight, MessageCircle, Heart, Share2 } from 'lucide-react';

export const CommunityPreviewPage = () => {
  const discussions = [
    {
      id: 'disc-1',
      title: 'Monsoon yield predictions for 1121 Basmati in Punjab & Haryana',
      author: 'Dr. Ramesh Sharma (Agronomist)',
      replies: 24,
      likes: 85,
      time: '2h ago',
      category: 'Crop Forecasting'
    },
    {
      id: 'disc-2',
      title: 'Bulk Export Quality Standards for Spices Board India accreditation',
      author: 'Vikram Mehta (Trade Exporter)',
      replies: 19,
      likes: 62,
      time: '5h ago',
      category: 'Export & Quality'
    },
    {
      id: 'disc-3',
      title: 'Cold Storage preservation protocols for Nashik Red Onions',
      author: 'Sunil Deshmukh (Farmer)',
      replies: 31,
      likes: 110,
      time: '1d ago',
      category: 'Post-Harvest'
    }
  ];

  const expertsOnline = [
    { name: 'Dr. K.V. Rao', field: 'Soil & Fertilizer Advisory', status: 'Online' },
    { name: 'Prof. Ananya Roy', field: 'Commodity Market Analyst', status: 'Online' },
    { name: 'Er. Rajesh Varma', field: 'Grain Storage Technologist', status: 'Busy' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Buyer & Farmer Trade Community</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Engage with agronomists, certified producers, and trade specialists.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold self-start sm:self-auto">
          Community Forum Preview
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text font-display">Recent Discussions</h3>
            <span className="text-xs font-semibold text-indigo-400">View All Threads</span>
          </div>

          <div className="space-y-4">
            {discussions.map((d) => (
              <div
                key={d.id}
                className="bg-card border border-border/80 rounded-2xl p-5 shadow-md space-y-3 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    {d.category}
                  </span>
                  <span className="text-text/40">{d.time}</span>
                </div>

                <h4 className="text-base font-bold text-text font-display leading-snug">{d.title}</h4>
                <p className="text-xs text-text/50">Initiated by {d.author}</p>

                <div className="flex items-center gap-4 pt-2 border-t border-border/60 text-xs text-text/60">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{d.replies} Replies</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{d.likes} Endorsements</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="space-y-6">
          {/* Experts Panel */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-text">Advisory Experts Online</h3>
            </div>

            <div className="space-y-3">
              {expertsOnline.map((exp, idx) => (
                <div key={idx} className="p-3 bg-surface/60 border border-border/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-text">{exp.name}</h5>
                    <p className="text-[11px] text-text/50">{exp.field}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      exp.status === 'Online'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Join Community CTA */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white font-display">Join Trade Network</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Post contract inquiries, request customized harvest bulk quotes, and receive instant market advice.
            </p>
            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
              <span>Join Community Channel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPreviewPage;
