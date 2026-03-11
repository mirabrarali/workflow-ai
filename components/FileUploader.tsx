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
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-4-8l-6-6m0 0l-6 6m6-6v20"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-blue-600">Drop PDF here</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop PDF file here
              </p>
              <p className="text-sm text-gray-500">or click to select</p>
              <p className="text-xs text-gray-400 mt-2">
                Supported format: PDF (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
