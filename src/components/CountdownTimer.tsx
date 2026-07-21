"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Grainient from "@/app/Grainient";

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
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="relative min-h-screen w-full bg-[#07090e] flex flex-col items-center justify-between p-4 sm:p-8 text-white overflow-y-auto select-none font-sans">
      {/* Background WebGL Gradient */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-60">
        <Grainient
          color1="#1e3a8a"
          color2="#312e81"
          color3="#4c1d95"
          timeSpeed={0.12}
          colorBalance={0.0}
          warpStrength={0.7}
          warpFrequency={3.5}
          warpSpeed={1.2}
          warpAmplitude={35.0}
          blendAngle={15.0}
          blendSoftness={0.08}
          rotationAmount={200.0}
          noiseScale={1.5}
          grainAmount={0.04}
          grainScale={1.5}
          grainAnimated={false}
          contrast={1.4}
          gamma={1.1}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.95}
        />
      </div>

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-[#07090e]/75 z-10 backdrop-blur-[4px]"></div>

      {/* Header Bar */}
      <header className="relative z-20 w-full max-w-6xl flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3">
          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Studentforge Logo"
            className="h-8 w-auto object-contain drop-shadow-md"
          />
          <div className="h-5 w-[1px] bg-white/20"></div>
          <span className="text-sm font-semibold tracking-wider text-slate-200 uppercase">
            Studentforge Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Scheduled Release v3.0
          </span>
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md hover:shadow-indigo-500/20"
          >
            Authorized Portal Access
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto py-12 max-w-4xl w-full text-center gap-10">
        
        {/* Official Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide shadow-lg">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>OFFICIAL ANNOUNCEMENT • SYSTEM UPGRADE IN PROGRESS</span>
        </div>

        {/* Headlines */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Platform Maintenance & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Major System Deployment
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Studentforge infrastructure is currently undergoing scheduled platform upgrades to introduce enhanced learning tools, enterprise security features, and performance optimizations.
          </p>
        </div>

        {/* Official Countdown Display */}
        <div className="w-full max-w-3xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Accent top line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ESTIMATED LAUNCH COUNTDOWN
            </span>
            <span className="font-mono text-indigo-300">TARGET: AUG 06, 2026 • 22:00 UTC</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeBlocks.map((block) => (
              <div
                key={block.label}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.07]"
              >
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md tabular-nums">
                  {String(block.value).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar Visualizer */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Upgrade Migration Progress</span>
              <span className="text-indigo-400 font-mono">System Deployment Active</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[78%] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Milestone Schedule */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-white">Database Migration</div>
              <div className="text-[11px] text-emerald-400 font-medium">Completed</div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-white">Core System Sync</div>
              <div className="text-[11px] text-indigo-400 font-medium animate-pulse">In Progress</div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-bold text-xs">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-white">Public Go-Live</div>
              <div className="text-[11px] text-slate-400 font-medium">Scheduled Aug 06</div>
            </div>
          </div>
        </div>

        {/* Portal Sign-In Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Official Platform Sign In
          </Link>
          <a
            href="mailto:support@studentforge.com"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            Contact Platform Administrator
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-6xl py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-white/10 gap-2">
        <p>© 2026 Studentforge Enterprise. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-slate-200 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-slate-200 transition">Terms of Service</a>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-500">SYS-STATUS: OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
}

