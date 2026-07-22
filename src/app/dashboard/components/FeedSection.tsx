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

  const fetchPostsFromApi = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const dbPosts = await res.json();
        if (Array.isArray(dbPosts) && dbPosts.length > 0) {
          const formatted: FeedPost[] = dbPosts.map((p: any) => ({
            id: p.id,
            authorName: p.userName || "Community Developer",
            authorRole: p.userRole || "Student Developer",
            authorImage: p.userImage || null,
            timeAgo: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
            category: p.category || "General",
            content: p.content,
            imageUrl: p.imageUrl || undefined,
            likes: p.likesCount || 0,
            comments: [],
            liked: false,
            bookmarked: false,
          }));
          setPosts(formatted);
          return;
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
  }, []);

  useEffect(() => {
    if (newPostSignal) {
      fetchPostsFromApi();
    }
  }, [newPostSignal]);

  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextBookmarked = !p.bookmarked;
          if (nextBookmarked) toast.success("Post saved to bookmarks!");
          return { ...p, bookmarked: nextBookmarked };
        }
        return p;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          currentUser={user}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
          onOpenCommentsDrawer={(postItem) => setActiveDrawerPost(postItem)}
        />
      ))}

      <FeedCommentDrawer
        post={activeDrawerPost}
        currentUser={user}
        onClose={() => setActiveDrawerPost(null)}
      />
    </div>
  );
}
