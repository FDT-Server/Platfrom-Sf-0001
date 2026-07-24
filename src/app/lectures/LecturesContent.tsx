"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface LecturesContentProps {
  user: {
    fullName: string;
    email: string;
  };
}

export default function LecturesContent({ user }: LecturesContentProps) {

  const [activeLang, setActiveLang] = useState<Record<string, "en" | "te">>({});

  const toggleLanguage = (cardId: string, lang: "en" | "te") => {
    setActiveLang((prev) => ({
      ...prev,
      [cardId]: lang,
    }));
  };

  const lecturesList = [
    {
      id: "PRISMA_ORM",
      title: "Prisma ORM Reference",
      publisher: "Prisma Database Team",
      category: "Database",
      description: "Learn schema designs, relations models, and database queries in Prisma.",
      docsLink: "https://www.prisma.io/docs",
      videoEn: "gimSKEsWYb4?si=8KilGDXOwX3gYhmu",
      videoTe: "gimSKEsWYb4?si=8KilGDXOwX3gYhmu",
    },
    {
      id: "POSTGRES",
      title: "PostgreSQL Database",
      publisher: "PostgreSQL Global Group",
      category: "Database",
      description: "Comprehensive SQL queries guide, indexing, and indexing execution plans.",
      docsLink: "https://www.postgresql.org/docs",
      videoEn: "evJuky1ZtD8?si=6oLrXAdmK9OHE5yD",
      videoTe: "evJuky1ZtD8?si=6oLrXAdmK9OHE5yD",
    },
    {
      id: "NEON_DB",
      title: "Neon Serverless Database",
      publisher: "Neon Postgres Org",
      category: "Database",
      description: "Deploy serverless databases with instant scaling and branch cloning.",
      docsLink: "https://neon.tech/docs",
      videoEn: "XtMiMnX0hDg?si=J7rlS15Yd1xZpqE1",
      videoTe: "XtMiMnX0hDg?si=J7rlS15Yd1xZpqE1",
    },
    {
      id: "COCKROACH",
      title: "CockroachDB Serverless",
      publisher: "Cockroach Labs Team",
      category: "Database",
      description: "Deploy distributed Postgres SQL tables across globally resilient clouds.",
      docsLink: "https://www.cockroachlabs.com/docs",
      videoEn: "pFFmeg_smt8?si=pBJjXfD45t_0x92u",
      videoTe: "pFFmeg_smt8?si=pBJjXfD45t_0x92u",
    },
    {
      id: "NEXTJS_APP",
      title: "Next.js 16 / App Router",
      publisher: "Vercel Core Next.js",
      category: "Next.js",
      description: "Master layouts, client vs server components, routing and caching.",
      docsLink: "https://nextjs.org/docs",
      videoEn: "I1V9YWqRIeI?si=NDpQLPPuXsZ0_Xop",
      videoTe: "I1V9YWqRIeI?si=NDpQLPPuXsZ0_Xop",
    },
    {
      id: "REACT19",
      title: "React 19 Framework",
      publisher: "Meta Open Source Team",
      category: "Library",
      description: "Explore the new React compiler, Server Actions, and custom forms hooks.",
      docsLink: "https://react.dev",
      videoEn: "Ke90Tje7VS0",
      videoTe: "dGcsHMXbSMA",
    },
    {
      id: "TYPESCRIPT",
      title: "TypeScript Handbook",
      publisher: "Microsoft Developers",
      category: "Language",
      description: "Write typeguards, generic parameters, interfaces, and safe configurations.",
      docsLink: "https://www.typescriptlang.org/docs",
      videoEn: "d56mG7DezGs?si=eRQX4HWiKCEtDnjy",
      videoTe: "d56mG7DezGs?si=eRQX4HWiKCEtDnjy",
    },
    {
      id: "TAILWIND4",
      title: "Tailwind CSS v4 Utility",
      publisher: "Tailwind Labs CSS",
      category: "Styling",
      description: "Build layout systems using the new v4 utility configurations compiler.",
      docsLink: "https://tailwindcss.com/docs",
      videoEn: "6biMWgD6_JY?si=IOJ8i6siDgtyOO4C",
      videoTe: "6biMWgD6_JY?si=IOJ8i6siDgtyOO4C",
    },
    {
      id: "SHADCNUI",
      title: "Shadcn UI CLI Layouts",
      publisher: "Radix UI Primitives",
      category: "Components",
      description: "Integrate components in Next.js using shadcn CLI commands.",
      docsLink: "https://ui.shadcn.com",
      videoEn: "m-gIqQTHcAY?si=e8SNZQYkMG-ELrMw",
      videoTe: "m-gIqQTHcAY?si=e8SNZQYkMG-ELrMw",
    },
    {
      id: "CSS3",
      title: "CSS3 Grid & Animations",
      publisher: "W3C CSS Working Group",
      category: "Styling",
      description: "Build layouts using Flexbox, CSS Grid, and hardware transitions.",
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      videoEn: "yfoY53QXEnI",
      videoTe: "R9I8xP_lX9o",
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-300 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">

        <div className="pb-6 border-b border-slate-300">
          <span className="text-xs font-bold text-blue-600 bg-blue-50/60 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
            <span className="material-symbols-outlined text-[14px] select-none">
              video_library
            </span>
            Academy Video Library
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            Curated Lectures
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Learn using our embedded video players. Choose your preferred language (English or Telugu) below each clip.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pr-1 pb-4">
          {lecturesList.map((card) => {
            const currentLang = activeLang[card.id] || "en";
            const embedId = currentLang === "en" ? card.videoEn : card.videoTe;

            return (
              <div
                key={card.id}
                className="flex flex-col rounded-2xl shadow-sm border border-slate-300 overflow-hidden bg-white hover:shadow-md transition duration-150 group"
              >

                <div className="relative h-48 w-full bg-slate-900">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${embedId}`}
                    title={card.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>

                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1.5 mb-4">
                      <button
                        onClick={() => toggleLanguage(card.id, "en")}
                        className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition duration-150 ${
                          currentLang === "en"
                            ? "bg-white text-blue-600 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        English Video
                      </button>
                      <button
                        onClick={() => toggleLanguage(card.id, "te")}
                        className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition duration-150 ${
                          currentLang === "te"
                            ? "bg-white text-blue-600 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Telugu Video
                      </button>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {card.publisher}
                      </span>
                      <span className="inline-block bg-slate-50 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-100">
                        {card.category}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-800 leading-snug mt-2 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="border-t border-dashed border-slate-300 my-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-red-600 select-none">
                        play_circle
                      </span>
                      YouTube Embed
                    </span>
                    <a
                      href={card.docsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black hover:bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-bold transition duration-150 flex items-center gap-1.5 shadow-sm"
                    >
                      Official Docs
                      <span className="material-symbols-outlined text-[12px] shrink-0 select-none">
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
