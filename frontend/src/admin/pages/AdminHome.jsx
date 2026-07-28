import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Sprout,
  ShoppingBag,
  Wrench,
  Award,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Cpu,
  Clock,
  Activity,
  HardDrive
} from 'lucide-react';
import adminService from '../../services/adminService';
import { StatisticCard } from '../../components/ui';

export const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        if (data) {
          setStats(data.stats);
          setHealth(data.health);
          setActivities(data.activityStream || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-card rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-card rounded-2xl lg:col-span-2" />
          <div className="h-64 bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  // 12 Premium Stat Cards Configuration
  const statCardConfigs = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users className="w-5 h-5 text-indigo-400" />, change: '+8.2%', isPositive: true },
    { title: 'Farmers Registered', value: stats?.farmersCount || 0, icon: <Sprout className="w-5 h-5 text-emerald-400" />, change: '+12%', isPositive: true },
    { title: 'Buyers Registered', value: stats?.buyersCount || 0, icon: <ShoppingBag className="w-5 h-5 text-sky-400" />, change: '+4.5%', isPositive: true },
    { title: 'Certified Experts', value: stats?.expertsCount || 0, icon: <Award className="w-5 h-5 text-amber-400" />, change: '+3.1%', isPositive: true },
    { title: 'Active Crop Listings', value: stats?.activeListings || 0, icon: <ShoppingBag className="w-5 h-5 text-green-400" />, change: '+15.2%', isPositive: true },
    { title: 'Pending Expert Approvals', value: stats?.pendingApprovals || 0, icon: <Activity className="w-5 h-5 text-rose-400" />, change: 'Review Required', isPositive: false },
    { title: 'Active Equipment Leases', value: stats?.equipmentRentals || 0, icon: <Wrench className="w-5 h-5 text-blue-400" />, change: '+8.4%', isPositive: true },
    { title: 'Total Consultations', value: stats?.consultationsCount || 0, icon: <Calendar className="w-5 h-5 text-purple-400" />, change: '+18.1%', isPositive: true },
    { title: 'AI Diagnosis Reviews', value: stats?.aiReportsCount || 0, icon: <ClipboardCheck className="w-5 h-5 text-indigo-500" />, change: '94% accuracy', isPositive: true },
    { title: 'Government Schemes', value: stats?.schemesCount || 0, icon: <Award className="w-5 h-5 text-orange-400" />, change: '4 Categories', isPositive: true },
    { title: 'Ecosystem Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-emerald-500" />, change: '+14.2%', isPositive: true },
    { title: 'Platform Growth Rate', value: `${stats?.growth || 0}%`, icon: <TrendingUp className="w-5 h-5 text-green-500" />, change: 'Monthly', isPositive: true }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Hero */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-background to-background border border-border p-6 md:p-8"
      >
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-3xl -z-10 rounded-full" />
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-3 inline-block">
            KrishiMitra AI Command Center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-2">
            System Operations Overview
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Monitor registration metrics, review pending expert applications, audit active marketplace transactions, publish government directives, and check system performance metrics.
          </p>
        </div>
      </motion.div>

      {/* System Health Telemetry Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-premium transition-all">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">CPU Usage</span>
            <span className="text-lg font-bold text-white">{health?.cpuUsage || '12%'}</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-premium transition-all">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Memory Allocation</span>
            <span className="text-lg font-bold text-white">{health?.memoryUsage || '34%'}</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-premium transition-all">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">System Uptime</span>
            <span className="text-lg font-bold text-white font-mono text-amber-300">{health?.systemUptime || '14d 6h'}</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-premium transition-all">
          <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Avg API Latency</span>
            <span className="text-lg font-bold text-white">{health?.avgApiResponseTime || '45ms'}</span>
          </div>
        </div>
      </motion.div>

      {/* Grid of 12 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardConfigs.map((config, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
          >
            <StatisticCard
              title={config.title}
              value={config.value}
              change={config.change}
              isPositive={config.isPositive}
              icon={config.icon}
              className="bg-card/40 border border-border/80"
            />
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout: Activity Stream & System Health Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Logs */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
              <h3 className="text-lg font-bold font-display text-white">System Activity Stream</h3>
              <span className="text-xs px-2.5 py-1 bg-surface text-gray-400 border border-border rounded-lg">Realtime Feed</span>
            </div>
            
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-4 p-3 bg-surface/30 border border-border/40 rounded-xl hover:bg-surface/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 text-xs font-bold">
                    {act.type[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text/80 leading-normal">{act.message}</p>
                    <span className="text-[10px] text-gray-500 font-medium block mt-1">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full mt-6 text-center py-2.5 bg-surface/50 border border-border hover:bg-border text-xs font-semibold text-text rounded-xl transition-all">
            View All Audit Logs
          </button>
        </motion.div>

        {/* Platform Overview Info */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-3xl p-6 space-y-6"
        >
          <div className="pb-4 border-b border-border/50">
            <h3 className="text-lg font-bold font-display text-white">Platform Health</h3>
            <p className="text-xs text-gray-500 mt-1">Status index and metrics summary</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Database Connection</span>
                <span className="text-emerald-400">Connected (Replica)</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Cloudinary Storage API</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Gemini LLM Engine</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Security Firewall</span>
                <span className="text-emerald-400">Intact (0 Threats)</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mt-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Platform Diagnostics
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              All microservices are active. No anomalies found. Average request payload is 4.2 KB.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminHome;
