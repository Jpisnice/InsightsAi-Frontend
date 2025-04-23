'use client';

import { useState, useRef } from 'react';
import { processFile } from '../../../app/insight/actions';

export default function FileUpload() {
  // ...existing code...
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    // ...existing code...
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a file');
      return;
    }

    const file = fileInputRef.current.files[0];
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await processFile(file);
      setResult(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the file';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    // ...existing code...
    if (!result) return;
    
    try {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `document-insights-${timestamp}.json`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download results');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Document Insights</h1>
      
      <form onSubmit={handleFileUpload} className="mb-8">
        <div className="mb-4">
          <label htmlFor="file" className="block mb-2 font-medium">
            Upload a document
          </label>
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isProcessing ? 'Processing...' : 'Process Document'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Download Results
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
