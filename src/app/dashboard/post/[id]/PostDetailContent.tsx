"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PostHeader from "@/components/feed/PostHeader";
import PostBody from "@/components/feed/PostBody";
import PostGallery from "@/components/feed/PostGallery";
import ReactionBar from "@/components/feed/ReactionBar";
import CommentList from "@/components/feed/CommentList";
import RelatedPosts from "@/components/feed/RelatedPosts";
import PostSidebar from "@/components/feed/PostSidebar";
import { FeedPost } from "@/components/feed/types";

interface PostDetailContentProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    selectedRole: string;
    profileImage?: string | null;
  };
  post: FeedPost;
}

export default function PostDetailContent({ user, post }: PostDetailContentProps) {
  const currentUserObj = {
    id: user.id,
    name: user.fullName,
    image: user.profileImage || null,
  };

  return (
    <DashboardLayout user={user}>
      {/* 2-Column Clean Layout for Post Details Page */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start font-sans">
        
        {/* ========================================================
            CENTER MAIN POST DETAILS COLUMN
            Contains Back to Feed Header, Author Card, Post Content,
            Media Lightbox, Reaction Bar, Comments & Related Posts
           ======================================================== */}
        <main className="w-full flex flex-col gap-5 min-w-0">
          {/* Header with Back Button & Breadcrumb */}
          <PostHeader
            author={post.author}
            createdAt={post.createdAt}
            visibility={post.visibility}
          />

          {/* Post Body & Formatting */}
          <PostBody
            title={post.title}
            content={post.content}
            tags={post.tags}
            projectUrl={post.projectUrl}
            codeSnippet={post.codeSnippet}
          />

          {/* Media Attachments & Gallery Lightbox */}
          <PostGallery media={post.media} />

          {/* Reactions & Engagement Stats Bar */}
          <ReactionBar
            postId={post.id}
            reactions={post.reactions}
            initialReaction={post.userReaction}
            commentsCount={post.comments.length}
            sharesCount={post.sharesCount}
            bookmarksCount={post.bookmarksCount}
            viewsCount={post.viewsCount}
            bookmarked={post.bookmarked}
          />

          {/* Threaded Comment List & Editor */}
          <CommentList comments={post.comments} currentUser={currentUserObj} />

          {/* Bottom Related Posts Section */}
          <RelatedPosts currentPostId={post.id} authorName={post.author.name} />
        </main>

        {/* ========================================================
            RIGHT STICKY SIDEBAR (Author Profile, Tags, Communities)
           ======================================================== */}
        <PostSidebar author={post.author} />

      </div>
    </DashboardLayout>
  );
}
