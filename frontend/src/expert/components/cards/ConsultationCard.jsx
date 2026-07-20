import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, CheckCheck, Eye, AlertCircle } from 'lucide-react';

export const ConsultationCard = ({
  consultation,
  onAccept,
  onReject,
  onComplete,
  onViewDetails
}) => {
  const {
    id,
    farmerName,
    crop,
    issue,
    priority = 'Medium',
    image,
    status = 'Pending'
  } = consultation;

  const getPriorityBadge = (prio) => {
    if (prio === 'Urgent' || prio === 'High') {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    if (prio === 'Medium') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
    >
      <div className="flex gap-4 items-start">
        {image && (
          <img
            src={image}
            alt={crop}
            className="w-20 h-20 rounded-xl object-cover border border-border shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-text font-display truncate">{farmerName}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge(priority)}`}>
              {priority} Priority
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-400">Crop: {crop}</p>
          <p className="text-xs text-text/70 line-clamp-2 leading-relaxed pt-0.5">{issue}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60 text-xs">
        <span className="text-text/50 font-medium">Status: <span className="text-text font-bold">{status}</span></span>

        <div className="flex gap-2">
          {status === 'Pending' && (
            <>
              <button
                onClick={() => onAccept && onAccept(consultation)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onReject && onReject(consultation)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-xl transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}

          {status === 'Accepted' && (
            <button
              onClick={() => onComplete && onComplete(consultation)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>
          )}

          <button
            onClick={() => onViewDetails && onViewDetails(consultation)}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface hover:bg-border text-text font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsultationCard;
