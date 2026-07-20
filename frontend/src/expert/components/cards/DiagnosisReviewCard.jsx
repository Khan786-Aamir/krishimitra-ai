import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  FileSpreadsheet,
  CheckCheck,
  AlertTriangle,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export const DiagnosisReviewCard = ({
  review,
  onApprove,
  onReject,
  onModify,
  onGenerateReport,
  onMarkReviewed
}) => {
  const {
    id,
    farmerName,
    cropName,
    disease,
    confidence = 92,
    severity = 'Moderate',
    symptoms = [],
    aiRecommendation,
    leafImage,
    status = 'Pending'
  } = review;

  const [isEditing, setIsEditing] = useState(false);
  const [modifiedRec, setModifiedRec] = useState(aiRecommendation);

  const getSeverityBadge = (sev) => {
    if (sev === 'Severe' || sev === 'Critical') {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    if (sev === 'Moderate') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all relative"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-surface shrink-0 border border-border">
          <img
            src={leafImage || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600'}
            alt={cropName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-400 rounded-md">
            {confidence}% AI Confidence
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-text font-display truncate">{disease}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadge(severity)} shrink-0`}>
              {severity} Severity
            </span>
          </div>

          <p className="text-xs text-text/50">
            Affected Crop: <span className="text-text font-semibold">{cropName}</span> • Submitted by{' '}
            <span className="text-text font-semibold">{farmerName}</span>
          </p>

          {symptoms.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] uppercase font-semibold text-text/40 block">Observed Symptoms</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {symptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 bg-surface border border-border/60 text-text/70 rounded-md"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Agronomy Advice</span>
        </div>
        {isEditing ? (
          <textarea
            value={modifiedRec}
            onChange={(e) => setModifiedRec(e.target.value)}
            className="w-full mt-2 p-2 bg-surface border border-border rounded-lg text-xs text-text focus:outline-none focus:border-emerald-500"
            rows={3}
          />
        ) : (
          <p className="text-xs text-text/80 leading-relaxed pt-1">{modifiedRec}</p>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60 text-xs">
        <button
          onClick={() => onApprove && onApprove(review)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approve</span>
        </button>

        <button
          onClick={() => onReject && onReject(review)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-xl transition-all cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Reject</span>
        </button>

        <button
          onClick={() => {
            if (isEditing) {
              onModify && onModify(review, modifiedRec);
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface hover:bg-border text-text font-semibold rounded-xl transition-all cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isEditing ? 'Save Edit' : 'Modify'}</span>
        </button>

        <button
          onClick={() => onGenerateReport && onGenerateReport(review)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface hover:bg-border text-text font-semibold rounded-xl transition-all cursor-pointer"
          title="Generate Clinical Report PDF"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Report</span>
        </button>

        <button
          onClick={() => onMarkReviewed && onMarkReviewed(review)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-semibold rounded-xl transition-all cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mark Reviewed</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DiagnosisReviewCard;
