"use client";

import React from "react";
import Link from "next/link";
import { IconSparkles, IconArrowUpRight, IconThumbUp, IconMessageCircle } from "@tabler/icons-react";
import { FeedPost } from "./types";

interface RelatedPostsProps {
  currentPostId: string;
  authorName: string;
}

const mockRelatedPosts = [
  {
    id: "post-hackathon-win",
    title: "First Place Winners at National Smart Campus Hackathon 2026 🏆",
    authorName: "Team Synergy",
    category: "Achievement",
    likes: 65,
    commentsCount: 18,
    timeAgo: "3h ago",
  },
  {
    id: "post-ai-agent",
    title: "Hands-on AI Workshop: Building Production LLM Agents",
    authorName: "Dr. K. R. Raman",
    category: "Workshop",
    likes: 61,
    commentsCount: 24,
    timeAgo: "1d ago",
  },
  {
    id: "post-internship-opening",
    title: "Front-End Engineering Intern Opening at TechForge Solutions",
    authorName: "Placement Cell",
    category: "Opportunity",
    likes: 42,
    commentsCount: 9,
    timeAgo: "5h ago",
  },
];

export default function RelatedPosts({ currentPostId, authorName }: RelatedPostsProps) {
  const filtered = mockRelatedPosts.filter((p) => p.id !== currentPostId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <IconSparkles className="w-4.5 h-4.5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-slate-900">
            More Related Content
          </h3>
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>Explore Feed</span>
          <IconArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/post/${item.id}`}
            className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between gap-2 hover:bg-slate-100/80 hover:border-blue-200 transition duration-150 group"
          >
            <div>
              <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-150 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 mt-1.5 leading-snug">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-400">
              <span>{item.authorName}</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <IconThumbUp className="w-3 h-3 text-slate-400" />
                  {item.likes}
                </span>
                <span className="flex items-center gap-0.5">
                  <IconMessageCircle className="w-3 h-3 text-slate-400" />
                  {item.commentsCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
