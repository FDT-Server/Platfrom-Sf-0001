"use client";

import React from "react";
import Link from "next/link";
import { IconBriefcase, IconMapPin, IconArrowUpRight } from "@tabler/icons-react";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  logoBg: string;
  logoLetter: string;
}

const sampleOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    role: "Front-End Developer Intern",
    company: "Atlassian",
    location: "Bengaluru",
    stipend: "₹45k/mo",
    logoBg: "bg-blue-600 text-white",
    logoLetter: "A",
  },
  {
    id: "opp-2",
    role: "Full-Stack Software Engineer",
    company: "Stripe",
    location: "Remote",
    stipend: "₹18–22 LPA",
    logoBg: "bg-indigo-600 text-white",
    logoLetter: "S",
  },
  {
    id: "opp-3",
    role: "AI & ML Research Intern",
    company: "Google DeepMind",
    location: "Bengaluru",
    stipend: "₹60k/mo",
    logoBg: "bg-emerald-600 text-white",
    logoLetter: "G",
  },
  {
    id: "opp-4",
    role: "UI/UX Product Design Intern",
    company: "Figma",
    location: "Remote",
    stipend: "₹40k/mo",
    logoBg: "bg-purple-600 text-white",
    logoLetter: "F",
  },
];

export default function OpportunitiesSection() {
  const handleApply = (role: string, company: string) => {
    toast.success(`Application initiated for ${role} at ${company}!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <IconBriefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">Featured Opportunities</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Handpicked internships & roles</p>
          </div>
        </div>

        <Link
          href="/opportunities"
          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <IconArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Compact Opportunities List */}
      <div className="flex flex-col gap-2.5">
        {sampleOpportunities.slice(0, 4).map((opp) => (
          <div
            key={opp.id}
            className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 flex items-center justify-between gap-2 hover:bg-slate-100/70 transition duration-150"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-8 h-8 rounded-lg ${opp.logoBg} font-black text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                {opp.logoLetter}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{opp.role}</h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {opp.company} · {opp.location}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleApply(opp.role, opp.company)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold transition shadow-xs shrink-0 cursor-pointer"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
