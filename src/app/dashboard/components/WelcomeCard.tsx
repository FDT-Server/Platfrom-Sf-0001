"use client";

import React, { useMemo } from "react";

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

  const firstName = userName ? userName.split(" ")[0] : "Student";

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-7 pb-16 sm:pb-20 shadow-sm border border-blue-500/20 relative overflow-hidden select-none">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/15 px-3.5 py-1 rounded-full backdrop-blur-xs text-blue-100">
            {formattedDate}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
          Welcome back, {firstName}
        </h2>

        <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal max-w-2xl mt-0.5">
          &ldquo;Consistency is key. Every line of code, completed lesson, and project brings you closer to your career goals.&rdquo;
        </p>
      </div>
    </div>
  );
}
