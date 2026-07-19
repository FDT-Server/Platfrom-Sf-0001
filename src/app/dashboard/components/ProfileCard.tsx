"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { IconSchool, IconBriefcase, IconUserCheck } from "@tabler/icons-react";

interface ProfileCardProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    selectedRole: string;
    otherRoleText?: string | null;
    profileImage?: string | null;
    collegeStudying?: string | null;
    branch?: string | null;
    year?: string | null;
    about?: string | null;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (user.fullName) score += 20;
    if (user.collegeStudying) score += 20;
    if (user.branch) score += 15;
    if (user.year) score += 15;
    if (user.about) score += 15;
    if (user.profileImage) score += 15;
    return score;
  }, [user]);

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center pb-5 relative transition-all duration-200 hover:shadow-md">
      {/* Banner */}
      <div className="h-20 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Profile Avatar */}
      <div className="-mt-10 relative group">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white text-blue-700 flex items-center justify-center font-black text-xl shadow-md">
            {initials}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="mt-3 text-center px-4 w-full">
        <h3 className="text-base font-bold text-slate-800 leading-tight truncate">{user.fullName}</h3>
        
        {/* Preferred Track / Selected Role */}
        <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-150 px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
          {user.selectedRole || "Student Developer"}
        </span>

        {/* Academic Details */}
        <div className="mt-3 flex flex-col items-center gap-1 text-xs text-slate-600 font-medium">
          {user.collegeStudying ? (
            <p className="flex items-center gap-1.5 text-slate-700 font-semibold truncate w-full justify-center" title={user.collegeStudying}>
              <IconSchool className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">{user.collegeStudying}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 italic">College not specified</p>
          )}

          {(user.branch || user.year) && (
            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <IconBriefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {user.branch ? user.branch : "General"} {user.year ? `· Year ${user.year}` : ""}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 w-full my-4" />

      {/* Profile Completion Dial */}
      <div className="flex flex-col items-center px-4 w-full select-none">
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700 mb-1.5">
          <span className="flex items-center gap-1">
            <IconUserCheck className="w-3.5 h-3.5 text-blue-600" />
            Profile Strength
          </span>
          <span className="text-blue-600 font-black">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-medium mt-1.5 text-center">
          {profileCompletion < 100
            ? "Complete profile to boost networking views!"
            : "Awesome! Profile is fully complete!"}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4 px-4 w-full justify-center">
        <Link
          href="/profile"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-center text-xs font-bold transition shadow-xs"
        >
          View Profile
        </Link>
        <Link
          href="/profile"
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2 text-center text-xs font-bold transition shadow-xs border border-slate-200"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
