"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconCalendarEvent,
  IconExternalLink,
  IconArrowUpRight,
} from "@tabler/icons-react";

interface EventInfo {
  id: string;
  title: string;
  description: string;
  day: string;
  month: string;
  time: string;
  duration: string;
  category: string;
  imageUrl: string | null;
  speakerName: string;
  speakerTitle: string;
  speakerCompany: string;
  speakerImage: string;
  joinLink: string;
  badgeText: string;
  badgeBg: string;
}

interface DashboardContentProps {
  user: {
    fullName: string;
    email: string;
    selectedRole: string;
    otherRoleText: string | null;
    goals: string[];
    profileImage?: string | null;
  };
  events: EventInfo[];
}


function categoryHeaderBg(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("webinar")) return "bg-indigo-500 text-white";
  if (c.includes("workshop")) return "bg-amber-500 text-white";
  if (c.includes("bootcamp")) return "bg-rose-500 text-white";
  if (c.includes("hackathon")) return "bg-emerald-600 text-white";
  if (c.includes("talk") || c.includes("seminar")) return "bg-sky-500 text-white";
  if (c.includes("networking")) return "bg-purple-500 text-white";
  return "bg-slate-600 text-white";
}


function categoryBadgeColor(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("webinar")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (c.includes("workshop")) return "bg-amber-50 text-amber-700 border-amber-100";
  if (c.includes("bootcamp")) return "bg-rose-50 text-rose-700 border-rose-100";
  if (c.includes("hackathon")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (c.includes("talk") || c.includes("seminar")) return "bg-sky-50 text-sky-700 border-sky-100";
  if (c.includes("networking")) return "bg-purple-50 text-purple-700 border-purple-100";
  return "bg-slate-50 text-slate-700 border-slate-100";
}

export default function DashboardContent({ user, events }: DashboardContentProps) {
  return (
    <DashboardLayout user={user}>
      <div className="w-full flex flex-col gap-8 animate-fadeIn">

        
        <div
          className="relative overflow-hidden rounded-2xl flex items-center justify-between shadow-xs w-full h-28 sm:h-32 md:h-36 lg:h-40"
          style={{ background: "linear-gradient(to bottom, #ebeff2, #f2f3f5)" }}
        >
          <div className="pl-4 sm:pl-6 md:pl-8 py-4 flex flex-col items-start gap-0.5 sm:gap-1 z-10">
            <span className="text-[8px] sm:text-[10px] font-medium text-white bg-blue-600 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider">
              Dashboard Active
            </span>
            <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-medium text-slate-800 mt-1 select-none">
              Welcome, {user.fullName}! 👋
            </h3>
          </div>
          <div className="h-full flex items-center justify-end select-none pointer-events-none">
            <img
              src="https://ik.imagekit.io/dypkhqxip/dashb%20banner"
              alt="Dashboard Banner"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        
        {events.length > 0 && (
          <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">

            
            <div className="pb-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200">
                  <IconCalendarEvent className="w-3.5 h-3.5" />
                  Live Events
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">Events Happening</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Upcoming sessions, workshops & talks curated for your learning path.
                </p>
              </div>
              <a
                href="/events"
                className="shrink-0 text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors"
              >
                View all <IconArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pr-1 pb-4">
              {events.map((event, idx) => {
                const hasImage = !!event.imageUrl;
                const headerBg = categoryHeaderBg(event.category);
                const badgeColor = event.badgeBg || categoryBadgeColor(event.category);
                const badgeLabel = event.badgeText || event.category;

                return (
                  <div
                    key={event.id}
                    className="flex flex-col rounded-2xl shadow-sm border border-slate-200 bg-white hover:shadow-md transition duration-150 overflow-hidden"
                  >
                    
                    {hasImage ? (
                      <div className="h-32 w-full overflow-hidden relative">
                        <img
                          src={event.imageUrl!}
                          className="w-full h-full object-cover"
                          alt={event.title}
                        />
                        <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200/50 shadow-xs ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                        
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-xs">
                          {event.day} {event.month}
                        </span>
                      </div>
                    ) : (
                      <div className={`flex justify-between items-center px-6 py-4 text-xs font-bold font-mono tracking-wider ${headerBg}`}>
                        <span>{event.day} {event.month}</span>
                        <span>{event.time}</span>
                      </div>
                    )}

                    
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        
                        <div className="flex items-center gap-1.5">
                          <IconCalendarEvent className="w-4 h-4 text-slate-450 shrink-0" />
                          <p className="text-[11px] text-slate-500 font-semibold truncate">
                            {event.speakerName}
                            {event.speakerCompany ? ` · ${event.speakerCompany}` : ""}
                          </p>
                        </div>

                        
                        <div className="flex items-start justify-between gap-3 mt-2">
                          <h4 className="text-base font-extrabold text-slate-800 leading-tight line-clamp-2">
                            {event.title}
                          </h4>
                          {!hasImage && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeColor}`}>
                              {badgeLabel}
                            </span>
                          )}
                        </div>

                        
                        <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                          {event.duration} · {event.time}
                        </p>
                      </div>

                      
                      <div className="border-t border-dashed border-slate-200 my-5" />

                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                          Event
                        </span>
                        {event.joinLink ? (
                          <a
                            href={event.joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition duration-150 flex items-center gap-1 shadow-xs border-0 cursor-pointer"
                          >
                            Join Now
                            <IconExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="bg-slate-100 text-slate-400 rounded-lg px-4 py-2 text-xs font-bold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
