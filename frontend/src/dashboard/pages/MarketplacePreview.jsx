import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, TrendingUp, DollarSign, PlusCircle, Check } from 'lucide-react';

export const MarketplacePreview = () => {
  const [sellForm, setSellForm] = useState({
    cropName: '',
    quantity: '',
    price: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  const priceTrends = [
    { name: 'Basmati Paddy (Punjab)', current: '₹3,600 / Quintal', change: '+₹150', up: true },
    { name: 'Sharbati Wheat (M.P.)', current: '₹2,450 / Quintal', change: '+₹40', up: true },
    { name: 'Hybrid Cotton (M.S.)', current: '₹7,100 / Candy', change: '-₹180', up: false },
    { name: 'Sugarcane (U.P.)', current: '₹390 / Ton', change: '+₹10', up: true },
    { name: 'Mustard Seeds (Rajasthan)', current: '₹5,400 / Quintal', change: '-₹50', up: false }
  ];

  const activeBuyOrders = [
    { buyer: 'AgroCorp India Ltd', crop: 'Basmati Rice', qty: '120 Quintals', target: '₹3,700/Qtl', location: 'Amritsar' },
    { buyer: 'Patanjali Agro Div', crop: 'Organic Wheat', qty: '300 Quintals', target: '₹2,480/Qtl', location: 'Indore' }
  ];

  const handlePostSell = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSellForm({ cropName: '', quantity: '', price: '', notes: '' });
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary rounded-full">
          Coming in Module 9
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display mt-2">Direct Marketplace</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Bypass middle intermediaries. Trade harvests directly with national corporate buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Trend Index */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Live Mandi Price Index</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-premium">
            <div className="divide-y divide-border/40">
              {priceTrends.map((trend, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="block text-text">{trend.name}</span>
                    <span className="block text-[10px] text-text/40 font-bold uppercase mt-0.5">Government MSP benchmarked</span>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="block text-text font-bold">{trend.current}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      trend.up
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {trend.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sell crop placeholder form */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Post Harvest Listing</h3>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium">
            {success ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-text">Listing Posted!</h4>
                <p className="text-[10px] text-text/40 font-semibold max-w-[180px] mx-auto leading-relaxed">
                  Your harvest offer is simulated and posted. Buyers will bid when Module 9 goes active.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSell} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basmati Paddy"
                    value={sellForm.cropName}
                    onChange={(e) => setSellForm(prev => ({ ...prev, cropName: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Quantity (Qtl)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={sellForm.quantity}
                      onChange={(e) => setSellForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Target (₹/Qtl)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3600"
                      value={sellForm.price}
                      onChange={(e) => setSellForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text/40 uppercase tracking-wider">Grading / Moisture info</label>
                  <textarea
                    placeholder="Grade A harvest, moisture level <= 14%..."
                    value={sellForm.notes}
                    onChange={(e) => setSellForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows="2"
                    className="w-full bg-surface border border-border rounded-xl p-3 text-text focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Harvest Harvest</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Buyer listings panel */}
      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Active Procurement Mandates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBuyOrders.map((order, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-premium flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                  Verified Corporate Buyer
                </span>
                <h4 className="font-bold text-text pt-1.5">{order.buyer}</h4>
                <p className="text-[11px] text-text/60 font-medium">Looking for: {order.crop} ({order.qty})</p>
                <p className="text-[10px] text-text/40 font-bold">Preferred center: {order.location}</p>
              </div>
              <div className="text-right space-y-2">
                <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Target Offer</span>
                <span className="block text-base font-extrabold text-primary leading-none">{order.target}</span>
                <button className="px-3.5 py-1.5 bg-surface hover:bg-border border border-border text-[10px] font-bold rounded-lg transition-all cursor-pointer">
                  Submit Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreview;
