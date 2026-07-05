"use client";

import React, { useState } from "react";
import useRouter from "next/navigation"; // Wait, next/navigation uses useRouter
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

interface StudyPod {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  creatorImage?: string | null;
  creatorRole?: string | null;
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
        
        {/* Header Hero Area */}
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

        {/* Search / Directory Filter */}
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

        {/* Pods Grid list */}
        {filteredPods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 pr-1 pb-4">
            {filteredPods.map((pod) => (
              <div
                key={pod.id}
                className="flex flex-col rounded-2xl shadow-xs border border-slate-300 overflow-hidden bg-white hover:shadow-md transition duration-150 animate-fadeIn"
              >
                {/* Colored top bar header: yellow theme to match study pods directory theme! */}
                <div className="flex justify-between items-center px-6 py-4 text-[10px] font-bold font-mono tracking-wider bg-yellow-100/70 text-slate-800 border-b border-yellow-200/50">
                  <span>POD-{pod.id.substring(0, 5).toUpperCase()}</span>
                  <span>
                    {new Date(pod.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Main Card Body */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Host Avatar and Role Row */}
                    <div className="flex items-center gap-2">
                      {pod.creatorImage ? (
                        <img
                          src={pod.creatorImage}
                          alt={pod.creatorName}
                          className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-[9px] font-bold shrink-0">
                          {pod.creatorName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-700 font-semibold leading-none truncate">
                          {pod.creatorName}
                        </p>
                        <p className="text-[8px] text-slate-400 font-medium leading-none truncate mt-0.5">
                          {pod.creatorRole || "Academy Learner"}
                        </p>
                      </div>
                    </div>

                    {/* Room name and dynamic badge */}
                    <div className="flex items-start justify-between gap-3 mt-3.5">
                      <h4 className="text-sm font-semibold text-slate-850 leading-snug line-clamp-2">
                        {pod.name}
                      </h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50/50 text-indigo-700 border-indigo-100 shrink-0 select-none">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Dotted horizontal line separator */}
                  <div className="border-t border-dashed border-slate-200 my-4" />

                  {/* Action footer */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleCopyLink(pod.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-indigo-650 transition cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedPodId === pod.id ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5 shrink-0" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => router.push(`/studypod/${pod.id}`)}
                      className="bg-black hover:bg-slate-900 text-white rounded-lg px-5 py-2 text-xs font-medium transition duration-150 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Enter Room</span>
                      <IconLogin className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
            <div className="w-[300px] h-[300px] flex items-center justify-center overflow-hidden mb-1">
              <iframe
                src="https://lottie.host/embed/f1da6ee0-a2ca-4587-a660-de3e93db559c/QfMgkv2YHd.lottie"
                style={{ width: "300px", height: "300px", border: "none" }}
                title="No Study Pods Animation"
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
