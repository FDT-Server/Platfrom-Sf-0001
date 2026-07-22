"use client";

import React from "react";
import { IconSparkles, IconCheck, IconAlertTriangle, IconShieldCheck } from "@tabler/icons-react";

interface ScoreCardProps {
  score: number;
  analyzedAt?: string;
  summary?: string;
}

export default function ScoreCard({ score, analyzedAt, summary }: ScoreCardProps) {

  let strokeColor = "#ef4444";
  let badgeBg = "bg-red-50 text-red-700 border-red-200";
  let gradeText = "Needs Major Improvement";

  if (score >= 80) {
    strokeColor = "#10b981";
    badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    gradeText = "Excellent - ATS Ready";
  } else if (score >= 60) {
    strokeColor = "#f59e0b";
    badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
    gradeText = "Good - Needs Minor Optimization";
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6 shrink-0">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-slate-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              out of 100
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Resume Overall Health
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Resume Score
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mt-2.5 w-fit ${badgeBg}`}
          >
            {score >= 80 ? (
              <IconShieldCheck className="w-4 h-4" />
            ) : score >= 60 ? (
              <IconCheck className="w-4 h-4" />
            ) : (
              <IconAlertTriangle className="w-4 h-4" />
            )}
            {gradeText}
          </span>
        </div>
      </div>

      {/* Summary Box */}
      <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
            <IconSparkles className="w-3.5 h-3.5" /> AI Diagnostic Overview
          </span>
          {analyzedAt && (
            <span className="text-[10px] text-slate-400 font-medium">
              Last scan: {new Date(analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-650 mt-2.5 leading-relaxed">
          {summary ||
            "Your resume scores high on technical skills and structural alignment. Strengthening target keyword density and quantifying impact in project bullets will unlock top-tier ATS performance."}
        </p>
      </div>
    </div>
  );
}
