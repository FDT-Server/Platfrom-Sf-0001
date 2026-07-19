"use client";

import React from "react";
import {
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconSparkles,
} from "@tabler/icons-react";

interface ChartsProps {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  experienceScore: number;
  skillsCount: { technical: number; soft: number; industry: number };
}

export default function Charts({
  overallScore,
  atsScore,
  contentScore,
  experienceScore,
  skillsCount,
}: ChartsProps) {
  const scoreCategories = [
    { label: "ATS Readiness", score: atsScore, color: "bg-indigo-600", textColor: "text-indigo-600" },
    { label: "Content Quality", score: contentScore, color: "bg-emerald-500", textColor: "text-emerald-600" },
    { label: "Experience Impact", score: experienceScore, color: "bg-purple-600", textColor: "text-purple-600" },
    { label: "Project & Tech Stack", score: 84, color: "bg-amber-500", textColor: "text-amber-600" },
    { label: "Structure & Whitespace", score: 89, color: "bg-blue-600", textColor: "text-blue-600" },
  ];

  const totalSkills = skillsCount.technical + skillsCount.soft + skillsCount.industry || 1;
  const techPct = Math.round((skillsCount.technical / totalSkills) * 100);
  const softPct = Math.round((skillsCount.soft / totalSkills) * 100);
  const indPct = Math.round((skillsCount.industry / totalSkills) * 100);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 9
            </span>
            <h3 className="text-lg font-bold text-slate-800">Visual Analytics & Category Breakdowns</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quantitative charts detailing skills distribution, section score weightings, and improvement trend metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Scores Breakdown */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <IconChartBar className="w-4 h-4 text-indigo-600" /> Section Score Distribution
            </h4>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
              Weighted Average: {overallScore}%
            </span>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {scoreCategories.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className={`font-bold ${item.textColor}`}>{item.score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Distribution Pie / Bar representation */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <IconChartPie className="w-4 h-4 text-emerald-600" /> Skills Coverage Mix
            </h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              {totalSkills} Total Keywords
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {/* Visual Bar segments */}
            <div className="w-full h-4 bg-slate-200 rounded-full flex overflow-hidden p-0.5 gap-0.5">
              <div className="bg-indigo-600 h-full rounded-l-full" style={{ width: `${techPct}%` }} title={`Technical (${techPct}%)`} />
              <div className="bg-purple-500 h-full" style={{ width: `${softPct}%` }} title={`Soft Skills (${softPct}%)`} />
              <div className="bg-emerald-500 h-full rounded-r-full" style={{ width: `${indPct}%` }} title={`Industry (${indPct}%)`} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Technical</span>
                <span className="text-base font-extrabold text-indigo-600">{skillsCount.technical}</span>
                <span className="text-[10px] text-slate-400 block">({techPct}%)</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Soft Skills</span>
                <span className="text-base font-extrabold text-purple-600">{skillsCount.soft}</span>
                <span className="text-[10px] text-slate-400 block">({softPct}%)</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Industry</span>
                <span className="text-base font-extrabold text-emerald-600">{skillsCount.industry}</span>
                <span className="text-[10px] text-slate-400 block">({indPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
