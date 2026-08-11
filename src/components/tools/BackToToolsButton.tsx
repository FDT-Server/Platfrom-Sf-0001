"use client";

import React from "react";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface BackToToolsButtonProps {
  label?: string;
  className?: string;
}

export default function BackToToolsButton({
  label = "Back to Tools Hub",
  className = "",
}: BackToToolsButtonProps) {
  return (
    <Link
      href="/tools"
      className={`group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200/90 hover:border-slate-900 shadow-2xs hover:shadow-md transition-all duration-200 text-xs font-bold shrink-0 cursor-pointer ${className}`}
      title="Return to Tools Hub"
    >
      <div className="w-5 h-5 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-slate-600 group-hover:text-white transition-all duration-200 shadow-2xs group-hover:shadow-none border border-slate-200/60 group-hover:border-transparent">
        <IconArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
      </div>
      <span className="tracking-tight">{label}</span>
    </Link>
  );
}
