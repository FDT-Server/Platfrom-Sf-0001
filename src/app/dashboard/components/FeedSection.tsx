"use client";

import React, { useState, useEffect } from "react";
import FeedPostCard, { FeedPost } from "./FeedPostCard";
import FeedCommentDrawer from "./FeedCommentDrawer";
import { toast } from "sonner";

interface FeedSectionProps {
  user: {
    id: string;
    fullName: string;
    profileImage?: string | null;
  };
  newPostSignal?: any;
}

export default function FeedSection({ user, newPostSignal }: FeedSectionProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDrawerPost, setActiveDrawerPost] = useState<FeedPost | null>(null);

  const formatExactDateTime = (dateValue: string | Date) => {
    if (!dateValue) return "Recently";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchPostsFromApi = async () => {
    try {
      const res = await fetch(`/api/posts?t=${Date.now()}`);
      if (res.ok) {
        const dbPosts = await res.json();
        if (Array.isArray(dbPosts)) {
          let localBookmarks: string[] = [];
          if (typeof window !== "undefined") {
            try {
              localBookmarks = JSON.parse(localStorage.getItem("sf_saved_posts") || "[]");
            } catch (e) {}
          }

          setPosts((prevPosts) => {
            const prevMap = new Map(prevPosts.map((p) => [p.id, p]));
            return dbPosts.map((p: any) => {
              const prev = prevMap.get(p.id);
              const exactTime = formatExactDateTime(p.createdAt);
              const bUserIds = Array.isArray(p.bookmarkedUserIds) ? p.bookmarkedUserIds : [];
              const lUserIds = Array.isArray(p.likedUserIds) ? p.likedUserIds : [];
              const comms = Array.isArray(p.comments) ? p.comments : [];

              let isLiked = prev ? prev.liked : false;
              let isBookmarked = prev ? prev.bookmarked : localBookmarks.includes(p.id);

              if (user && user.id) {
                if (lUserIds.includes(user.id)) isLiked = true;
                if (bUserIds.includes(user.id)) isBookmarked = true;
              }

              return {
                id: p.id,
                authorName: p.userName || "Community Developer",
                authorRole: p.userRole || "Student Developer",
                authorImage: p.userImage && p.userImage.trim() !== "" ? p.userImage : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.userName || "Developer")}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
                timeAgo: exactTime,
                category: p.category || "General",
                content: p.content,
                imageUrl: p.imageUrl || undefined,
                likes: p.likesCount || 0,
                sharesCount: p.sharesCount || 0,
                viewsCount: p.viewsCount || 0,
                comments: comms,
                liked: isLiked,
                bookmarked: isBookmarked,
              };
            });
          });
        }
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsFromApi();
    const interval = setInterval(() => {
      fetchPostsFromApi();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (newPostSignal) {
      fetchPostsFromApi();
    }
  }, [newPostSignal]);

  const handleLikeToggle = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
    } catch (err) {
      console.error("Error persisting like:", err);
    }
  };

  const handleBookmarkToggle = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextBookmarked = !p.bookmarked;
          if (nextBookmarked) toast.success("Post saved to profile bookmarks!");

          if (typeof window !== "undefined") {
            try {
              const currentSaved: string[] = JSON.parse(localStorage.getItem("sf_saved_posts") || "[]");
              if (nextBookmarked) {
                if (!currentSaved.includes(postId)) currentSaved.push(postId);
              } else {
                const idx = currentSaved.indexOf(postId);
                if (idx > -1) currentSaved.splice(idx, 1);
              }
              localStorage.setItem("sf_saved_posts", JSON.stringify(currentSaved));
            } catch (e) {}
          }

          return { ...p, bookmarked: nextBookmarked };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bookmark" }),
      });
    } catch (err) {
      console.error("Error persisting bookmark:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {posts.length > 0 ? (
        posts.map((post) => (
          <FeedPostCard
            key={post.id}
            post={post}
            currentUser={user}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenCommentsDrawer={(postItem) => setActiveDrawerPost(postItem)}
          />
        ))
      ) : !loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <p className="text-sm font-bold text-slate-800">No posts in the community feed yet</p>
          <p className="text-xs text-slate-500 mt-1">Be the first to share an update, ask a question, or start a discussion!</p>
        </div>
      ) : null}

      <FeedCommentDrawer
        post={activeDrawerPost}
        currentUser={user}
        onClose={() => setActiveDrawerPost(null)}
      />
    </div>
  );
}
