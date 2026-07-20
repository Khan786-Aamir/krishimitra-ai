import React, { useState } from 'react';
import { BookOpen, Search, Leaf, ShieldAlert, Sparkles, FileText, CloudSun, Award } from 'lucide-react';

export const KnowledgeHubPage = () => {
  const [activeTab, setActiveTab] = useState('diseases');
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      id: 'kh-1',
      category: 'diseases',
      title: 'Puccinia striiformis (Yellow Rust) Management Protocols',
      summary: 'Comprehensive guide on chemical spray windows, dosage limits, and early spore identification in wheat crops.',
      updatedAt: '2026-07-15'
    },
    {
      id: 'kh-2',
      category: 'nutrition',
      title: 'N-P-K Micronutrient Balancing for High-Yield Paddy',
      summary: 'Optimizing Zinc Sulphate and Nitrogen split application during tillering phase.',
      updatedAt: '2026-07-10'
    },
    {
      id: 'kh-3',
      category: 'fertilizer',
      title: 'Bio-Fertilizer Inoculants: Azotobacter & PSB Usage',
      summary: 'Seed treatment techniques to enhance soil nitrogen fixation naturally.',
      updatedAt: '2026-06-28'
    },
    {
      id: 'kh-4',
      category: 'pesticide',
      title: 'CIBRC Approved Fungicides for Commercial Horticulture',
      summary: 'Central Insecticides Board compliance rules and maximum residue limits (MRL).',
      updatedAt: '2026-06-20'
    },
    {
      id: 'kh-5',
      category: 'advisories',
      title: 'ICAR Advisory on Kharif Crop Drainage & Flood Protection',
      summary: 'Emergency drainage strategies for waterlogged soils post heavy rains.',
      updatedAt: '2026-07-18'
    }
  ];

  const filteredArticles = articles.filter(
    (a) =>
      (activeTab === 'all' || a.category === activeTab) &&
      (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display flex items-center gap-2">
          <span>Agricultural Knowledge Hub</span>
          <BookOpen className="w-6 h-6 text-emerald-400" />
        </h1>
        <p className="text-xs sm:text-sm text-text/50 mt-1">
          Peer-reviewed disease libraries, bio-pesticide guidelines, ICAR advisories, and crop nutrition reference manuals.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, active ingredients, or government advisories..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface/60 border border-border/80 focus:border-emerald-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'diseases', label: 'Disease Library' },
              { id: 'nutrition', label: 'Crop Nutrition' },
              { id: 'fertilizer', label: 'Fertilizer Guide' },
              { id: 'pesticide', label: 'Pesticide Guide' },
              { id: 'advisories', label: 'Government Advisories' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-surface hover:bg-border text-text/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full uppercase">
                {art.category}
              </span>
              <h3 className="text-base font-bold text-text font-display leading-snug">{art.title}</h3>
              <p className="text-xs text-text/60 leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-text/40">Updated: {art.updatedAt}</span>
              <button className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">
                Read Article →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeHubPage;
