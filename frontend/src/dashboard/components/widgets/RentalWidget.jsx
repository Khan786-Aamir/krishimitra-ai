import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock } from 'lucide-react';

export const RentalWidget = ({
  equipment = [
    { name: 'Rotary Tiller Rotavator', rate: '₹1,200/day', status: 'Available', owner: 'Baldev S.' },
    { name: 'Mahindra Tractor 55HP', rate: '₹2,500/day', status: 'Rented Today', owner: 'Sukhdev P.' }
  ]
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <Wrench className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">Equipment Rental</h4>
        </div>
        <span className="text-[10px] text-text/40 font-semibold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> 2 Bookings Scheduled
        </span>
      </div>

      <div className="space-y-2">
        <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Nearby Machinery</span>
        <div className="space-y-2.5">
          {equipment.map((item, idx) => (
            <div key={idx} className="p-3 bg-surface/50 border border-border/40 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-start font-semibold">
                <span className="text-text">{item.name}</span>
                <span className="text-accent">{item.rate}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text/50 font-bold">
                <span>Lender: {item.owner}</span>
                <span className={`px-1.5 py-0.5 rounded border ${
                  item.status === 'Available'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/farmer/equipment"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all"
      >
        <span>Book Machinery Lease</span>
      </Link>
    </div>
  );
};

export default RentalWidget;
