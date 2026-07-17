"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
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

  return (
    <div className={`min-h-screen lg:h-screen w-full bg-[#0c0e17] flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative ${mode === "dashboard" ? "p-3 gap-3" : "p-0"}`}>
      
      {(mode === "login" || mode === "signup") && (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <img 
            src="/new-auth-bg.jpg" 
            alt="Authentication Background" 
            className="w-full h-full object-cover animate-kenburns brightness-110 will-change-transform"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      )}

      {mode === "dashboard" && (
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
      )}
        
      
      <div className={`w-full flex flex-col justify-between items-start text-white h-full relative z-10 select-none text-left overflow-hidden ${
        mode === "dashboard" ? "lg:w-[35%] p-8 lg:p-10" : "lg:w-1/2 p-10 lg:p-16"
      }`}>
        
        <div className="relative z-10 flex flex-col h-full w-full">
          {mode === "dashboard" && (
            <div className="flex items-center gap-3 w-full">
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Platform</span>
              <div className="h-6 w-[1px] bg-white/40"></div>
              <img 
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" 
                alt="Studentforge Logo" 
                className="h-8 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}

          <div className="space-y-8 w-full mt-10">
            {mode === "dashboard" && (
              <div className="pt-2 border-t border-white/20 w-full">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white">
                  <a href="#terms" className="hover:text-white/80 transition duration-200">Terms</a>
                  <a href="#privacy" className="hover:text-white/80 transition duration-200">Privacy Policy</a>
                  <button 
                    onClick={handleLogout} 
                    className="hover:text-white/80 text-left transition duration-200 focus:outline-none cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                <p className="text-[10px] text-white mt-3 font-mono">
                  © 2026 Studentforge
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className={`flex-1 bg-white flex flex-col justify-between shadow-2xl relative z-10 overflow-y-auto ${
        mode === "dashboard" 
          ? "rounded-[24px] lg:rounded-[28px] p-6 sm:p-10 lg:p-12 h-full" 
          : "rounded-[24px] lg:rounded-[36px] p-8 sm:p-10 lg:p-16 m-4 lg:my-6 lg:mr-6 h-[calc(100%-2rem)] lg:h-[calc(100%-3rem)] min-h-[520px]"
      }`}>
        {children}
      </div>
    </div>
  );
}
