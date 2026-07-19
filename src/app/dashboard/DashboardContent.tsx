"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileCard from "./components/ProfileCard";
import QuickActionsCard from "./components/QuickActionsCard";
import TrendingSkillsCard from "./components/TrendingSkillsCard";
import WelcomeCard from "./components/WelcomeCard";
import QuickStatsCards from "./components/QuickStatsCards";
import CreatePostCard, { PostCategory } from "./components/CreatePostCard";
import FeedSection from "./components/FeedSection";
import OpportunitiesSection from "./components/OpportunitiesSection";
import RecommendedCoursesSection from "./components/RecommendedCoursesSection";
import UpcomingEventsSection, { EventInfo } from "./components/UpcomingEventsSection";
import SuggestedConnectionsCard, { SuggestedUser } from "./components/SuggestedConnectionsCard";
import TrendingCommunitiesCard from "./components/TrendingCommunitiesCard";
import LeaderboardCard from "./components/LeaderboardCard";
import NotificationsCard from "./components/NotificationsCard";
import CalendarCard from "./components/CalendarCard";
import { toast } from "sonner";

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
        TRUE 3-COLUMN LINKEDIN-STYLE DASHBOARD GRID:
        grid-template-columns: 300px minmax(0, 1fr) 340px; gap: 24px; align-items: start;
      */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_340px] gap-6 items-start font-sans">
        
        {/* ========================================================
            LEFT SIDEBAR (User & Navigation Cards - Sticky)
            1. User Profile Card
            2. Quick Actions
            3. Trending Skills
           ======================================================== */}
        <aside className="w-full flex flex-col gap-6 lg:sticky lg:top-6">
          <ProfileCard user={user} />
          <QuickActionsCard />
          <TrendingSkillsCard />
        </aside>

        {/* ========================================================
            CENTER COLUMN (Social Feed ONLY)
            1. Welcome Banner
            2. Quick Statistics
            3. Create Post
            4. Timeline Feed Posts
           ======================================================== */}
        <main className="w-full flex flex-col gap-6 min-w-0">
          <WelcomeCard userName={user.fullName} />
          <QuickStatsCards />
          <CreatePostCard user={user} onPostCreated={handlePostCreated} />
          <FeedSection user={user} newPostSignal={createdPost} />
        </main>

        {/* ========================================================
            RIGHT SIDEBAR (All Supporting Widgets - Sticky)
            1. Suggested Connections
            2. Featured Opportunities
            3. Recommended Courses
            4. Upcoming Events
            5. Trending Communities
            6. Leaderboard
            7. Recent Activity (Notifications)
            8. Calendar
           ======================================================== */}
        <aside className="w-full flex flex-col gap-6 lg:sticky lg:top-6">
          <SuggestedConnectionsCard suggestedUsers={suggestedUsers} />
          <OpportunitiesSection />
          <RecommendedCoursesSection />
          <UpcomingEventsSection events={events} />
          <TrendingCommunitiesCard />
          <LeaderboardCard />
          <NotificationsCard />
          <CalendarCard />
        </aside>

      </div>
    </DashboardLayout>
  );
}
