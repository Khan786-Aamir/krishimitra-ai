import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Sparkles, MessageSquare, TrendingUp, History, Lightbulb, Sprout, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui';

export const AISuggestions = () => {
  const navigate = useNavigate();
  const { setActiveSessionId } = useOutletContext();

  const handleSuggestionClick = (promptText) => {
    // Reset active session so it triggers a fresh chat run
    setActiveSessionId(null);
    navigate('/assistant', { state: { autoPrompt: promptText } });
  };

  const trendingQuestions = [
    { text: 'How can I increase wheat production?', category: 'Crops', reads: '1.2k reads' },
    { text: 'Best organic fertilizers for tomato farming.', category: 'Organic', reads: '920 reads' },
    { text: 'How to register for KCC scheme online?', category: 'Government', reads: '1.5k reads' },
    { text: 'Symptoms and control of Rice Blast disease.', category: 'Pests', reads: '840 reads' }
  ];

  const recentlyAsked = [
    { text: 'What is the ideal soil pH for sugarcane?', category: 'Soil', time: '10m ago' },
    { text: 'How often should I irrigate mustard seeds?', category: 'Irrigation', time: '1h ago' },
    { text: 'Organic treatments for cotton whitefly infestation.', category: 'Organic', time: '3h ago' }
  ];

  const recommendedQuestions = [
    { text: 'How to prepare Panchagavya vermicompost at home.', category: 'Organic', difficulty: 'Easy' },
    { text: 'Calculating NPK fertilizer ratio for one acre of maize.', category: 'Soil', difficulty: 'Medium' },
    { text: 'Subsidy rate for solar water pumps under PM-KUSUM.', category: 'Government', difficulty: 'Easy' },
    { text: 'Micro-irrigation layouts for vegetable garden.', category: 'Irrigation', difficulty: 'Advanced' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> AI Suggestions & Advice
        </h1>
        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
          Select popular agricultural topics to kick off prompt responses from our generative advisors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1 - Trending */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium space-y-4 flex flex-col">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black text-white font-display">Trending Questions</h3>
          </div>

          <div className="space-y-3 flex-1">
            {trendingQuestions.map((q, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(q.text)}
                className="p-3 bg-surface border border-border/60 hover:border-primary/20 rounded-xl transition-all cursor-pointer group flex flex-col justify-between h-20 text-[10px]"
              >
                <p className="text-gray-300 font-semibold leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                  {q.text}
                </p>
                <div className="flex justify-between items-center text-[8px] font-bold text-gray-600 mt-1">
                  <span>{q.category}</span>
                  <span>{q.reads}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Recently Asked */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium space-y-4 flex flex-col">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-black text-white font-display">Recently Asked</h3>
          </div>

          <div className="space-y-3 flex-1">
            {recentlyAsked.map((q, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(q.text)}
                className="p-3 bg-surface border border-border/60 hover:border-primary/20 rounded-xl transition-all cursor-pointer group flex flex-col justify-between h-20 text-[10px]"
              >
                <p className="text-gray-300 font-semibold leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                  {q.text}
                </p>
                <div className="flex justify-between items-center text-[8px] font-bold text-gray-600 mt-1">
                  <span>{q.category}</span>
                  <span>{q.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Recommended */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium space-y-4 flex flex-col">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black text-white font-display">Recommended</h3>
          </div>

          <div className="space-y-3 flex-1">
            {recommendedQuestions.map((q, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(q.text)}
                className="p-3 bg-surface border border-border/60 hover:border-primary/20 rounded-xl transition-all cursor-pointer group flex flex-col justify-between h-20 text-[10px]"
              >
                <p className="text-gray-300 font-semibold leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                  {q.text}
                </p>
                <div className="flex justify-between items-center text-[8px] font-bold text-gray-600 mt-1">
                  <span>{q.category}</span>
                  <span className={
                    q.difficulty === 'Easy' ? 'text-emerald-400' : (q.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400')
                  }>{q.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sprout Banner promo */}
      <div className="p-5 bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/25 rounded-3xl flex items-center justify-between gap-6 mt-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-surface border border-border/80 text-primary rounded-2xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white font-display">Have a custom question about your fields?</h4>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Click go to start a customized dialogue session with our experts.</p>
          </div>
        </div>
        <Button onClick={() => handleSuggestionClick('Recommend crops for black cotton soil.')} className="text-[10px] font-bold py-2 px-4 rounded-xl flex items-center gap-1 shrink-0">
          <span>Go to Chat</span> <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

    </div>
  );
};
