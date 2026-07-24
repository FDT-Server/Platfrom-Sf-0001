"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconClock, IconUser, IconCopy, IconSparkles, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

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
  const [timeStr, setTimeStr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SF";

  return (

    <div className="w-full bg-blue-600 rounded-[28px] p-1.5 shadow-sm transition-all duration-200 hover:shadow-md select-none">

      <div className="bg-[#22252e] text-white rounded-[22px] p-5 flex flex-col gap-4">

        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="truncate max-w-[170px]">
            {user.selectedRole || "Student Developer"}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <IconClock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr || "7:23PM"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-700 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 border border-slate-700 shadow-xs">
              {initials}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-semibold text-white leading-snug truncate">
              {user.fullName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">Available for work</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link
            href="/profile"
            className="bg-[#323644] hover:bg-[#3c4152] text-white py-3 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <IconUser className="w-4 h-4 text-slate-300" />
            <span>View Profile</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="bg-[#323644] hover:bg-[#3c4152] text-white py-3 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copied ? (
              <IconCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <IconCopy className="w-4 h-4 text-slate-300" />
            )}
            <span>{copied ? "Copied" : "Copy Email"}</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-600 text-white py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold">
        <IconSparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span className="truncate">
          {user.collegeStudying ? user.collegeStudying : "Currently High on Creativity"}
        </span>
      </div>
    </div>
  );
}
