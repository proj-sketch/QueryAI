'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  iconColor: 'blue' | 'green' | 'purple' | 'orange';
  sparklineData: { value: number }[];
  delay?: number;
}

export default function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  iconColor,
  sparklineData,
  delay = 0,
}: KPICardProps) {
  const isUp = trend >= 0;
  const sparkColor = isUp ? '#22c55e' : '#ef4444';

  return (
    <div
      className={`kpi-card animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="kpi-header">
        <div className={`kpi-icon ${iconColor}`}>{icon}</div>
        <div className={`kpi-trend ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp /> : <TrendingDown />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{title} · {trendLabel}</div>
      <div className="kpi-sparkline">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`spark-${iconColor}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparkColor}
              strokeWidth={2}
              fill={`url(#spark-${iconColor})`}
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
