import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle2, Video, MapPin } from 'lucide-react';

export const AppointmentCard = ({ appointment }) => {
  const { farmerName, crop, date, timeSlot, status } = appointment;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/80 rounded-2xl p-4 shadow-md flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
          <Calendar className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-text font-display truncate">{farmerName}</h4>
          <p className="text-xs text-text/50 truncate mt-0.5">{crop}</p>
          <div className="flex items-center gap-2 text-[11px] text-text/40 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{date} ({timeSlot})</span>
            </span>
          </div>
        </div>
      </div>

      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
          status === 'Upcoming'
            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            : status === 'Completed'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
};

export default AppointmentCard;
