"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IconTarget,
  IconCheck,
  IconAlertCircle,
  IconPlus,
  IconSparkles,
  IconArrowRight,
  IconCopy,
  IconRefresh,
} from "@tabler/icons-react";
import { compareWithJobDescription, GeminiJobMatchResult } from "@/services/gemini-analysis";
import { toast } from "sonner";

interface KeywordMatcherProps {
  resumeText: string;
}

interface FormValues {
  jobDescription: string;
}

export default function KeywordMatcher({ resumeText }: KeywordMatcherProps) {
  const [matchResult, setMatchResult] = useState<GeminiJobMatchResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      jobDescription: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.jobDescription.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }

    setIsComparing(true);
    try {
      const result = await compareWithJobDescription(resumeText, data.jobDescription);
      setMatchResult(result);
      toast.success(`Match complete! Resume matches ${result.matchPercentage}% of the job description.`);
    } catch (e) {
      toast.error("Failed to compare job description.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleFillSampleJD = () => {
    const sample = `We are seeking a Senior Full Stack Engineer with strong proficiency in React, TypeScript, Next.js, Node.js, and AWS. The ideal candidate has experience with PostgreSQL, GraphQL, Docker, Kubernetes microservices, CI/CD automated deployments, and Redis caching.`;
    setValue("jobDescription", sample);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success(`Copied "${keyword}" to clipboard!`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 6
            </span>
            <h3 className="text-lg font-bold text-slate-800">Job Description Keyword Matcher</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paste target role posting to calculate match percentage, identify missing skill keywords, and get tailored suggestions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSampleJD}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer shrink-0"
        >
          <IconSparkles className="w-4 h-4" /> Load Sample JD
        </button>
      </div>

      {/* Form Input Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Job Description (Paste Text)
          </label>
          <textarea
            {...register("jobDescription")}
            rows={4}
            placeholder="Paste the full job posting requirements here (e.g. Seeking Senior Full Stack Engineer with React, TypeScript, Kubernetes...)"
            className="w-full bg-slate-50 text-slate-900 text-xs p-4 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isComparing}
          className="w-fit inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          {isComparing ? (
            <>
              <IconSparkles className="w-4 h-4 animate-spin" />
              Comparing Resume vs Job Description...
            </>
          ) : (
            <>
              <IconTarget className="w-4 h-4" />
              Analyze Keyword Match
            </>
          )}
        </button>
      </form>

      {/* Match Results Display */}
      {matchResult && (
        <div className="mt-4 pt-6 border-t border-slate-200 flex flex-col gap-6 animate-fadeIn">
          {/* Match Score Meter */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-indigo-600/20 border-4 border-indigo-500 flex items-center justify-center text-2xl font-extrabold text-white">
                {matchResult.matchPercentage}%
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Target Role Match Score
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {matchResult.matchPercentage >= 80
                    ? "High Compatibility Match!"
                    : matchResult.matchPercentage >= 65
                    ? "Moderate Match - Add missing keywords"
                    : "Low Match - Needs tailored summary & skills"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  {matchResult.tailoredSummarySuggestion}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Matched Keywords:</span>
                <span className="font-bold text-emerald-400">{matchResult.matchingKeywords.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Missing Keywords:</span>
                <span className="font-bold text-amber-400">{matchResult.missingKeywords.length}</span>
              </div>
            </div>
          </div>

          {/* Keyword Pill Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching Keywords */}
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200/80">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-emerald-200">
                <IconCheck className="w-4 h-4 text-emerald-600" />
                Matching Keywords Present ({matchResult.matchingKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2 mt-4">
                {matchResult.matchingKeywords.map((word) => (
                  <span key={word} className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* High Priority Missing Keywords */}
            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-amber-200">
                <IconAlertCircle className="w-4 h-4 text-amber-600" />
                High Priority Missing Keywords ({matchResult.highPriorityKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2 mt-4">
                {matchResult.highPriorityKeywords.map((word) => (
                  <button
                    key={word}
                    onClick={() => copyKeyword(word)}
                    title="Click to copy"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <IconPlus className="w-3.5 h-3.5 text-amber-600" />
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
