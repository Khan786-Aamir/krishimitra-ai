import React, { useState, useEffect } from 'react';
import { Stethoscope, Search, Filter, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import expertService from '../services/expertService';
import DiagnosisReviewCard from '../components/cards/DiagnosisReviewCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const AIDiagnosisReviewsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expertService.getReviews();
      setReviews(data || []);
    } catch (err) {
      setError('Unable to fetch AI diagnosis review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = (review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: 'Approved' } : r)));
  };

  const handleReject = (review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: 'Rejected' } : r)));
  };

  const handleModify = (review, newRec) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, aiRecommendation: newRec, status: 'Modified' } : r))
    );
  };

  const handleMarkReviewed = (review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: 'Reviewed' } : r)));
  };

  const handleGenerateReport = (review) => {
    alert(`Generating certified agronomy report for ${review.farmerName} (${review.cropName} - ${review.disease})`);
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = filterSeverity === 'all' || r.severity.toLowerCase() === filterSeverity.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display flex items-center gap-2">
            <span>AI Diagnosis Review Queue</span>
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Validate computer vision leaf scans, verify disease symptoms, and endorse bio-pesticide prescriptions.
          </p>
        </div>

        <button
          onClick={loadReviews}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-surface border border-border text-xs font-bold text-text rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, disease name, or farmer..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface/60 border border-border/80 focus:border-emerald-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'severe', 'moderate', 'mild'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-surface hover:bg-border text-text/70'
              }`}
            >
              {sev} Severity
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadReviews} />
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No Diagnosis Reviews Found"
          description="There are currently no AI leaf scan reports matching your search parameters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setFilterSeverity('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <DiagnosisReviewCard
              key={rev.id || rev._id}
              review={rev}
              onApprove={handleApprove}
              onReject={handleReject}
              onModify={handleModify}
              onGenerateReport={handleGenerateReport}
              onMarkReviewed={handleMarkReviewed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIDiagnosisReviewsPage;
