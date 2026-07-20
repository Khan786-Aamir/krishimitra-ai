import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, RefreshCw, X } from 'lucide-react';
import expertService from '../services/expertService';
import ConsultationCard from '../components/cards/ConsultationCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const ConsultationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expertService.getConsultations();
      setConsultations(data || []);
    } catch (err) {
      setError('Unable to load farmer consultation requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleAccept = async (c) => {
    setConsultations((prev) => prev.map((item) => (item.id === c.id ? { ...item, status: 'Accepted' } : item)));
    await expertService.acceptConsultation(c.id);
  };

  const handleReject = async (c) => {
    setConsultations((prev) => prev.map((item) => (item.id === c.id ? { ...item, status: 'Rejected' } : item)));
    await expertService.rejectConsultation(c.id);
  };

  const handleComplete = async (c) => {
    setConsultations((prev) => prev.map((item) => (item.id === c.id ? { ...item, status: 'Completed' } : item)));
    await expertService.completeConsultation(c.id);
  };

  const filteredConsultations = consultations.filter((item) => {
    const matchesTab =
      activeTab === 'all' || item.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Farmer Consultations</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Direct farmer advisory requests and field crop problem reports.
          </p>
        </div>

        <button
          onClick={loadConsultations}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-surface border border-border text-xs font-bold text-text rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farmer name, crop, or crop issue..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface/60 border border-border/80 focus:border-emerald-500 rounded-xl text-xs text-text placeholder:text-text/40 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'completed', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-surface hover:bg-border text-text/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadConsultations} />
      ) : filteredConsultations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Consultations Found"
          description="There are no farmer consultation requests matching the current filters."
          actionText="Reset Filters"
          onAction={() => {
            setActiveTab('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultations.map((item) => (
            <ConsultationCard
              key={item.id || item._id}
              consultation={item}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
              onViewDetails={(c) => setSelectedDetails(c)}
            />
          ))}
        </div>
      )}

      {/* Consultation Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedDetails(null)}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text rounded-xl bg-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-text font-display">Consultation Query Details</h3>

            <div className="p-4 bg-surface/50 border border-border/60 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text/50">Farmer Name:</span>
                <span className="font-bold text-text">{selectedDetails.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">Crop Stand:</span>
                <span className="font-semibold text-emerald-400">{selectedDetails.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">Priority Level:</span>
                <span className="font-bold text-amber-400">{selectedDetails.priority}</span>
              </div>
              <div className="pt-2 border-t border-border/40">
                <span className="text-text/50 block mb-1">Issue Reported:</span>
                <p className="text-text/80 leading-relaxed bg-background/60 p-2.5 rounded-xl border border-border/40">
                  {selectedDetails.issue}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDetails(null)}
              className="w-full py-2.5 bg-surface hover:bg-border text-text text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
