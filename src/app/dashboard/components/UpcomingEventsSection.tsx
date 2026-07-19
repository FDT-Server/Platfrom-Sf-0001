"use client";

import React from "react";
import Link from "next/link";
import { IconCalendarEvent, IconExternalLink, IconUser, IconClock, IconArrowUpRight } from "@tabler/icons-react";
import { toast } from "sonner";

export interface EventInfo {
  id: string;
  title: string;
  description: string;
  day: string;
  month: string;
  time: string;
  duration: string;
  category: string;
  imageUrl?: string | null;
  speakerName: string;
  speakerTitle: string;
  speakerCompany: string;
  speakerImage?: string | null;
  joinLink?: string | null;
  badgeText?: string | null;
  badgeBg?: string | null;
}

interface UpcomingEventsSectionProps {
  events: EventInfo[];
}

export default function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  const handleRegister = (title: string) => {
    toast.success(`Registered for ${title}!`);
  };

  const defaultEvents: EventInfo[] = [
    {
      id: "demo-evt-1",
      title: "AI Agent Architecture with Next.js 15 & LangChain",
      description: "Learn how to build production-ready LLM agents with state management.",
      day: "22",
      month: "JUL",
      time: "06:00 PM IST",
      duration: "90 min",
      category: "Webinar",
      speakerName: "Dr. Vikram Seth",
      speakerTitle: "AI Research Lead",
      speakerCompany: "Student Forge AI Lab",
      joinLink: "https://meet.google.com",
    },
    {
      id: "demo-evt-2",
      title: "System Design Essentials: Scalable Microservices",
      description: "Master load balancing, caching, Redis, and database partitioning.",
      day: "25",
      month: "JUL",
      time: "05:00 PM IST",
      duration: "120 min",
      category: "Masterclass",
      speakerName: "Pooja Reddy",
      speakerTitle: "Principal Architect",
      speakerCompany: "TechForge",
      joinLink: "https://meet.google.com",
    },
    {
      id: "demo-evt-3",
      title: "Full-Stack Web3 & Smart Contracts Bootcamp",
      description: "Build decentralized apps with Solidity and Ethers.js.",
      day: "29",
      month: "JUL",
      time: "04:00 PM IST",
      duration: "60 min",
      category: "Workshop",
      speakerName: "Karan Mehta",
      speakerTitle: "Blockchain Engineer",
      speakerCompany: "Web3 Forge",
      joinLink: "https://meet.google.com",
    },
  ];

  const displayEvents = (events && events.length > 0 ? events : defaultEvents).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
            <IconCalendarEvent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">Upcoming Events</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Live seminars & workshops</p>
          </div>
        </div>

        <Link
          href="/events"
          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <IconArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Events Compact List */}
      <div className="flex flex-col gap-2.5">
        {displayEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-100/70 transition duration-150"
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              {/* Date Box */}
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-2xs leading-none font-mono">
                <span className="text-[8px] font-black text-rose-600 uppercase">
                  {evt.month}
                </span>
                <span className="text-xs font-black text-slate-800 mt-0.5">
                  {evt.day}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">{evt.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {evt.speakerName} ({evt.speakerCompany})
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {evt.joinLink ? (
                <a
                  href={evt.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold transition shadow-xs flex items-center gap-1"
                >
                  <span>Join</span>
                  <IconExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={() => handleRegister(evt.title)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold transition shadow-xs cursor-pointer"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
