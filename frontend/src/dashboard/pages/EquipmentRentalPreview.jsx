import React, { useState } from 'react';
import { Tractor, ShieldCheck, Clock, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const EquipmentRentalPreview = () => {
  const [bookedIdx, setBookedIdx] = useState(null);

  const localFleet = [
    {
      name: 'John Deere 5050D Tractor (50 HP)',
      owner: 'Gurbaksh Singh (Ludhiana)',
      rate: '₹2,500 / Day',
      location: '1.2 km away',
      rating: '4.9 ★ (42 bookings)',
      specs: 'Dual Clutch, Power Steering, 8 Forward + 4 Reverse Gears'
    },
    {
      name: 'Mahindra Combined Harvester',
      owner: 'Sukhdev Patil (Amritsar)',
      rate: '₹4,000 / Day',
      location: '3.5 km away',
      rating: '4.8 ★ (28 bookings)',
      specs: 'Large capacity grain tank, suitable for Wheat and Paddy crops'
    },
    {
      name: 'Pneumatic Precision Seed Drill',
      owner: 'Jagdev Dhillon (Jalandhar)',
      rate: '₹1,500 / Day',
      location: '0.8 km away',
      rating: '4.95 ★ (15 bookings)',
      specs: 'Optimal row spacing seeder, supports tractor mounting'
    }
  ];

  const handleBookClick = (idx) => {
    setBookedIdx(idx);
    setTimeout(() => {
      setBookedIdx(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary rounded-full">
          Coming in Module 10
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display mt-2">Equipment Rental Hub</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Peer-to-peer machinery leasing. Rent heavy vehicles directly from nearby farms.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Available Machinery Nearby</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localFleet.map((machine, idx) => (
            <div
              key={idx}
              className="bg-card border border-border hover:border-accent/20 rounded-2xl p-5 shadow-premium flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-text/40 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {machine.location}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-text leading-tight">{machine.name}</h4>
                
                <div className="space-y-1 text-xs text-text/50 font-semibold">
                  <p>Lender: {machine.owner}</p>
                  <p className="truncate">Specs: {machine.specs}</p>
                </div>

                <div className="text-[10px] text-amber-400 font-bold bg-amber-500/5 px-2 py-1 border border-amber-500/10 rounded-lg inline-block">
                  {machine.rating}
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 mt-6 flex justify-between items-center shrink-0">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Daily Rate</span>
                  <span className="block text-sm font-extrabold text-accent">{machine.rate}</span>
                </div>
                
                {bookedIdx === idx ? (
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Request Sent!
                  </span>
                ) : (
                  <button
                    onClick={() => handleBookClick(idx)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/10 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Lease</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking scheduling panel */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-premium max-w-xl">
        <h4 className="font-bold text-sm text-text flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Active Rental Ledgers
        </h4>
        <div className="mt-4 space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-center p-3 bg-surface/50 border border-border/40 rounded-xl">
            <div>
              <span className="block text-text">Drip Irrigation Pipes (Set of 10)</span>
              <span className="block text-[9px] text-text/40 mt-0.5">Rented from: Jaspal Singh</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Active till Tomorrow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentRentalPreview;
