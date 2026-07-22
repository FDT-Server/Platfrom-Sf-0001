"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import {
  IconFileText,
  IconFileSpreadsheet,
  IconCheckupList,
  IconCode,
  IconGitBranch,
  IconCalculator,
  IconBriefcase,
  IconHelpCircle,
  IconCoin,
  IconBrain,
  IconNotes,
  IconRoute,
  IconClock,
  IconListDetails,
  IconTarget,
  IconArrowRight,
} from "@tabler/icons-react";

interface ToolsContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
}

type ToolCard = {
  id: string;
  title: string;
  description: string;
  category: "Resume" | "Coding" | "Career" | "AI" | "Productivity";
  icon: React.ComponentType<{ className?: string }>;
  launchUrl?: string;
  badge?: string;
};

const tools: ToolCard[] = [

  {
    id: "ai-resume-builder",
    title: "AI Resume Builder",
    description: "Build a professional, ATS-friendly resume using templates in real-time.",
    category: "Resume",
    icon: IconFileText,
    launchUrl: "/tools/resume",
    badge: "Active",
  },
  {
    id: "resume-analyzer",
    title: "Resume Analyzer",
    description: "Scan your resume for formatting mistakes, grammar issues, and missing fields.",
    category: "Resume",
    icon: IconFileSpreadsheet,
    launchUrl: "/tools/resume-analyzer",
    badge: "Beta",
  },
  {
    id: "ats-score-checker",
    title: "ATS Score Checker",
    description: "Check how well your resume matches standard applicant tracking systems.",
    category: "Resume",
    icon: IconCheckupList,
    badge: "Premium",
  },

  {
    id: "code-playground",
    title: "Code Playground",
    description: "Write, compile, and run snippets of HTML/CSS/JS and Python instantly in your browser.",
    category: "Coding",
    icon: IconCode,
    badge: "Sandbox",
  },
  {
    id: "dsa-tracker",
    title: "DSA Tracker",
    description: "Log your progress through popular DSA sheets and keep notes on key patterns.",
    category: "Coding",
    icon: IconGitBranch,
    badge: "Utility",
  },
  {
    id: "complexity-calculator",
    title: "Complexity Calculator",
    description: "Analyze code blocks to estimate time and space complexities.",
    category: "Coding",
    icon: IconCalculator,
  },

  {
    id: "cover-letter",
    title: "Cover Letter Gen",
    description: "Generate customized cover letters tailored to specific roles and companies.",
    category: "Career",
    icon: IconBriefcase,
  },
  {
    id: "interview-gen",
    title: "Interview Prep",
    description: "Generate practice behavioral and technical questions for targeted job profiles.",
    category: "Career",
    icon: IconHelpCircle,
    badge: "New",
  },
  {
    id: "salary-estimator",
    title: "Salary Estimator",
    description: "Estimate standard market compensation based on role, experience, and location.",
    category: "Career",
    icon: IconCoin,
  },

  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    description: "Ask questions, clarify topics, and get step-by-step guides for technical subjects.",
    category: "AI",
    icon: IconBrain,
    badge: "Pro",
  },
  {
    id: "ai-notes-gen",
    title: "AI Notes Generator",
    description: "Transform raw lecture scripts or transcripts into structured markdown notes.",
    category: "AI",
    icon: IconNotes,
  },
  {
    id: "ai-roadmap-gen",
    title: "AI Roadmap Generator",
    description: "Generate personalized step-by-step learning roadmaps for any career track.",
    category: "AI",
    icon: IconRoute,
    badge: "Interactive",
  },

  {
    id: "pomodoro",
    title: "Pomodoro Timer",
    description: "Track focus cycles with customizable study blocks and break reminders.",
    category: "Productivity",
    icon: IconClock,
  },
  {
    id: "task-planner",
    title: "Task Planner",
    description: "Create kanban boards or structured checklists to organize daily schedules.",
    category: "Productivity",
    icon: IconListDetails,
  },
  {
    id: "goal-tracker",
    title: "Goal Tracker",
    description: "Set long-term metrics and trace your progress milestones periodically.",
    category: "Productivity",
    icon: IconTarget,
  },
];

const categoryColors = {
  Resume: "bg-blue-50 text-blue-700 border-blue-100",
  Coding: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Career: "bg-purple-50 text-purple-700 border-purple-100",
  AI: "bg-amber-50 text-amber-700 border-amber-100",
  Productivity: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function ToolsContent({ user }: ToolsContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Resume", "Coding", "Career", "AI", "Productivity"];

  const filteredTools = activeCategory === "All"
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  const handleLaunch = (tool: ToolCard) => {
    if (!tool.launchUrl) {
      toast.info(`"${tool.title}" is currently under development. Stay tuned for future updates!`, {
        description: "We are actively preparing this module.",
        duration: 3500,
      });
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">

        <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50/60 px-2.5 py-1 rounded-md">
              Developer Zone
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Student Utilities & Tools
            </h3>
            <p className="text-sm text-slate-650 mt-1">
              Select a specialized application to accelerate your engineering tracks and career growth.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 border cursor-pointer ${
                activeCategory === category
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pr-1 pb-4">
          {filteredTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <div
                key={tool.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition duration-150 group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        categoryColors[tool.category]
                      }`}
                    >
                      {tool.category}
                    </span>
                    {tool.badge && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900/5 transition duration-150">
                      <ToolIcon className="w-5 h-5 text-slate-650 group-hover:text-slate-900 transition duration-150" />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                      {tool.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-550 leading-relaxed mt-3.5">
                    {tool.description}
                  </p>
                </div>

                {/* Launch Button */}
                <div className="mt-6 pt-4 border-t border-dashed border-slate-100">
                  {tool.launchUrl ? (
                    <Link
                      href={tool.launchUrl}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-xs font-bold transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Launch Tool
                      <IconArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleLaunch(tool)}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white rounded-xl py-2.5 text-xs font-bold transition duration-150 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-0"
                    >
                      Launch Tool
                      <IconArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
