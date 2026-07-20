import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Search, ExternalLink, HelpCircle } from 'lucide-react';
import { schemeService } from '../services/schemeService';

export const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSchemeId, setAppliedSchemeId] = useState(null);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await schemeService.getSchemes();
      if (res.success) {
        setSchemes(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve government schemes record ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleApplyClick = (id) => {
    setAppliedSchemeId(id);
    setTimeout(() => {
      setAppliedSchemeId(null);
      alert('Application request simulated! A local government representative will verify your farm coordinates shortly.');
    }, 2000);
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-1/4 bg-card rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-card rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Government Agriculture Schemes</h1>
          <p className="text-xs text-text/40 font-semibold mt-1">
            Eligible crop subsidies, equipment loans, and weather insurance schemes
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subsidies, loans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border text-xs rounded-xl py-2 pl-9 pr-4 text-text focus:outline-none"
          />
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
          {error}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center p-12 bg-card border border-border rounded-2xl text-text/40 text-xs font-semibold">
          No eligible schemes match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-card border border-border hover:border-primary/20 rounded-2xl p-5 shadow-premium flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    scheme.isEligible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {scheme.isEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-text leading-tight">{scheme.title}</h3>
                <p className="text-[11px] text-text/60 leading-relaxed font-semibold">{scheme.description}</p>
                
                <div className="space-y-1 text-xs text-text/50 font-bold border-t border-border/30 pt-3">
                  <p>Target Eligibility: <span className="text-text font-semibold">{scheme.eligibility}</span></p>
                  <p>Finances Category: <span className="text-text font-semibold">{scheme.category}</span></p>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 mt-5 flex justify-between items-center shrink-0">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Benefit Scale</span>
                  <span className="block text-sm font-extrabold text-primary">{scheme.benefit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={scheme.detailsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-surface border border-border/30 text-text/60 hover:text-text rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold"
                  >
                    Details <ExternalLink className="w-3 h-3" />
                  </a>

                  {appliedSchemeId === scheme.id ? (
                    <span className="px-3.5 py-2 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Applying...
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(scheme.id)}
                      disabled={!scheme.isEligible}
                      className="px-4 py-2 bg-primary disabled:bg-surface border border-primary/20 disabled:border-border text-white disabled:text-text/30 text-xs font-bold rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-lg shadow-primary/10 disabled:shadow-none"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
