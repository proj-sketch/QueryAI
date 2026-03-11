'use client';

import React from 'react';
import { DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import {
  RevenueLineChart,
  SalesBarChart,
  CategoryPieChart,
  UserGrowthAreaChart,
} from './SampleCharts';

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$842K',
    trend: 12.5,
    trendLabel: 'vs last month',
    icon: <DollarSign size={20} />,
    iconColor: 'blue' as const,
    sparklineData: [
      { value: 30 }, { value: 45 }, { value: 42 }, { value: 55 },
      { value: 50 }, { value: 62 }, { value: 58 }, { value: 70 },
      { value: 68 }, { value: 75 }, { value: 80 }, { value: 85 },
    ],
  },
  {
    title: 'Active Users',
    value: '5,120',
    trend: 8.3,
    trendLabel: 'vs last month',
    icon: <Users size={20} />,
    iconColor: 'green' as const,
    sparklineData: [
      { value: 20 }, { value: 25 }, { value: 30 }, { value: 28 },
      { value: 35 }, { value: 40 }, { value: 38 }, { value: 45 },
      { value: 50 }, { value: 48 }, { value: 55 }, { value: 60 },
    ],
  },
  {
    title: 'Total Orders',
    value: '12,847',
    trend: -2.1,
    trendLabel: 'vs last week',
    icon: <ShoppingCart size={20} />,
    iconColor: 'purple' as const,
    sparklineData: [
      { value: 50 }, { value: 48 }, { value: 52 }, { value: 45 },
      { value: 47 }, { value: 43 }, { value: 46 }, { value: 40 },
      { value: 42 }, { value: 38 }, { value: 41 }, { value: 39 },
    ],
  },
  {
    title: 'Avg. Order Value',
    value: '$68.50',
    trend: 5.7,
    trendLabel: 'vs last quarter',
    icon: <BarChart3 size={20} />,
    iconColor: 'orange' as const,
    sparklineData: [
      { value: 40 }, { value: 42 }, { value: 45 }, { value: 44 },
      { value: 48 }, { value: 50 }, { value: 49 }, { value: 53 },
      { value: 55 }, { value: 54 }, { value: 58 }, { value: 62 },
    ],
  },
];

export default function DashboardArea() {
  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        {kpiData.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} delay={i * 80} />
        ))}
      </div>

      {/* Revenue + Pie */}
      <div className="charts-row" style={{ animationDelay: '0.3s' }}>
        <ChartCard
          title="Monthly Revenue"
          subtitle="Revenue vs Target for 2024"
          chartType="Line"
        >
          <RevenueLineChart />
        </ChartCard>
        <ChartCard
          title="Product Categories"
          subtitle="Distribution by category"
          chartType="Donut"
        >
          <CategoryPieChart />
        </ChartCard>
      </div>

      {/* Sales + User Growth */}
      <div className="charts-row-equal">
        <ChartCard
          title="Sales by Region"
          subtitle="Regional performance breakdown"
          chartType="Bar"
        >
          <SalesBarChart />
        </ChartCard>
        <ChartCard
          title="User Growth"
          subtitle="Total vs Active users over time"
          chartType="Area"
        >
          <UserGrowthAreaChart />
        </ChartCard>
      </div>
    </div>
  );
}
