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
  // Target date: August 6, 2026 at 22:00:00 (17 days from July 20, 2026)
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
      <div className="min-h-screen bg-[#0c0e17] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0c0e17] flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
      {/* Background WebGL Gradient */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Grainient
          color1="#4e91ff"
          color2="#623bff"
          color3="#d5a5ff"
          timeSpeed={0.15}
          colorBalance={0.0}
          warpStrength={0.8}
          warpFrequency={4.0}
          warpSpeed={1.5}
          warpAmplitude={40.0}
          blendAngle={15.0}
          blendSoftness={0.08}
          rotationAmount={300.0}
          noiseScale={1.5}
          grainAmount={0.05}
          grainScale={1.5}
          grainAnimated={false}
          contrast={1.4}
          gamma={1.1}
          saturation={1.1}
          centerX={0.0}
          centerY={0.0}
          zoom={0.95}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45 z-10 backdrop-blur-[2px]"></div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-between h-full max-w-4xl w-full py-16 gap-12 text-center">
        {/* Logo and branding */}
        <div className="flex items-center gap-3 animate-fadeIn">
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Platform</span>
          <div className="h-6 w-[1px] bg-white/40"></div>
          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Studentforge Logo"
            className="h-9 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Upgrade / Construction Message */}
        <div className="flex flex-col gap-5 max-w-2xl px-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <span className="mx-auto w-fit text-[10px] font-bold tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full uppercase">
            Platform Upgrade in Progress
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
            We're building something <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">amazing</span>.
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
            Our engineering teams are deploying brand-new interactive tools, a social learning ecosystem, and customized resume-building software. See you very soon!
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl px-4 animate-fadeIn" style={{ animationDelay: "200ms" }}>
          {timeBlocks.map((block) => (
            <div
              key={block.label}
              className="relative group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-lg transition duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"
            >
              {/* Subtle glass reflection glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none"></div>

              <span className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md tabular-nums">
                {String(block.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                {block.label}
              </span>
            </div>
          ))}
        </div>

        {/* Sub-actions / Developer Bypass */}
        <div className="flex flex-col items-center gap-3 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <p className="text-xs text-slate-400">
            Want to get notified when we launch? Check back soon.
          </p>
          <div className="h-px w-12 bg-white/20 my-2"></div>
          <Link
            href="/login"
            className="text-[11px] font-bold text-slate-400 hover:text-white transition uppercase tracking-wider flex items-center gap-1.5 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[14px]">login</span>
            Developer Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
