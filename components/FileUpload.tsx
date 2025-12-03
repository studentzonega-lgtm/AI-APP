import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, FileCheck } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, fileName: string) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit.');
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      onFileSelect(base64, file.name);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative group flex flex-col items-center justify-center w-full h-72 rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-xl' 
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50 hover:shadow-lg'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          onChange={handleChange}
          accept="application/pdf"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 transition-transform duration-300 group-hover:scale-105">
           <div className={`p-5 rounded-2xl mb-4 transition-colors duration-300 ${dragActive ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
            {dragActive ? (
              <FileCheck className="w-10 h-10 text-indigo-600 animate-bounce" />
            ) : (
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            )}
          </div>
          
          <h3 className="mb-2 text-lg font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
            {dragActive ? 'Drop to analyze' : 'Upload Research Paper'}
          </h3>
          
          <p className="mb-4 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Drag and drop your PDF here, or click to browse files.
          </p>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
            PDF up to 20MB
          </span>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 flex items-center p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50 animate-in slide-in-from-top-2">
          <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3" />
          <div>
            <span className="font-medium block">Upload Failed</span>
            <span className="opacity-90">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};