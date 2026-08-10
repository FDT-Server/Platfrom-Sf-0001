"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconUserPlus, IconUsers, IconChevronRight, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

export interface SuggestedUser {
  id: string;
  fullName: string;
  email?: string;
  selectedRole: string;
  profileImage?: string | null;
  collegeStudying?: string | null;
}

const avatarGradients = [
  "from-blue-600 to-indigo-600 text-white",
  "from-indigo-600 to-purple-600 text-white",
  "from-sky-500 to-blue-600 text-white",
  "from-emerald-500 to-teal-600 text-white",
  "from-violet-600 to-indigo-700 text-white",
];

function UserAvatarItem({
  src,
  name,
  gradientClass,
}: {
  src?: string | null;
  name: string;
  gradientClass: string;
}) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  if (src && !imgError) {
    return (
      <div className="relative shrink-0">
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="w-10 h-10 rounded-full object-cover border border-slate-200/80 bg-slate-50 shadow-2xs group-hover:scale-105 transition duration-200"
        />
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} font-bold text-xs flex items-center justify-center border border-white/20 shadow-2xs group-hover:scale-105 transition duration-200`}
      >
        {initials}
      </div>
    </div>
  );
}

interface SuggestedConnectionsCardProps {
  suggestedUsers?: SuggestedUser[];
  currentUserId?: string;
}

export default function SuggestedConnectionsCard({
  suggestedUsers,
  currentUserId,
}: SuggestedConnectionsCardProps) {
  const router = useRouter();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<SuggestedUser[]>(
    (suggestedUsers || []).filter((u) => !currentUserId || u.id !== currentUserId)
  );
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/users?suggestions=1&t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        // API already excludes self, friends, and pending
        setUsersList(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch suggested connections:", err);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
    const interval = setInterval(fetchSuggestions, 8000);
    return () => clearInterval(interval);
  }, [fetchSuggestions]);

  const usersToDisplay = usersList.slice(0, 3);

  const handleConnect = async (targetUser: SuggestedUser) => {
    if (pendingIds.includes(targetUser.id) || sendingId) return;
    setSendingId(targetUser.id);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", toUserId: targetUser.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not send request");
        return;
      }

      if (data.status === "ACCEPTED") {
        toast.success(data.message || `Connected with ${targetUser.fullName}`);
      } else {
        toast.success(
          `Connection request sent to ${targetUser.fullName.split(" ")[0]}! They will see it in Pending Requests.`
        );
        setPendingIds((prev) => [...prev, targetUser.id]);
      }
      // Remove from suggestions immediately (friends + pending excluded)
      setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
    } catch {
      toast.error("Network error sending request");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-md select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <IconUsers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 leading-tight tracking-wide">
              Suggested Connections
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              People you may know — friends are hidden
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/networking?tab=discover")}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition cursor-pointer"
        >
          <span>View All</span>
          <IconChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {usersToDisplay.length > 0 ? (
          usersToDisplay.map((userItem, index) => {
            const isPending = pendingIds.includes(userItem.id);
            const gradientClass = avatarGradients[index % avatarGradients.length];

            return (
              <div
                key={userItem.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition duration-150 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UserAvatarItem
                    src={userItem.profileImage}
                    name={userItem.fullName}
                    gradientClass={gradientClass}
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition">
                      {userItem.fullName}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {userItem.selectedRole || "Student Member"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnect(userItem)}
                  disabled={isPending || sendingId === userItem.id}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition duration-150 shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs ${
                    isPending
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 active:scale-95"
                  }`}
                >
                  {isPending || sendingId === userItem.id ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sendingId === userItem.id ? "..." : "Sent"}</span>
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
          })
        ) : (
          <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              No new people to suggest. Your friends and pending requests are hidden here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
