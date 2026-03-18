'use client';

import React, { useState } from 'react';
import { History, Search, FileText, CheckCircle, Clock, AlertCircle, Trash2, RotateCcw, Filter } from 'lucide-react';
import { ChatMessage } from '@/app/page';

interface QueryHistoryProps {
  messages: ChatMessage[];
}

export default function QueryHistory({ messages }: QueryHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const history = messages
    .map((msg, idx) => ({ msg, originalIndex: idx }))
    .filter(({ msg }) => msg.role === 'user')
    .map(({ msg, originalIndex }) => {
      const nextMsg = messages[originalIndex + 1];
      let status = 'pending';
      let duration = '—';
      let rows = 0;

      if (nextMsg && nextMsg.role === 'ai') {
        status = nextMsg.isError ? 'failed' : 'completed';
        const diffMs = nextMsg.timestamp.getTime() - msg.timestamp.getTime();
        duration = `${Math.abs(diffMs / 1000).toFixed(1)}s`;
        if (nextMsg.chartData) {
          rows = nextMsg.chartData.length;
        }
      }

      return {
        id: originalIndex,
        query: msg.content,
        date: msg.timestamp.toLocaleTimeString(),
        status,
        duration,
        rows
      };
    });

  const filtered = history.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    alert('Delete not supported in this session view.');
  };

  const handleRerun = (query: string) => {
    alert(`Re-running query:\n"${query}"\n\n(API integration pending)`);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Query History</h2>
          <p className="view-subtitle">Review your past interactions with Query AI and their results.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="header-search" style={{ minWidth: 250 }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '13px' }}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'failed')}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Rows</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                    No queries match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={16} className="text-muted" />
                        {item.query}
                      </div>
                    </td>
                    <td className="text-muted">{item.date}</td>
                    <td className="text-muted">{item.duration}</td>
                    <td className="text-muted">{item.rows > 0 ? item.rows : '—'}</td>
                    <td>
                      {item.status === 'completed' ? (
                        <span className="status-badge success">
                          <CheckCircle size={14} /> Completed
                        </span>
                      ) : (
                        <span className="status-badge danger">
                          <AlertCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Re-run Query" onClick={() => handleRerun(item.query)}>
                          <RotateCcw size={15} />
                        </button>
                        <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span className="text-muted text-sm">Showing {filtered.length} of {history.length} queries</span>
        </div>
      </div>
    </div>
  );
}
