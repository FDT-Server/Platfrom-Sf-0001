"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconBriefcase,
  IconCopy,
  IconCheck,
  IconDownload,
  IconSparkles,
  IconWriting,
} from "@tabler/icons-react";

interface CoverLetterContentProps {
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

export default function CoverLetterContent({ user }: CoverLetterContentProps) {
  const [jobTitle, setJobTitle] = useState("Software Engineer Intern");
  const [companyName, setCompanyName] = useState("TechCorp Solutions");
  const [keySkills, setKeySkills] = useState("React, TypeScript, Next.js, Node.js, PostgreSQL");
  const [tone, setTone] = useState("Professional");
  const [copied, setCopied] = useState(false);

  const generatedLetter = `Dear Hiring Manager at ${companyName},

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. As a passionate developer with expertise in ${keySkills}, I have consistently built scalable web applications and collaborated across engineering teams to deliver robust products.

At ${companyName}, your commitment to building state-of-the-art software aligns perfectly with my professional goals. In my recent projects, I have implemented clean component architectures, optimized database performance, and delivered features with high user satisfaction.

Key highlights of my background include:
• Expertise in ${keySkills} for full-stack software development.
• Proven track record in rapid prototyping, clean code standards, and agile sprint deliveries.
• Strong problem-solving skills demonstrated through algorithm mastery and project deployments.

I would welcome the opportunity to discuss how my technical skills and enthusiasm for ${companyName}'s mission can add immediate value to your team. Thank you for your time and consideration.

Sincerely,
${user.fullName}
${user.email}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 md:p-8 shadow-xs animate-fadeIn">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <IconArrowLeft className="w-3.5 h-3.5" /> Back to Tools Workspace
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <IconBriefcase className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Cover Letter Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate role-tailored cover letters in seconds.
          </p>
        </div>

        {/* Inputs & Live Letter Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Form Controls */}
          <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <IconSparkles className="w-4 h-4 text-amber-600" /> Application Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Key Skills & Technologies</label>
              <input
                type="text"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none"
              >
                <option value="Professional">Professional & Confident</option>
                <option value="Enthusiastic">Enthusiastic & High Energy</option>
                <option value="Concise">Concise & Direct</option>
              </select>
            </div>
          </div>

          {/* Generated Letter Display */}
          <div className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <IconWriting className="w-4 h-4 text-indigo-600" /> Generated Preview
              </span>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-950 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald-400" /> : <IconCopy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Letter"}
              </button>
            </div>

            <textarea
              readOnly
              value={generatedLetter}
              className="w-full flex-1 min-h-[320px] text-xs font-sans text-slate-800 leading-relaxed focus:outline-none resize-none bg-slate-50/50 p-4 rounded-xl border border-slate-100"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
