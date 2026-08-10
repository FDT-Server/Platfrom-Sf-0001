"use client";

import React, { useState } from "react";
import { IconMessageCircle, IconChevronDown } from "@tabler/icons-react";
import { PostComment } from "./types";
import CommentItem from "./CommentItem";
import CommentEditor from "./CommentEditor";
import { toast } from "sonner";

interface CommentListProps {
  comments: PostComment[];
  currentUser: {
    id: string;
    name: string;
    image?: string | null;
  };
  postId?: string;
}

export default function CommentList({ comments: initialComments, currentUser, postId }: CommentListProps) {
  const [comments, setComments] = useState<PostComment[]>(initialComments || []);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleAddComment = async (text: string) => {
    const newComment: PostComment = {
      id: `c-${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: "Student Developer",
        image: currentUser.image || null,
      },
      content: text,
      createdAt: "Just now",
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments([newComment, ...comments]);
    toast.success("Comment published!");

    if (postId) {
      try {
        await fetch(`/api/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "comment", commentText: text }),
        });
      } catch (err) {
        console.error("Failed to save comment to DB:", err);
      }
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.liked;
          return {
            ...c,
            liked: nextLiked,
            likes: nextLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const newReply = {
            id: `reply-${Date.now()}`,
            author: {
              id: currentUser.id,
              name: currentUser.name,
              role: "Student Developer",
              image: currentUser.image || null,
            },
            content: replyText,
            createdAt: "Just now",
            likes: 0,
          };
          return {
            ...c,
            replies: [...c.replies, newReply],
          };
        }
        return c;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    toast.success("Comment deleted");
  };

  const handleEditComment = (commentId: string, newText: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content: newText } : c))
    );
  };

  return (
    <div id="comment-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 select-none">
        <IconMessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-extrabold text-slate-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Primary Add Comment Editor */}
      <CommentEditor currentUser={currentUser} onSubmitComment={handleAddComment} />

      {/* List of Comments */}
      <div className="flex flex-col gap-3.5 mt-2">
        {comments.slice(0, visibleCount).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onLikeComment={handleLikeComment}
            onAddReply={handleAddReply}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 font-medium italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}

        {comments.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl border border-slate-200 transition duration-150 flex items-center justify-center gap-1 cursor-pointer select-none"
          >
            <span>Load More Comments</span>
            <IconChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
