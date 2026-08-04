"use client";

import React from "react";
import { IconTrophy, IconAward } from "@tabler/icons-react";

interface TopContributor {
  rank: number;
  name: string;
  badge: string;
  points: string;
  image: string;
}

const topContributors: TopContributor[] = [
  {
    rank: 1,
    name: "Harish Kumar",
    badge: "Gold Mentor",
    points: "4,950 pts",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    rank: 2,
    name: "Sneha Patel",
    badge: "Code Ninja",
    points: "4,200 pts",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    rank: 3,
    name: "Kunal Shah",
    badge: "AI Specialist",
    points: "3,850 pts",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

export default function LeaderboardCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-1.5">
          <IconTrophy className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Leaderboard
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Weekly Top</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {topContributors.map((c) => (
          <div key={c.rank} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  c.rank === 1
                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                    : c.rank === 2
                    ? "bg-slate-200 text-slate-700 border border-slate-300"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {c.rank}
              </div>

              <img
                src={c.image}
                alt={c.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
              />

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {c.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  {c.badge}
                </span>
              </div>
            </div>

            <span className="text-xs font-black text-blue-600 shrink-0">
              {c.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
