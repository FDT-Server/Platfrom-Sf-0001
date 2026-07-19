"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconUserPlus, IconCheck, IconClock, IconUsers } from "@tabler/icons-react";
import { toast } from "sonner";

export interface SuggestedUser {
  id: string;
  fullName: string;
  email?: string;
  selectedRole: string;
  profileImage?: string | null;
}

interface SuggestedConnectionsCardProps {
  suggestedUsers: SuggestedUser[];
}

const fallbackSuggested: SuggestedUser[] = [
  {
    id: "user-1",
    fullName: "Rohan Gupta",
    selectedRole: "Web Development Specialist",
    profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "user-2",
    fullName: "Priya Sharma",
    selectedRole: "UI/UX Designer",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "user-3",
    fullName: "Amit Patel",
    selectedRole: "Software Engineering",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

export default function SuggestedConnectionsCard({ suggestedUsers }: SuggestedConnectionsCardProps) {
  const router = useRouter();
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const usersToDisplay = suggestedUsers && suggestedUsers.length > 0 ? suggestedUsers : fallbackSuggested;

  const handleConnect = (userId: string, name: string) => {
    if (!pendingIds.includes(userId)) {
      setPendingIds([...pendingIds, userId]);
      toast.success(`Connection request sent to ${name.split(" ")[0]}!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pl-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Suggested Connections
        </span>
        <button
          onClick={() => router.push("/networking")}
          className="text-[11px] font-bold text-blue-600 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {usersToDisplay.map((userItem) => {
          const isPending = pendingIds.includes(userItem.id);
          const initials = userItem.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={userItem.id} className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {userItem.profileImage ? (
                  <img
                    src={userItem.profileImage}
                    alt={userItem.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {userItem.fullName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {userItem.selectedRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleConnect(userItem.id, userItem.fullName)}
                disabled={isPending}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition duration-150 shrink-0 cursor-pointer flex items-center gap-1 ${
                  isPending
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-xs"
                }`}
              >
                {isPending ? (
                  <>
                    <IconClock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </>
                ) : (
                  <>
                    <IconUserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
