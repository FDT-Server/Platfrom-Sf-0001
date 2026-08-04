"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  onClose?: () => void;
}

export default function CreatePostCard({ user, onPostCreated, onClose }: CreatePostCardProps) {
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState<PostCategory>("General");
  const [imageUrl, setImageUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Listen for global open-compose event (e.g. from top navbar)
    const handleOpenCompose = (e: any) => {
      if (e.detail && e.detail.category) {
        setCategory(e.detail.category);
      }
      setIsExpanded(true);
    };
    window.addEventListener('open-compose', handleOpenCompose);
    
    return () => {
      window.removeEventListener('open-compose', handleOpenCompose);
    };
  }, []);

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

  if (mounted && isExpanded && typeof document !== "undefined") {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn md:pr-[12%] lg:pr-[15%] xl:pr-[18%]">
        {/* Full screen dark overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => {
            setIsExpanded(false);
            if (onClose) onClose();
          }}
        />

        {/* Modal Container */}
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col w-full max-w-4xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] relative z-10 animate-scaleIn">
          
          {/* Close Button */}
          <button 
            onClick={() => {
              setIsExpanded(false);
              if (onClose) onClose();
            }}
            className="absolute -top-3 -right-3 z-[110] bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
              title="Cancel post"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-4">
              {user.profileImage && !imgError ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  onError={() => setImgError(true)}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200/80 shrink-0 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm border border-white/20">
                  {initials}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-800">{user.fullName}</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Posting in <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full ml-1">{category}</span></span>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
              <textarea
                rows={12}
                placeholder={`What do you want to talk about, ${firstName}?`}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full min-h-[300px] text-base bg-slate-50/50 border border-slate-200 rounded-xl p-5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-y leading-relaxed"
                autoFocus
              />

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/80">
                <IconLink className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Paste image URL (optional)..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs font-medium bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["General", "Project", "Achievement", "Question"] as PostCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition duration-150 cursor-pointer ${
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

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                    }}
                    className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full border border-slate-200 transition cursor-pointer"
                  >
                    <IconX className="w-3.5 h-3.5 inline mr-1" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handlePostSubmit}
                    disabled={!postText.trim()}
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-6 py-2 rounded-full transition duration-150 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconSend className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col transition-all duration-300 select-none ml-auto relative z-[100] w-[280px] p-3 shadow-xl hover:shadow-2xl">
      {/* Close Button for small menu */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 z-[110] bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
          title="Cancel post"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}

      <div className="flex flex-col gap-2 animate-fadeIn w-full">
        <div className="px-2 pt-1 pb-2 border-b border-slate-100 mb-1">
          <h3 className="text-[13px] font-bold text-slate-700">Create a post</h3>
        </div>
        <div className="flex flex-col gap-1.5 w-full">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold border transition duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 w-full text-left ${btn.color}`}
              >
                <IconComp className="w-5 h-5 shrink-0" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
