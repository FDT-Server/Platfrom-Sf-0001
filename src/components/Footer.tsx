"use client";

import React from "react";
import Link from "next/link";
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
  const isDark = variant === "dark";
  const isDashboard = variant === "dashboard";

  const titleColor = isDark ? "text-white" : isDashboard ? "text-slate-900 dark:text-white" : "text-white";
  const textColor = isDark ? "text-slate-300" : isDashboard ? "text-slate-600 dark:text-slate-300" : "text-slate-300";
  const hoverColor = "hover:text-indigo-600 dark:hover:text-indigo-400";

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: IconBrandYoutube,
      hoverClass: "hover:bg-red-600 hover:border-red-500 hover:text-white",
    },
    {
      name: "WhatsApp",
      href: "https://whatsapp.com",
      icon: IconBrandWhatsapp,
      hoverClass: "hover:bg-emerald-600 hover:border-emerald-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: IconBrandLinkedin,
      hoverClass: "hover:bg-blue-600 hover:border-blue-500 hover:text-white",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: IconBrandInstagram,
      hoverClass: "hover:bg-pink-600 hover:border-pink-500 hover:text-white",
    },
  ];

  return (
    <footer
      className={`w-full mt-8 sm:mt-12 pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6 md:px-10 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
        isDark
          ? "bg-[#0b172a] text-slate-300 border-[#1e3456]"
          : isDashboard
          ? "bg-slate-900 text-slate-300 border-slate-800 shadow-xs"
          : "bg-slate-900 text-slate-300 border-slate-800"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Brand Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand details & Social icons */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                alt="Student Forge Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <div className="h-5 w-[1px] bg-slate-700"></div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white select-none">
                Student Forge
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Studentforge is a legitimate educational platform dedicated to helping engineering students master full-stack development, database architecture, and technology skills.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
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
                      className={`w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 ${item.hoverClass} transition-all duration-200 shadow-2xs group`}
                    >
                      <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <Link href="/login" className={`inline-block ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link href="/login" className={`inline-block ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  Engineering Courses
                </Link>
              </li>
              <li>
                <Link href="/login" className={`inline-block ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  Video Lectures
                </Link>
              </li>
              <li>
                <Link href="/login" className={`inline-block ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  1-on-1 Mentorship
                </Link>
              </li>
              <li>
                <Link href="/plans" className={`inline-block ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  Membership Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Compliance Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-indigo-400">gavel</span>
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <Link href="/terms" className={`inline-flex items-center gap-1 ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={`inline-flex items-center gap-1 ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className={`inline-flex items-center gap-1 ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  <span className="text-amber-400 font-semibold">•</span>
                  <span>Refund & Cancellation</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className={`inline-flex items-center gap-1 ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  <span className="text-amber-400 font-semibold">•</span>
                  <span>Shipping & Digital Delivery</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`inline-flex items-center gap-1 ${hoverColor} transition-transform duration-200 hover:translate-x-0.5`}>
                  <span>Contact & Support Info</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Merchant Info & Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center gap-2 flex-wrap">
                <span className="material-symbols-outlined text-[16px] text-indigo-400 shrink-0">mail</span>
                <a href="mailto:studentforgetechnologies@gmail.com" className="hover:text-indigo-400 underline break-all">
                  studentforgetechnologies@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-indigo-400 shrink-0">schedule</span>
                <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-indigo-400 shrink-0">domain</span>
                <span>STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED</span>
              </p>
            </div>
            
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                <span>Get Support</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 font-mono text-center sm:text-left">
          <p>© {new Date().getFullYear()} Student Forge Platform. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

