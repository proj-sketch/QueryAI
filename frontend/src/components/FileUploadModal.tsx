'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface FileUploadModalProps {
  onClose: () => void;
}

export default function FileUploadModal({ onClose }: FileUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    // TODO: Send file to backend
    console.log('Uploading:', file.name);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <h3>Upload Dataset</h3>
            <p>Upload a CSV or Excel file to start querying your data with AI.</p>
          </div>
          <button className="chart-action-btn" onClick={onClose} style={{ marginTop: -4 }}>
            <X size={20} />
          </button>
        </div>

        <div
          className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={40} />
          <div className="upload-text">
            <strong>Click to upload</strong> or drag and drop
          </div>
          <div className="upload-hint">CSV, XLSX up to 50MB</div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>

        {file && (
          <div className="upload-file-info">
            <FileSpreadsheet />
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatSize(file.size)}</div>
            </div>
            <CheckCircle size={20} style={{ color: 'var(--success)' }} />
          </div>
        )}

        <div className="upload-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file}
            style={{ opacity: file ? 1 : 0.5 }}
          >
            Upload & Analyze
          </button>
        </div>
      </div>
    </div>
  );
}
