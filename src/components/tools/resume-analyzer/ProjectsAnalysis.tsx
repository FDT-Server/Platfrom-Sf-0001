"use client";

import React from "react";
import {
  IconFolderCode,
  IconBrandGithub,
  IconExternalLink,
  IconAlertCircle,
  IconCheck,
  IconBulb,
  IconSparkles,
} from "@tabler/icons-react";
import { DetailedAnalysisSection } from "@/services/resume-analyzer";

interface ProjectsAnalysisProps {
  projects: DetailedAnalysisSection;
}

export default function ProjectsAnalysis({ projects }: ProjectsAnalysisProps) {
  const details = projects.details || {};
  const projectList: Array<any> = details.detectedProjects || [];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 5
            </span>
            <h3 className="text-lg font-bold text-slate-800">Projects & Portfolio Review</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analysis of technical complexity, GitHub link availability, stack diversity, and project descriptions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500">Innovation Score:</span>
          <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
            {details.innovationScore || 88} / 100
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {projectList.map((proj, idx) => (
          <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <IconFolderCode className="w-5 h-5 text-indigo-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-800">{proj.name}</h4>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  {proj.descriptionQuality}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {proj.techStack?.map((tech: string, tIdx: number) => (
                  <span key={tIdx} className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {proj.githubLink?.includes("github.com") ? (
                <a
                  href={`https://${proj.githubLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <IconBrandGithub className="w-4 h-4 text-slate-900" />
                  GitHub Repo
                  <IconExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <IconAlertCircle className="w-4 h-4 text-amber-600" />
                  Missing GitHub URL
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio & Repository Recommendations */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <IconBulb className="w-4 h-4 text-amber-500" /> Portfolio Optimization Tips
        </h4>
        <div className="mt-3 flex flex-col gap-2">
          {projects.suggestions.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <IconCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
