import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SchemesWidget = ({ schemes = [] }) => {
  // Take first 2 schemes for overview
  const displayedSchemes = schemes.slice(0, 2);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text">Government Schemes</h4>
        </div>
        <span className="text-[10px] text-text/40 font-semibold">
          {schemes.length} Active Schemes
        </span>
      </div>

      <div className="space-y-3">
        {displayedSchemes.length === 0 ? (
          <div className="py-6 text-center text-xs text-text/40">
            No schemes fetched.
          </div>
        ) : (
          displayedSchemes.map((scheme, idx) => (
            <div key={idx} className="p-3 bg-surface/50 border border-border/40 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h5 className="font-bold text-text leading-tight max-w-[70%]">{scheme.title}</h5>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                  {scheme.type}
                </span>
              </div>
              <p className="text-[11px] text-text/60 leading-relaxed truncate-2-lines">{scheme.description}</p>
              <div className="flex justify-between items-center text-[10px] font-bold border-t border-border/30 pt-2 mt-1">
                <span className="text-text/40">Benefit: <span className="text-primary">{scheme.benefit}</span></span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Eligible
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        to="/farmer/schemes"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all group"
      >
        <span>All Government Schemes</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default SchemesWidget;
