"use client";

import React from "react";
import { IconBell, IconHeart, IconSparkles, IconUpload } from "@tabler/icons-react";

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  icon: any;
  color: string;
}

const notifications: NotificationItem[] = [
  {
    id: "n1",
    text: "Rohan Gupta liked your project submission",
    time: "15m ago",
    icon: IconHeart,
    color: "text-rose-500 bg-rose-50",
  },
  {
    id: "n2",
    text: "New Workshop announced: Advanced LLM Agents",
    time: "1h ago",
    icon: IconSparkles,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "n3",
    text: "Priya Sharma uploaded a new System Design resource",
    time: "3h ago",
    icon: IconUpload,
    color: "text-blue-500 bg-blue-50",
  },
];

export default function NotificationsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      <div className="flex items-center gap-1.5 pl-1">
        <IconBell className="w-4 h-4 text-slate-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recent Activity
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.map((n) => {
          const IconComp = n.icon;
          return (
            <div
              key={n.id}
              className="flex items-start gap-2.5 pb-2 border-b border-dashed border-slate-100 last:border-b-0 last:pb-0"
            >
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${n.color}`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-700 font-medium leading-tight">{n.text}</p>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  {n.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
