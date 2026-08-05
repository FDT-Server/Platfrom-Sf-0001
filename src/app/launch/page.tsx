"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Rocket } from "lucide-react";
import confetti from "canvas-confetti";

export default function LaunchPage() {
  const router = useRouter();
  const [isCounting, setIsCounting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [count, setCount] = useState(10);
  const [isFading, setIsFading] = useState(false);

  // 10-second countdown
  useEffect(() => {
    if (!isCounting || isPaused) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isCounting, isPaused]);

  // When count hits 0 → show confetti for 10s → white fade → redirect
  useEffect(() => {
    if (!isCounting || count !== 0) return;

    const duration = 10 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        zIndex: 100,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        zIndex: 100,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // After 10 seconds, start white fade
    const fadeId = setTimeout(() => setIsFading(true), 10000);

    // After 10.7 seconds, redirect to main page
    const navId = setTimeout(() => router.push("/"), 10700);

    return () => {
      clearTimeout(fadeId);
      clearTimeout(navId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const startLaunch = () => {
    setCount(10);
    setIsPaused(false);
    setIsFading(false);
    setIsCounting(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-indigo-600 selection:text-white">

      {/* White fade overlay */}
      <div
        className={`fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-700 ease-in-out ${isFading ? "opacity-100" : "opacity-0"}`}
      />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-100 relative z-10">
        <Link href="/" className="flex items-center gap-3" title="Return to Home">
          <span className="text-sm sm:text-lg font-extrabold tracking-tight text-[#011E3B] select-none">Platform</span>
          <div className="h-5 w-[1.5px] bg-[#011E3B]" />

          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Student Forge Logo"
            className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-4xl mx-auto w-full relative z-10">

        {/* IDLE — Launch Button & Prominent Logo Showcase */}
        {!isCounting && (
          <div className="space-y-8 flex flex-col items-center">
            
            {/* Clean Hero Logo */}
            <div className="mb-1 transition-transform hover:scale-105 duration-300">
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                alt="Student Forge Logo"
                className="h-24 sm:h-32 md:h-36 w-auto object-contain"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Platform Product Launch
            </h1>
            <button
              onClick={startLaunch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg sm:text-xl px-9 py-4 sm:px-11 sm:py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 mx-auto cursor-pointer"
            >
              <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
              <span>Launch Platform</span>
            </button>
          </div>
        )}

        {/* COUNTING — Number Flow Timer */}
        {isCounting && (
          <div className="space-y-8 flex flex-col items-center">
            <div className="font-mono text-[22vw] sm:text-[16vw] font-black tracking-tight leading-none select-none text-slate-900">
              <NumberFlow value={count} prefix={count < 10 ? "0:0" : "0:"} />
            </div>

            {/* Pause / Reset controls — only while counting down */}
            {count > 0 && (
              <div className="flex items-center gap-3">
                <motion.button
                  aria-label={isPaused ? "Resume" : "Pause"}
                  onClick={() => setIsPaused((p) => !p)}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <AnimatePresence initial={false} mode="wait">
                    {isPaused ? (
                      <motion.svg key="play" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.1 }} viewBox="0 0 12 14" fill="none" className="h-5 w-5 fill-current text-white">
                        <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
                      </motion.svg>
                    ) : (
                      <motion.svg key="pause" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.1 }} viewBox="0 0 10 13" fill="none" className="h-5 w-5 fill-current text-white">
                        <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>
                <button
                  aria-label="Reset"
                  onClick={() => { setCount(10); setIsPaused(false); }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-md hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="rotate-45 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono relative z-10">
        <p>© {new Date().getFullYear()} Student Forge Platform. All rights reserved.</p>
        <p className="text-indigo-600 font-semibold">Route: /launch</p>
      </footer>

    </div>
  );
}
