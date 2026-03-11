/**
 * PDF processing utilities
 */

export async function extractTextFromPDF(file: File): Promise<string> {
  // This will be handled on the server side
  // For now, return a placeholder that will be processed by the API
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        // Send to API for processing
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
        resolve(data.text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function validatePDFFile(file: File): boolean {
  const validType = file.type === 'application/pdf';
  const validSize = file.size <= 10 * 1024 * 1024; // 10MB max

  return validType && validSize;
}
