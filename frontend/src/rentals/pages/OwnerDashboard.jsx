import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Tractor, CheckCircle, Clock, Inbox, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Loader, StatisticCard } from '../../components/ui';

export const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [fleet, setFleet] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [fleetData, requestsData] = await Promise.all([
          equipmentService.getMyEquipment(),
          equipmentService.getReceivedRequests()
        ]);
        setFleet(fleetData || []);
        setRequests(requestsData || []);
      } catch (err) {
        console.error('Error loading owner dashboard:', err);
        addToast('Failed to load dashboard metrics', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute requested metrics
  const totalEquipment = fleet.length; // 1. Total Equipment
  const activeRentals = requests.filter(r => r.status === 'Approved').length; // 2. Active Rentals
  const pendingRequests = requests.filter(r => r.status === 'Pending').length; // 3. Pending Requests
  const completedRentals = requests.filter(r => r.status === 'Completed').length; // 4. Completed Rentals
  
  // 5. Estimated Earnings (Sum of totalAmount for Completed and Approved requests)
  const estimatedEarnings = requests
    .filter(r => r.status === 'Completed' || r.status === 'Approved')
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  // Activity summary log
  const recentActivities = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" /> Owner Dashboard
          </h1>
          <p className="text-xs text-text/40 font-semibold mt-1">
            Check machinery statistics, manage earnings logs, and coordinate active reservations.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate('/rentals/my-equipment')} variant="outline" className="border-border hover:bg-surface text-xs font-bold px-4 py-2.5 rounded-xl">
            My Machinery
          </Button>
          <Button onClick={() => navigate('/rentals/add-equipment')} className="text-xs font-bold px-4 py-2.5 rounded-xl">
            List New Machine
          </Button>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Fleet</span>
            <Tractor className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalEquipment}</span>
          <span className="block text-[9px] text-gray-500 font-semibold mt-1">Listed machines</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Rentals</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-black text-primary">{activeRentals}</span>
          <span className="block text-[9px] text-gray-500 font-semibold mt-1">Currently leased out</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pending Requests</span>
            <Inbox className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400">{pendingRequests}</span>
          <span className="block text-[9px] text-gray-500 font-semibold mt-1">Requires audit</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-white">{completedRentals}</span>
          <span className="block text-[9px] text-gray-500 font-semibold mt-1">Successfully finished</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Est. Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400">₹{estimatedEarnings.toLocaleString()}</span>
          <span className="block text-[9px] text-gray-500 font-semibold mt-1">Completed & Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Recent requests & quick approval list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-premium space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white font-display">Recent Booking Handover Requests</h3>
            <button
              onClick={() => navigate('/rentals/requests')}
              className="text-xs text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Requests</span> <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-xs text-gray-500 font-semibold italic py-8 text-center">No bookings requested yet.</p>
          ) : (
            <div className="space-y-4 divide-y divide-border/40">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between text-xs font-semibold">
                  <div className="space-y-1">
                    <h4 className="text-white font-extrabold">{act.equipment?.equipmentName}</h4>
                    <p className="text-gray-500 text-[10px] font-medium">
                      Rented by: {act.renter?.name} | {act.numberOfDays} days
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-extrabold text-emerald-400 block">₹{act.totalAmount?.toLocaleString()}</span>
                    <Badge className={
                      act.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : (act.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20')
                    }>
                      {act.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Fleet Status distribution */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-premium space-y-4">
          <h3 className="text-sm font-bold text-white font-display">Machinery Status</h3>
          
          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-400">Available</span>
                <span className="text-white">{fleet.filter(f => f.availabilityStatus === 'Available').length} / {totalEquipment}</span>
              </div>
              <div className="h-2 w-full bg-surface border border-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${totalEquipment > 0 ? (fleet.filter(f => f.availabilityStatus === 'Available').length / totalEquipment) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-400">Booked (Leased)</span>
                <span className="text-white">{fleet.filter(f => f.availabilityStatus === 'Booked').length} / {totalEquipment}</span>
              </div>
              <div className="h-2 w-full bg-surface border border-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${totalEquipment > 0 ? (fleet.filter(f => f.availabilityStatus === 'Booked').length / totalEquipment) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-orange-400">Maintenance</span>
                <span className="text-white">{fleet.filter(f => f.availabilityStatus === 'Maintenance').length} / {totalEquipment}</span>
              </div>
              <div className="h-2 w-full bg-surface border border-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${totalEquipment > 0 ? (fleet.filter(f => f.availabilityStatus === 'Maintenance').length / totalEquipment) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-surface/50 border border-border/40 rounded-2xl flex items-center gap-3 mt-6">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
              Rentals yield is up by <span className="text-emerald-400 font-bold">+12%</span> since last month. Keep machinery active and set competitive rates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
