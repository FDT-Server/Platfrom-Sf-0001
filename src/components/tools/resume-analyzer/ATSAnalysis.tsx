"use client";

import React from "react";
import {
  IconCheck,
  IconAlertTriangle,
  IconX,
  IconTable,
  IconPhoto,
  IconTypography,
  IconFileTypePdf,
  IconEye,
  IconSparkles,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";
import { ATSCheckResult } from "@/services/ats-service";

interface ATSAnalysisProps {
  atsData: ATSCheckResult;
}

export default function ATSAnalysis({ atsData }: ATSAnalysisProps) {
  const getBadgeColor = (status: "pass" | "warning" | "fail") => {
    if (status === "pass") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "warning") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 1
            </span>
            <h3 className="text-lg font-bold text-slate-800">ATS Compatibility Audit</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated evaluation of structural parsing fidelity across top enterprise ATS systems (Workday, Greenhouse, Lever).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500">ATS Readiness:</span>
          <span className={`text-sm font-extrabold px-3 py-0.5 rounded-full border ${getBadgeColor(atsData.status)}`}>
            {atsData.score} / 100 ({atsData.expectedReadability})
          </span>
        </div>
      </div>

      {/* Grid of Key ATS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tables Detected */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <IconTable className="w-4 h-4 text-slate-600" /> Tables
            </span>
            {atsData.tablesDetected === 0 ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Clear
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Warning
              </span>
            )}
          </div>
          <p className="text-sm font-extrabold text-slate-800 mt-3">
            {atsData.tablesDetected} Tables Detected
          </p>
          <span className="text-[11px] text-slate-500 mt-1">
            {atsData.tablesDetected === 0 ? "Safe for multi-column ATS parsers" : "May disrupt text flow in ATS"}
          </span>
        </div>

        {/* Metric 2: Images Detected */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <IconPhoto className="w-4 h-4 text-slate-600" /> Images & Graphics
            </span>
            {atsData.imagesDetected === 0 ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Clear
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Issue
              </span>
            )}
          </div>
          <p className="text-sm font-extrabold text-slate-800 mt-3">
            {atsData.imagesDetected} Graphics Found
          </p>
          <span className="text-[11px] text-slate-500 mt-1">
            {atsData.imagesDetected === 0 ? "Text is 100% extractable" : "Graphics cannot be read by ATS"}
          </span>
        </div>

        {/* Metric 3: Fonts & Headers */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <IconTypography className="w-4 h-4 text-slate-600" /> Fonts
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Standard
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-800 mt-3 truncate">
            {atsData.fontsFound.join(", ")}
          </p>
          <span className="text-[11px] text-slate-500 mt-1">
            Standard web fonts ensure clean rendering
          </span>
        </div>

        {/* Metric 4: Keyword Density */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <IconAdjustmentsHorizontal className="w-4 h-4 text-slate-600" /> Keyword Density
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              {atsData.keywordDensityScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${atsData.keywordDensityScore}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            Optimal keyword frequency distribution
          </span>
        </div>
      </div>

      {/* Formatting Issues & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Formatting Check */}
        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <IconAlertTriangle className="w-4 h-4 text-amber-500" />
            Formatting & Parsing Warnings ({atsData.formattingIssues.length})
          </h4>
          <div className="mt-3 flex flex-col gap-2.5">
            {atsData.formattingIssues.length > 0 ? (
              atsData.formattingIssues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                  <IconAlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <IconCheck className="w-4 h-4 shrink-0" />
                Zero critical formatting issues detected. Format is ready for ATS submission!
              </div>
            )}
          </div>
        </div>

        {/* ATS Suggestions */}
        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <IconSparkles className="w-4 h-4 text-indigo-600" />
            ATS Optimization Tips
          </h4>
          <div className="mt-3 flex flex-col gap-2.5">
            {atsData.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
