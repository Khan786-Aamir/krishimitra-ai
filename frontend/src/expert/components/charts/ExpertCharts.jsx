import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const MonthlyConsultationsChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConsult" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
          <Area type="monotone" dataKey="count" name="Total Requests" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorConsult)" />
          <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#6366F1" strokeWidth={2} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DiseaseCategoryChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FarmerSatisfactionChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="rating" stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
          <Bar dataKey="count" name="Reviews" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  MonthlyConsultationsChart,
  DiseaseCategoryChart,
  FarmerSatisfactionChart
};
