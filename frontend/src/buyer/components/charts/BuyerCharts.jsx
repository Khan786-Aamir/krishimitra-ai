import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const MonthlySpendingChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
            formatter={(val) => [`₹${val.toLocaleString()}`, 'Purchases']}
          />
          <Area type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PriceTrendChart = ({ data = [] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
          <Line type="monotone" dataKey="wheat" name="Sharbati Wheat" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="rice" name="Basmati Rice" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="onion" name="Red Onions" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryDistributionChart = ({ data = [] }) => {
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
              <Cell key={`cell-${index}`} fill={entry.color || '#6366F1'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
            formatter={(val) => [`${val}%`, 'Share']}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  MonthlySpendingChart,
  PriceTrendChart,
  CategoryDistributionChart
};
