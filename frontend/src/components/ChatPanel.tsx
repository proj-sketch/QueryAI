'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Paperclip } from 'lucide-react';

interface ChatPanelProps {
  collapsed: boolean;
  onUploadClick: () => void;
}

const samplePrompts = [
  'Show monthly revenue for Q3 by region',
  'Compare top 5 products by sales volume',
  'Display customer acquisition cost trends',
  'Revenue breakdown by product category',
];

export default function ChatPanel({ collapsed, onUploadClick }: ChatPanelProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // TODO: Send query to backend
    console.log('Query:', query);
    setQuery('');
  };

  const handleChipClick = (prompt: string) => {
    setQuery(prompt);
  };

  return (
    <div className={`chat-panel ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="chat-container">
        <div className="prompt-chips">
          {samplePrompts.map((prompt) => (
            <button 
              key={prompt} 
              className="prompt-chip" 
              onClick={() => handleChipClick(prompt)}
            >
              <Sparkles size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="chat-input-wrapper">
            <div className="chat-input-icon">
              <Sparkles />
            </div>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask QueryAI anything about your data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="button" 
              className="chat-upload-btn" 
              onClick={onUploadClick}
              title="Upload CSV"
            >
              <Paperclip />
            </button>
            <button type="submit" className="chat-send-btn" title="Send query">
              <Send />
            </button>
          </div>
        </form>

        <div className="chat-footer-text">
          QueryAI can make mistakes. Always verify important business decisions with raw data.
        </div>
      </div>
    </div>
  );
}
