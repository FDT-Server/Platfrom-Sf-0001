"use client";

import React, { useState } from "react";
import {
  IconWand,
  IconSparkles,
  IconCopy,
  IconCheck,
  IconArrowDown,
  IconRefresh,
  IconFileText,
  IconBriefcase,
  IconCode,
  IconFolderCode,
} from "@tabler/icons-react";
import { rewriteResumeSection, GeminiRewriteResult } from "@/services/gemini-analysis";
import { toast } from "sonner";

interface RewritePanelProps {
  initialSummary?: string;
  initialExperience?: string;
  initialSkills?: string;
  initialProjects?: string;
}

export default function RewritePanel({
  initialSummary,
  initialExperience,
  initialSkills,
  initialProjects,
}: RewritePanelProps) {
  const [activeSection, setActiveSection] = useState<"summary" | "experience" | "skills" | "projects">("summary");
  const [rewriteResult, setRewriteResult] = useState<GeminiRewriteResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const sectionConfig = [
    { key: "summary", label: "Improve Summary", icon: IconFileText, initial: initialSummary },
    { key: "experience", label: "Improve Experience", icon: IconBriefcase, initial: initialExperience },
    { key: "skills", label: "Improve Skills", icon: IconCode, initial: initialSkills },
    { key: "projects", label: "Improve Projects", icon: IconFolderCode, initial: initialProjects },
  ] as const;

  const handleTriggerRewrite = async (sectionKey: "summary" | "experience" | "skills" | "projects") => {
    setActiveSection(sectionKey);
    setIsGenerating(true);
    setCopied(false);

    try {
      const currentConfig = sectionConfig.find((s) => s.key === sectionKey);
      const result = await rewriteResumeSection(sectionKey, currentConfig?.initial || "");
      setRewriteResult(result);
      toast.success(`Generated optimized ${result.sectionType} section!`);
    } catch (e) {
      toast.error("Failed to generate AI rewrite.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (rewriteResult) {
      navigator.clipboard.writeText(rewriteResult.improvedText);
      setCopied(true);
      toast.success("Improved text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 8
            </span>
            <h3 className="text-lg font-bold text-slate-800">AI Section Rewriter Studio</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instantly reword and optimize individual sections of your resume for maximum impact and ATS clarity.
          </p>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectionConfig.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key && rewriteResult;
          return (
            <button
              key={item.key}
              onClick={() => handleTriggerRewrite(item.key)}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-200">
          <IconSparkles className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <h4 className="text-sm font-bold text-slate-800">Generating AI Rewrite...</h4>
          <p className="text-xs text-slate-500 mt-1">Applying industry action verbs and ATS keywords</p>
        </div>
      )}

      {/* Output Display */}
      {rewriteResult && !isGenerating && (
        <div className="flex flex-col gap-4 pt-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {rewriteResult.sectionType} Optimization Output
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <IconCheck className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <IconCopy className="w-4 h-4" /> Copy Improved Text
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200 px-2 py-0.5 rounded w-fit">
                Original Version
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                {rewriteResult.originalText}
              </p>
            </div>

            {/* Improved Card */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded w-fit flex items-center gap-1">
                <IconSparkles className="w-3 h-3" /> AI Improved Version
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-sans mt-1 font-medium">
                {rewriteResult.improvedText}
              </p>
            </div>
          </div>

          {/* Key Improvements Bullet list */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Key Enhancements Applied
            </span>
            <div className="flex flex-col gap-1.5">
              {rewriteResult.keyChanges.map((change, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
