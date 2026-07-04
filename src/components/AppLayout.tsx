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
    <div className="min-h-screen lg:h-screen w-full bg-[#0c0e17] flex flex-col lg:flex-row p-3 gap-3 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      
      {/* Background WebGL Grainient */}
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
        
      {/* LEFT PANEL: Branding & Testimonial Sidebar */}
      <div className="w-full lg:w-[35%] flex flex-col justify-between items-start p-8 lg:p-10 text-white h-full relative z-10 select-none text-left">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 w-full">
          <img 
            src="https://ik.imagekit.io/dypkhqxip/logotraining" 
            alt="Training Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="h-6 w-[1px] bg-white"></div>
          <span className="text-xl font-bold tracking-tight text-white">Training</span>
        </div>

        {/* Welcome / Promo Text */}
        <div className="my-10 lg:my-0 space-y-4 w-full">
          <h1 className="text-3xl font-bold tracking-tight text-white leading-none">
            {mode === "signup" ? "Get Started" : "Welcome Back"}
          </h1>
          <p className="text-white text-sm leading-relaxed max-w-sm">
            {mode === "signup" 
              ? "Explore our intuitive dashboard and set up your account in just a few clicks."
              : mode === "login"
              ? "Log in to resume your training paths, build real-world projects, and track your progress."
              : "Access your dashboard to check recommended learning paths and manage your progress."}
          </p>
        </div>

        {/* Footer links */}
        <div className="space-y-8 w-full">
          {/* Sidebar Footer Links */}
          <div className="pt-2 border-t border-white/20 w-full">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white">
              <a href="#terms" className="hover:text-white/80 transition duration-200">Terms</a>
              <a href="#privacy" className="hover:text-white/80 transition duration-200">Privacy Policy</a>
              {mode === "dashboard" ? (
                <button 
                  onClick={handleLogout} 
                  className="hover:text-white/80 text-left transition duration-200 focus:outline-none cursor-pointer"
                >
                  Logout
                </button>
              ) : mode === "signup" ? (
                <Link 
                  href="/login" 
                  className="text-white hover:text-white/80 text-left font-medium transition duration-200 focus:outline-none cursor-pointer"
                >
                  Login
                </Link>
              ) : (
                <Link 
                  href="/signup" 
                  className="text-white hover:text-white/80 text-left font-medium transition duration-200 focus:outline-none cursor-pointer"
                >
                  Sign Up
                </Link>
              )}
            </div>
            <p className="text-[10px] text-white mt-3 font-mono">
              © 2026 Redlix
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Content Area (White Rounded Container) */}
      <div className="flex-1 bg-white rounded-[24px] lg:rounded-[28px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between shadow-2xl h-full min-h-[520px] lg:min-h-0 relative z-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
