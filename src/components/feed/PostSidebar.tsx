"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconUser,
  IconHash,
  IconUsers,
  IconMessageCircle,
  IconUserPlus,
  IconCheck,
} from "@tabler/icons-react";
import { PostAuthor } from "./types";
import { toast } from "sonner";

interface PostSidebarProps {
  author: PostAuthor;
}

export default function PostSidebar({ author }: PostSidebarProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(author.isFollowing || false);
  const [pendingUserIds, setPendingUserIds] = useState<string[]>([]);
  const [suggestedStudents, setSuggestedStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchRealStudents = async () => {
      try {
        const res = await fetch(`/api/users?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            const filtered = data.users.filter(
              (u: any) =>
                u.id !== author.id &&
                u.email?.trim().toLowerCase() !== "webstrixx@gmail.com" &&
                u.email?.trim().toLowerCase() !== "hrstudentforge@gmail.com"
            );
            setSuggestedStudents(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching real students for sidebar:", err);
      }
    };

    fetchRealStudents();
  }, [author.id]);

  const handleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    toast.success(next ? `Following ${author.name}!` : `Unfollowed ${author.name}`);
  };

  const handleMessageAuthor = () => {
    router.push(`/networking?chatWith=${encodeURIComponent(author.id || author.name)}`);
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
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
              }}
              className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
              {author.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
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

        <div className="flex gap-2">
          <button
            onClick={handleFollow}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition duration-150 shadow-2xs cursor-pointer ${
              isFollowing
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
            }`}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </button>

          <button
            onClick={handleMessageAuthor}
            className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition duration-150 cursor-pointer shrink-0"
            title="Message Author Directly"
          >
            <IconMessageCircle className="w-4 h-4 text-blue-600" />
            <span>Message</span>
          </button>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <IconHash className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Trending Topics
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["FullStack", "NextJS", "Prisma", "AI", "Placements", "React", "Python"].map((tag) => (
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

      {/* Suggested Registered Students */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pl-1">
          <IconUsers className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Community Members
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {suggestedStudents.length > 0 ? (
            suggestedStudents.slice(0, 4).map((student) => {
              const isPending = pendingUserIds.includes(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                      src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                      alt={student.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate leading-snug">{student.fullName}</h5>
                      <span className="text-[10px] text-slate-400 font-medium block truncate">{student.selectedRole || "Student Member"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect(student.id, student.fullName)}
                    disabled={isPending}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer ${
                      isPending
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    }`}
                  >
                    {isPending ? "Sent" : "Connect"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No other registered members yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
