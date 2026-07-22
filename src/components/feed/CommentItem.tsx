"use client";

import React, { useState } from "react";
import {
  IconHeart,
  IconCornerDownRight,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { PostComment } from "./types";
import CommentEditor from "./CommentEditor";
import { toast } from "sonner";

interface CommentItemProps {
  comment: PostComment;
  currentUser: {
    id: string;
    name: string;
    image?: string | null;
  };
  onLikeComment: (commentId: string) => void;
  onAddReply: (commentId: string, replyText: string) => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, newText: string) => void;
}

export default function CommentItem({
  comment,
  currentUser,
  onLikeComment,
  onAddReply,
  onDeleteComment,
  onEditComment,
}: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const isOwner = currentUser.id === comment.author.id || currentUser.name === comment.author.name;

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onEditComment(comment.id, editText.trim());
    setIsEditing(false);
    toast.success("Comment updated!");
  };

  const handleReplySubmit = (replyText: string) => {
    onAddReply(comment.id, replyText);
    setShowReplyBox(false);
    toast.success("Reply added!");
  };

  return (
    <div className="flex gap-3 bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 transition duration-150 hover:bg-slate-100/50">
      {comment.author.image ? (
        <img
          src={comment.author.image}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate block">
              {comment.author.name}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              {comment.author.role} · {comment.createdAt}
            </span>
          </div>

          {}
          {isOwner && (
            <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-white transition cursor-pointer"
                title="Edit comment"
              >
                <IconEdit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white transition cursor-pointer"
                title="Delete comment"
              >
                <IconTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {}
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-1">
            <textarea
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-blue-400 rounded-xl p-2.5 text-slate-800 focus:outline-none"
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setIsEditing(false)}
                className="text-[10px] font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 pt-1 select-none">
          <button
            onClick={() => onLikeComment(comment.id)}
            className={`flex items-center gap-1 transition cursor-pointer ${
              comment.liked ? "text-rose-600" : "hover:text-slate-900"
            }`}
          >
            <IconHeart className={`w-3.5 h-3.5 ${comment.liked ? "fill-rose-600 text-rose-600" : ""}`} />
            <span>{comment.likes > 0 ? `${comment.likes} Likes` : "Like"}</span>
          </button>

          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
          >
            <IconCornerDownRight className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Nested Reply Input */}
        {showReplyBox && (
          <div className="mt-2 pl-2 border-l-2 border-blue-400 animate-fadeIn">
            <CommentEditor
              currentUser={currentUser}
              onSubmitComment={handleReplySubmit}
              placeholder={`Reply to ${comment.author.name.split(" ")[0]}...`}
              buttonLabel="Reply"
              autoFocus
            />
          </div>
        )}

        {/* Render Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2 pl-4 border-l-2 border-slate-200">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2.5 bg-white border border-slate-200/70 rounded-xl p-2.5">
                {reply.author.image ? (
                  <img
                    src={reply.author.image}
                    alt={reply.author.name}
                    className="w-6.5 h-6.5 rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {reply.author.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900">{reply.author.name}</span>
                    <span className="text-[9px] text-slate-400">{reply.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 leading-snug">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
