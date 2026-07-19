"use client";

import React, { useState } from "react";
import {
  IconAlertCircle,
  IconInfoCircle,
  IconBulb,
  IconCopy,
  IconCheck,
  IconArrowRight,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { ImprovementItem } from "@/services/resume-analyzer";
import { toast } from "sonner";

interface ImprovementSuggestionsProps {
  improvements: ImprovementItem[];
}

export default function ImprovementSuggestions({ improvements }: ImprovementSuggestionsProps) {
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = filterPriority === "All"
    ? improvements
    : improvements.filter((item) => item.priority === filterPriority);

  const handleCopyRewrite = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Example rewrite copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    if (priority === "High") return "bg-red-50 text-red-700 border-red-200";
    if (priority === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 7
            </span>
            <h3 className="text-lg font-bold text-slate-800">Actionable Improvement Suggestions</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized recommendations detailing specific problems, ATS/recruiter impact, recommended fixes, and example rewrites.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["All", "High", "Medium", "Low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterPriority === p
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List of Improvement Cards */}
      <div className="flex flex-col gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-300 transition-all shadow-2xs flex flex-col gap-4"
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getPriorityBadge(item.priority)}`}>
                  {item.priority} Priority
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Problem Title */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <IconAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                {item.problem}
              </h4>
            </div>

            {/* Why It Matters */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <IconInfoCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Why it matters: </span>
                {item.whyItMatters}
              </div>
            </div>

            {/* Recommended Improvement */}
            <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <IconBulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900">Recommended fix: </span>
                {item.recommendedImprovement}
              </div>
            </div>

            {/* Example Rewrite Diff Card */}
            {item.exampleRewrite && (
              <div className="bg-slate-900 rounded-xl p-4 text-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Example Transformation
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyRewrite(item.id, item.exampleRewrite.improved)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-3.5 h-3.5" /> Copy Rewrite
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Original */}
                  <div className="bg-red-950/40 p-3 rounded-lg border border-red-900/60 text-red-200">
                    <span className="text-[10px] font-bold uppercase text-red-400 block mb-1">
                      Original
                    </span>
                    <p className="line-through decoration-red-500/80">{item.exampleRewrite.original}</p>
                  </div>

                  {/* Improved */}
                  <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/60 text-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                      Improved AI Version
                    </span>
                    <p>{item.exampleRewrite.improved}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
