"use client";

import React from "react";
import Link from "next/link";
import {
  IconFileText,
  IconBook,
  IconSchool,
  IconAward,
  IconBriefcase,
  IconCalendarEvent,
} from "@tabler/icons-react";

export default function QuickActionsCard() {
  const quickActions = [
    { label: "Resume Builder", href: "/tools/resume", icon: IconFileText, color: "text-blue-600 bg-blue-50" },
    { label: "Resources", href: "/resources", icon: IconBook, color: "text-emerald-600 bg-emerald-50" },
    { label: "Courses", href: "/courses", icon: IconSchool, color: "text-purple-600 bg-purple-50" },
    { label: "Certificates", href: "/certificates", icon: IconAward, color: "text-amber-600 bg-amber-50" },
    { label: "Opportunities", href: "/opportunities", icon: IconBriefcase, color: "text-indigo-600 bg-indigo-50" },
    { label: "Events", href: "/events", icon: IconCalendarEvent, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 block">
        Quick Actions
      </span>
      <div className="flex flex-col gap-1">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50/80 rounded-xl transition duration-150 group"
            >
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-105 transition-transform duration-150`}>
                <IconComponent className="w-4 h-4 shrink-0" />
              </div>
              <span className="flex-1">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
