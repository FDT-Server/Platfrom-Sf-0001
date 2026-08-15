"use client";

import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import useRouter from "next/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconUsers,
  IconUsersPlus,
  IconSearch,
  IconCopy,
  IconCheck,
  IconLogin,
  IconX,
} from "@tabler/icons-react";

interface Participant {
  id: string;
  fullName: string;
  profileImage?: string | null;
  selectedRole?: string | null;
}

interface StudyPod {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  creatorImage?: string | null;
  creatorRole?: string | null;
  participants: Participant[];
}

interface StudyPodContentProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
  initialPods: StudyPod[];
}

export default function StudyPodContent({ user, initialPods }: StudyPodContentProps) {
  const router = useNextRouter();
  const [pods, setPods] = useState<StudyPod[]>(initialPods);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPodId, setCopiedPodId] = useState<string | null>(null);

  const getCardHeaderTheme = (podId: string) => {
    const themes = [
      {
        bg: "bg-gradient-to-r from-amber-100 to-yellow-50 border-b border-amber-200/80 text-amber-950",
        pill: "bg-amber-200/80 text-amber-950",
        tagColor: "text-amber-700"
      },
      {
        bg: "bg-gradient-to-r from-blue-100 to-sky-50 border-b border-blue-200/80 text-blue-950",
        pill: "bg-blue-200/80 text-blue-950",
        tagColor: "text-blue-700"
      },
      {
        bg: "bg-gradient-to-r from-emerald-100 to-teal-50 border-b border-teal-200/80 text-teal-950",
        pill: "bg-teal-200/80 text-teal-950",
        tagColor: "text-teal-700"
      },
      {
        bg: "bg-gradient-to-r from-purple-100 to-fuchsia-50 border-b border-fuchsia-200/80 text-purple-950",
        pill: "bg-fuchsia-200/80 text-purple-950",
        tagColor: "text-fuchsia-700"
      },
      {
        bg: "bg-gradient-to-r from-rose-100 to-pink-50 border-b border-pink-200/80 text-rose-950",
        pill: "bg-pink-200/80 text-rose-950",
        tagColor: "text-pink-700"
      }
    ];
    let hash = 0;
    for (let i = 0; i < podId.length; i++) {
      hash = podId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % themes.length;
    return themes[index];
  };

  const handleCopyLink = (podId: string) => {
    const inviteUrl = `${window.location.origin}/studypod/${podId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedPodId(podId);
    setTimeout(() => setCopiedPodId(null), 2000);
  };

  const filteredPods = pods.filter((pod) =>
    pod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-fadeIn">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-yellow-100/80 text-slate-900 rounded-3xl p-6 md:p-8 border border-yellow-200 shadow-xs animate-fadeIn">
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Collaborative Study Pods
            </h1>
            <p className="text-xs text-slate-800 max-w-xl leading-relaxed">
              Create virtual study rooms, collaborate on ideas, manage shared task list checklists, and chat in real-time with peers.
            </p>
          </div>
          <button
            onClick={() => router.push("/studypod/create")}
            className="shrink-0 self-start md:self-center bg-slate-950 hover:bg-slate-900 hover:scale-102 active:scale-98 text-white text-xs font-medium px-5 py-3 rounded-lg transition duration-200 cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <IconUsersPlus className="w-4.5 h-4.5" />
            Create Study Pod
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <IconSearch className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active study pods by room name..."
            className="flex-1 text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400"
          />
        </div>

        {filteredPods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 pr-1 pb-4">
            {filteredPods.map((pod) => {
              const headerTheme = getCardHeaderTheme(pod.id);
              return (
                <div
                  key={pod.id}
                  className="group relative flex flex-col rounded-[24px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fadeIn"
                >
                  {/* Subtle gradient overlay on top */}
                  <div className={`absolute top-0 inset-x-0 h-1.5 ${headerTheme.bg} opacity-90`}></div>

                  <div className="flex justify-between items-center px-6 pt-5 pb-2 text-[10px] font-bold font-mono tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${headerTheme.pill.replace('bg-', 'bg-').split(' ')[0]}`}></span>
                      POD-{pod.id.substring(0, 5).toUpperCase()}
                    </span>
                    <span>
                      {new Date(pod.createdAt).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <h4 className="text-[17px] font-black text-slate-900 leading-tight tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {pod.name}
                        </h4>
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 select-none shadow-sm ${headerTheme.pill}`}>
                          Active
                        </span>
                      </div>

                      {/* Creator Badge */}
                      <div className="bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl p-3 border border-slate-100 flex items-center gap-3.5 mb-5 group/creator">
                        {pod.creatorImage ? (
                          <img
                            src={pod.creatorImage}
                            alt={pod.creatorName}
                            className="w-10 h-10 rounded-[14px] object-cover ring-2 ring-white shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-[14px] bg-indigo-50 text-indigo-600 ring-2 ring-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                            {pod.creatorName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Host Creator</span>
                          <p className="text-[13px] font-bold text-slate-800 truncate group-hover/creator:text-indigo-600 transition-colors">
                            {pod.creatorName}
                          </p>
                        </div>
                      </div>

                      {/* Collaborators */}
                      <div className="space-y-2.5">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Collaborators Joined</span>
                        {pod.participants && pod.participants.length > 0 ? (
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5 overflow-hidden py-1">
                              {pod.participants.slice(0, 5).map((p) => {
                                if (p.profileImage) {
                                  return (
                                    <img
                                      key={p.id}
                                      src={p.profileImage}
                                      alt={p.fullName}
                                      title={`${p.fullName} (${p.selectedRole || "Member"})`}
                                      className="inline-block h-8 w-8 rounded-full ring-[3px] ring-white object-cover shadow-sm transition-transform hover:scale-110 hover:z-10 relative"
                                    />
                                  );
                                }
                                return (
                                  <div
                                    key={p.id}
                                    title={`${p.fullName} (${p.selectedRole || "Member"})`}
                                    className="inline-block h-8 w-8 rounded-full ring-[3px] ring-white bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 hover:z-10 relative"
                                  >
                                    {p.fullName.substring(0, 2).toUpperCase()}
                                  </div>
                                );
                              })}
                              {pod.participants.length > 5 && (
                                <div className="inline-block h-8 w-8 rounded-full ring-[3px] ring-white bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm relative z-0">
                                  +{pod.participants.length - 5}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-700">
                                {pod.participants.length}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium -mt-1">
                                {pod.participants.length === 1 ? "User" : "Users"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 border-dashed flex items-center justify-center">
                              <span className="w-3.5 h-3.5 text-slate-300 material-symbols-outlined">person</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                              Be the first to join
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-5 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => handleCopyLink(pod.id)}
                        className="text-[12px] font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-slate-50"
                      >
                        {copiedPodId === pod.id ? (
                          <>
                            <IconCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="w-4 h-4 shrink-0" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => router.push(`/studypod/${pod.id}`)}
                        className="bg-slate-900 hover:bg-black text-white rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all duration-200 flex items-center gap-2 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 cursor-pointer group/btn"
                      >
                        <span>Enter Room</span>
                        <IconLogin className="w-4 h-4 shrink-0 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
              <div className="w-full flex justify-center py-6 mb-4">
                <DotLottieReact
                  src="/empty-pods.lottie"
                  loop
                  autoplay
                  className="w-full max-w-[280px] h-[200px] select-none pointer-events-none opacity-90"
                />
              </div>
            <h3 className="text-sm font-semibold text-slate-700 mt-1">No Study Pods Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              There are no study rooms matching your search. Create the first one to start collaborating with your friends!
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
