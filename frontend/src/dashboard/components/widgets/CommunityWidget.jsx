import React from 'react';
import { Link } from 'react-router-dom';
import { Users, HelpCircle, MessageSquare } from 'lucide-react';

export const CommunityWidget = ({
  discussions = [
    { title: 'Blight control protocols for Basmati-1121?', replies: 18, author: 'Sukhwinder S.' },
    { title: 'Best seeder drill for clay soil?', replies: 5, author: 'Amanpreet D.' }
  ],
  expertsOnlineCount = 8
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">Community Forum</h4>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
          {expertsOnlineCount} Experts Online
        </span>
      </div>

      <div className="space-y-2">
        <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Active Board Debates</span>
        <div className="space-y-2.5">
          {discussions.map((post, idx) => (
            <div key={idx} className="p-3 bg-surface/50 border border-border/40 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-text flex items-start gap-1.5 leading-tight">
                <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {post.title}
              </p>
              <div className="flex justify-between items-center text-[10px] text-text/50 font-bold">
                <span>By: {post.author}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> {post.replies} Replies
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/farmer/community"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all"
      >
        <span>Join Community Board</span>
      </Link>
    </div>
  );
};

export default CommunityWidget;
