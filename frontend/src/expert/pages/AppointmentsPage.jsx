import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Grid, List } from 'lucide-react';
import expertService from '../services/expertService';
import AppointmentCard from '../components/cards/AppointmentCard';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/ui/StateViews';

export const AppointmentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [statusFilter, setStatusFilter] = useState('all');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expertService.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      setError('Unable to load appointment schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'today') return app.date.includes('Today');
    if (statusFilter === 'upcoming') return app.status === 'Upcoming';
    if (statusFilter === 'completed') return app.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Appointments Schedule</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Manage field visits, advisory appointments, and scheduled farmer consultations.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-card border border-border rounded-xl p-1 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-text/60 hover:text-text'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'timeline' ? 'bg-emerald-600 text-white shadow-sm' : 'text-text/60 hover:text-text'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Timeline View</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80 gap-6 text-xs font-bold">
        {[
          { id: 'all', label: 'All Sessions' },
          { id: 'today', label: "Today's Appointments" },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'border-emerald-500 text-emerald-400 font-extrabold'
                : 'border-transparent text-text/50 hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content View */}
      {loading ? (
        <LoadingSkeleton type="cards" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAppointments} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No Appointments Scheduled"
          description="There are no appointments matching the selected status filter."
        />
      ) : viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.map((app) => (
            <AppointmentCard key={app.id || app._id} appointment={app} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider font-display">Appointment Timeline</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
            {filteredAppointments.map((app, idx) => (
              <div key={idx} className="relative pl-8 space-y-1">
                <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text">{app.farmerName}</h4>
                  <span className="text-[10px] text-text/40">{app.date} ({app.timeSlot})</span>
                </div>
                <p className="text-xs text-emerald-400 font-medium">{app.crop}</p>
                <span className="text-[11px] text-text/50 block">Status: {app.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
