"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconArrowRight,
} from "@tabler/icons-react";
import { PostCategory } from "./CreatePostCard";

export interface PostComment {
  id: string;
  authorName: string;
  authorImage?: string | null;
  content: string;
  timeAgo: string;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorImage?: string | null;
  timeAgo: string;
  category: PostCategory | "Opportunity";
  content: string;
  imageUrl?: string;
  likes: number;
  sharesCount?: number;
  viewsCount?: number;
  comments: PostComment[];
  liked?: boolean;
  bookmarked?: boolean;
}

interface FeedPostCardProps {
  post: FeedPost;
  currentUser: {
    fullName: string;
    profileImage?: string | null;
  };
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onOpenCommentsDrawer?: (post: FeedPost) => void;
}

export default function FeedPostCard({
  post,
  currentUser,
  onLikeToggle,
  onBookmarkToggle,
  onOpenCommentsDrawer,
}: FeedPostCardProps) {
  const router = useRouter();

  const initials = post.authorName
    ? post.authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) {
      return;
    }
    router.push(`/dashboard/post/${post.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/post/${post.id}`);
      toast.success("Post link copied to clipboard!");
      try {
        await fetch(`/api/posts/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "share" }),
        });
      } catch (err) {
        console.error("Error sharing post:", err);
      }
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenCommentsDrawer) {
      onOpenCommentsDrawer(post);
    } else {
      router.push(`/dashboard/post/${post.id}#comment-section`);
    }
  };

  const categoryBadgeStyles: Record<string, string> = {
    Achievement: "bg-amber-50 text-amber-700 border-amber-200",
    Project: "bg-blue-50 text-blue-700 border-blue-200",
    Question: "bg-rose-50 text-rose-700 border-rose-200",
    Opportunity: "bg-emerald-50 text-emerald-700 border-emerald-200",
    General: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col gap-3.5 transition duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          {post.authorImage ? (
            <img
              src={post.authorImage}
              alt={post.authorName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.authorName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
              }}
              className="w-10 h-10 rounded-full object-cover border border-slate-200/80 bg-slate-50 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
              {post.authorName}
            </h4>
            <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
              {post.authorRole} · {post.timeAgo}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            categoryBadgeStyles[post.category] || categoryBadgeStyles.General
          }`}
        >
          {post.category}
        </span>
      </div>

      {/* Body Content */}
      <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Clear, Uncropped Image attachment */}
      {post.imageUrl && post.imageUrl.trim() !== "" && (
        <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-950/5 select-none p-1 flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt="Post media"
            className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-2xs"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Real Stats summary */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-0.5 border-b border-slate-100 pb-2 select-none">
        <div className="flex items-center gap-2">
          <span>{post.likes} Likes</span>
          <span>·</span>
          <span>{post.comments.length} Comments</span>
          <span>·</span>
          <span>{post.sharesCount || 0} Shares</span>
          <span>·</span>
          <span>{post.viewsCount || 0} Views</span>
        </div>
        <span className="hover:text-blue-600 transition text-[10px] font-bold">
          View post &rarr;
        </span>
      </div>

      {/* Actions toolbar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 select-none">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(post.id);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition duration-150 cursor-pointer ${
            post.liked ? "text-rose-600 bg-rose-50" : "hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <IconHeart className={`w-4 h-4 ${post.liked ? "fill-rose-600 text-rose-600" : ""}`} />
          <span>Like</span>
        </button>

        <button
          type="button"
          onClick={handleCommentClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition duration-150 cursor-pointer hover:bg-slate-50 hover:text-blue-600"
        >
          <IconMessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition duration-150 cursor-pointer"
        >
          <IconShare className="w-4 h-4" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(post.id);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition duration-150 cursor-pointer ${
            post.bookmarked ? "text-blue-600 bg-blue-50" : "hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <IconBookmark className={`w-4 h-4 ${post.bookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
