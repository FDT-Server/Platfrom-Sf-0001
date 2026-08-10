"use client";

import React, { useMemo } from "react";

interface WelcomeCardProps {
  userName: string;
  credits: number;
  streak: number;
  profileImage?: string | null;
}

export default function WelcomeCard({ userName }: WelcomeCardProps) {
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    // E.g. "Thu, Jul 30, 2026"
    return new Date().toLocaleDateString("en-US", options).toUpperCase();
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "Student";

  return (
    <div className="bg-[#2D5BFF] text-white rounded-[24px] px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between relative overflow-hidden select-none w-full shadow-md">
      {/* Background abstract elements (optional, to mimic the mockup) */}
      <div className="absolute top-0 right-[25%] opacity-30">
        <span className="material-symbols-outlined text-[64px] font-light">code</span>
      </div>
      <div className="absolute bottom-10 right-[35%] opacity-20">
        <span className="material-symbols-outlined text-[32px] font-light">terminal</span>
      </div>

      <div className="relative z-10 flex flex-col gap-2.5 w-full max-w-xl">
        {/* Date Pill */}
        <div className="inline-flex w-max">
          <span className="text-[11px] font-bold tracking-wider bg-white/10 px-4 py-1.5 rounded-full text-blue-100 border border-white/5 shadow-sm">
            {formattedDate}
          </span>
        </div>

        {/* Greeting & Quote */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {firstName} <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h2>
          <p className="text-[12px] sm:text-[14px] text-blue-100/90 leading-relaxed font-normal max-w-[90%]">
            "Consistency is key. Every line of code, completed lesson, and project brings you closer to your career goals."
          </p>
        </div>
      </div>
    </div>
  );
}
