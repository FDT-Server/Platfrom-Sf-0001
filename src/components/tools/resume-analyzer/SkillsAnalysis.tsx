"use client";

import React, { useState } from "react";
import {
  IconCode,
  IconBrain,
  IconBriefcase,
  IconCheck,
  IconPlus,
  IconAlertCircle,
  IconCopy,
} from "@tabler/icons-react";
import { SkillCategory } from "@/services/resume-analyzer";
import { toast } from "sonner";

interface SkillsAnalysisProps {
  skills: {
    technical: SkillCategory;
    soft: SkillCategory;
    industry: SkillCategory;
  };
}

export default function SkillsAnalysis({ skills }: SkillsAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"technical" | "soft" | "industry">("technical");

  const categoryMap = {
    technical: { title: "Technical Skills", icon: IconCode, data: skills.technical },
    soft: { title: "Soft Skills & Leadership", icon: IconBrain, data: skills.soft },
    industry: { title: "Industry & Architectural Skills", icon: IconBriefcase, data: skills.industry },
  };

  const currentCategory = categoryMap[activeTab];

  const handleCopySkill = (skill: string) => {
    navigator.clipboard.writeText(skill);
    toast.success(`Copied "${skill}" to clipboard!`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 2
            </span>
            <h3 className="text-lg font-bold text-slate-800">Skills Matrix & Keyword Coverage</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Categorized breakdown of detected skills versus high-demand industry skills for engineering roles.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["technical", "soft", "industry"] as const).map((tabKey) => {
            const Icon = categoryMap[tabKey].icon;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tabKey
                    ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{tabKey}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content for selected Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detected Skills */}
        <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200/80 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-emerald-600" />
              Detected ({currentCategory.data.detected.length})
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              In Resume
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {currentCategory.data.detected.map((skill) => (
              <button
                key={skill}
                onClick={() => handleCopySkill(skill)}
                title="Click to copy skill"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
              >
                <span>{skill}</span>
                <IconCopy className="w-3 h-3 text-emerald-400 group-hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200/80 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <IconAlertCircle className="w-4 h-4 text-amber-600" />
              Missing Skills ({currentCategory.data.missing.length})
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              High Impact
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {currentCategory.data.missing.map((skill) => (
              <button
                key={skill}
                onClick={() => handleCopySkill(skill)}
                title="Click to copy for addition"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-white px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
              >
                <IconPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Skills */}
        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-200/80 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
              <IconBriefcase className="w-4 h-4 text-indigo-600" />
              Suggested ({currentCategory.data.suggested.length})
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              Recommended
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {currentCategory.data.suggested.map((skill) => (
              <button
                key={skill}
                onClick={() => handleCopySkill(skill)}
                title="Click to copy suggestion"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer shadow-2xs"
              >
                <IconPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
