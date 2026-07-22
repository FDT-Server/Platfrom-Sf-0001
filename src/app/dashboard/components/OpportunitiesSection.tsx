"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconBriefcase, IconMapPin, IconExternalLink, IconBuilding, IconCurrencyRupee, IconClock } from "@tabler/icons-react";
import { toast } from "sonner";

export interface OpportunityItem {
  id: string;
  role?: string;
  title?: string;
  company: string;
  location: string;
  stipend?: string;
  compensation?: string;
  type?: string;
  category?: string;
  link: string;
  logoBg?: string;
  logoLetter?: string;
  imageUrl?: string | null;
}

const fallbackOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Front-End Developer Intern",
    company: "Atlassian",
    location: "Bengaluru, India",
    compensation: "₹45,000 / mo",
    type: "Internship",
    category: "Engineering",
    link: "https://www.atlassian.com/company/careers",
    logoBg: "bg-blue-600 text-white",
    logoLetter: "A",
    imageUrl: "https://unavatar.io/atlassian.com",
  },
  {
    id: "opp-2",
    title: "Full-Stack Software Engineer",
    company: "Stripe",
    location: "Remote (India)",
    compensation: "₹18 - ₹22 LPA",
    type: "Full-time",
    category: "Engineering",
    link: "https://stripe.com/jobs",
    logoBg: "bg-indigo-600 text-white",
    logoLetter: "S",
    imageUrl: "https://unavatar.io/stripe.com",
  },
  {
    id: "opp-3",
    title: "AI & ML Research Intern",
    company: "Google DeepMind",
    location: "Bengaluru, India",
    compensation: "₹60,000 / mo",
    type: "Internship",
    category: "Artificial Intelligence",
    link: "https://deepmind.google/careers/",
    logoBg: "bg-emerald-600 text-white",
    logoLetter: "G",
    imageUrl: "https://unavatar.io/google.com",
  },
  {
    id: "opp-4",
    title: "UI/UX Product Design Intern",
    company: "Figma",
    location: "Remote",
    compensation: "₹40,000 / mo",
    type: "Internship",
    category: "Design",
    link: "https://www.figma.com/careers/",
    logoBg: "bg-purple-600 text-white",
    logoLetter: "F",
    imageUrl: "https://unavatar.io/figma.com",
  },
];

export default function OpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(fallbackOpportunities);
  const [loading, setLoading] = useState<boolean>(true);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchOpps() {
      try {
        const res = await fetch("/api/opportunities");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setOpportunities(data);
          }
        }
      } catch (err) {
        console.error("Error loading opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpps();
  }, []);

  const handleLogoError = (id: string) => {
    setFailedLogos((prev) => ({ ...prev, [id]: true }));
  };

  const getLogoUrl = (opp: OpportunityItem): string | null => {
    if (opp.imageUrl && opp.imageUrl.trim() !== "") {
      return opp.imageUrl;
    }
    if (opp.company) {
      const domainSlug = opp.company.toLowerCase().replace(/[^a-z0-9]/g, "");
      return `https://unavatar.io/${domainSlug}.com`;
    }
    return null;
  };

  const handleApplyClick = (opp: OpportunityItem) => {
    const roleTitle = opp.title || opp.role || "Role";
    toast.success(`Opening application page for ${roleTitle} at ${opp.company}...`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-md select-none">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <IconBriefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 leading-tight tracking-wide">
              Featured Opportunities
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Handpicked internships & roles
            </p>
          </div>
        </div>

        <Link
          href="/opportunities"
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition cursor-pointer"
        >
          <span>View All</span>
          <IconExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Opportunities List */}
      <div className="flex flex-col gap-2.5">
        {opportunities.slice(0, 4).map((opp) => {
          const roleTitle = opp.title || opp.role || "Developer Role";
          const comp = opp.compensation || opp.stipend || "Best in Industry";
          const logoUrl = getLogoUrl(opp);
          const logoFailed = failedLogos[opp.id] || !logoUrl;
          const bgClass = opp.logoBg || "bg-gradient-to-br from-blue-600 to-indigo-600 text-white";
          const letter = opp.logoLetter || opp.company.charAt(0).toUpperCase();

          return (
            <div
              key={opp.id}
              className="group bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-blue-200 rounded-xl p-3 flex flex-col gap-2.5 transition-all duration-200 hover:shadow-xs"
            >
              {/* Top Section: Logo + Title/Company + Apply Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Company Logo Container */}
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                    {!logoFailed ? (
                      <img
                        src={logoUrl!}
                        alt={`${opp.company} logo`}
                        onError={() => handleLogoError(opp.id)}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-lg ${bgClass} font-extrabold text-sm flex items-center justify-center shadow-2xs`}
                      >
                        {letter}
                      </div>
                    )}
                  </div>

                  {/* Role Title & Company */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate leading-snug transition-colors">
                      {roleTitle}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold truncate mt-0.5">
                      <span className="truncate text-slate-800">{opp.company}</span>
                      <span className="text-slate-300">•</span>
                      <span className="truncate text-slate-500 flex items-center gap-0.5">
                        <IconMapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {opp.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Apply Button */}
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleApplyClick(opp)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold transition duration-150 shadow-2xs hover:shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 border-0 mt-0.5"
                >
                  <span>Apply</span>
                  <IconExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Data Row: Clear metadata badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/50">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                  {comp}
                </span>

                {opp.type && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70 flex items-center gap-1">
                    <IconClock className="w-2.5 h-2.5 text-slate-400" />
                    {opp.type}
                  </span>
                )}

                {opp.category && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {opp.category}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
