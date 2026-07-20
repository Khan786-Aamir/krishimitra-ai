import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export const MarketplaceWidget = ({
  prices = [
    { name: 'Basmati Paddy', rate: '₹3,600/Qtl', trend: 'up', change: '+₹150' },
    { name: 'Sharbati Wheat', rate: '₹2,450/Qtl', trend: 'up', change: '+₹40' },
    { name: 'Premium Cotton', rate: '₹7,100/Candy', trend: 'down', change: '-₹180' }
  ],
  listingsCount = 4
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">Direct Marketplace</h4>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 border border-primary/20 rounded-full font-bold">
          {listingsCount} Active Listings
        </span>
      </div>

      <div className="space-y-2">
        <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Trending Crop Prices</span>
        <div className="space-y-2">
          {prices.map((crop, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 bg-surface/50 border border-border/40 rounded-xl text-xs font-semibold">
              <span className="text-text">{crop.name}</span>
              <div className="flex items-center gap-2.5">
                <span className="text-text/80">{crop.rate}</span>
                <span className={`flex items-center gap-0.5 font-bold ${
                  crop.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {crop.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {crop.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to="/farmer/marketplace"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all"
        >
          <span>View Marketplace</span>
        </Link>
        <Link
          to="/farmer/marketplace?action=sell"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-dark text-xs font-semibold text-white rounded-xl transition-all shadow-lg shadow-primary/10"
        >
          <span>Quick Sell</span>
        </Link>
      </div>
    </div>
  );
};

export default MarketplaceWidget;
