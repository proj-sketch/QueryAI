'use client';

import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#f43f5e'];

const customTooltipStyle: React.CSSProperties = {
  background: 'rgba(17, 20, 34, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '10px 14px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  fontSize: '12px',
  color: '#e2e8f0',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={customTooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#94a3b8' }}>{label}</div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span>{p.name}: <strong style={{ color: '#fff' }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DynamicChart({ data, type }: { data: any[], type: string }) {
  if (!data || data.length === 0) return <div>No data to visualize.</div>;

  const keys = Object.keys(data[0]);
  // Assume first key is string/category for X axis, rest are numeric for Y axis
  const xKey = keys[0];
  const yKeys = keys.slice(1).filter(k => typeof data[0][k] === 'number');

  if (yKeys.length === 0) {
     return (
       <div style={{ overflowX: 'auto', maxHeight: 400 }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
           <thead>
             <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
               {keys.map(k => <th key={k} style={{ padding: '8px 12px' }}>{k}</th>)}
             </tr>
           </thead>
           <tbody>
             {data.map((row, i) => (
               <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                 {keys.map(k => <td key={k} style={{ padding: '8px 12px' }}>{row[k]}</td>)}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
  }

  // Fallback to table if type is table or unknown
  if (type === 'table' || !['bar', 'line', 'pie', 'area'].includes(type.toLowerCase())) {
     return (
       <div style={{ overflowX: 'auto', maxHeight: 400 }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
           <thead>
             <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
               {keys.map(k => <th key={k} style={{ padding: '8px 12px' }}>{k}</th>)}
             </tr>
           </thead>
           <tbody>
             {data.map((row, i) => (
               <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                 {keys.map(k => <td key={k} style={{ padding: '8px 12px' }}>{row[k]}</td>)}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
  }

  const renderContent = () => {
    switch (type.toLowerCase()) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey={xKey} stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            {yKeys.map((k, i) => (
              <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey={xKey} stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            {yKeys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={50} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              {yKeys.map((k, i) => (
                <linearGradient key={`color${k}`} id={`color${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey={xKey} stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            {yKeys.map((k, i) => (
              <Area key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} fillOpacity={1} fill={`url(#color${k})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );
      case 'pie':
        const valKey = yKeys[0];
        return (
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey={valKey}
              nameKey={xKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: 350, marginTop: 24, padding: 16, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ResponsiveContainer width="100%" height="100%">
        {renderContent() as any}
      </ResponsiveContainer>
    </div>
  );
}
