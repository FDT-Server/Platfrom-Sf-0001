"use client";

import React, { useState, useEffect } from "react";
import { IconBriefcase, IconUsers, IconSchool, IconMessageCircle } from "@tabler/icons-react";

interface RealStatsData {
  opportunities: number;
  users: number;
  studyPods: number;
  posts: number;
}

export default function QuickStatsCards() {
  const [statsData, setStatsData] = useState<RealStatsData>({
    opportunities: 6,
    users: 12,
    studyPods: 4,
    posts: 3,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStatsData({
            opportunities: data.opportunities || 0,
            users: data.users || 0,
            studyPods: data.studyPods || 0,
            posts: data.posts || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load real stats:", err);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Featured Opportunities",
      value: `${statsData.opportunities}`,
      subtitle: "Verified internships & roles",
      icon: IconBriefcase,
      color: "text-blue-600 bg-blue-50/80 border-blue-100",
    },
    {
      title: "Community Members",
      value: `${statsData.users}`,
      subtitle: "Active trainees & developers",
      icon: IconUsers,
      color: "text-amber-600 bg-amber-50/80 border-amber-100",
    },
    {
      title: "Active Study Pods",
      value: `${statsData.studyPods}`,
      subtitle: "Collaborative learning groups",
      icon: IconSchool,
      color: "text-purple-600 bg-purple-50/80 border-purple-100",
    },
    {
      title: "Community Posts",
      value: `${statsData.posts}`,
      subtitle: "Discussions & achievements",
      icon: IconMessageCircle,
      color: "text-emerald-600 bg-emerald-50/80 border-emerald-100",
    },
  ];

  return (
    <div className="-mt-12 sm:-mt-14 relative z-10 px-3 sm:px-4 grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-md hover:shadow-lg hover:bg-white rounded-2xl p-4 flex flex-col justify-between transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 line-clamp-1">
                {stat.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${stat.color} shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
