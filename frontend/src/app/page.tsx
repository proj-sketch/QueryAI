'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardArea from '@/components/DashboardArea';
import ChatPanel from '@/components/ChatPanel';
import FileUploadModal from '@/components/FileUploadModal';

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="main-content">
          <DashboardArea />
        </main>
      </div>
      <ChatPanel 
        collapsed={sidebarCollapsed} 
        onUploadClick={() => setShowUploadModal(true)} 
      />
      {showUploadModal && (
        <FileUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
