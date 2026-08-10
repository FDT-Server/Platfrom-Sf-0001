"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconChevronRight,
  IconCheck,
  IconUserPlus,
  IconMessageCircle,
  IconAward,
  IconSchool,
  IconGlobe,
} from "@tabler/icons-react";
import { PostAuthor } from "./types";
import { toast } from "sonner";

interface PostHeaderProps {
  author: PostAuthor;
  createdAt: string;
  visibility?: string;
}

export default function PostHeader({ author, createdAt, visibility }: PostHeaderProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(author.isFollowing || false);

  const handleFollowToggle = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    toast.success(nextState ? `Following ${author.name}!` : `Unfollowed ${author.name}`);
  };

  const handleMessage = () => {
    router.push(`/networking?chatWith=${encodeURIComponent(author.id || author.name)}`);
  };

  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Top Navigation Bar: Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition duration-150 shadow-2xs cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Link href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </Link>
          <IconChevronRight className="w-3.5 h-3.5" />
          <Link href="/dashboard" className="hover:text-blue-600 transition">
            Feed
          </Link>
          <IconChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold">Post Details</span>
        </div>
      </div>

      {/* Author Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative shrink-0">
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-13 h-13 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-base shadow-sm">
                {initials}
              </div>
            )}
            {author.isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white" title="Verified Member">
                <IconAward className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">{author.name}</h3>
              {author.isVerified && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-150 px-2 py-0.5 rounded-md">
                  Verified Student
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 font-semibold mt-0.5 leading-tight">{author.role}</p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1.5 flex-wrap">
              {author.college && (
                <span className="flex items-center gap-1 text-slate-500 font-semibold">
                  <IconSchool className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  {author.college} {author.branch ? `· ${author.branch}` : ""} {author.year ? `(${author.year})` : ""}
                </span>
              )}
              <span className="flex items-center gap-1">
                <IconGlobe className="w-3.5 h-3.5" />
                {createdAt} · {visibility || "Public"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Follow & Message */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={handleMessage}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition duration-150 shadow-2xs cursor-pointer"
          >
            <IconMessageCircle className="w-4 h-4 text-blue-600" />
            <span>Message</span>
          </button>

          <button
            onClick={handleFollowToggle}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition duration-150 shadow-2xs cursor-pointer ${
              isFollowing
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
            }`}
          >
            {isFollowing ? (
              <>
                <IconCheck className="w-4 h-4 text-emerald-600" />
                <span>Following</span>
              </>
            ) : (
              <>
                <IconUserPlus className="w-4 h-4" />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
