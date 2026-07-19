"use client";

import React, { useMemo } from "react";
import { IconFlame, IconTarget, IconBell, IconSparkles } from "@tabler/icons-react";

interface WelcomeCardProps {
  userName: string;
}

export default function WelcomeCard({ userName }: WelcomeCardProps) {
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  }, []);

  const monthShort = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  }, []);

  const dayNumber = useMemo(() => {
    return new Date().getDate();
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "Student";

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-5 shadow-sm border border-blue-600/20 relative overflow-hidden select-none">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
              <IconSparkles className="w-3.5 h-3.5 text-amber-300" />
              {formattedDate}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Welcome back, {firstName}! 👋
          </h2>

          <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
            &ldquo;Consistency is key. Every line of code, completed lesson, and project brings you closer to your career goals.&rdquo;
          </p>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap gap-2.5 mt-2">
            <div className="text-xs font-bold bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <IconFlame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>5 Day Streak</span>
            </div>

            <div className="text-xs font-bold bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <IconTarget className="w-4 h-4 text-emerald-300" />
              <span>Resume: 80% Complete</span>
            </div>

            <div className="text-xs font-bold bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <IconBell className="w-4 h-4 text-sky-200" />
              <span>2 Reminders Today</span>
            </div>
          </div>
        </div>

        {/* Date Calendar Badge */}
        <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm leading-none self-end md:self-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
            {monthShort}
          </span>
          <span className="text-3xl font-black mt-1 text-white">
            {dayNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
