"use client";

import React, { useState } from "react";
import { IconUsers, IconCheck, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface Community {
  name: string;
  members: string;
  badgeKey: string;
}

const communities: Community[] = [
  { name: "Web Development", members: "3.4k members", badgeKey: "WebDev" },
  { name: "Artificial Intelligence", members: "4.2k members", badgeKey: "AI" },
  { name: "Cyber Security", members: "1.8k members", badgeKey: "Cyber" },
  { name: "UI/UX", members: "2.1k members", badgeKey: "Design" },
  { name: "Placement Preparation", members: "5.6k members", badgeKey: "Placement" },
];

export default function TrendingCommunitiesCard() {
  const [joinedKeys, setJoinedKeys] = useState<string[]>(["WebDev", "AI"]);

  const toggleJoin = (badgeKey: string, name: string) => {
    if (joinedKeys.includes(badgeKey)) {
      setJoinedKeys(joinedKeys.filter((k) => k !== badgeKey));
      toast.info(`Left ${name} community`);
    } else {
      setJoinedKeys([...joinedKeys, badgeKey]);
      toast.success(`Joined ${name} community!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 pl-1">
        <IconUsers className="w-4 h-4 text-blue-600" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Trending Communities
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {communities.map((comm) => {
          const isJoined = joinedKeys.includes(comm.badgeKey);

          return (
            <div key={comm.name} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {comm.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {comm.members}
                </span>
              </div>

              <button
                onClick={() => toggleJoin(comm.badgeKey, comm.name)}
                className={`text-[11px] font-bold px-3 py-1 rounded-xl border transition duration-150 shrink-0 cursor-pointer flex items-center gap-1 ${
                  isJoined
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200"
                }`}
              >
                {isJoined ? (
                  <>
                    <IconCheck className="w-3.5 h-3.5" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Join</span>
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
