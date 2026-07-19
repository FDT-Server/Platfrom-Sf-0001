"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import UploadZone, { UploadedFileInfo } from "@/components/tools/resume-analyzer/UploadZone";
import ResumePreview from "@/components/tools/resume-analyzer/ResumePreview";
import AnalysisDashboard from "@/components/tools/resume-analyzer/AnalysisDashboard";
import { analyzeResume, ResumeAnalysisResult } from "@/services/resume-analyzer";
import {
  IconArrowLeft,
  IconSparkles,
  IconFileSpreadsheet,
  IconCheck,
  IconShieldCheck,
  IconBulb,
  IconCpu,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface ResumeAnalyzerContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
}

export default function ResumeAnalyzerContent({ user }: ResumeAnalyzerContentProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  // Trigger analysis on file upload
  const handleFileUpload = async (file: File) => {
    const info: UploadedFileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fileObj: file,
    };

    setUploadedFile(info);
    setIsAnalyzing(true);

    try {
      // Run analysis engine
      const result = await analyzeResume(file);
      // Add slight timeout to display simulated scan animation
      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        toast.success("AI Analysis Complete!", {
          description: `Resume scored ${result.overallScore}/100 with ${result.improvements.length} actionable suggestions.`,
        });
      }, 1000);
    } catch (e) {
      toast.error("Failed to run resume analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleReplaceFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    toast.info("Previous resume cleared. Upload a new document to scan.");
  };

  const handleDeleteFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    toast.success("Resume deleted.");
  };

  const handleDownloadFile = () => {
    if (!uploadedFile) return;
    toast.success(`Downloading ${uploadedFile.name}...`);
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col gap-6 animate-fadeIn pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <Link
              href="/tools"
              className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shrink-0"
              title="Back to Tools"
            >
              <IconArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  Career Suite
                </span>
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AI Powered
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">AI Resume Analyzer</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan your resume for ATS compatibility, keyword gaps, formatting issues, and metric suggestions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <IconCpu className="w-4 h-4 text-indigo-600" />
              Engine: Gemini / Rule-Based Parser
            </span>
          </div>
        </div>

        {/* Main Dual-Panel Grid Layout */}
        <div className="w-full">
          {!uploadedFile ? (
            /* INITIAL STATE: Upload Panel (Left) | AI Welcome Info (Right) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Upload Zone */}
              <div className="lg:col-span-5">
                <UploadZone
                  uploadedFile={uploadedFile}
                  onFileUpload={handleFileUpload}
                  onReplaceFile={handleReplaceFile}
                  onDeleteFile={handleDeleteFile}
                  onDownloadFile={handleDownloadFile}
                />
              </div>

              {/* Right: AI Welcome Diagnostic Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                    <IconSparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Smart AI Career Assistant
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload your PDF or DOCX resume to run 10+ diagnostic modules in seconds.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <IconCheck className="w-4 h-4 text-emerald-600" />
                      ATS Readability Scan
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Detect hidden tables, invalid graphics, non-standard fonts, and multi-column parsing issues.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <IconCheck className="w-4 h-4 text-emerald-600" />
                      Job Keyword Matcher
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Paste target job postings to uncover missing high-priority tech stack keywords.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <IconCheck className="w-4 h-4 text-emerald-600" />
                      Action Verb & Impact Audit
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Identify passive phrases and get instant AI metrics to rewrite experience bullet points.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <IconCheck className="w-4 h-4 text-emerald-600" />
                      Visual Analytics & PDF Export
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Download full diagnostic reports and track progress across multiple resume versions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* UPLOADED STATE: Sticky Resume Preview (Left) | Analysis Dashboard (Right) */
            <div className="flex flex-col gap-6">
              {/* Top Upload Status Bar */}
              <UploadZone
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onReplaceFile={handleReplaceFile}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
                onTogglePreview={() => setIsPreviewOpen((prev) => !prev)}
                isPreviewOpen={isPreviewOpen}
                isAnalyzing={isAnalyzing}
              />

              {/* Dual Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Panel: Sticky Resume Preview */}
                {isPreviewOpen && (
                  <div className="lg:col-span-5">
                    <ResumePreview
                      parsedData={analysisResult?.parsedData || null}
                      fileName={uploadedFile.name}
                    />
                  </div>
                )}

                {/* Right Panel: AI Analysis Dashboard */}
                <div className={isPreviewOpen ? "lg:col-span-7" : "lg:col-span-12"}>
                  {isAnalyzing || !analysisResult ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 animate-pulse mb-4">
                        <IconSparkles className="w-8 h-8 animate-spin" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Running AI Diagnostic Engine...
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Evaluating ATS headers, extracting skills matrix, and benchmarking impact metrics.
                      </p>
                    </div>
                  ) : (
                    <AnalysisDashboard analysis={analysisResult} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
