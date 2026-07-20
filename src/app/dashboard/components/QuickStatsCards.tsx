"use client";

import React from "react";
import { IconSchool, IconAward, IconSend, IconCalendarEvent } from "@tabler/icons-react";

export default function QuickStatsCards() {
  const stats = [
    {
      title: "Courses Enrolled",
      value: "4",
      subtitle: "2 in progress",
      icon: IconSchool,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Certificates Earned",
      value: "3",
      subtitle: "Verified badges",
      icon: IconAward,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Applications Submitted",
      value: "8",
      subtitle: "2 under review",
      icon: IconSend,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Upcoming Events",
      value: "3",
      subtitle: "This week",
      icon: IconCalendarEvent,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col justify-between transition duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                {stat.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${stat.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
