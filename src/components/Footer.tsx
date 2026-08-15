"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconBrandLinkedin,
  IconBrandInstagram,
} from "@tabler/icons-react";

interface FooterProps {
  variant?: "light" | "dark" | "dashboard";
  className?: string;
}

export default function Footer({ variant = "dashboard", className = "" }: FooterProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@StudentForge",
      icon: IconBrandYoutube,
      hoverClass: "hover:bg-red-600 hover:border-red-500 hover:text-white hover:shadow-red-500/20",
    },
    {
      name: "WhatsApp",
      href: "https://api.whatsapp.com/send/?phone=916304218064&text&type=phone_number&app_absent=0",
      icon: IconBrandWhatsapp,
      hoverClass: "hover:bg-emerald-600 hover:border-emerald-500 hover:text-white hover:shadow-emerald-500/20",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/student-forge/posts/?feedView=all",
      icon: IconBrandLinkedin,
      hoverClass: "hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:shadow-blue-500/20",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/studentforge/",
      icon: IconBrandInstagram,
      hoverClass: "hover:bg-pink-600 hover:border-pink-500 hover:text-white hover:shadow-pink-500/20",
    },
  ];

  return (
    <footer className={`w-full relative overflow-hidden font-sans ${className}`}>
      
      {/* Top Wave SVG Transition */}
      <div className="w-full leading-none z-10 relative">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14 sm:h-24 object-cover drop-shadow-sm"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 110 720 70C960 30 1200 10 1440 40V120H0V40Z"
            fill="#FFF6ED"
          />
        </svg>

        {/* Animated Lottie Character Resting on the Wave */}
        <div className="absolute top-0 left-6 sm:left-20 -translate-y-[68%] pointer-events-none z-20">
          <div className="w-28 sm:w-44 h-28 sm:h-44">
            <DotLottieReact
              src="/footer-animation.json"
              loop
              autoplay
            />
          </div>
        </div>
      </div>

      {/* Main Footer Container (Light Yellowish Theme) */}
      <div className="relative z-0 px-4 sm:px-8 lg:px-16 pt-16 pb-12 sm:pt-24 sm:pb-16 bg-[#FFF6ED] text-slate-800 transition-colors duration-300">
        
        {/* Ambient Gradient Lighting Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Floating Geometric Decorative Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-12 left-1/4 w-4 h-4 border-2 border-indigo-400 rotate-12 rounded-sm animate-pulse" />
          <div className="absolute top-28 left-2/3 w-5 h-5 border-2 border-amber-400 rotate-45" />
          <div className="absolute bottom-16 left-12 w-6 h-6 border-2 border-sky-400 -rotate-12 rounded-xs" />
          <div className="absolute bottom-24 right-1/4 w-5 h-5 border-2 border-indigo-400 rotate-45 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Navigation Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
            
            {/* Col 1: Brand & Logo */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-tight select-none text-[#011E3B]">
                  Platform
                </span>
                <div className="h-5 w-[1px] bg-slate-300"></div>
                <img
                  src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                  alt="Student Forge Logo"
                  className="h-8 sm:h-9 w-auto object-contain shrink-0"
                />
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] max-w-xs font-medium">
                Studentforge is a legitimate educational platform dedicated to helping engineering students master full-stack development, database architecture, and technology skills.
              </p>
            </div>

            {/* Col 2: About Us / Features */}
            <div className="space-y-3">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-900">
                About Us
              </h4>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Our Story & Mission</span>
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Engineering Courses</span>
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>1-on-1 Mentorship</span>
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Membership Plans</span>
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Platform Benefits</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Compliance */}
            <div className="space-y-3">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-900">
                Legal & Policy
              </h4>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>
                  <Link href="/terms" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-indigo-600 transition-colors duration-150 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-indigo-600 transition flex items-center gap-1">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Refund & Cancellation</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-indigo-600 transition flex items-center gap-1">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Shipping & Delivery</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Keep In Touch */}
            <div className="space-y-3">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-900">
                Keep In Touch
              </h4>
              <div className="space-y-2 text-slate-600 font-medium text-[11px]">
                <p>
                  <a href="mailto:studentforgetechnologies@gmail.com" className="hover:text-indigo-600 underline break-all font-semibold">
                    studentforgetechnologies@gmail.com
                  </a>
                </p>
                <p>Mon – Sat: 9:00 AM – 6:00 PM IST</p>
                <p className="font-bold text-slate-800">
                  STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED
                </p>
              </div>
            </div>

            {/* Col 5: Follow Us */}
            <div className="space-y-3">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-900">
                Follow Us
              </h4>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      title={item.name}
                      className={`w-9 h-9 rounded-xl border border-slate-200/90 bg-white text-slate-700 flex items-center justify-center transition-all duration-200 shadow-xs group ${item.hoverClass}`}
                    >
                      <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Footer Links */}
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-mono gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Student Forge Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="hover:text-indigo-600 transition underline font-medium">
                Customer Support & Inquiries
              </Link>
            </div>
          </div>

          {/* Interactive Overscroll Slide-Up / Slide-Down Text (Full Unclipped Reveal) */}
          <div className="overflow-hidden w-full pt-2 pb-2 text-center select-none pointer-events-none">
            <div
              className={`transition-all duration-700 ease-out transform ${
                isAtBottom
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-32 opacity-0 scale-95"
              }`}
            >
              <h1 className="text-[13vw] sm:text-[14vw] font-serif italic font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 leading-none py-1 whitespace-nowrap block drop-shadow-md">
                Platform.
              </h1>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
