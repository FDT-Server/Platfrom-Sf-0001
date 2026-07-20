"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconPrinter,
  IconChevronRight,
  IconUser,
  IconFileText,
  IconBriefcase,
  IconSchool,
  IconSettings,
  IconFolder,
  IconAward,
  IconLanguage,
  IconRefresh,
  IconArrowLeft,
  IconTarget,
  IconUsers,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { ResumeData } from "./types";
import { initialResumeData } from "./templates";
import {
  ModernTemplate,
  ProfessionalTemplate,
  MinimalTemplate,
  ExecutiveTemplate,
} from "./templates";

// Import modular section form editors
import PersonalInfoForm from "./components/PersonalInfoForm";
import SummaryForm from "./components/SummaryForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ProjectsForm from "./components/ProjectsForm";
import SkillsForm from "./components/SkillsForm";
import CertificationsForm from "./components/CertificationsForm";
import LanguagesForm from "./components/LanguagesForm";
import AchievementsForm from "./components/AchievementsForm";
import InterestsForm from "./components/InterestsForm";
import ReferencesForm from "./components/ReferencesForm";
import CustomSectionsForm from "./components/CustomSectionsForm";

interface ResumeBuilderContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
}

export default function ResumeBuilderContent({ user }: ResumeBuilderContentProps) {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(0.85);
  const [previewHeight, setPreviewHeight] = useState(1123);
  const [zoomMode, setZoomMode] = useState<"75" | "90" | "100" | "fit">("fit");

  const printAreaRef = useRef<HTMLDivElement>(null);
  const previewParentRef = useRef<HTMLDivElement>(null);

  // Handle mobile detection (xl breakpoint is 1280px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle preview auto-scaling / zoom modes
  useEffect(() => {
    if (typeof window === "undefined" || !previewParentRef.current) return;

    if (zoomMode === "75") {
      setScale(0.75);
      return;
    }
    if (zoomMode === "90") {
      setScale(0.9);
      return;
    }
    if (zoomMode === "100") {
      setScale(1.0);
      return;
    }

    // Auto-fit calculation (ResizeObserver)
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const containerWidth = entries[0].contentRect.width;
      if (containerWidth === 0) return;

      const padding = window.innerWidth < 768 ? 24 : 64;
      const availableWidth = containerWidth - padding;
      const newScale = Math.min(1.0, availableWidth / 794);
      setScale(newScale);
    });

    resizeObserver.observe(previewParentRef.current);
    return () => resizeObserver.disconnect();
  }, [mobileTab, zoomMode]);

  // Measure dynamic preview height for scroll calculations
  useEffect(() => {
    if (printAreaRef.current) {
      setPreviewHeight(printAreaRef.current.scrollHeight || 1123);
    }
  }, [data, scale, mobileTab]);

  // Load draft from local storage
  useEffect(() => {
    const saved = localStorage.getItem("sf-resume-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personalDetails) {
          setData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse resume draft:", e);
      }
    }
  }, []);

  // Save changes (Auto-save)
  const updateData = (newData: Partial<ResumeData>) => {
    setData((prev) => {
      const merged = { ...prev, ...newData };
      localStorage.setItem("sf-resume-draft", JSON.stringify(merged));
      return merged;
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your resume to default template data?")) {
      setData(initialResumeData);
      localStorage.setItem("sf-resume-draft", JSON.stringify(initialResumeData));
      toast.success("Resume reset to default template.");
    }
  };

  const handleExport = () => {
    if (isMobile) {
      setMobileTab("preview");
    }
    toast.success("Draft Saved! Preparing Print Dialog...", {
      description: "Select 'Save as PDF' to download your resume.",
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleSaveDraftExplicitly = () => {
    localStorage.setItem("sf-resume-draft", JSON.stringify(data));
    toast.success("Resume progress draft saved successfully!");
  };

  // Section completeness calculations
  const completionMap: Record<string, boolean> = {
    personal: !!data.personalDetails.name && !!data.personalDetails.email,
    summary: !!data.summary && data.summary.trim().length > 0,
    experience: data.experience.length > 0 && !!data.experience[0].company && !!data.experience[0].role,
    education: data.education.length > 0 && !!data.education[0].school && !!data.education[0].degree,
    projects: data.projects.length > 0 && !!data.projects[0].name,
    skills: data.skills.length > 0 && !!data.skills[0].name,
    certifications: data.certifications.length > 0 && !!data.certifications[0].title,
    languages: data.languages.length > 0 && !!data.languages[0].name,
    achievements: (data.achievements || []).length > 0 && !!(data.achievements || [])[0].trim(),
    interests: (data.interests || []).length > 0 && !!(data.interests || [])[0].trim(),
    references: (data.references || []).length > 0 && !!(data.references || [])[0].name,
  };

  // Sections config array
  const sections = [
    { id: "personal", label: "Personal Information", icon: IconUser },
    { id: "summary", label: "Professional Summary", icon: IconFileText },
    { id: "education", label: "Education", icon: IconSchool },
    { id: "experience", label: "Work Experience", icon: IconBriefcase },
    { id: "projects", label: "Projects", icon: IconFolder },
    { id: "skills", label: "Skills", icon: IconSettings },
    { id: "certifications", label: "Certifications", icon: IconAward },
    { id: "languages", label: "Languages", icon: IconLanguage },
    { id: "achievements", label: "Achievements", icon: IconClipboardCheck },
    { id: "interests", label: "Interests", icon: IconTarget },
    { id: "references", label: "References", icon: IconUsers },
  ];

  // Dynamic progress tracker percentage
  const totalSections = sections.length;
  const completedSections = Object.values(completionMap).filter(Boolean).length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  // Dynamic order list of all sections (including custom ones)
  const getSectionsList = () => {
    const list = sections.map((s) => s.id);
    (data.customSections || []).forEach((_, idx) => {
      list.push(`custom-${idx}`);
    });
    return list;
  };

  const handleNext = () => {
    const list = getSectionsList();
    const idx = list.indexOf(activeSection);
    if (idx < list.length - 1) {
      setActiveSection(list[idx + 1]);
    } else {
      toast.success("Congratulations! All wizard sections completed.", {
        description: "Click 'Print / PDF' at the top to download your resume.",
      });
    }
  };

  const handlePrevious = () => {
    const list = getSectionsList();
    const idx = list.indexOf(activeSection);
    if (idx > 0) {
      setActiveSection(list[idx - 1]);
    }
  };

  const addCustomSection = () => {
    const newIdx = data.customSections.length;
    const newSec = {
      title: "New Custom Section",
      items: [
        {
          id: `item-${Date.now()}`,
          title: "",
          description: "",
        },
      ],
    };
    updateData({ customSections: [...(data.customSections || []), newSec] });
    setActiveSection(`custom-${newIdx}`);
    toast.success("Added new custom section");
  };

  // Render the currently selected editor section component
  const renderEditorSection = () => {
    if (activeSection === "personal") {
      return <PersonalInfoForm data={data} onChange={updateData} />;
    }
    if (activeSection === "summary") {
      return <SummaryForm data={data} onChange={updateData} />;
    }
    if (activeSection === "experience") {
      return <ExperienceForm data={data} onChange={updateData} />;
    }
    if (activeSection === "education") {
      return <EducationForm data={data} onChange={updateData} />;
    }
    if (activeSection === "projects") {
      return <ProjectsForm data={data} onChange={updateData} />;
    }
    if (activeSection === "skills") {
      return <SkillsForm data={data} onChange={updateData} />;
    }
    if (activeSection === "certifications") {
      return <CertificationsForm data={data} onChange={updateData} />;
    }
    if (activeSection === "languages") {
      return <LanguagesForm data={data} onChange={updateData} />;
    }
    if (activeSection === "achievements") {
      return <AchievementsForm data={data} onChange={updateData} />;
    }
    if (activeSection === "interests") {
      return <InterestsForm data={data} onChange={updateData} />;
    }
    if (activeSection === "references") {
      return <ReferencesForm data={data} onChange={updateData} />;
    }
    if (activeSection.startsWith("custom-")) {
      const idx = parseInt(activeSection.split("-")[1]);
      return <CustomSectionsForm data={data} onChange={updateData} activeCustomIndex={idx} />;
    }
    return null;
  };

  const renderTemplate = () => {
    switch (data.template) {
      case "professional":
        return <ProfessionalTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "executive":
        return <ExecutiveTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      {/* High Quality A4 Print Layout CSS */}
      <style>{`
        /* Hide print portal on screen display */
        #resume-print-portal {
          display: none;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }

          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide screen layout elements */
          body * {
            visibility: hidden !important;
          }

          /* Unclip parent containers */
          div, main, section {
            overflow: visible !important;
            max-height: none !important;
          }

          /* Force top-level print portal to be 100% visible and positioned at top-left */
          #resume-print-portal,
          #resume-print-portal * {
            visibility: visible !important;
            display: block !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #resume-print-portal {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            z-index: 999999999 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Preserve 2-column template layout on paper */
          #resume-print-portal .flex-col.md\:flex-row {
            flex-direction: row !important;
          }
          #resume-print-portal .md\:w-\[35\%\] {
            width: 35% !important;
          }
          #resume-print-portal .md\:pr-6 {
            padding-right: 1.5rem !important;
          }
          #resume-print-portal .md\:border-r {
            border-right-width: 1px !important;
          }
          #resume-print-portal .md\:border-b-0 {
            border-bottom-width: 0px !important;
          }
        }
      `}</style>

      <div className="flex flex-col w-full h-[calc(100vh-80px)] md:h-[calc(100vh-88px)] overflow-hidden bg-slate-50 relative animate-fadeIn pr-1">

        {/* Top Control Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <Link href="/tools" className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 text-xs font-semibold">
              <IconArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <IconFileText className="w-5 h-5 text-indigo-600" /> AI Resume Builder
            </h3>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Progress tracker widget */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Completion: {completionPercentage}%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2 py-1 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider pl-1">Template:</span>
              <select
                value={data.template}
                onChange={(e) => updateData({ template: e.target.value as any })}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none border-0 pr-6 py-1 cursor-pointer font-sans"
              >
                <option value="modern">Modern</option>
                <option value="professional">Professional</option>
                <option value="minimal">Minimal</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              title="Reset data"
              className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-slate-100 transition border border-slate-200 bg-white cursor-pointer"
            >
              <IconRefresh className="w-4 h-4" />
            </button>

            <button
              onClick={handleExport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-sm border-0 cursor-pointer"
            >
              <IconPrinter className="w-4 h-4" /> Print / PDF
            </button>
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="flex xl:hidden border border-slate-200 bg-white rounded-2xl p-1 mb-4 shrink-0 shadow-xs">
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${mobileTab === "edit"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-650 hover:bg-slate-50"
              }`}
          >
            Edit Resume ({completionPercentage}%)
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${mobileTab === "preview"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-650 hover:bg-slate-50"
              }`}
          >
            Preview Resume
          </button>
        </div>

        {/* Three Column Builder Body */}
        <div
          className="xl:grid flex flex-col flex-1 overflow-hidden gap-4 pb-2 w-full"
          style={!isMobile ? { gridTemplateColumns: "300px minmax(550px, 680px) 1fr" } : undefined}
        >

          {/* COLUMN 1: Fixed Navigation (Left Sidebar) */}
          <div
            className={cn(
              "bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1 shadow-xs shrink-0 transition-all duration-200",
              // On desktop:
              "xl:block xl:h-full xl:w-auto xl:overflow-y-auto",
              // On mobile/tablet (<1280px):
              mobileTab === "edit"
                ? (activeSection ? "hidden xl:block" : "w-full h-[calc(100vh-280px)] overflow-y-auto")
                : "hidden xl:block"
            )}
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block">
              Resume Sections
            </span>
            {sections.map((sec) => {
              const SecIcon = sec.icon;
              const isActive = activeSection === sec.id;
              const isComplete = completionMap[sec.id];
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition duration-150 cursor-pointer",
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <SecIcon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-450")} />
                    <span>{sec.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isComplete ? (
                      <span className="text-emerald-500 font-extrabold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">✓</span>
                    ) : (
                      <span className="text-slate-400 font-bold text-[9px] bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200">○</span>
                    )}
                    <IconChevronRight className={cn("w-3.5 h-3.5 transition-transform", isActive ? "rotate-90" : "opacity-30")} />
                  </div>
                </button>
              );
            })}

            {/* Custom Sections */}
            {(data.customSections || []).map((sec, idx) => (
              <button
                key={`custom-${idx}`}
                onClick={() => setActiveSection(`custom-${idx}`)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition duration-150 cursor-pointer",
                  activeSection === `custom-${idx}`
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-655 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <IconSettings className="w-4 h-4 text-slate-450" />
                  <span className="truncate">{sec.title || `Custom Sec ${idx + 1}`}</span>
                </div>
                <IconChevronRight className="w-3.5 h-3.5 opacity-30" />
              </button>
            ))}

            <button
              onClick={addCustomSection}
              className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-slate-350 hover:border-slate-800 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold transition duration-150 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {/* COLUMN 2: Single Section Form Editor (Middle Panel) */}
          <div
            className={cn(
              "flex-grow flex flex-col gap-6 scroll-smooth transition-all duration-200",
              // On desktop:
              "xl:h-full xl:overflow-y-auto xl:overflow-x-hidden xl:pr-2 pb-12",
              // On mobile/tablet (<1280px):
              mobileTab === "edit"
                ? (activeSection ? "w-full h-[calc(100vh-280px)] overflow-y-auto pb-12" : "hidden xl:flex")
                : "hidden xl:flex"
            )}
          >

            {/* Mobile Navigation Picker Button */}
            {isMobile && activeSection && (
              <button
                onClick={() => setActiveSection("")}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-2 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0 w-fit cursor-pointer shadow-xs"
              >
                ← Back to Section List
              </button>
            )}

            {/* Current Active Form Editor Section Card */}
            {renderEditorSection()}

            {/* Bottom Navigation Wizard */}
            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mt-2 shrink-0">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={getSectionsList().indexOf(activeSection) === 0}
                className="text-xs font-bold text-slate-655 hover:text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 cursor-pointer bg-white disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleSaveDraftExplicitly}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 cursor-pointer bg-white"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-2.5 shadow-xs cursor-pointer border-0"
              >
                {getSectionsList().indexOf(activeSection) === getSectionsList().length - 1
                  ? "Finish Wizard →"
                  : "Next Section →"}
              </button>
            </div>

            {/* Architecture placeholder for future AI enhancements */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex flex-col gap-1 text-[10px] text-indigo-700/80 font-mono shrink-0">
              <span className="font-bold uppercase tracking-wider">AI Integration Architecture ready:</span>
              <span>- Hook points defined for AI Bullets suggestions</span>
              <span>- Resume context optimization variables mapped</span>
              <span>- ATS analyzer schema validation points prepared</span>
            </div>
          </div>

          {/* COLUMN 3: Live Preview (Right Panel) */}
          <div
            ref={previewParentRef}
            className={cn(
              "bg-slate-100 border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-inner select-none relative group/preview transition-all duration-200",
              // On desktop:
              "xl:flex-1 xl:h-full xl:w-auto",
              // On mobile/tablet (<1280px):
              mobileTab === "preview"
                ? "w-full h-[calc(100vh-280px)]"
                : "hidden xl:flex"
            )}
          >
            {/* Live Indicator + Zoom Controls Bar */}
            <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-3 py-2 border-b border-slate-750 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Preview
              </span>

              {/* Zoom Buttons */}
              <div className="flex items-center gap-1 bg-slate-800 rounded-md p-0.5 shrink-0 border border-slate-700 select-none" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setZoomMode("75")}
                  className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold transition cursor-pointer border-0", zoomMode === "75" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white")}
                >
                  75%
                </button>
                <button
                  onClick={() => setZoomMode("90")}
                  className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold transition cursor-pointer border-0", zoomMode === "90" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white")}
                >
                  90%
                </button>
                <button
                  onClick={() => setZoomMode("100")}
                  className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold transition cursor-pointer border-0", zoomMode === "100" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white")}
                >
                  100%
                </button>
                <button
                  onClick={() => setZoomMode("fit")}
                  className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold transition cursor-pointer border-0", zoomMode === "fit" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white")}
                >
                  Fit Width
                </button>
              </div>
            </div>

            {/* Scaled Preview Wrapper */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center items-start scrollbar-thin">
              {/* Outer shadow card wrapping the scaled document to reserve EXACT layout size */}
              <div
                style={{
                  width: `${794 * scale}px`,
                  height: `${previewHeight * scale}px`,
                  overflow: "hidden",
                  position: "relative",
                  margin: "0 auto",
                }}
                className="shadow-xl border border-slate-200/80 rounded-sm shrink-0 bg-white"
              >
                <div
                  id="print-preview-container"
                  ref={printAreaRef}
                  className="bg-white shrink-0"
                  style={{
                    width: "794px",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bulletproof Top-Level Dedicated A4 Print Portal */}
      <div id="resume-print-portal">
        {renderTemplate()}
      </div>
    </DashboardLayout>
  );
}
