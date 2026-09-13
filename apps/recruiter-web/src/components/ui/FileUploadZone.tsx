import React, { useState } from 'react';
import { Button } from './Button';
import { FileText, CheckCircle2 } from 'lucide-react';

export interface FileUploadZoneProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  currentFileUrl?: string;
  onFileSelect?: (file: File) => void;
  isUploading?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label = 'Upload Existing CV / Resume (PDF)',
  accept = '.pdf',
  maxSizeMB = 5,
  currentFileUrl,
  onFileSelect,
  isUploading = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onFileSelect?.(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragOver
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-xs">
            <FileText className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {isUploading
                ? 'Uploading file to cloud storage...'
                : selectedFileName || 'Drag and drop your CV here, or browse'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports PDF format up to {maxSizeMB}MB
            </p>
          </div>
          <Button variant="outline" size="sm" type="button">
            Select PDF Document
          </Button>
        </div>
      </div>

      {currentFileUrl && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            ✓ Active CV uploaded and ready for recruiters
          </span>
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            View Uploaded PDF ↗
          </a>
        </div>
      )}
    </div>
  );
};
