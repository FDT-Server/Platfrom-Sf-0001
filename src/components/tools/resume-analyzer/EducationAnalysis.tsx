"use client";

import React from "react";
import {
  IconSchool,
  IconCertificate,
  IconBook,
  IconAward,
  IconCheck,
} from "@tabler/icons-react";
import { DetailedAnalysisSection } from "@/services/resume-analyzer";

interface EducationAnalysisProps {
  education: DetailedAnalysisSection;
}

export default function EducationAnalysis({ education }: EducationAnalysisProps) {
  const details = education.details || {};

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 4
            </span>
            <h3 className="text-lg font-bold text-slate-800">Education & Certification Review</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verification of degree titles, CGPA scores, relevant course modules, and professional credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500">Education Score:</span>
          <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
            {education.score} / 100
          </span>
        </div>
      </div>

      {/* Degree & CGPA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
            <IconSchool className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Degree & Institution
            </span>
            <h4 className="text-sm font-extrabold text-slate-800 mt-1">
              {details.degreeDetected || "Degree Detected"}
            </h4>
            <p className="text-xs font-semibold text-indigo-600 mt-0.5">
              {details.institution} ({details.graduationYear})
            </p>
            {details.cgpa && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded mt-2 border border-emerald-200">
                CGPA: {details.cgpa}
              </span>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <IconCertificate className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Certifications Verified
            </span>
            <div className="flex flex-col gap-1 mt-2">
              {details.certifications && details.certifications.length > 0 ? (
                details.certifications.map((cert: string, idx: number) => (
                  <span key={idx} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {cert}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No industry certifications detected.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Relevant Coursework */}
      {details.relevantCoursework && (
        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <IconBook className="w-4 h-4 text-indigo-600" /> Relevant Engineering Coursework
          </h4>
          <div className="flex flex-wrap gap-2 mt-3">
            {details.relevantCoursework.map((course: string, idx: number) => (
              <span key={idx} className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
