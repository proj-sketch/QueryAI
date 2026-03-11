'use client';

import React from 'react';
import { Maximize2, Download, Filter } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  chartType?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function ChartCard({
  title,
  subtitle,
  chartType = 'chart',
  children,
  className = '',
  bodyClassName = 'chart-body',
}: ChartCardProps) {
  return (
    <div className={`chart-card animate-slide-up ${className}`}>
      <div className="chart-card-header">
        <div className="chart-card-title-section">
          <div className="chart-card-title">{title}</div>
          {subtitle && <div className="chart-card-subtitle">{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="chart-type-badge">{chartType}</span>
          <div className="chart-actions">
            <button className="chart-action-btn" title="Filter">
              <Filter />
            </button>
            <button className="chart-action-btn" title="Download">
              <Download />
            </button>
            <button className="chart-action-btn" title="Expand">
              <Maximize2 />
            </button>
          </div>
        </div>
      </div>
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}
