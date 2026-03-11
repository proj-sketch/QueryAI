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
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: History, label: 'Query History', active: false },
  { icon: Database, label: 'Data Sources', active: false },
  { icon: Upload, label: 'Upload Data', active: false },
  { icon: BookOpen, label: 'Documentation', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
            key={item.label}
            className={`nav-item ${item.active ? 'active' : ''}`}
            href="#"
            onClick={(e) => e.preventDefault()}
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
