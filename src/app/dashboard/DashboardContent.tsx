"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileCard from "./components/ProfileCard";
import QuickActionsCard from "./components/QuickActionsCard";
import WelcomeCard from "./components/WelcomeCard";
import QuickStatsCards from "./components/QuickStatsCards";
import CreatePostCard, { PostCategory } from "./components/CreatePostCard";
import FeedSection from "./components/FeedSection";
import OpportunitiesSection from "./components/OpportunitiesSection";
import SuggestedConnectionsCard, { SuggestedUser } from "./components/SuggestedConnectionsCard";
import { toast } from "sonner";

interface EventInfo {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  speakers?: string;
  link?: string;
}

interface DashboardContentProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    selectedRole: string;
    otherRoleText: string | null;
    goals: string[];
    profileImage?: string | null;
    collegeStudying?: string | null;
    branch?: string | null;
    year?: string | null;
    linkedinLink?: string | null;
    portfolioLink?: string | null;
    about?: string | null;
    shareWithNetworking?: boolean;
  };
  events: EventInfo[];
  suggestedUsers: SuggestedUser[];
}

export default function DashboardContent({ user, events, suggestedUsers }: DashboardContentProps) {
  const [createdPost, setCreatedPost] = useState<{
    content: string;
    category: PostCategory;
    imageUrl?: string;
  } | null>(null);

  const handlePostCreated = (post: {
    content: string;
    category: PostCategory;
    imageUrl?: string;
  }) => {
    setCreatedPost(post);
    toast.success("Post published to your feed!");
  };

  return (
    <DashboardLayout user={user}>
      {/* 
        CLEAN 3-COLUMN DASHBOARD GRID:
        Left Sidebar | Center Scrollable Feed | Right Sidebar (Cleaned)
      */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_340px] gap-6 items-start font-sans">
        
        {/* LEFT SIDEBAR (Sticky) */}
        <aside className="w-full flex flex-col gap-6 lg:sticky lg:top-6">
          <ProfileCard user={user} />
          <QuickActionsCard />
        </aside>

        {/* CENTER COLUMN (Scrollable Feed) */}
        <main className="w-full flex flex-col gap-6 min-w-0">
          <WelcomeCard userName={user.fullName} />
          <QuickStatsCards />
          <CreatePostCard user={user} onPostCreated={handlePostCreated} />
          <FeedSection user={user} newPostSignal={createdPost} />
        </main>

        {/* RIGHT SIDEBAR (Cleaned Widgets - Sticky) */}
        <aside className="w-full flex flex-col gap-6 lg:sticky lg:top-6">
          <SuggestedConnectionsCard suggestedUsers={suggestedUsers} />
          <OpportunitiesSection />
        </aside>

      </div>
    </DashboardLayout>
  );
}
