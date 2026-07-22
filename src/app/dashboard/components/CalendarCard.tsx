"use client";

import React from "react";
import { IconCalendar, IconBriefcase, IconCode, IconCalendarEvent } from "@tabler/icons-react";

interface CalendarItem {
  dateMonth: string;
  dateDay: string;
  title: string;
  time: string;
  type: "Interview" | "Hackathon" | "Event" | "Deadline";
}

const calendarEvents: CalendarItem[] = [
  {
    dateMonth: "JUL",
    dateDay: "21",
    title: "Technical Mock Interview",
    time: "10:30 AM",
    type: "Interview",
  },
  {
    dateMonth: "JUL",
    dateDay: "24",
    title: "Student Forge Hackathon Kickoff",
    time: "05:00 PM",
    type: "Hackathon",
  },
  {
    dateMonth: "JUL",
    dateDay: "28",
    title: "Project Portfolio Submission",
    time: "11:59 PM",
    type: "Deadline",
  },
];

export default function CalendarCard() {
  const badgeColors: Record<string, string> = {
    Interview: "text-blue-600 bg-blue-50",
    Hackathon: "text-purple-600 bg-purple-50",
    Event: "text-rose-600 bg-rose-50",
    Deadline: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      <div className="flex items-center gap-1.5 pl-1">
        <IconCalendar className="w-4 h-4 text-blue-600" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Your Calendar
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {calendarEvents.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-150 rounded-xl p-1.5 w-11 shrink-0 shadow-2xs leading-none font-mono">
              <span className="text-[9px] font-black text-blue-700 uppercase">{item.dateMonth}</span>
              <span className="text-sm font-black text-blue-900 mt-0.5">{item.dateDay}</span>
            </div>

            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                {item.title}
              </h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md border border-slate-200/60 ${
                    badgeColors[item.type] || "text-slate-600 bg-slate-50"
                  }`}
                >
                  {item.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
