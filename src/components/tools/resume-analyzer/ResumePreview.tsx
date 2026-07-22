"use client";

import React, { useState } from "react";
import {
  IconZoomIn,
  IconZoomOut,
  IconMaximize,
  IconRotate,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconFileText,
  IconX,
} from "@tabler/icons-react";
import { ParsedResumeData } from "@/services/resume-parser";

interface ResumePreviewProps {
  parsedData: ParsedResumeData | null;
  fileName?: string;
}

export default function ResumePreview({ parsedData, fileName = "Resume.pdf" }: ResumePreviewProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const totalPages = parsedData?.metadata.pageCount || 1;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoom(100);
  const handleFitWidth = () => setZoom(110);

  const rawText = parsedData?.rawText || "";
  const matchCount = searchQuery.trim()
    ? (rawText.match(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length
    : 0;

  const renderHighlightedText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-amber-300 text-slate-900 rounded-xs px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg flex flex-col h-full min-h-[640px] max-h-[85vh] sticky top-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <IconFileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[150px] md:max-w-[200px]">
            {fileName}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <IconZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px] font-bold text-slate-300 min-w-[42px] text-center">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <IconZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={handleFitWidth}
            title="Fit Width"
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <IconMaximize className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <IconRotate className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 hover:bg-slate-700 disabled:opacity-40 rounded-md cursor-pointer disabled:cursor-not-allowed text-slate-300"
          >
            <IconChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 hover:bg-slate-700 disabled:opacity-40 rounded-md cursor-pointer disabled:cursor-not-allowed text-slate-300"
          >
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document Text Search Bar */}
      <div className="mt-3 relative">
        <div className="relative flex items-center">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inside resume text..."
            className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs pl-9 pr-20 py-2 rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <div className="absolute right-2 flex items-center gap-1.5">
              <span className="text-[10px] font-bold bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700">
                {matchCount} match{matchCount !== 1 ? "es" : ""}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Container */}
      <div className="mt-3 flex-1 overflow-auto rounded-xl bg-slate-950 p-4 md:p-6 border border-slate-800 flex justify-center custom-scrollbar">
        <div
          className="bg-white text-slate-900 rounded-lg shadow-xl p-6 md:p-8 transition-transform duration-150 origin-top min-h-[580px] w-full max-w-2xl text-xs font-sans leading-relaxed selection:bg-indigo-100"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          {parsedData ? (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {renderHighlightedText(parsedData.contact?.candidateName || "Uploaded Candidate Resume")}
                </h2>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                  {renderHighlightedText(parsedData.contact?.jobTitle || "Parsed Resume Overview")}
                </p>
                <p className="text-[11px] text-slate-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {parsedData.contact?.email && <span>{renderHighlightedText(parsedData.contact.email)}</span>}
                  {parsedData.contact?.phone && <span>• {renderHighlightedText(parsedData.contact.phone)}</span>}
                  {parsedData.contact?.links?.map((link, idx) => (
                    <span key={idx}>• {renderHighlightedText(link)}</span>
                  ))}
                </p>
              </div>

              {/* Sections */}
              {Object.entries(parsedData.sections).map(([key, sec]) => {
                if (key === "contact") return null;
                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                      {sec.title}
                    </h3>
                    {sec.content && (
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {renderHighlightedText(sec.content)}
                      </p>
                    )}
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 mt-1">
                        {sec.bulletPoints.map((bullet, idx) => (
                          <li key={idx}>{renderHighlightedText(bullet)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
              <IconFileText className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No Resume Data Loaded</p>
              <p className="text-xs text-slate-400 mt-1">Upload a PDF or DOCX file to see preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
