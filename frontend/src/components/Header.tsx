'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Dashboard</h2>
        <span className="header-subtitle">Welcome back! Here&apos;s your business intelligence overview.</span>
      </div>
      <div className="header-right">
        <div className="header-search">
          <Search />
          <span>Search anything...</span>
          <kbd>⌘K</kbd>
        </div>
        <button className="header-icon-btn" title="Help">
          <HelpCircle size={20} />
        </button>
        <button className="header-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="header-avatar" title="Profile">
          JD
        </div>
      </div>
    </header>
  );
}
