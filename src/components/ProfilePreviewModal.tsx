"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import {
  IconX,
  IconMessage,
  IconUserPlus,
  IconUserCheck,
  IconSchool,
  IconLocation,
  IconBrandLinkedin,
  IconLink,
  IconHourglass,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export default function ProfilePreviewModal() {
  const {
    activeProfilePreview,
    setActiveProfilePreview,
    connections,
    sentRequests,
    sendConnectRequest,
    removeConnection,
    openChat,
  } = useChat();

  if (!activeProfilePreview) return null;

  const user = activeProfilePreview;
  const isConnected = connections.includes(user.id);
  const isPending = sentRequests.includes(user.id);

  const handleMessage = () => {
    openChat(user.id);
    setActiveProfilePreview(null);
  };

  const handleConnect = () => {
    if (isConnected) {
      if (confirm(`Are you sure you want to remove connection with ${user.fullName}?`)) {
        removeConnection(user.id);
      }
    } else if (!isPending) {
      sendConnectRequest(user.id);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
          onClick={() => setActiveProfilePreview(null)}
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-y-auto"
        >
          {/* Header Cover Banner */}
          <div className="h-36 w-full relative bg-gradient-to-r from-blue-600 to-indigo-700">
            <button
              onClick={() => setActiveProfilePreview(null)}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition z-10"
            >
              <IconX className="w-5 h-5" />
            </button>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Profile Picture Overlay */}
          <div className="px-6 -mt-12 relative flex items-end justify-between">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-md">
                {getInitials(user.fullName)}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleMessage}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg p-2.5 transition flex items-center gap-1.5 text-sm font-semibold shadow-xs"
              >
                <IconMessage className="w-4 h-4" />
                Message
              </button>

              <button
                onClick={handleConnect}
                className={`rounded-lg px-4 py-2.5 transition flex items-center gap-1.5 text-sm font-bold shadow-xs border cursor-pointer ${isConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : isPending
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                  }`}
              >
                {isConnected ? (
                  <>
                    <IconUserCheck className="w-4 h-4" />
                    Connected
                  </>
                ) : isPending ? (
                  <>
                    <IconHourglass className="w-4 h-4 animate-spin" />
                    Requested
                  </>
                ) : (
                  <>
                    <IconUserPlus className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user.fullName}</h2>
              <span className="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-150 uppercase tracking-wide">
                {user.selectedRole}
              </span>

              {/* College Information */}
              {(user.collegeStudying || user.branch) && (
                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                  {user.collegeStudying && (
                    <div className="flex items-center gap-2">
                      <IconSchool className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{user.collegeStudying}</span>
                    </div>
                  )}
                  {(user.branch || user.year) && (
                    <div className="flex items-center gap-2 pl-6.5 text-xs text-slate-500">
                      <span>{user.branch}</span>
                      {user.branch && user.year && <span>·</span>}
                      <span>{user.year ? `${user.year} Year` : ""}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About / Summary */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {user.about || `${user.fullName} is a student on Student Forge, pursuing skills in web development and career preparedness.`}
              </p>
            </div>

            {/* Links and Portfolio */}
            {(user.linkedinLink || user.portfolioLink) && (
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Links</h3>
                <div className="flex flex-col gap-2.5">
                  {user.linkedinLink && (
                    <a
                      href={user.linkedinLink.startsWith("http") ? user.linkedinLink : `https://${user.linkedinLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline hover:text-blue-800 w-fit"
                    >
                      <IconBrandLinkedin className="w-5 h-5 text-slate-400" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {user.portfolioLink && (
                    <a
                      href={user.portfolioLink.startsWith("http") ? user.portfolioLink : `https://${user.portfolioLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline hover:text-blue-800 w-fit"
                    >
                      <IconLink className="w-5 h-5 text-slate-400" />
                      <span>Portfolio Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick Skills Stats */}
            <div className="border-t border-slate-100 pt-5 mt-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Profile Completion</h3>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between">
                <div className="text-xs text-slate-600 max-w-[200px]">
                  Connecting with this student helps expand your professional network on Student Forge.
                </div>
                <div className="flex items-center justify-center font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full h-12 w-12 text-sm shadow-xs shrink-0 select-none">
                  {Math.min(
                    100,
                    (user.fullName ? 20 : 0) +
                    (user.collegeStudying ? 20 : 0) +
                    (user.branch ? 15 : 0) +
                    (user.year ? 15 : 0) +
                    (user.about ? 15 : 0) +
                    (user.profileImage ? 15 : 0)
                  )}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
