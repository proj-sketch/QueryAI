'use client';

import React, { useState } from 'react';
import { User, Mail, Shield, Palette, LogOut, Moon, Sun } from 'lucide-react';

export default function SettingsView() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Settings</h2>
          <p className="view-subtitle">Manage your account preferences and app settings.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="card settings-card">
          <h3 className="settings-section-title">
            <User size={18} /> Profile Information
          </h3>
          <div className="settings-group">
            <div className="settings-item">
              <label>Username</label>
              <div className="settings-value">
                <User size={16} className="text-muted" />
                <input type="text" value="John Doe" readOnly className="settings-input form-control" />
              </div>
            </div>
            <div className="settings-item">
              <label>Email Address</label>
              <div className="settings-value">
                <Mail size={16} className="text-muted" />
                <input type="email" value="john.doe@example.com" readOnly className="settings-input form-control" />
              </div>
            </div>
            <div className="settings-item">
              <label>Role</label>
              <div className="settings-value">
                <Shield size={16} className="text-muted" />
                <span className="badge">Admin</span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary mt-4">Edit Profile</button>
        </div>

        {/* Preferences */}
        <div className="card settings-card">
          <h3 className="settings-section-title">
            <Palette size={18} /> Appearance
          </h3>
          <div className="settings-group">
            <div className="settings-item theme-item">
              <label>Theme Option</label>
              <div className="theme-options">
                <button 
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={16} /> Dark
                </button>
                <button 
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={16} /> Light
                </button>
              </div>
            </div>
          </div>

          <div className="settings-divider"></div>
          
          <h3 className="settings-section-title text-danger mt-4">
            Danger Zone
          </h3>
          <p className="text-muted text-sm mb-4">Logging out will end your current session.</p>
          <button className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
