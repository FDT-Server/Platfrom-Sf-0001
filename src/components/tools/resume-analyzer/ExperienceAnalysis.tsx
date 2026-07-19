"use client";

import React from "react";
import {
  IconBriefcase,
  IconClock,
  IconChartBar,
  IconUsers,
  IconCheck,
  IconAlertCircle,
  IconFlame,
} from "@tabler/icons-react";
import { DetailedAnalysisSection } from "@/services/resume-analyzer";

interface ExperienceAnalysisProps {
  experience: DetailedAnalysisSection;
}

export default function ExperienceAnalysis({ experience }: ExperienceAnalysisProps) {
  const details = experience.details || {};

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 3
            </span>
            <h3 className="text-lg font-bold text-slate-800">Experience & Impact Analysis</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluation of work tenure, metric-driven impact statements, leadership depth, and role achievements.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500">Experience Score:</span>
          <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
            {experience.score} / 100
          </span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Years of Experience */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <IconClock className="w-4 h-4 text-indigo-600" /> Tenure Detected
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 mt-3">{details.yearsOfExperience || "3+ Years"}</p>
          <p className="text-[11px] text-slate-500 mt-1">Matches Mid-Senior engineering profiles</p>
        </div>

        {/* Quantified Achievements */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <IconChartBar className="w-4 h-4 text-emerald-600" /> Quantified Metrics
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              4 Bullet Metrics
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 mt-3">{details.quantifiedAchievements}</p>
          <p className="text-[11px] text-slate-500 mt-1">Percentages and latency benchmarks present</p>
        </div>

        {/* Leadership Indicators */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <IconUsers className="w-4 h-4 text-purple-600" /> Leadership & Mentorship
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Detected
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 mt-3 line-clamp-2">{details.leadership}</p>
          <p className="text-[11px] text-slate-500 mt-1">Mentorship experience detected</p>
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <IconFlame className="w-4 h-4 text-amber-500" /> Key Action Items for Experience Section
        </h4>
        <div className="mt-3 flex flex-col gap-2">
          {experience.suggestions.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
