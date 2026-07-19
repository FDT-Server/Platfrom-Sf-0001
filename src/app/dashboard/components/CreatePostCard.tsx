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

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    if (onPostCreated) {
      onPostCreated({
        content: postText.trim(),
        category,
        imageUrl: imageUrl.trim() || undefined,
      });
    } else {
      toast.success("Post created successfully! (Placeholder UI)");
    }

    setPostText("");
    setImageUrl("");
    setCategory("General");
    setIsExpanded(false);
  };

  const actionButtons = [
    { label: "Project", category: "Project" as PostCategory, icon: IconCode, color: "text-blue-500 hover:bg-blue-50" },
    { label: "Achievement", category: "Achievement" as PostCategory, icon: IconAward, color: "text-amber-500 hover:bg-amber-50" },
    { label: "Question", category: "Question" as PostCategory, icon: IconHelpCircle, color: "text-purple-500 hover:bg-purple-50" },
    { label: "Image", category: "General" as PostCategory, icon: IconPhoto, color: "text-emerald-500 hover:bg-emerald-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      {/* Top Input Row */}
      <div className="flex items-center gap-3">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
        )}

        <input
          type="text"
          placeholder={`Start a post, share a project or ask a question, ${user.fullName.split(" ")[0]}...`}
          value={postText}
          onChange={(e) => {
            setPostText(e.target.value);
            if (e.target.value.trim() && !isExpanded) {
              setIsExpanded(true);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className="w-full text-xs font-medium bg-slate-100 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
        />
      </div>

      {/* Expanded Fields */}
      {isExpanded && (
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 animate-fadeIn">
          {/* Optional Image Input */}
          <div className="flex items-center gap-2">
            <IconPhoto className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Paste optional image URL (e.g. Unsplash or project screenshot)..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Select & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
              <div className="flex gap-1 flex-wrap">
                {(["General", "Project", "Achievement", "Question"] as PostCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition duration-150 cursor-pointer ${
                      category === cat
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
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
                className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition"
              >
                <IconX className="w-4 h-4 inline mr-1" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePostSubmit}
                disabled={!postText.trim()}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-1.5 rounded-xl transition duration-150 shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <IconSend className="w-3.5 h-3.5" />
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Action Icons row when collapsed */}
      {!isExpanded && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-bold text-slate-600">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer ${btn.color}`}
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
