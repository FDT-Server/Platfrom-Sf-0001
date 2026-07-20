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
  newPostSignal?: {
    content: string;
    category: any;
    imageUrl?: string;
  } | null;
}

const defaultMockPosts: FeedPost[] = [
  {
    id: "post-aws-cert",
    authorName: "Aarav Sharma",
    authorRole: "Cloud Computing Track · CSE Year 3",
    authorImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120",
    timeAgo: "1 hour ago",
    category: "Achievement",
    content: "Super excited to share that I just passed the AWS Certified Solutions Architect Associate exam! Big thanks to Student Forge resources and cloud study group for the guidance. Onward to building serverless apps!",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=300",
    likes: 38,
    comments: [
      {
        id: "c-aws-1",
        authorName: "Neha Verma",
        content: "Huge congratulations Aarav! Which practice tests did you find most helpful?",
        timeAgo: "45m ago",
      },
    ],
    liked: false,
    bookmarked: false,
  },
  {
    id: "post-hackathon-win",
    authorName: "Team Synergy (Rohan & Ananya)",
    authorRole: "Full Stack Developers · ECE Year 4",
    authorImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120&h=120",
    timeAgo: "3 hours ago",
    category: "Achievement",
    content: "We took 1st Place at National Smart Campus Hackathon 2026! Built an AI-powered automated attendance & resource management system using Next.js 15, TailwindCSS, and Python OpenCV. Thanks to everyone who tested our demo!",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600&h=300",
    likes: 54,
    comments: [
      {
        id: "c-hack-1",
        authorName: "Vikram Tech Lead",
        content: "Incredible work team! The OpenCV demo ran so smooth.",
        timeAgo: "1h ago",
      },
    ],
    liked: true,
    bookmarked: true,
  },
  {
    id: "post-internship-announcement",
    authorName: "Placement Cell Notice",
    authorRole: "Student Forge Corporate Relations",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120",
    timeAgo: "5 hours ago",
    category: "Opportunity",
    content: "NEW INTERNSHIP OPENING: Front-End Engineering Intern at TechForge Solutions (Stipend: ₹40,000/mo). Open for 3rd and 4th year CSE/IT students. Applications close this Friday!",
    likes: 42,
    comments: [],
    liked: false,
    bookmarked: false,
  },
  {
    id: "post-coding-contest",
    authorName: "Coding Club Lead",
    authorRole: "Algorithms & Competitive Programming",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    timeAgo: "8 hours ago",
    category: "General",
    content: "Upcoming Weekly Speed Coding Contest #42 is going live tomorrow at 7:00 PM IST! Test your Data Structures & Algorithms speed with top leaderboard prizes.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600&h=300",
    likes: 29,
    comments: [],
    liked: false,
    bookmarked: false,
  },
  {
    id: "post-ai-workshop",
    authorName: "Dr. K. R. Raman",
    authorRole: "AI Research Faculty & Mentor",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
    timeAgo: "1 day ago",
    category: "Question",
    content: "Hands-on AI Workshop: 'Building Production LLM Agents with Next.js & Python'. Session starts on Saturday morning. What specific agent architectures would you like us to cover?",
    likes: 61,
    comments: [
      {
        id: "c-ai-1",
        authorName: "Priya S.",
        content: "Would love to see Multi-Agent Routing and Tool Calling covered!",
        timeAgo: "18h ago",
      },
    ],
    liked: false,
    bookmarked: false,
  },
];

export default function FeedSection({ user, newPostSignal }: FeedSectionProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [activeDrawerPost, setActiveDrawerPost] = useState<FeedPost | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sf_timeline_posts");
      if (stored) {
        try {
          setPosts(JSON.parse(stored));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setPosts(defaultMockPosts);
      localStorage.setItem("sf_timeline_posts", JSON.stringify(defaultMockPosts));
    }
  }, []);

  useEffect(() => {
    if (newPostSignal) {
      const created: FeedPost = {
        id: `post-${Date.now()}`,
        authorName: user.fullName,
        authorRole: "Student Developer",
        authorImage: user.profileImage || undefined,
        timeAgo: "Just now",
        category: newPostSignal.category,
        content: newPostSignal.content,
        imageUrl: newPostSignal.imageUrl,
        likes: 0,
        comments: [],
        liked: false,
        bookmarked: false,
      };
      setPosts((prev) => {
        const nextList = [created, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("sf_timeline_posts", JSON.stringify(nextList));
        }
        return nextList;
      });
    }
  }, [newPostSignal, user]);

  const savePosts = (newPostsList: FeedPost[]) => {
    setPosts(newPostsList);
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_timeline_posts", JSON.stringify(newPostsList));
    }
  };

  const handleLikeToggle = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.liked;
        return {
          ...p,
          liked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleBookmarkToggle = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextBookmarked = !p.bookmarked;
        if (nextBookmarked) toast.success("Post saved to bookmarks!");
        return { ...p, bookmarked: nextBookmarked };
      }
      return p;
    });
    savePosts(updated);
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
