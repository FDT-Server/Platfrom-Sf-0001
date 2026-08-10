"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  IconFileText,
  IconCode,
  IconHelpCircle,
  IconBriefcase,
  IconClock,
  IconArrowRight,
  IconFilter,
  IconChevronDown,
  IconCheck,
  IconSparkles,
  IconSearch,
  IconFileCheck,
  IconTerminal2,
  IconFlame,
  IconStar,
} from "@tabler/icons-react";

interface ToolsContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    isPremium: boolean;
  };
}

const categoryOptions = ["All Tools", "Resume", "Coding", "Career", "Productivity"];

// --- Clean SVG Vector Header Illustrations (No overlapping badges) ---

const ResumeAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Clean Resume Paper Illustration */}
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-44 h-28 bg-white rounded-2xl shadow-sm border border-blue-200/80 p-3.5 flex flex-col justify-between overflow-hidden"
    >
      {/* Scanner Light Beam Effect */}
      <motion.div
        animate={{ y: [0, 90, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"
      />

      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
          ✓
        </div>
        <div className="space-y-1 flex-1">
          <div className="w-20 h-2 bg-blue-600 rounded-full" />
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="w-full h-1.5 bg-slate-200 rounded-full" />
        <div className="w-4/5 h-1.5 bg-blue-400 rounded-full" />
        <div className="w-3/5 h-1.5 bg-slate-200 rounded-full" />
      </div>
    </motion.div>
  </div>
);

const CodingAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Terminal Code Window Illustration */}
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className="w-48 h-28 bg-slate-950 rounded-2xl shadow-sm border border-slate-800 p-3 flex flex-col justify-between font-mono text-xs text-emerald-400 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] text-slate-400 ml-auto font-sans font-bold">main.py</span>
      </div>

      <div className="space-y-1.5 text-[11px] leading-relaxed">
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-emerald-400 font-bold">def</span>
          <span className="text-indigo-300 font-bold">twoSum</span>(nums, target):
        </div>
        <div className="pl-3 flex items-center gap-1.5">
          <span className="text-amber-300 font-bold">return</span> [0, 1]
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-3.5 bg-emerald-400 inline-block rounded-xs"
          />
        </div>
      </div>
    </motion.div>
  </div>
);

const InterviewAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Speech Bubble Card Illustration */}
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-48 bg-white p-3.5 rounded-2xl shadow-sm border border-purple-200 text-xs space-y-2"
    >
      <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs">
        <IconHelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
        <span>System Design & Behavioral</span>
      </div>
      <div className="w-full h-1.5 bg-purple-100 rounded-full" />
      <div className="w-3/4 h-1.5 bg-purple-200 rounded-full" />
    </motion.div>
  </div>
);

const CoverLetterAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Writing Sheet Illustration */}
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      className="w-44 h-28 bg-white rounded-2xl shadow-sm border border-amber-200 p-3.5 flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-center gap-2">
        <IconBriefcase className="w-4 h-4 text-amber-600 shrink-0" />
        <div className="w-16 h-2 bg-amber-500 rounded-full" />
      </div>

      <div className="space-y-1.5">
        <motion.div
          animate={{ width: ["20%", "95%", "20%"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-1.5 bg-amber-400 rounded-full"
        />
        <div className="w-full h-1.5 bg-slate-200 rounded-full" />
        <div className="w-3/4 h-1.5 bg-slate-200 rounded-full" />
      </div>
    </motion.div>
  </div>
);

const ProductivityAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Circular Progress Timer Illustration */}
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
      className="w-36 h-28 bg-slate-950 text-white rounded-2xl shadow-sm border border-slate-800 p-3 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 border-3 border-rose-500/30 border-t-rose-500 rounded-full flex items-center justify-center mb-1"
      />
      <span className="absolute font-mono text-sm font-extrabold text-rose-400">25:00</span>
      <span className="text-[10px] text-slate-400 font-bold">Focus Timer</span>
    </motion.div>
  </div>
);

// --- Card Data Structure ---

type ToolSuiteCard = {
  id: string;
  title: string;
  category: "Resume" | "Coding" | "Career" | "Productivity";
  primaryUrl: string;
  primaryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  headerBg: string;
  headerBorder: string;
  badgeBg: string;
  badgeText: string;
  animationComponent: React.ComponentType;
  metrics: { label: string; value: string };
};

const toolSuites: ToolSuiteCard[] = [
  {
    id: "resume-suite",
    title: "Resume Suite & Builder",
    category: "Resume",
    primaryUrl: "/tools/resume",
    primaryLabel: "Open Resume Builder",
    secondaryUrl: "/tools/resume-analyzer",
    secondaryLabel: "ATS Analyzer & Checker",
    headerBg: "bg-gradient-to-br from-blue-100/90 via-indigo-50 to-blue-50",
    headerBorder: "border-blue-200/70",
    badgeBg: "bg-blue-200/90 text-blue-800 border-blue-300",
    badgeText: "3-in-1 Suite",
    animationComponent: ResumeAnimation,
    metrics: { label: "ATS Optimization", value: "Real-time" },
  },
  {
    id: "coding-dsa-suite",
    title: "Coding & DSA Suite",
    category: "Coding",
    primaryUrl: "/tools/coding-dsa",
    primaryLabel: "Launch Coding & DSA Hub",
    headerBg: "bg-gradient-to-br from-emerald-100/90 via-teal-50 to-emerald-50",
    headerBorder: "border-emerald-200/70",
    badgeBg: "bg-emerald-200/90 text-emerald-800 border-emerald-300",
    badgeText: "Interactive",
    animationComponent: CodingAnimation,
    metrics: { label: "Languages", value: "Web & Python" },
  },
  {
    id: "interview-prep-suite",
    title: "Interview Prep Suite",
    category: "Career",
    primaryUrl: "/tools/interview-prep",
    primaryLabel: "Start Interview Practice",
    headerBg: "bg-gradient-to-br from-purple-100/90 via-fuchsia-50 to-purple-50",
    headerBorder: "border-purple-200/70",
    badgeBg: "bg-purple-200/90 text-purple-800 border-purple-300",
    badgeText: "Prep Guide",
    animationComponent: InterviewAnimation,
    metrics: { label: "Target Domains", value: "5 Tracks" },
  },
  {
    id: "cover-letter-gen",
    title: "Cover Letter Generator",
    category: "Career",
    primaryUrl: "/tools/cover-letter",
    primaryLabel: "Generate Cover Letter",
    headerBg: "bg-gradient-to-br from-amber-100/90 via-yellow-50 to-amber-50",
    headerBorder: "border-amber-200/70",
    badgeBg: "bg-amber-200/90 text-amber-900 border-amber-300",
    badgeText: "Utility",
    animationComponent: CoverLetterAnimation,
    metrics: { label: "Customization", value: "Role Tailored" },
  },
  {
    id: "productivity-suite",
    title: "Focus & Task Suite",
    category: "Productivity",
    primaryUrl: "/tools/productivity",
    primaryLabel: "Open Focus Planner",
    headerBg: "bg-gradient-to-br from-rose-100/90 via-pink-50 to-rose-50",
    headerBorder: "border-rose-200/70",
    badgeBg: "bg-rose-200/90 text-rose-800 border-rose-300",
    badgeText: "Pomodoro",
    animationComponent: ProductivityAnimation,
    metrics: { label: "Focus Timer", value: "25m / 5m" },
  },
];

export default function ToolsContent({ user }: ToolsContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Tools");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuites = toolSuites.filter((suite) => {
    const matchesCategory =
      activeCategory === "All Tools" || suite.category === activeCategory;
    const matchesSearch = suite.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-3xl border border-slate-200/80 bg-slate-50/50 p-4 md:p-8 shadow-xs animate-fadeIn">
        
        {/* Header Bar */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2">
              <IconSparkles className="w-3.5 h-3.5 text-indigo-600" />
              Developer Tools Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Developer & Career Tools
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              All-in-one workspace for ATS resume building, interactive coding, interview prep, and study productivity.
            </p>
          </div>

          {/* Search & Filter Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search suite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-slate-800 w-36 sm:w-48 transition"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition duration-150 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <IconFilter className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeCategory}</span>
                <IconChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-30 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Filter Category
                  </div>
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        activeCategory === cat
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {activeCategory === cat && (
                        <IconCheck className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Uncluttered Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredSuites.map((suite) => {
            const AnimComponent = suite.animationComponent;
            return (
              <div
                key={suite.id}
                className="group flex flex-col rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Top Animated Header Banner */}
                <div
                  className={`relative h-48 ${suite.headerBg} border-b ${suite.headerBorder} p-4 flex flex-col justify-between overflow-hidden`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/50 shadow-2xs">
                      {suite.category}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs ${suite.badgeBg}`}
                    >
                      {suite.badgeText}
                    </span>
                  </div>

                  {/* Micro-Animation Graphic Container */}
                  <div className="relative z-10 h-32 flex items-center justify-center overflow-hidden">
                    <AnimComponent />
                  </div>
                </div>

                {/* Minimal Content Body Below Banner */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {suite.title}
                    </h3>

                    {/* Metric Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-semibold">{suite.metrics.label}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                        {suite.metrics.value}
                      </span>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href={suite.primaryUrl}
                      className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl py-3 px-4 text-xs font-bold transition duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md cursor-pointer"
                    >
                      <span>{suite.primaryLabel}</span>
                      <IconArrowRight className="w-4 h-4 shrink-0 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>

                    {suite.secondaryUrl && (
                      <Link
                        href={suite.secondaryUrl}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl py-2.5 px-4 text-xs font-bold transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <IconFileCheck className="w-3.5 h-3.5 text-slate-600" />
                        <span>{suite.secondaryLabel}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSuites.length === 0 && (
          <div className="w-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 mt-8">
            <IconSearch className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600">No suite matching your query</p>
            <button
              onClick={() => {
                setActiveCategory("All Tools");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
