'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { validatePDFFile, formatFileSize } from '@/lib/pdf';

interface FileUploaderProps {
  onFileUpload: (file: File, content: string) => Promise<void>;
  isLoading?: boolean;
}

export function FileUploader({
  onFileUpload,
  isLoading = false,
}: FileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setUploadProgress(0);

      for (const file of acceptedFiles) {
        if (!validatePDFFile(file)) {
          setError(
            'Please upload a valid PDF file (max 10MB). Only .pdf files are supported.'
          );
          return;
        }

        try {
          setUploadProgress(25);

          // Process the PDF
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              setUploadProgress(50);

              const arrayBuffer = e.target?.result as ArrayBuffer;
              const response = await fetch('/api/pdf/process', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/octet-stream',
                },
                body: arrayBuffer,
              });

              if (!response.ok) {
                throw new Error('Failed to process PDF');
              }

              const data = await response.json();
              setUploadProgress(75);

              await onFileUpload(file, data.text || '');
              setUploadProgress(100);

              // Reset progress after 2 seconds
              setTimeout(() => setUploadProgress(0), 2000);
            } catch (err) {
              setError('Failed to process PDF file');
              console.error(err);
            }
          };

          reader.onerror = () => {
            setError('Failed to read file');
          };

          reader.readAsArrayBuffer(file);
        } catch (err) {
          setError('Error processing file');
          console.error(err);
        }
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative backdrop-blur-md border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
          isDragActive
            ? 'border-purple-500 bg-purple-600/10 scale-105'
            : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-600/10'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
              📄
            </div>
            <div className="absolute inset-0 animate-pulse-glow" />
          </div>

          {isDragActive ? (
            <div className="animate-fade-in">
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                📎 Drop PDF here
              </p>
              <p className="text-gray-300 mt-2">
                Release to upload
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Upload PDF Document
              </p>
              <p className="text-gray-400 mt-2">
                Drag and drop or click to select
              </p>
              <p className="text-sm text-gray-500 mt-3 py-3 px-4 rounded-lg bg-white/5 border border-white/10 inline-block">
                ✓ Supported: PDF | ✓ Max: 10MB | ✓ Instant Processing
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-6 space-y-3 animate-slide-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">
              Processing Document...
            </p>
            <span className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full h-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/50"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadProgress === 100 && (
        <div className="mt-6 p-4 backdrop-blur-md bg-green-600/10 border border-green-500/30 rounded-xl animate-slide-in">
          <p className="text-green-400 font-semibold flex items-center justify-center">
            ✓ Document processed successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 backdrop-blur-md bg-red-600/10 border border-red-500/30 rounded-xl animate-slide-in">
          <p className="text-red-400 font-semibold flex items-center space-x-2">
            <span>⚠ {error}</span>
          </p>
        </div>
      )}
    </div>
  );
}
