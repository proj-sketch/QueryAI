'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/* ============ SAMPLE DATA ============ */
const monthlyRevenue = [
  { month: 'Jan', revenue: 42000, target: 38000 },
  { month: 'Feb', revenue: 48000, target: 40000 },
  { month: 'Mar', revenue: 45000, target: 42000 },
  { month: 'Apr', revenue: 53000, target: 44000 },
  { month: 'May', revenue: 49000, target: 46000 },
  { month: 'Jun', revenue: 62000, target: 48000 },
  { month: 'Jul', revenue: 58000, target: 50000 },
  { month: 'Aug', revenue: 71000, target: 52000 },
  { month: 'Sep', revenue: 67000, target: 54000 },
  { month: 'Oct', revenue: 73000, target: 56000 },
  { month: 'Nov', revenue: 78000, target: 58000 },
  { month: 'Dec', revenue: 85000, target: 60000 },
];

const salesByRegion = [
  { region: 'North', sales: 124000, growth: 12 },
  { region: 'South', sales: 98000, growth: 8 },
  { region: 'East', sales: 156000, growth: 18 },
  { region: 'West', sales: 142000, growth: 15 },
  { region: 'Central', sales: 87000, growth: 6 },
];

const categoryDistribution = [
  { name: 'Electronics', value: 35 },
  { name: 'Apparel', value: 25 },
  { name: 'Home & Living', value: 18 },
  { name: 'Sports', value: 12 },
  { name: 'Others', value: 10 },
];

const userGrowth = [
  { month: 'Jan', users: 1200, active: 980 },
  { month: 'Feb', users: 1450, active: 1180 },
  { month: 'Mar', users: 1680, active: 1350 },
  { month: 'Apr', users: 1920, active: 1580 },
  { month: 'May', users: 2300, active: 1900 },
  { month: 'Jun', users: 2750, active: 2280 },
  { month: 'Jul', users: 3100, active: 2600 },
  { month: 'Aug', users: 3500, active: 2950 },
  { month: 'Sep', users: 3800, active: 3200 },
  { month: 'Oct', users: 4200, active: 3600 },
  { month: 'Nov', users: 4600, active: 3900 },
  { month: 'Dec', users: 5100, active: 4350 },
];

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b'];

/* ============ CUSTOM TOOLTIP ============ */
const customTooltipStyle: React.CSSProperties = {
  background: 'rgba(17, 20, 34, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '10px 14px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  fontSize: '12px',
  color: '#e2e8f0',
  lineHeight: '1.6',
};

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={customTooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#94a3b8' }}>{label}</div>
      {payload.map((p: TooltipPayload, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span>{p.name}: <strong style={{ color: '#fff' }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

/* ============ CHARTS ============ */

export function RevenueLineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={monthlyRevenue}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={(v) => `$${v / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          iconType="circle" 
          wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 8 }} 
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="url(#revGrad)"
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#475569"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={salesByRegion} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis 
          dataKey="region" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={(v) => `$${v / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="sales"
          name="Sales"
          fill="#3b82f6"
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
        >
          {salesByRegion.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(${220 + index * 15}, 80%, ${55 + index * 5}%)`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={categoryDistribution}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="value"
          nameKey="name"
          paddingAngle={3}
          strokeWidth={0}
          animationDuration={1200}
        >
          {categoryDistribution.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Legend 
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: 12, color: '#94a3b8', lineHeight: '24px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function UserGrowthAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={userGrowth}>
        <defs>
          <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={(v) => `${v / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          iconType="circle" 
          wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 8 }} 
        />
        <Area
          type="monotone"
          dataKey="users"
          name="Total Users"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#usersGrad)"
          dot={false}
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="active"
          name="Active Users"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill="url(#activeGrad)"
          dot={false}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
