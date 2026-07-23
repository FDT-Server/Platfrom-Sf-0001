"use client";

import React, { useState } from "react";
import {
  IconThumbUp,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconEye,
} from "@tabler/icons-react";
import { ReactionType, PostReactionSummary } from "./types";
import { toast } from "sonner";

interface ReactionBarProps {
  postId: string;
  reactions: PostReactionSummary;
  initialReaction?: ReactionType | null;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  bookmarked?: boolean;
}

const reactionOptions: { type: ReactionType; label: string; emoji: string; color: string }[] = [
  { type: "like", label: "Like", emoji: "👍", color: "text-blue-600" },
  { type: "celebrate", label: "Celebrate", emoji: "👏", color: "text-amber-600" },
  { type: "support", label: "Support", emoji: "🤝", color: "text-purple-600" },
  { type: "insightful", label: "Insightful", emoji: "💡", color: "text-emerald-600" },
  { type: "love", label: "Love", emoji: "❤️", color: "text-rose-600" },
];

export default function ReactionBar({
  postId,
  reactions,
  initialReaction,
  commentsCount,
  sharesCount,
  bookmarksCount,
  viewsCount,
  bookmarked: initialBookmarked = false,
}: ReactionBarProps) {
  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(initialReaction || null);
  const [reactionCounts, setReactionCounts] = useState<PostReactionSummary>(reactions);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [showPicker, setShowPicker] = useState(false);

  const totalReactions =
    reactionCounts.like +
    reactionCounts.celebrate +
    reactionCounts.support +
    reactionCounts.insightful +
    reactionCounts.love;

  const handleSelectReaction = (type: ReactionType) => {
    const isSame = activeReaction === type;
    const newCounts = { ...reactionCounts };

    if (activeReaction) {
      newCounts[activeReaction] = Math.max(0, newCounts[activeReaction] - 1);
    }

    if (!isSame) {
      newCounts[type] = (newCounts[type] || 0) + 1;
      setActiveReaction(type);
      toast.success(`Reacted with ${type}!`);
    } else {
      setActiveReaction(null);
    }

    setReactionCounts(newCounts);
    setShowPicker(false);
  };

  const handleBookmark = async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    toast.success(next ? "Post saved to profile bookmarks!" : "Removed from bookmarks");

    if (typeof window !== "undefined") {
      try {
        const currentSaved: string[] = JSON.parse(localStorage.getItem("sf_saved_posts") || "[]");
        if (next) {
          if (!currentSaved.includes(postId)) currentSaved.push(postId);
        } else {
          const idx = currentSaved.indexOf(postId);
          if (idx > -1) currentSaved.splice(idx, 1);
        }
        localStorage.setItem("sf_saved_posts", JSON.stringify(currentSaved));
      } catch (e) {}
    }

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bookmark" }),
      });
    } catch (err) {
      console.error("Failed to persist bookmark:", err);
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/post/${postId}`);
      toast.success("Post link copied to clipboard!");
      try {
        await fetch(`/api/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "share" }),
        });
      } catch (err) {
        console.error("Failed to persist share count:", err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      {/* Engagement Stats Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] shadow-2xs">👍</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] shadow-2xs">👏</span>
            <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[10px] shadow-2xs">❤️</span>
          </span>
          <span className="font-extrabold text-slate-900 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
            {reactionCounts.like || totalReactions || 0} Likes
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span>{commentsCount} Comments</span>
          <span>·</span>
          <span>{sharesCount} Shares</span>
          <span>·</span>
          <span className="flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <IconEye className="w-3.5 h-3.5 text-blue-600" />
            {viewsCount} Views
          </span>
        </div>
      </div>

      {/* Interactive Action Toolbar */}
      <div className="relative flex items-center justify-between pt-1 text-xs font-bold text-slate-600">

        {/* Hover/Click Reaction Popup Selector */}
        {showPicker && (
          <div className="absolute -top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-2xl px-3 py-1.5 flex items-center gap-2 animate-fadeIn z-20">
            {reactionOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleSelectReaction(opt.type)}
                className="hover:scale-125 transition-transform duration-150 p-1 text-base cursor-pointer"
                title={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reaction Button */}
        <div className="relative" onMouseLeave={() => setShowPicker(false)}>
          <button
            onClick={() => handleSelectReaction(activeReaction ? activeReaction : "like")}
            onMouseEnter={() => setShowPicker(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition duration-150 cursor-pointer ${
              activeReaction ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {activeReaction ? (
              <>
                <span className="text-sm">
                  {reactionOptions.find((r) => r.type === activeReaction)?.emoji || "👍"}
                </span>
                <span className="capitalize font-black">{activeReaction}</span>
              </>
            ) : (
              <>
                <IconThumbUp className="w-4 h-4" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment */}
        <a
          href="#comment-section"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition duration-150 cursor-pointer"
        >
          <IconMessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </a>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition duration-150 cursor-pointer"
        >
          <IconShare className="w-4 h-4" />
          <span>Share</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition duration-150 cursor-pointer ${
            isBookmarked ? "text-blue-600 bg-blue-50" : "hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <IconBookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
          <span>{isBookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
