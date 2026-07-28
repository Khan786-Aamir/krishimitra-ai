import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, RefreshCw, Landmark, ShoppingCart, Activity } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import adminService from '../../services/adminService';
import { Button } from '../../components/ui';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#22C55E', '#3B82F6', '#EAB308', '#A855F7', '#EF4444'];

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-card w-1/4 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-card rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Platform Ecosystem Analytics
          </h1>
          <p className="text-gray-400 text-xs mt-1">Visualize growth indices, financial trends, rental metrics, and crop health rates.</p>
        </div>
        <Button variant="outline" className="border-border text-gray-400 hover:text-white" onClick={fetchAnalytics}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Platform Growth (Monthly registrations & rentals) */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <LineIcon className="w-4 h-4 text-primary" />
            User Registrations & Rentals
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.platformGrowth}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Area type="monotone" dataKey="registrations" stroke="#22C55E" fillOpacity={1} fill="url(#colorReg)" name="Registrations" />
                <Line type="monotone" dataKey="rentals" stroke="#A855F7" strokeWidth={2} name="Equipment Leases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: User Role Distribution */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-sky-400" />
            User Role Demographics
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Marketplace Growth (Revenue overview) */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            Ecosystem Marketplace Revenues (INR)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.marketplaceGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" name="Marketplace Earnings (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Equipment Usage by category */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Equipment Listings vs Bookings
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.equipmentUsage}>
                <XAxis dataKey="category" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Bar dataKey="listings" fill="#EAB308" name="Leased Machinery" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="#A855F7" name="Completed Leases" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: Consultation Trends */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-purple-400" />
            Farmer Expert Consultations Trend
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.consultationTrends}>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Line type="monotone" dataKey="consultations" stroke="#A855F7" strokeWidth={3} name="Total Advisories" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 6: AI Diagnosis Trends (Healthy vs disease by crop) */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            AI Leaf Diagnosis Scans by crop
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.aiDiagnosisTrends}>
                <XAxis dataKey="crop" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Bar dataKey="healthy" fill="#22C55E" name="Healthy Leaf" stackId="a" />
                <Bar dataKey="disease" fill="#EF4444" name="Infected Leaf" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 7: Government Schemes Reach */}
        <div className="bg-card border border-border rounded-3xl p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 mb-4">
            <Landmark className="w-4 h-4 text-primary" />
            Government Scheme application reach
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.govSchemeReach} layout="vertical">
                <XAxis type="number" stroke="#6b7280" fontSize={10} />
                <YAxis dataKey="title" type="category" stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Legend />
                <Bar dataKey="reach" fill="#22C55E" name="Registered Farmers Reached" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
