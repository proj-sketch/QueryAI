'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Moon, Sun, LogOut, Save, Check } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [saved, setSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    alert('You have been logged out.\n\n(Authentication integration pending)');
    setShowLogoutConfirm(false);
    onClose();
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={onClose}></div>
      <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
        <div className="settings-panel-header">
          <h3>Settings</h3>
          <button className="settings-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-panel-body">
          {/* Profile Section */}
          <div className="sp-section">
            <div className="sp-section-title">Profile</div>
            <div className="sp-avatar-row">
              <div className="sp-avatar">
                {username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div className="sp-avatar-name">{username}</div>
                <div className="sp-avatar-role">Business Analyst</div>
              </div>
            </div>

            <div className="sp-field">
              <label>Username</label>
              <div className="sp-input-wrap">
                <User size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setIsEditing(true); }}
                  className="sp-input"
                />
              </div>
            </div>

            <div className="sp-field">
              <label>Email</label>
              <div className="sp-input-wrap">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setIsEditing(true); }}
                  className="sp-input"
                />
              </div>
            </div>

            {isEditing && (
              <button className="btn btn-primary sp-save-btn" onClick={handleSave}>
                <Save size={14} /> Save Changes
              </button>
            )}
            {saved && (
              <div className="sp-saved-msg">
                <Check size={14} /> Changes saved successfully
              </div>
            )}
          </div>

          {/* Theme Section */}
          <div className="sp-section">
            <div className="sp-section-title">Appearance</div>
            <div className="sp-theme-row">
              <span>Theme</span>
              <div className="sp-theme-toggle" onClick={handleThemeToggle}>
                <div className={`sp-theme-option ${theme === 'dark' ? 'active' : ''}`}>
                  <Moon size={14} /> Dark
                </div>
                <div className={`sp-theme-option ${theme === 'light' ? 'active' : ''}`}>
                  <Sun size={14} /> Light
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="sp-section sp-danger-section">
            <div className="sp-section-title">Session</div>
            {!showLogoutConfirm ? (
              <button className="btn sp-logout-btn" onClick={() => setShowLogoutConfirm(true)}>
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <div className="sp-logout-confirm">
                <p>Are you sure you want to log out?</p>
                <div className="sp-logout-actions">
                  <button className="btn btn-ghost" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                  <button className="btn sp-logout-btn" onClick={handleLogout}>Yes, Log Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
