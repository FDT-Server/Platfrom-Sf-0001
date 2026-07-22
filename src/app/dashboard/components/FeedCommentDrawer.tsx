"use client";

import React, { useState } from "react";
import { IconX, IconMessageCircle, IconArrowRight } from "@tabler/icons-react";
import { FeedPost } from "./FeedPostCard";
import CommentList from "@/components/feed/CommentList";
import Link from "next/link";

interface FeedCommentDrawerProps {
  post: FeedPost | null;
  currentUser: {
    id: string;
    fullName: string;
    profileImage?: string | null;
  };
  onClose: () => void;
}

export default function FeedCommentDrawer({ post, currentUser, onClose }: FeedCommentDrawerProps) {
  if (!post) return null;

  const formattedComments = post.comments.map((c) => ({
    id: c.id,
    author: {
      id: `author-${c.authorName}`,
      name: c.authorName,
      role: "Community Student",
      image: c.authorImage || null,
    },
    content: c.content,
    createdAt: c.timeAgo,
    likes: 0,
    liked: false,
    replies: [],
  }));

  const currentUserObj = {
    id: currentUser.id,
    name: currentUser.fullName,
    image: currentUser.profileImage || null,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">

          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <IconMessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Post Comments</h3>
                <p className="text-[10px] text-slate-400 font-semibold line-clamp-1">
                  By {post.authorName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1.5 rounded-full border border-slate-200 transition cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* Quick Post Snippet */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-xs text-slate-700 leading-relaxed font-normal">
              <span className="font-bold text-slate-900 block mb-1">{post.authorName} wrote:</span>
              <p className="line-clamp-3">{post.content}</p>

              <Link
                href={`/dashboard/post/${post.id}`}
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
              >
                <span>View Full Post Page</span>
                <IconArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Comment List */}
            <CommentList comments={formattedComments} currentUser={currentUserObj} />
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <Link
              href={`/dashboard/post/${post.id}`}
              onClick={onClose}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1"
            >
              <span>Open Dedicated Post Page</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
