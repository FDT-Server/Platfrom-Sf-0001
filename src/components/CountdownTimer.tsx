"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  // Target date: August 6, 2026 at 22:00:00 (approx 16 days from July 21, 2026)
  const targetDate = new Date("2026-08-06T22:00:00").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center text-slate-800">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="h-screen w-screen bg-white text-slate-900 flex flex-col justify-between overflow-hidden font-sans select-none p-6 sm:p-10">
      
      {/* ── Top Header Logo ──────────────────────────────────────────────────── */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-center py-2 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Studentforge Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="h-5 w-[1px] bg-slate-200"></div>
          <span className="text-xs font-bold tracking-wider text-slate-700 uppercase">
            Platform
          </span>
        </div>
      </header>

      {/* ── Centered Main Content ────────────────────────────────────────────── */}
      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center text-center gap-8 my-auto overflow-hidden">
        
        {/* Headline & Paragraph */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Platform Upgrade in Progress
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Studentforge is undergoing scheduled system updates. Services will resume automatically once the upgrade completes.
          </p>
        </div>

        {/* 4-Box Countdown Timer */}
        <div className="w-full max-w-xl grid grid-cols-4 gap-3 sm:gap-5">
          {timeBlocks.map((block) => (
            <div
              key={block.label}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 text-center shadow-xs"
            >
              <div className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-indigo-600 tabular-nums">
                {String(block.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                {block.label}
              </div>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p className="text-xs font-medium text-slate-400">
          Target Release: <strong className="text-slate-700 font-semibold">August 06, 2026</strong>
        </p>

      </main>

      {/* ── Minimal Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full max-w-4xl mx-auto py-3 text-center text-xs text-slate-400 border-t border-slate-100 shrink-0">
        © 2026 Studentforge Inc. All rights reserved.
      </footer>

    </div>
  );
}


