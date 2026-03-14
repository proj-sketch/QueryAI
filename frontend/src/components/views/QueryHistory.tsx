'use client';

import React, { useState } from 'react';
import { History, Search, FileText, CheckCircle, Clock, AlertCircle, Trash2, RotateCcw, Filter } from 'lucide-react';

const initialHistory = [
  { id: 1, query: 'Show monthly revenue for Q3 by region', date: '2 hours ago', status: 'completed', duration: '1.2s', rows: 24 },
  { id: 2, query: 'Compare top 5 products by sales volume', date: '5 hours ago', status: 'completed', duration: '0.8s', rows: 5 },
  { id: 3, query: 'Display customer acquisition cost trends', date: 'Yesterday', status: 'failed', duration: '4.5s', rows: 0 },
  { id: 4, query: 'Revenue breakdown by product category', date: 'Yesterday', status: 'completed', duration: '2.1s', rows: 8 },
  { id: 5, query: 'What is the churn rate for enterprise customers?', date: '2 days ago', status: 'completed', duration: '1.5s', rows: 1 },
  { id: 6, query: 'Show top 10 customers by lifetime value', date: '2 days ago', status: 'completed', duration: '2.8s', rows: 10 },
  { id: 7, query: 'Monthly active users trend for the past year', date: '3 days ago', status: 'completed', duration: '1.1s', rows: 12 },
  { id: 8, query: 'Compare sales figures Q1 vs Q2 2024', date: '3 days ago', status: 'completed', duration: '0.9s', rows: 6 },
  { id: 9, query: 'Show average order value by region', date: '4 days ago', status: 'failed', duration: '3.2s', rows: 0 },
  { id: 10, query: 'List all products with declining sales', date: '5 days ago', status: 'completed', duration: '1.7s', rows: 14 },
  { id: 11, query: 'What percentage of revenue comes from new customers?', date: '1 week ago', status: 'completed', duration: '2.4s', rows: 1 },
  { id: 12, query: 'Show inventory levels by warehouse', date: '1 week ago', status: 'completed', duration: '1.3s', rows: 7 },
];

export default function QueryHistory() {
  const [history, setHistory] = useState(initialHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const filtered = history.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
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
