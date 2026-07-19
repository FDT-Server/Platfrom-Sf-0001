"use client";

import React, { useState } from "react";
import { IconCopy, IconCheck, IconExternalLink, IconCode } from "@tabler/icons-react";
import { toast } from "sonner";

interface PostBodyProps {
  title?: string;
  content: string;
  tags?: string[];
  projectUrl?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export default function PostBody({
  title,
  content,
  tags,
  projectUrl,
  codeSnippet,
}: PostBodyProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (codeSnippet?.code) {
      navigator.clipboard.writeText(codeSnippet.code);
      setCopiedCode(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleTagClick = (tag: string) => {
    toast.info(`Filtering feed by #${tag}...`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Optional Post Title */}
      {title && (
        <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug tracking-tight">
          {title}
        </h1>
      )}

      {/* Main Formatted Content */}
      <div className="text-xs md:text-sm text-slate-800 leading-relaxed space-y-3 font-normal whitespace-pre-wrap">
        {content}
      </div>

      {/* Project Link Card */}
      {projectUrl && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 hover:bg-blue-50/50 hover:border-blue-200 transition duration-150 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 font-bold shrink-0">
              <IconExternalLink className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Project Link
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">{projectUrl}</p>
            </div>
          </div>
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-1.5 text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1"
          >
            <span>Visit</span>
            <IconExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Code Snippet Block */}
      {codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs shadow-md select-text">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 select-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <IconCode className="w-3.5 h-3.5 text-blue-400" />
              {codeSnippet.language}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition duration-150 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <IconCopy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto leading-relaxed text-[11px] text-emerald-300">
            <code>{codeSnippet.code}</code>
          </pre>
        </div>
      )}

      {/* Clickable Hashtags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 select-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-150 px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
