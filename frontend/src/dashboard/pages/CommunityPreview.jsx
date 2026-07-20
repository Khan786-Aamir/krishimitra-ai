import React from 'react';
import { Users, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

export const CommunityPreview = () => {
  const discussions = [
    {
      title: 'Blight control protocols for Basmati-1121 crops?',
      author: 'Gurcharan Dhillon (Agronomist)',
      replies: 18,
      category: 'Pest Control',
      time: '2 hours ago'
    },
    {
      title: 'Is drip irrigation suitable for sandy loam soils in Bathinda?',
      author: 'Dr. Ramesh Kumar (Soil Expert)',
      replies: 6,
      category: 'Irrigation',
      time: '5 hours ago'
    },
    {
      title: 'Sudden fall in cotton Mandi rate? Should I sell or store?',
      author: 'Amanpreet Singh (Farmer)',
      replies: 24,
      category: 'Market Pricing',
      time: '1 day ago'
    }
  ];

  const onlineExperts = [
    { name: 'Dr. Gurcharan S. Gill', role: 'Crop Protection Pathology Specialist', college: 'Punjab Agricultural University' },
    { name: 'Dr. Ramesh Kumar', role: 'Soil Chemist & Testing Advisor', college: 'ICAR Research Institute' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary rounded-full">
          Coming in Module 14
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display mt-2">Community & Expert Advisory</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Ask qualified agronomists soil testing or pest control questions. Join localized boards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forum Debates */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Active Forum Board debates</h3>
          <div className="space-y-4">
            {discussions.map((post, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center text-[10px] text-text/40 font-bold">
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase">
                    {post.category}
                  </span>
                  <span>{post.time}</span>
                </div>
                <h4 className="font-bold text-sm text-text flex items-start gap-1.5 leading-tight">
                  <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                  {post.title}
                </h4>
                <div className="flex justify-between items-center text-[10px] text-text/50 font-bold border-t border-border/40 pt-2.5 mt-2">
                  <span>Author: {post.author}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> {post.replies} Replies
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Advisory Panel */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Agronomist Panel (Online)</h3>
          <div className="space-y-4">
            {onlineExperts.map((exp, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-text">{exp.name}</h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-text/60 font-semibold">{exp.role}</p>
                <p className="text-[10px] text-text/40 font-bold uppercase">{exp.college}</p>
                <button className="w-full mt-2 py-2 bg-surface hover:bg-border border border-border text-[10px] font-bold rounded-lg transition-all cursor-pointer">
                  Direct Consultation
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPreview;
