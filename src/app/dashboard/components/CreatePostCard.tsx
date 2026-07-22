"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  IconPhoto,
  IconAward,
  IconCode,
  IconHelpCircle,
  IconSend,
  IconX,
  IconLink,
} from "@tabler/icons-react";

export type PostCategory = "General" | "Achievement" | "Project" | "Question";

interface CreatePostCardProps {
  user: {
    fullName: string;
    profileImage?: string | null;
  };
  onPostCreated?: (post: {
    content: string;
    category: PostCategory;
    imageUrl?: string;
  }) => void;
}

export default function CreatePostCard({ user, onPostCreated }: CreatePostCardProps) {
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState<PostCategory>("General");
  const [imageUrl, setImageUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const firstName = user.fullName ? user.fullName.split(" ")[0] : "Student";

  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postText.trim(),
          category,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        const newPost = await res.json();
        toast.success("Post published to your feed!");
        if (onPostCreated) {
          onPostCreated(newPost);
        }
      } else {
        toast.error("Failed to publish post.");
      }
    } catch (err) {
      console.error("Error publishing post:", err);
      toast.error("An error occurred while publishing.");
    }

    setPostText("");
    setImageUrl("");
    setCategory("General");
    setIsExpanded(false);
  };

  const actionButtons = [
    {
      label: "Project",
      category: "Project" as PostCategory,
      icon: IconCode,
      color: "text-blue-600 bg-blue-50/80 hover:bg-blue-100/90 border-blue-100",
    },
    {
      label: "Achievement",
      category: "Achievement" as PostCategory,
      icon: IconAward,
      color: "text-amber-600 bg-amber-50/80 hover:bg-amber-100/90 border-amber-100",
    },
    {
      label: "Question",
      category: "Question" as PostCategory,
      icon: IconHelpCircle,
      color: "text-purple-600 bg-purple-50/80 hover:bg-purple-100/90 border-purple-100",
    },
    {
      label: "Image",
      category: "General" as PostCategory,
      icon: IconPhoto,
      color: "text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-md select-none">
      <div className="flex items-center gap-3">
        {}
        {user.profileImage && !imgError ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            onError={() => setImgError(true)}
            className="w-11 h-11 rounded-full object-cover border border-slate-200/80 shrink-0 shadow-2xs"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs border border-white/20">
            {initials}
          </div>
        )}

        <input
          type="text"
          placeholder={`Start a post, share a project or ask a question, ${firstName}...`}
          value={postText}
          onChange={(e) => {
            setPostText(e.target.value);
            if (e.target.value.trim() && !isExpanded) {
              setIsExpanded(true);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className="w-full text-xs sm:text-sm font-medium bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-full px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-150 shadow-2xs cursor-pointer"
        />
      </div>

      {/* Expanded Composer Drawer */}
      {isExpanded && (
        <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-3.5 animate-fadeIn">
          {/* Detailed Multiline Area */}
          <textarea
            rows={3}
            placeholder="What's on your mind? Share your code, project updates, or questions..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full text-xs sm:text-sm font-medium bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
            autoFocus
          />

          {/* Optional Image URL Input */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
            <IconLink className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Paste image URL (optional)..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs font-medium bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Type Select & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(["General", "Project", "Achievement", "Question"] as PostCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition duration-150 cursor-pointer ${
                      category === cat
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setPostText("");
                  setImageUrl("");
                  setCategory("General");
                }}
                className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full border border-slate-200 transition cursor-pointer"
              >
                <IconX className="w-3.5 h-3.5 inline mr-1" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePostSubmit}
                disabled={!postText.trim()}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-5 py-2 rounded-full transition duration-150 shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <IconSend className="w-3.5 h-3.5" />
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Action Buttons Row */}
      {!isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-100 pt-3">
          {actionButtons.map((btn) => {
            const IconComp = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={() => {
                  setCategory(btn.category);
                  setIsExpanded(true);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border transition duration-150 cursor-pointer shadow-2xs ${btn.color}`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
