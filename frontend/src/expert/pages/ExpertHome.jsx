import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  MessageSquare,
  Calendar,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';
import expertService from '../services/expertService';
import StatCard from '../components/cards/StatCard';
import QuickActions from '../components/cards/QuickActions';
import DiagnosisReviewCard from '../components/cards/DiagnosisReviewCard';
import { LoadingSkeleton, ErrorState } from '../components/ui/StateViews';

export const ExpertHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dash, revs] = await Promise.all([
        expertService.getDashboard(),
        expertService.getReviews()
      ]);
      setDashboardData(dash);
      setRecentReviews((revs || []).slice(0, 2));
    } catch (err) {
      setError('Failed to load expert advisory dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <LoadingSkeleton type="cards" count={3} />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  const { stats, profile, hasProfile } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/60 via-teal-900/40 to-slate-900 p-6 sm:p-8 border border-emerald-500/20 shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Certified Agricultural Advisory Panel</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Empower Farmers, <br />
            <span className="text-emerald-400 bg-clip-text">Validate AI Crop Diagnostics.</span>
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            {hasProfile && profile ? (
              <>
                Welcome back, <span className="text-white font-semibold">{profile.qualification}</span> ({profile.institute}). You have <span className="text-emerald-400 font-bold">{stats?.pendingReviews || 0} AI disease diagnosis reports</span> pending your clinical validation.
              </>
            ) : (
              <>
                Welcome to KrishiMitra Expert Portal. Please complete your professional credentials in your profile to start receiving direct consultation requests.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/expert/reviews')}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <span>Review Diagnosis Queue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/expert/profile')}
              className="flex items-center gap-2 px-5 py-2.5 bg-card/60 hover:bg-card text-gray-200 border border-border text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <span>Manage Credentials</span>
            </button>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Profile Setup Warning Banner (if no profile configured yet) */}
      {!hasProfile && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Action Required: Complete Your Expert Profile</h4>
              <p className="text-xs text-amber-300/80">Add your degree qualifications, institute, and working hours to enable farmer booking.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/expert/profile')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
          >
            Setup Profile Now
          </button>
        </div>
      )}

      {/* 6 Animated Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Pending AI Reviews"
          value={stats?.pendingReviews || 0}
          subtitle="Disease diagnosis validation"
          icon={Stethoscope}
          colorScheme="emerald"
          onClick={() => navigate('/expert/reviews')}
        />
        <StatCard
          title="Today's Consultations"
          value={stats?.todayConsultations || 0}
          subtitle="Accepted farmer queries"
          icon={MessageSquare}
          colorScheme="amber"
          onClick={() => navigate('/expert/consultations')}
        />
        <StatCard
          title="Appointments"
          value={stats?.appointments || 0}
          subtitle="Scheduled field sessions"
          icon={Calendar}
          colorScheme="indigo"
          onClick={() => navigate('/expert/appointments')}
        />
        <StatCard
          title="Farmer Requests"
          value={stats?.farmerRequests || 0}
          subtitle="Pending direct inquiries"
          icon={Users}
          colorScheme="purple"
          onClick={() => navigate('/expert/farmers')}
        />
        <StatCard
          title="Expert Rating"
          value={`${stats?.rating || 4.9} ★`}
          subtitle="Farmer feedback score"
          icon={Star}
          colorScheme="blue"
          onClick={() => navigate('/expert/analytics')}
        />
        <StatCard
          title="Total Consultations"
          value={stats?.totalConsultations || 0}
          subtitle="Lifetime resolved cases"
          icon={CheckCircle2}
          colorScheme="rose"
          onClick={() => navigate('/expert/analytics')}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Hero AI Reviews Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text font-display">Priority AI Diagnosis Validation</h3>
            <p className="text-xs text-text/50">High severity leaf scan reports awaiting expert sign-off</p>
          </div>
          <button
            onClick={() => navigate('/expert/reviews')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentReviews.map((rev) => (
            <DiagnosisReviewCard
              key={rev.id || rev._id}
              review={rev}
              onApprove={() => alert('Diagnosis Approved successfully!')}
              onReject={() => alert('Diagnosis Rejected.')}
              onModify={() => alert('Recommendation modified!')}
              onGenerateReport={() => alert('Clinical Report PDF generated.')}
              onMarkReviewed={() => alert('Marked as reviewed.')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertHome;
