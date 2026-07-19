"use client";

import React, { useState, useRef } from "react";
import {
  IconUpload,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileText,
  IconRefresh,
  IconTrash,
  IconDownload,
  IconEye,
  IconCheck,
  IconAlertCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";

export interface UploadedFileInfo {
  name: string;
  size: number; // in bytes
  type: string;
  uploadTime: string;
  fileObj?: File;
}

interface UploadZoneProps {
  uploadedFile: UploadedFileInfo | null;
  onFileUpload: (file: File) => void;
  onReplaceFile: () => void;
  onDeleteFile: () => void;
  onDownloadFile: () => void;
  onTogglePreview?: () => void;
  isPreviewOpen?: boolean;
  isAnalyzing?: boolean;
}

export default function UploadZone({
  uploadedFile,
  onFileUpload,
  onReplaceFile,
  onDeleteFile,
  onDownloadFile,
  onTogglePreview,
  isPreviewOpen = false,
  isAnalyzing = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const validExtensions = ["pdf", "docx", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      toast.error("Invalid file format. Please upload a PDF or DOCX file.", {
        description: "Only .pdf and .docx documents are supported for ATS analysis.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size too large.", {
        description: "Maximum supported file size is 10 MB.",
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            onFileUpload(file);
            toast.success("Resume uploaded successfully!", {
              description: `${file.name} is ready for AI analysis.`,
            });
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc"
        className="hidden"
      />

      {!uploadedFile && uploadProgress === null ? (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/50 scale-[0.99]"
              : "border-slate-300 hover:border-indigo-500 hover:bg-slate-50/80"
          }`}
        >
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 text-indigo-600 shadow-sm">
            <IconUpload className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mt-4">
            Upload your resume for AI Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Drag & drop your file here, or click to browse. Supports PDF and DOCX formats up to 10MB.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <IconFileTypePdf className="w-4 h-4 text-red-500" /> PDF
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <IconFileTypeDocx className="w-4 h-4 text-blue-500" /> DOCX
            </span>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <IconUpload className="w-4 h-4" />
            Select Resume File
          </button>
        </div>
      ) : uploadProgress !== null ? (
        /* Progress Indicator */
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse mb-3">
            <IconSparkles className="w-6 h-6 animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Uploading Resume...</h4>
          <p className="text-xs text-slate-500 mt-1">Preparing document for parser engine</p>

          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-5 max-w-md overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-2">{uploadProgress}%</span>
        </div>
      ) : uploadedFile ? (
        /* Uploaded State */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                {uploadedFile.name.endsWith(".docx") ? (
                  <IconFileTypeDocx className="w-7 h-7 text-blue-600" />
                ) : (
                  <IconFileTypePdf className="w-7 h-7 text-red-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 truncate" title={uploadedFile.name}>
                    {uploadedFile.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    <IconCheck className="w-3 h-3" /> Ready
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Size: {formatSize(uploadedFile.size)}</span>
                  <span>•</span>
                  <span>Uploaded: {uploadedFile.uploadTime}</span>
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 animate-pulse">
                <IconSparkles className="w-4 h-4 animate-spin" />
                Analyzing AI Score...
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <IconRefresh className="w-4 h-4 text-slate-500" />
                Replace
              </button>
              <button
                type="button"
                onClick={onDeleteFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer border border-red-100"
              >
                <IconTrash className="w-4 h-4" />
                Delete
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownloadFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <IconDownload className="w-4 h-4 text-slate-600" />
                Download
              </button>
              {onTogglePreview && (
                <button
                  type="button"
                  onClick={onTogglePreview}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    isPreviewOpen
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <IconEye className="w-4 h-4" />
                  {isPreviewOpen ? "Hide Preview" : "Preview Resume"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
