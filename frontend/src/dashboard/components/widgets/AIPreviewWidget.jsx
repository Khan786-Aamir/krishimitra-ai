import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, ArrowRight, Brain } from 'lucide-react';

export const AIPreviewWidget = ({
  latestScan = {
    cropName: 'Paddy Rice',
    diseaseName: 'Rice Blast Pathogen',
    confidence: 96,
    healthStatus: 'Critical',
    date: 'July 18, 2026'
  }
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getMeterColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500';
      case 'Warning': return 'bg-amber-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <Brain className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">AI Disease Detection</h4>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(latestScan.healthStatus)}`}>
          {latestScan.healthStatus}
        </span>
      </div>

      <div className="space-y-3 bg-surface/40 border border-border/40 p-4 rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Latest Diagnosis Scan</span>
            <span className="block text-sm font-bold text-text mt-0.5">{latestScan.cropName}</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Confidence Level</span>
            <span className="block text-sm font-bold text-primary mt-0.5">{latestScan.confidence}% Match</span>
          </div>
        </div>

        <div>
          <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Detected Pathogen</span>
          <span className="block text-xs font-semibold text-red-400 mt-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            {latestScan.diseaseName}
          </span>
        </div>

        {/* Health Meter Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-text/50">
            <span>Overall Plant Vigour</span>
            <span>{100 - latestScan.confidence}% Health Risk</span>
          </div>
          <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - latestScan.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${getMeterColor(latestScan.healthStatus)}`}
            />
          </div>
        </div>
      </div>

      <Link
        to="/farmer/ai"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all group"
      >
        <span>View AI Diagnosis</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default AIPreviewWidget;
