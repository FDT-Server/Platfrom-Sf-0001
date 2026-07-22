"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconSend,
  IconBrandTelegram,
  IconUsers,
  IconLock,
  IconMessage,
  IconMessageCircle,
  IconX,
  IconUserPlus,
  IconUserCheck,
  IconClock,
  IconCheck,
  IconSearch,
  IconBuilding,
  IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface UserCompact {
  id: string;
  fullName: string;
  email: string;
  selectedRole: string;
  profileImage: string | null;
  collegeStudying?: string | null;
  branch?: string | null;
  year?: string | null;
  dob?: string | null;
  portfolioLink?: string | null;
  linkedinLink?: string | null;
  about?: string | null;
  shareWithNetworking?: boolean;
}

interface ConnectionRequestItem {
  id: string;
  fullName: string;
  selectedRole: string;
  profileImage: string | null;
  collegeStudying?: string | null;
  status: "PENDING" | "ACCEPTED";
  sentAt?: string;
  incoming?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  recipientId: string | null;
  reactions?: any;
  seenBy?: any;
  createdAt: string;
}

interface NetworkingContentProps {
  user: UserCompact;
  allUsers: UserCompact[];
}

const bubbleColors = [
  { bg: "#4f46e5", text: "#ffffff" },
  { bg: "#059669", text: "#ffffff" },
  { bg: "#db2777", text: "#ffffff" },
  { bg: "#e11d48", text: "#ffffff" },
  { bg: "#0284c7", text: "#ffffff" },
  { bg: "#0891b2", text: "#ffffff" },
  { bg: "#f97316", text: "#ffffff" },
  { bg: "#0d9488", text: "#ffffff" },
  { bg: "#7c3aed", text: "#ffffff" },
];

const fallbackPortraits: string[] = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=600",
];

function getMemberImage(id: string, customImage?: string | null): string {
  if (customImage && customImage.trim() !== "") {
    return customImage;
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackPortraits.length;
  return fallbackPortraits[index];
}

const initialDefaultRequests: ConnectionRequestItem[] = [];

interface MemberCardProps {
  id: string;
  fullName: string;
  handle: string;
  role: string;
  college?: string | null;
  statusText?: string;
  image: string;
  actionType: "add" | "accept" | "message" | "pending";
  onAction: () => void;
  onDecline?: () => void;
}

function MemberCard({
  fullName,
  handle,
  role,
  college,
  statusText,
  image,
  actionType,
  onAction,
  onDecline,
}: MemberCardProps) {
  return (
    <div className="bg-white rounded-[22px] border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-2 flex flex-col justify-between transition-all duration-200 select-none group w-full max-w-[230px] shrink-0">
      {/* Top Image Hero - No separate container */}
      <div className="relative w-full h-44 rounded-[16px] overflow-hidden bg-slate-100 shadow-2xs group">
        {/* Full Card Hero Image */}
        <img
          src={image}
          alt={fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Compact Glassmorphism Name & Status Badge directly on top of image */}
        <div className="absolute top-2 inset-x-2 backdrop-blur-md bg-white/70 border border-white/60 shadow-xs rounded-lg px-2 py-1.5 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-semibold text-slate-900 leading-tight truncate w-full tracking-tight">
            {fullName}
          </h3>
          <div className="flex items-center justify-center gap-1 text-[9px] font-medium text-slate-600 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span className="truncate">{statusText || role || "Connecting"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="flex items-center justify-between gap-1.5 pt-2 pb-0.5 px-1">
        {/* Left: Thumbnail avatar + @handle & subtitle */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={image}
              alt={fullName}
              className="w-6 h-6 rounded-full object-cover border border-white shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
          </div>

          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-semibold text-[#111111] truncate">@{handle}</span>
            <span className="text-[8px] font-medium text-slate-400 truncate">
              {college || "12m ago"}
            </span>
          </div>
        </div>

        {/* Right: Action Button */}
        {actionType === "add" && (
          <button
            onClick={onAction}
            className="bg-[#1c1c1c] hover:bg-black text-white font-medium text-[9px] rounded-lg px-2.5 py-1 flex items-center gap-0.5 shadow-2xs transition active:scale-95 cursor-pointer border-0 shrink-0"
          >
            <IconPlus className="w-3 h-3" />
            <span>Add</span>
          </button>
        )}

        {actionType === "accept" && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onAction}
              className="bg-[#1c1c1c] hover:bg-black text-white font-medium text-[9px] rounded-lg px-2 py-1 flex items-center gap-0.5 shadow-2xs transition active:scale-95 cursor-pointer border-0"
            >
              <IconCheck className="w-3 h-3" />
              <span>Accept</span>
            </button>
            {onDecline && (
              <button
                onClick={onDecline}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[9px] rounded-lg p-1 transition cursor-pointer border-0"
              >
                <IconX className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {actionType === "message" && (
          <button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[9px] rounded-lg px-2.5 py-1 flex items-center gap-0.5 shadow-2xs transition active:scale-95 cursor-pointer border-0 shrink-0"
          >
            <IconMessageCircle className="w-3 h-3" />
            <span>Message</span>
          </button>
        )}

        {actionType === "pending" && (
          <button
            disabled
            className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[9px] rounded-lg px-2 py-1 flex items-center gap-0.5 cursor-default shrink-0"
          >
            <IconClock className="w-3 h-3" />
            <span>Pending</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function NetworkingContent({ user, allUsers }: NetworkingContentProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "friends" | "requests" | "discover">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [requests, setRequests] = useState<ConnectionRequestItem[]>(initialDefaultRequests);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sf_connection_requests");
      if (stored) {
        try {
          const parsed: ConnectionRequestItem[] = JSON.parse(stored);
          setRequests((prev) => {
            const combined = [...prev];
            parsed.forEach((item) => {
              if (!combined.some((c) => c.id === item.id)) {
                combined.unshift(item);
              }
            });
            return combined;
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveRequests = (updatedList: ConnectionRequestItem[]) => {
    setRequests(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_connection_requests", JSON.stringify(updatedList));
    }
  };

  const handleAcceptRequest = (reqId: string, name: string) => {
    const updated = requests.map((r) => (r.id === reqId ? { ...r, status: "ACCEPTED" as const } : r));
    saveRequests(updated);
    toast.success(`You and ${name} are now connected friends!`);
  };

  const handleDeclineRequest = (reqId: string) => {
    const updated = requests.filter((r) => r.id !== reqId);
    saveRequests(updated);
    toast.info("Connection request declined.");
  };

  const handleConnectDiscover = (targetUser: UserCompact) => {
    if (!requests.some((r) => r.id === targetUser.id)) {
      const newReq: ConnectionRequestItem = {
        id: targetUser.id,
        fullName: targetUser.fullName,
        selectedRole: targetUser.selectedRole || "Student Member",
        profileImage: targetUser.profileImage || null,
        collegeStudying: targetUser.collegeStudying || "Computer Science",
        status: "PENDING",
        sentAt: "Just now",
        incoming: false,
      };
      const updated = [newReq, ...requests];
      saveRequests(updated);
      toast.success(`Connection request sent to ${targetUser.fullName}!`);
    }
  };

  const getUserColor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bubbleColors.length;
    return bubbleColors[index];
  };

  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/messages?activeChatUserId=${activeChatUserId || "null"}&t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeChatUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeChatUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessageText.trim(),
          recipientId: activeChatUserId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessageText("");
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "SF";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const directoryUsers = allUsers.filter((u) => u.id !== user.id);
  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const acceptedFriends = requests.filter((r) => r.status === "ACCEPTED");

  const filteredDiscoverUsers = directoryUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      (u.selectedRole && u.selectedRole.toLowerCase().includes(q)) ||
      (u.collegeStudying && u.collegeStudying.toLowerCase().includes(q))
    );
  });

  const activeUserObj = allUsers.find((u) => u.id === activeChatUserId);
  const isAdminEmail = (email: string) => email.trim().toLowerCase() === "webstrixx@gmail.com";

  return (
    <DashboardLayout user={user}>
      <div className="flex h-[88vh] lg:h-[92vh] w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fadeIn select-none">
        {/* Navigation Tab Header Bar */}
        <div className="bg-white text-slate-900 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <IconUsers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-snug tracking-wide">
                Developer Network & Community Hub
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Connect with peers, manage invitations & chat in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "chat"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <IconMessageCircle className="w-3.5 h-3.5" />
              <span>Chat Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <IconClock className="w-3.5 h-3.5" />
              <span>Pending Requests</span>
              {pendingRequests.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "friends"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <IconUserCheck className="w-3.5 h-3.5" />
              <span>My Connections</span>
              <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {acceptedFriends.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "discover"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <IconUserPlus className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>
          </div>
        </div>

        {/* Main Content Area Based on Active Tab */}
        <div className="flex-1 flex overflow-hidden bg-slate-50/40">
          {/* TAB 1: CHAT HUB */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden w-full">
              {/* Conversations Sidebar */}
              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60 flex flex-col shrink-0 max-h-[35%] lg:max-h-full">
                <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconMessageCircle className="w-4 h-4 text-blue-600" />
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                      Conversations
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                    {allUsers.length} Members
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  <button
                    onClick={() => setActiveChatUserId(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left cursor-pointer ${
                      activeChatUserId === null
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm font-semibold"
                        : "bg-white border-slate-200/80 hover:border-blue-200 text-slate-700"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        activeChatUserId === null ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <IconMessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">Public Chat Hub</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          activeChatUserId === null ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        Everyone in academy
                      </p>
                    </div>
                  </button>

                  <div className="py-1.5 flex items-center gap-2">
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Direct Messages
                    </span>
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                  </div>

                  {directoryUsers.map((u) => {
                    const isSelected = activeChatUserId === u.id;
                    const isUserAdmin = isAdminEmail(u.email);
                    const userColor = getUserColor(u.id);

                    return (
                      <button
                        key={u.id}
                        onClick={() => setActiveChatUserId(u.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm font-semibold"
                            : "bg-white border-slate-200/80 hover:border-blue-200 text-slate-700"
                        }`}
                      >
                        <div className="relative shrink-0">
                          {u.profileImage ? (
                            <img
                              src={u.profileImage}
                              alt={u.fullName}
                              className="w-9 h-9 rounded-xl object-cover"
                            />
                          ) : (
                            <div
                              style={isSelected ? {} : { backgroundColor: userColor.bg, color: userColor.text }}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                                isSelected ? "bg-white/20 text-white" : ""
                              }`}
                            >
                              {getInitials(u.fullName)}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{u.fullName}</p>
                          <span
                            className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${
                              isSelected
                                ? "bg-white/25 text-white"
                                : isUserAdmin
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {isUserAdmin ? "Admin" : u.selectedRole}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat View Panel */}
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                <div
                  onClick={() => {
                    if (activeChatUserId !== null) {
                      setShowProfilePanel(true);
                    }
                  }}
                  className={`p-3.5 border-b border-slate-200 flex items-center justify-between bg-white z-10 shrink-0 ${
                    activeChatUserId !== null ? "hover:bg-slate-50 cursor-pointer transition" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {activeChatUserId === null ? (
                      <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <IconBrandTelegram className="w-5 h-5" />
                      </span>
                    ) : activeUserObj?.profileImage ? (
                      <img
                        src={activeUserObj.profileImage}
                        alt={activeUserObj.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor: getUserColor(activeChatUserId).bg,
                          color: getUserColor(activeChatUserId).text,
                        }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs"
                      >
                        {getInitials(activeUserObj?.fullName || "")}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                        {activeChatUserId === null ? (
                          "Public Chat Hub"
                        ) : (
                          <>
                            {activeUserObj?.fullName}
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <IconLock className="w-3 h-3 shrink-0" /> Private Chat
                            </span>
                          </>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {activeChatUserId === null
                          ? "Share ideas and project queries with all trainees"
                          : "Click to view member profile & training details"}
                      </p>
                    </div>
                  </div>

                  {activeChatUserId !== null && (
                    <button className="text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer border border-blue-100">
                      View Profile
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30 space-y-3.5">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <div className="w-7 h-7 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-xs text-slate-400 font-semibold">Loading conversation...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => {
                      const isCurrentUser = msg.userId === user.id;
                      const senderColor = getUserColor(msg.userId);

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 max-w-[85%] md:max-w-[70%] ${
                            isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          <div className="shrink-0">
                            {msg.userId === user.id && user.profileImage ? (
                              <img
                                src={user.profileImage}
                                className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs"
                                alt={msg.fullName}
                              />
                            ) : (
                              <div
                                style={{ backgroundColor: senderColor.bg, color: senderColor.text }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs"
                              >
                                {getInitials(msg.fullName)}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div
                              className={`flex items-center gap-1.5 text-[10px] ${
                                isCurrentUser ? "justify-end text-slate-500" : "text-slate-600"
                              }`}
                            >
                              <span className="font-bold text-slate-800">{msg.fullName}</span>
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {msg.role}
                              </span>
                            </div>

                            <div
                              style={{ backgroundColor: senderColor.bg, color: senderColor.text }}
                              className={`rounded-2xl px-4 py-2.5 shadow-2xs text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                                isCurrentUser ? "rounded-tr-none" : "rounded-tl-none"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-2">
                        <IconMessage className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-700">No messages in this chat yet</h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                        Type a message below to start the conversation!
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
                  {error && (
                    <div className="mb-2 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-150 p-2 rounded-lg">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder={
                        activeChatUserId === null
                          ? "Type a message to share with everyone..."
                          : `Send private message to ${activeUserObj?.fullName}...`
                      }
                      maxLength={500}
                      required
                      className="flex-1 px-4 py-2.5 border border-slate-200 focus:border-blue-600 focus:outline-none rounded-xl text-slate-800 text-xs transition placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!newMessageText.trim() || sending}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shadow-xs shrink-0"
                    >
                      <IconSend className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PENDING REQUESTS */}
          {activeTab === "requests" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Pending Connection Requests
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Review and accept invitations sent by trainees to connect as friends
                  </p>
                </div>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs px-3 py-1 rounded-full">
                  {pendingRequests.length} Pending
                </span>
              </div>

              {pendingRequests.length > 0 ? (
                <div className="flex flex-wrap items-start justify-start gap-4 w-full">
                  {pendingRequests.map((req) => {
                    const imgUrl = getMemberImage(req.id, req.profileImage);
                    const handle = req.fullName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);

                    return (
                      <MemberCard
                        key={req.id}
                        id={req.id}
                        fullName={req.fullName}
                        handle={handle}
                        role={req.selectedRole}
                        college={req.collegeStudying || "12m ago"}
                        statusText="Connecting"
                        image={imgUrl}
                        actionType="accept"
                        onAction={() => handleAcceptRequest(req.id, req.fullName)}
                        onDecline={() => handleDeclineRequest(req.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-3">
                    <IconClock className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No pending invitations</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    When other members send you connection requests, they will appear here for your approval.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRIENDS / MY CONNECTIONS */}
          {activeTab === "friends" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    My Connected Friends
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Your accepted network connections & study partners
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs px-3 py-1 rounded-full">
                  {acceptedFriends.length} Connected Friends
                </span>
              </div>

              {acceptedFriends.length > 0 ? (
                <div className="flex flex-wrap items-start justify-start gap-4 w-full">
                  {acceptedFriends.map((friend) => {
                    const imgUrl = getMemberImage(friend.id, friend.profileImage);
                    const handle = friend.fullName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);

                    return (
                      <MemberCard
                        key={friend.id}
                        id={friend.id}
                        fullName={friend.fullName}
                        handle={handle}
                        role={friend.selectedRole}
                        college={friend.collegeStudying || "Computer Science"}
                        statusText="Connected Friend"
                        image={imgUrl}
                        actionType="message"
                        onAction={() => {
                          setActiveChatUserId(friend.id);
                          setActiveTab("chat");
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3">
                    <IconUserCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No connected friends yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Accept pending requests or discover new members to build your network!
                  </p>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="mt-4 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-2xl hover:bg-blue-700 transition cursor-pointer"
                  >
                    Discover Members
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DISCOVER MEMBERS */}
          {activeTab === "discover" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Discover Academy Members
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Explore developers, engineers, and mentors in Student Forge
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or role..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-start justify-start gap-4 w-full">
                {filteredDiscoverUsers.map((u) => {
                  const reqStatus = requests.find((r) => r.id === u.id)?.status;
                  const imgUrl = getMemberImage(u.id, u.profileImage);
                  const handle = u.fullName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);

                  const actionType =
                    reqStatus === "ACCEPTED" ? "message" : reqStatus === "PENDING" ? "pending" : "add";

                  return (
                    <MemberCard
                      key={u.id}
                      id={u.id}
                      fullName={u.fullName}
                      handle={handle}
                      role={u.selectedRole || "Student Developer"}
                      college={u.collegeStudying || "Computer Science"}
                      statusText="Connecting"
                      image={imgUrl}
                      actionType={actionType}
                      onAction={() => {
                        if (actionType === "message") {
                          setActiveChatUserId(u.id);
                          setActiveTab("chat");
                        } else if (actionType === "add") {
                          handleConnectDiscover(u);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
