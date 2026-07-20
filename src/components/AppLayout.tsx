"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Grainient from "@/app/Grainient";

interface AppLayoutProps {
  mode: "login" | "signup" | "dashboard";
  children: ReactNode;
}

export default function AppLayout({ mode, children }: AppLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (mode === "dashboard") {
    return (
      <div className="min-h-screen lg:h-screen w-full bg-[#0c0e17] flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative p-3 gap-3">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Grainient
            color1="#4e91ff"
            color2="#623bff"
            color3="#d5a5ff"
            timeSpeed={0.25}
            colorBalance={0.0}
            warpStrength={1.0}
            warpFrequency={5.0}
            warpSpeed={2.0}
            warpAmplitude={50.0}
            blendAngle={0.0}
            blendSoftness={0.05}
            rotationAmount={500.0}
            noiseScale={2.0}
            grainAmount={0.1}
            grainScale={2.0}
            grainAnimated={false}
            contrast={1.5}
            gamma={1.0}
            saturation={1.0}
            centerX={0.0}
            centerY={0.0}
            zoom={0.9}
          />
        </div>
        <div className="w-full lg:w-[35%] flex flex-col justify-between items-start text-white h-full relative z-10 select-none text-left overflow-hidden p-8 lg:p-10">
          <div className="relative z-10 flex flex-col h-full w-full">
            <div className="flex items-center gap-3 w-full">
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Platform</span>
              <div className="h-6 w-[1px] bg-white/40"></div>
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                alt="Studentforge Logo"
                className="h-8 w-auto object-contain drop-shadow-md"
              />
            </div>
            <div className="space-y-8 w-full mt-10">
              <div className="pt-2 border-t border-white/20 w-full">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white">
                  <a href="#terms" className="hover:text-white/80 transition duration-200">Terms</a>
                  <a href="#privacy" className="hover:text-white/80 transition duration-200">Privacy Policy</a>
                  <button onClick={handleLogout} className="hover:text-white/80 text-left transition duration-200 focus:outline-none cursor-pointer">Logout</button>
                </div>
                <p className="text-[10px] text-white mt-3 font-mono">© 2026 Studentforge</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white flex flex-col justify-between shadow-2xl relative z-10 overflow-y-auto rounded-[24px] lg:rounded-[28px] p-6 sm:p-10 lg:p-12 h-full">
          {children}
        </div>
      </div>
    );
  }

  // ── Auth Layout (login / signup) ──────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white">

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#f0ebe0] flex-col p-10 xl:p-12 relative overflow-hidden">

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <img
            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
            alt="Studentforge Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            <span className="text-blue-600">P</span>latform
          </span>
        </div>

        {/* Stat badges — centered in remaining space */}
        <div className="flex-1 flex flex-col items-start justify-center gap-4 mt-8">
          <div className="bg-blue-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            50K+ Students
          </div>
          <div className="bg-blue-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            500+ Mentors
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-12 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
}
