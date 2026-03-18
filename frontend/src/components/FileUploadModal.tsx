'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadModalProps {
  onClose: () => void;
  onUploadSuccess?: (filename: string) => void;
}

export default function FileUploadModal({ onClose, onUploadSuccess }: FileUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; table_name?: string; row_count?: number; column_count?: number } | null>(null);
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
      setUploadResult(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadResult({
          success: true,
          message: data.message,
          table_name: data.table_name,
          row_count: data.row_count,
          column_count: data.column_count,
        });
        if (onUploadSuccess) {
          setTimeout(() => onUploadSuccess(file.name), 1500);
        }
      } else {
        setUploadResult({
          success: false,
          message: data.detail || 'Upload failed. Please try again.',
        });
      }
    } catch {
      setUploadResult({
        success: false,
        message: 'Cannot connect to backend. Make sure the Python server is running on port 8000.',
      });
    } finally {
      setIsUploading(false);
    }
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

        {!uploadResult?.success && (
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
        )}

        {file && !uploadResult?.success && (
          <div className="upload-file-info">
            <FileSpreadsheet />
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatSize(file.size)}</div>
            </div>
            <CheckCircle size={20} style={{ color: 'var(--success)' }} />
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="upload-file-info" style={{
            borderColor: uploadResult.success ? 'var(--success)' : 'var(--error, #ef4444)',
            background: uploadResult.success ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          }}>
            {uploadResult.success ? (
              <CheckCircle size={22} style={{ color: 'var(--success)' }} />
            ) : (
              <AlertCircle size={22} style={{ color: 'var(--error, #ef4444)' }} />
            )}
            <div className="file-details">
              <div className="file-name">{uploadResult.message}</div>
              {uploadResult.success && uploadResult.row_count != null && (
                <div className="file-size">
                  {uploadResult.row_count.toLocaleString()} rows · {uploadResult.column_count} columns · Table: {uploadResult.table_name}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="upload-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            {uploadResult?.success ? 'Done' : 'Cancel'}
          </button>
          {!uploadResult?.success && (
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!file || isUploading}
              style={{ opacity: file && !isUploading ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="spinning" /> Uploading...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

