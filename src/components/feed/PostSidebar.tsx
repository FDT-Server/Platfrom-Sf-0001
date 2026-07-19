"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconUser,
  IconHash,
  IconUsers,
  IconFlame,
  IconSchool,
  IconUserPlus,
  IconClock,
} from "@tabler/icons-react";
import { PostAuthor } from "./types";
import { toast } from "sonner";

interface PostSidebarProps {
  author: PostAuthor;
}

export default function PostSidebar({ author }: PostSidebarProps) {
  const [isFollowing, setIsFollowing] = useState(author.isFollowing || false);
  const [pendingUserIds, setPendingUserIds] = useState<string[]>([]);

  const handleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    toast.success(next ? `Following ${author.name}!` : `Unfollowed ${author.name}`);
  };

  const handleConnect = (id: string, name: string) => {
    if (!pendingUserIds.includes(id)) {
      setPendingUserIds([...pendingUserIds, id]);
      toast.success(`Connection request sent to ${name}!`);
    }
  };

  return (
    <aside className="w-full flex flex-col gap-5 lg:sticky lg:top-6 self-start select-none">
      {/* Author Bio Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 block">
          About the Author
        </span>

        <div className="flex items-center gap-3">
          {author.image ? (
            <img
              src={author.image}
              alt={author.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
              {author.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight">
              {author.name}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {author.role}
            </p>
            {author.college && (
              <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">
                {author.college}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`w-full py-2 rounded-xl text-xs font-bold transition duration-150 shadow-2xs cursor-pointer ${
            isFollowing
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
          }`}
        >
          {isFollowing ? "Following Author" : "+ Follow Author"}
        </button>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <IconHash className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Trending Tags
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["NextJS", "AWS", "Hackathon", "Placement", "UIUX", "Python", "WebDev"].map((tag) => (
            <button
              key={tag}
              onClick={() => toast.info(`Filtered feed by #${tag}`)}
              className="bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 hover:text-blue-600 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Related Communities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <IconUsers className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Related Communities
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { name: "Cloud Computing & AWS", members: "2.4k members" },
            { name: "Full-Stack Web Dev Pod", members: "4.1k members" },
            { name: "Placement Preparation 2026", members: "5.8k members" },
          ].map((comm) => (
            <div key={comm.name} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-800 truncate leading-snug">{comm.name}</h5>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{comm.members}</span>
              </div>
              <button
                onClick={() => toast.success(`Joined ${comm.name}!`)}
                className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-150 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition shrink-0 cursor-pointer"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Student Connections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 block">
          Suggested Students
        </span>

        <div className="flex flex-col gap-2.5">
          {[
            { id: "s1", name: "Rohan Gupta", role: "Web Dev Specialist" },
            { id: "s2", name: "Kunal Shah", role: "Backend Developer" },
          ].map((student) => {
            const isPending = pendingUserIds.includes(student.id);
            return (
              <div key={student.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate leading-snug">{student.name}</h5>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{student.role}</span>
                </div>
                <button
                  onClick={() => handleConnect(student.id, student.name)}
                  disabled={isPending}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer ${
                    isPending
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  }`}
                >
                  {isPending ? "Pending" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
