'use client';

import React, { useState } from 'react';
import { Database, Plus, Check, RefreshCw, Trash2, FileSpreadsheet, Server, Cloud } from 'lucide-react';

interface DataSource {
  id: number;
  name: string;
  type: string;
  icon: 'db' | 'file' | 'cloud';
  status: 'connected' | 'syncing' | 'error';
  lastSync: string;
  records: string;
  tables: number;
}

const initialSources: DataSource[] = [
  { id: 1, name: 'Main Production DB', type: 'PostgreSQL', icon: 'db', status: 'connected', lastSync: '10 mins ago', records: '2.4M', tables: 42 },
  { id: 2, name: 'Analytics Warehouse', type: 'Snowflake', icon: 'cloud', status: 'connected', lastSync: '1 hour ago', records: '14.8M', tables: 86 },
  { id: 3, name: 'Legacy Sales Data', type: 'MySQL', icon: 'db', status: 'syncing', lastSync: 'Sync in progress', records: '850K', tables: 21 },
  { id: 4, name: 'BMW Vehicle Inventory', type: 'CSV Upload', icon: 'file', status: 'connected', lastSync: '2 hours ago', records: '4,200', tables: 1 },
  { id: 5, name: 'Marketing Analytics', type: 'BigQuery', icon: 'cloud', status: 'connected', lastSync: '30 mins ago', records: '6.1M', tables: 35 },
  { id: 6, name: 'CRM Database', type: 'MongoDB', icon: 'db', status: 'error', lastSync: 'Connection failed', records: '—', tables: 0 },
];

export default function DataSources() {
  const [sources, setSources] = useState(initialSources);
  const [syncing, setSyncing] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    const source = sources.find((s) => s.id === id);
    if (confirm(`Remove "${source?.name}"? This will disconnect the data source.`)) {
      setSources((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSync = (id: number) => {
    setSyncing(id);
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'syncing' as const, lastSync: 'Sync in progress' } : s))
    );
    // Simulate sync completion
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'connected' as const, lastSync: 'Just now' } : s))
      );
      setSyncing(null);
    }, 2000);
  };

  const handleAddNew = () => {
    alert('Add New Connection\n\nThis feature will be available after API integration.\nYou can currently upload CSV files using the Upload button.');
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'file': return <FileSpreadsheet size={24} />;
      case 'cloud': return <Cloud size={24} />;
      default: return <Database size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'syncing': return 'warning';
      case 'error': return 'danger';
      default: return '';
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Data Sources</h2>
          <p className="view-subtitle">Manage your connected databases and integrations.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> Add Connection
        </button>
      </div>

      <div className="grid-cards source-grid">
        {sources.map((source) => (
          <div key={source.id} className="card source-card">
            <div className="source-header">
              <div className="source-icon">
                {getIcon(source.icon)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`status-dot ${getStatusColor(source.status)}`} title={source.status}></span>
                <span className="source-status-label">{source.status}</span>
              </div>
            </div>
            <h3 className="source-name">{source.name}</h3>
            <p className="source-type">{source.type}</p>

            <div className="source-stats">
              <div className="stat">
                <span className="stat-label">Records</span>
                <span className="stat-value">{source.records}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Tables</span>
                <span className="stat-value">{source.tables > 0 ? source.tables : '—'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Last Sync</span>
                <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {source.status === 'syncing' ? <RefreshCw size={12} className="spinning" /> : <Check size={12} />}
                  {source.lastSync}
                </span>
              </div>
            </div>

            <div className="source-actions">
              <button
                className="btn-sm btn-ghost"
                onClick={() => handleSync(source.id)}
                disabled={syncing === source.id}
                title="Re-sync"
              >
                <RefreshCw size={14} className={syncing === source.id ? 'spinning' : ''} /> Sync
              </button>
              <button
                className="btn-sm btn-danger-ghost"
                onClick={() => handleRemove(source.id)}
                title="Remove"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}

        <div className="card source-card add-new" onClick={handleAddNew}>
          <div className="add-icon">
            <Plus size={32} />
          </div>
          <h3>Connect New Source</h3>
          <p>PostgreSQL, MySQL, Snowflake, CSV, etc.</p>
        </div>
      </div>
    </div>
  );
}
