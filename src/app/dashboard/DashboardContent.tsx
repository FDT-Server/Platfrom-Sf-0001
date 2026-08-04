"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import WelcomeCard from "./components/WelcomeCard";
import QuickStatsCards from "./components/QuickStatsCards";
import CreatePostCard, { PostCategory } from "./components/CreatePostCard";
import FeedSection from "./components/FeedSection";
import OpportunitiesSection from "./components/OpportunitiesSection";
import SuggestedConnectionsCard, { SuggestedUser } from "./components/SuggestedConnectionsCard";
import { toast } from "sonner";

import { EventInfo } from "./components/UpcomingEventsSection";

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
    credits: number;
    streak: number;
    isPremium?: boolean;
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

  const [currentCredits, setCurrentCredits] = useState(user.credits || 0);
  const [currentStreak, setCurrentStreak] = useState(user.streak || 0);

  useEffect(() => {
    const claimDailyCredits = async () => {
      try {
        const res = await fetch("/api/credits/daily", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (data.creditsAdded > 0) {
            toast.success(`Welcome back! You earned +${data.creditsAdded} daily credits! 🔥 Streak: ${data.newStreak}`);
            setCurrentCredits(prev => prev + data.creditsAdded);
            setCurrentStreak(data.newStreak);
          } else if (data.newStreak > currentStreak) {
            setCurrentStreak(data.newStreak);
          }
        }
      } catch (err) {
        console.error("Failed to claim daily credits", err);
      }
    };
    claimDailyCredits();
  }, []);

  const handlePostCreated = (post: {
    content: string;
    category: PostCategory;
    imageUrl?: string;
  }) => {
    setCreatedPost(post);
    toast.success("Post published to your feed!");
  };

  const layoutUser = { ...user, credits: currentCredits, streak: currentStreak };

  return (
    <DashboardLayout user={layoutUser}>
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 font-sans -mt-1 sm:-mt-2 md:-mt-3">
        
        {/* Main Center Content */}
        <main className="w-full flex flex-col gap-6 min-w-0 relative pb-10 min-h-[calc(100vh-120px)]">
          {/* Welcome Banner */}
          <WelcomeCard 
            userName={layoutUser.fullName} 
            credits={layoutUser.credits} 
            streak={layoutUser.streak} 
            profileImage={layoutUser.profileImage} 
          />

          {/* Feed takes the maximum space now */}
          <FeedSection user={layoutUser} newPostSignal={createdPost} />

          {/* Hidden CreatePostCard to listen for global navbar events */}
          <div className="hidden">
            <CreatePostCard 
              user={layoutUser} 
              onPostCreated={handlePostCreated} 
            />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-full flex flex-col gap-6 lg:sticky lg:top-24 h-max">
          <SuggestedConnectionsCard
            suggestedUsers={suggestedUsers}
            currentUserId={layoutUser.id}
          />
          <OpportunitiesSection />
        </aside>

      </div>
    </DashboardLayout>
  );
}
