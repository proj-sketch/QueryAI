'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardArea from '@/components/DashboardArea';
import FileUploadModal from '@/components/FileUploadModal';
import SettingsPanel from '@/components/SettingsPanel';
import QueryHistory from '@/components/views/QueryHistory';
import DataSources from '@/components/views/DataSources';
import Documentation from '@/components/views/Documentation';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData?: any;
  chartType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  charts?: { title: string, chart_type: string, chart_data: any[] }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kpis?: { title: string, value: string, iconColor?: string }[];
  suggestedQuestions?: string[];
  sqlQuery?: string;
  isError?: boolean;
}

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedDataset, setUploadedDataset] = useState<string | null>(null);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardArea onUploadClick={() => setShowUploadModal(true)} messages={messages} setMessages={setMessages} uploadedDataset={uploadedDataset} />;
      case 'history':
        return <QueryHistory messages={messages} />;
      case 'sources':
        return <DataSources />;
      case 'docs':
        return <Documentation />;
      default:
        return <DashboardArea onUploadClick={() => setShowUploadModal(true)} messages={messages} setMessages={setMessages} uploadedDataset={uploadedDataset} />;
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'upload') {
      setShowUploadModal(true);
    } else if (tabId === 'settings') {
      setShowSettings(true);
    } else {
      setActiveTab(tabId);
      setShowSettings(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="main-content">
          {renderActiveView()}
        </main>
      </div>

      {showUploadModal && (
        <FileUploadModal 
          onClose={() => setShowUploadModal(false)} 
          onUploadSuccess={(filename) => {
            setUploadedDataset(filename);
            setShowUploadModal(false);
          }}
        />
      )}

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
