"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="h-screen w-screen bg-white text-slate-900 flex flex-col justify-between overflow-hidden font-sans select-none p-4 sm:p-6 lg:p-8">
      
      {/* ── Top Header Navigation ────────────────────────────────────────────── */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Studentforge Logo"
            className="h-8 w-auto object-contain"
          />
          <div className="h-5 w-[1px] bg-slate-200"></div>
          <span className="text-xs font-bold tracking-wider text-slate-700 uppercase">
            Platform
          </span>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
        >
          Sign In to Portal
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </header>

      {/* ── Main Content (100% Fit in Single Viewport) ────────────────────────── */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 my-auto py-2 overflow-hidden">
        
        {/* Left Column: Details & Countdown */}
        <div className="flex-1 flex flex-col justify-center items-start text-left space-y-5 max-w-xl">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Scheduled System Maintenance
          </div>

          {/* Heading & Paragraph */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              We're upgrading our <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                platform experience.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Studentforge is undergoing scheduled infrastructure upgrades. All core tools, learning portals, and account services will resume automatically upon launch.
            </p>
          </div>

          {/* 4-Box Countdown Timer */}
          <div className="w-full grid grid-cols-4 gap-2 sm:gap-4 pt-1">
            {timeBlocks.map((block) => (
              <div
                key={block.label}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-xs transition-all hover:border-indigo-300 hover:shadow-md"
              >
                <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-indigo-600 tabular-nums">
                  {String(block.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  {block.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              Official Login Portal
            </Link>
            <span className="text-xs text-slate-500 font-medium">
              Target Release: <strong className="text-slate-800 font-semibold">August 06, 2026</strong>
            </span>
          </div>

        </div>

        {/* Right Column: 3D Illustration & Status Visualizer (Visible on all screens) */}
        <div className="flex-1 flex items-center justify-center w-full max-w-sm lg:max-w-md relative my-2 lg:my-0">
          
          {/* Background Glow Circle */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-tr from-indigo-200 to-blue-100 rounded-full filter blur-2xl opacity-60 -z-10 animate-pulse"></div>

          {/* 3D Illustration Container */}
          <div className="bg-gradient-to-b from-slate-50/90 to-indigo-50/40 border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl text-center flex flex-col items-center gap-3 relative overflow-hidden w-full">
            
            {/* 3D Graphic */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 relative flex items-center justify-center">
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                alt="Studentforge 3D Icon"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl animate-bounce"
                style={{ animationDuration: '3s' }}
              />
              {/* 3D Floating Badges around Graphic */}
              <div className="absolute -top-1 -right-1 bg-white border border-slate-200 text-indigo-600 font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                🚀 v3.0 Release
              </div>
              <div className="absolute -bottom-1 -left-1 bg-indigo-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                ⚡ 99.9% Migration
              </div>
            </div>

            {/* Status Card Footer */}
            <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="font-semibold text-slate-700">System Deploy Active</span>
              </div>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Aug 06 Launch
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="w-full max-w-6xl mx-auto py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-100 gap-2 shrink-0">
        <p>© 2026 Studentforge Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-600">
          <Link href="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-900 transition">Terms of Service</Link>
        </div>
      </footer>

    </div>
  );
}


