"use client";

import React, { useState, useEffect } from "react";
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

const fallbackSuggested: SuggestedUser[] = [];

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
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>
  );
}

interface SuggestedConnectionsCardProps {
  suggestedUsers?: SuggestedUser[];
}

export default function SuggestedConnectionsCard({ suggestedUsers }: SuggestedConnectionsCardProps) {
  const router = useRouter();
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sf_connection_requests");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const ids = parsed.map((r: any) => r.id);
          setConnectedIds(ids);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const usersToDisplay = suggestedUsers && suggestedUsers.length > 0 ? suggestedUsers : fallbackSuggested;

  const handleConnect = (targetUser: SuggestedUser) => {
    if (!connectedIds.includes(targetUser.id)) {
      const newConnectedIds = [...connectedIds, targetUser.id];
      setConnectedIds(newConnectedIds);

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sf_connection_requests");
        const existing = stored ? JSON.parse(stored) : [];
        if (!existing.some((r: any) => r.id === targetUser.id)) {
          const newReq = {
            id: targetUser.id,
            fullName: targetUser.fullName,
            selectedRole: targetUser.selectedRole || "Student Member",
            profileImage: targetUser.profileImage || null,
            collegeStudying: targetUser.collegeStudying || "Computer Science",
            status: "PENDING",
            sentAt: new Date().toISOString(),
          };
          localStorage.setItem("sf_connection_requests", JSON.stringify([...existing, newReq]));
        }
      }

      toast.success(`Connection invitation sent to ${targetUser.fullName.split(" ")[0]}! View in Networking.`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3.5 transition-all duration-200 hover:shadow-md select-none">
      {/* Header Row */}
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
              People you may know & collaborate with
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/networking")}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition cursor-pointer"
        >
          <span>View All</span>
          <IconChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggested Users List */}
      <div className="flex flex-col gap-2">
        {usersToDisplay.length > 0 ? (
          usersToDisplay.map((userItem, index) => {
            const isConnected = connectedIds.includes(userItem.id);
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

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleConnect(userItem)}
                  disabled={isConnected}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition duration-150 shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs ${
                    isConnected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 active:scale-95"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sent</span>
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
            <p className="text-xs text-slate-500 font-medium">No other registered members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
