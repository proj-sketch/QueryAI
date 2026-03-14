'use client';

import React from 'react';
import {
  LayoutDashboard,
  History,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Upload,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'history', icon: History, label: 'Query History' },
  { id: 'sources', icon: Database, label: 'Data Sources' },
  { id: 'upload', icon: Upload, label: 'Upload Data' },
  { id: 'docs', icon: BookOpen, label: 'Documentation' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap />
        </div>
        <div className="logo-text">
          <h1>QueryAI</h1>
          <span>BI Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Main Menu</div>
        {navItems.map((item) => (
          <a
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTabChange(item.id);
            }}
          >
            <item.icon />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">JD</div>
        <div className="user-info">
          <div className="user-name">John Doe</div>
          <div className="user-role">Business Analyst</div>
        </div>
      </div>
    </aside>
  );
}
