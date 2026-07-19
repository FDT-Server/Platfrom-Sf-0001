"use client";

import React from "react";
import { toast } from "sonner";
import { IconFlame } from "@tabler/icons-react";

const trendingSkills = [
  "React",
  "Next.js",
  "Python",
  "AI",
  "UI/UX",
  "Java",
  "Cloud",
];

export default function TrendingSkillsCard() {
  const handleSkillClick = (skill: string) => {
    toast.info(`Filtering feed by #${skill}...`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-1.5 mb-3 pl-1">
        <IconFlame className="w-4 h-4 text-amber-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Trending Skills
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {trendingSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => handleSkillClick(skill)}
            className="bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 hover:text-blue-600 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer"
          >
            #{skill}
          </button>
        ))}
      </div>
    </div>
  );
}
