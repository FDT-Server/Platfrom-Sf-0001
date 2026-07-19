"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useChat, ChatMessage, UserCompact } from "@/context/ChatContext";
import {
  IconSend,
  IconMoodSmile,
  IconPaperclip,
  IconChevronLeft,
  IconMinus,
  IconX,
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconArchive,
  IconSettings,
  IconInbox,
  IconMessageCircle,
  IconPhoto,
  IconCornerDownLeft,
  IconTrash,
  IconUserPlus,
  IconExternalLink,
  IconCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ChatDrawer() {
  const {
    isOpen,
    isMinimized,
    activeChatUserId,
    openChat,
    closeChat,
    toggleChat,
    openChatTabs,
    closeChatTab,
    setMinimized,
    messages,
    allUsers,
    currentUser,
    sendMessage,
    reactToMessage,
    deleteMessage,
    replyingToMessage,
    setReplyingToMessage,
    unreadCount,
    connections,
    onlineUserIds,
    activeProfilePreview,
    setActiveProfilePreview,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionMenuId, setShowReactionMenuId] = useState<string | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "archive" | "requests">("chats");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Emojis list
  const emojiList = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉", "🔥", "🚀", "💻"];

  // Typing indicator simulation when changing active chat user
  useEffect(() => {
    if (activeChatUserId) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeChatUserId]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages.length, activeChatUserId, isOpen, isMinimized]);

  // Group messages into conversation list
  const conversationList = useMemo(() => {
    if (!currentUser) return [];

    const convosMap: { [key: string]: { lastMessage: ChatMessage; unreadCount: number } } = {};

    messages.forEach((msg) => {
      // General chatroom
      if (msg.recipientId === null) {
        const currentGeneral = convosMap["general"];
        if (!currentGeneral || new Date(msg.createdAt) > new Date(currentGeneral.lastMessage.createdAt)) {
          convosMap["general"] = { lastMessage: msg, unreadCount: 0 };
        }
        return;
      }

      // Private chat
      const isSentByMe = msg.userId === currentUser.id;
      const contactId = isSentByMe ? msg.recipientId! : msg.userId;

      let isUnread = false;
      if (!isSentByMe) {
        let seenMap: any = msg.seenBy || {};
        if (typeof seenMap === "string") {
          try {
            seenMap = JSON.parse(seenMap);
          } catch {
            seenMap = {};
          }
        }
        isUnread = !seenMap[currentUser.id];
      }

      const existing = convosMap[contactId];
      const unreadCountDiff = isUnread ? 1 : 0;

      if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
        convosMap[contactId] = {
          lastMessage: msg,
          unreadCount: (existing?.unreadCount || 0) + unreadCountDiff,
        };
      } else if (isUnread) {
        convosMap[contactId].unreadCount += 1;
      }
    });

    connections.forEach((userId) => {
      if (!convosMap[userId]) {
        const targetUser = allUsers.find((u) => u.id === userId);
        if (targetUser) {
          convosMap[userId] = {
            lastMessage: {
              id: `placeholder-${userId}`,
              content: "Start a conversation!",
              userId: userId,
              fullName: targetUser.fullName,
              email: targetUser.email,
              role: targetUser.selectedRole,
              recipientId: currentUser.id,
              createdAt: new Date(0).toISOString(),
            },
            unreadCount: 0,
          };
        }
      }
    });

    if (!convosMap["general"]) {
      convosMap["general"] = {
        lastMessage: {
          id: "placeholder-general",
          content: "Welcome to Student Forge General Chatroom!",
          userId: "system",
          fullName: "System",
          email: "",
          role: "System",
          recipientId: null,
          createdAt: new Date(0).toISOString(),
        },
        unreadCount: 0,
      };
    }

    return Object.entries(convosMap)
      .map(([id, data]) => {
        const isGeneral = id === "general";
        const contact = isGeneral ? null : allUsers.find((u) => u.id === id);
        return {
          id,
          contact,
          isGeneral,
          lastMessage: data.lastMessage,
          unreadCount: data.unreadCount,
        };
      })
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  }, [messages, allUsers, currentUser, connections]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversationList.filter((c) => {
      const query = searchTerm.toLowerCase();
      if (c.isGeneral) {
        return "general chatroom".includes(query);
      }
      return c.contact?.fullName.toLowerCase().includes(query) || c.contact?.selectedRole.toLowerCase().includes(query);
    });
  }, [conversationList, searchTerm]);

  // Messages in active chat
  const activeChatMessages = useMemo(() => {
    if (activeChatUserId === undefined) return [];

    if (activeChatUserId === null) {
      return messages.filter((m) => m.recipientId === null);
    }

    return messages.filter(
      (m) =>
        (m.userId === currentUser?.id && m.recipientId === activeChatUserId) ||
        (m.userId === activeChatUserId && m.recipientId === currentUser?.id)
    );
  }, [messages, activeChatUserId, currentUser]);

  const activeContact = useMemo(() => {
    if (!activeChatUserId) return null;
    return allUsers.find((u) => u.id === activeChatUserId) || null;
  }, [allUsers, activeChatUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let textToSend = inputText.trim();

    if (replyingToMessage) {
      textToSend = `Replying to ${replyingToMessage.fullName}:\n> ${replyingToMessage.content.slice(0, 60)}...\n\n${textToSend}`;
    }

    setInputText("");
    setShowEmojiPicker(false);

    if (activeChatUserId) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    }

    await sendMessage(textToSend);
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleAttachmentClick = () => {
    attachmentInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputText((prev) => prev + ` [Attachment: ${file.name}] `);
      toast.info(`Attached: ${file.name}`);
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

  // 1. FLOATING MESSENGER BUBBLE (Rendered when closed or minimized)
  if (!isOpen || isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] select-none font-sans">
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-white cursor-pointer group"
          title="Open Student Forge Messenger"
        >
          <IconMessageCircle className="w-7 h-7 group-hover:rotate-6 transition-transform duration-200" />
          
          {/* Online status green dot */}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
          
          {/* Unread badge counter */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md animate-bounce border border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  // 2. MAIN FLOATING MESSENGER PANEL & USER PROFILE DRAWER
  return (
    <>
      <div className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] md:w-[680px] h-[600px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col z-[9999] font-sans animate-fadeIn">
        
        {/* MESSENGER TOP HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <IconMessageCircle className="w-5 h-5" />
            <h3 className="text-sm font-extrabold tracking-tight">Messages</h3>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMinimized(true)}
              className="hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer text-white/90"
              title="Minimize"
            >
              <IconMinus className="w-4 h-4" />
            </button>
            <button
              onClick={closeChat}
              className="hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer text-white/90"
              title="Close"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MULTI-CHAT TABS BAR */}
        {openChatTabs.length > 0 && (
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none shrink-0">
            {openChatTabs.map((tabId) => {
              const isGeneral = tabId === null;
              const tabUser = isGeneral ? null : allUsers.find((u) => u.id === tabId);
              const tabName = isGeneral
                ? "📢 General"
                : tabUser?.fullName
                ? tabUser.fullName.split(" ")[0]
                : "Chat";
              const isActive = activeChatUserId === tabId;

              return (
                <div
                  key={tabId || "general"}
                  onClick={() => openChat(tabId)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition duration-150 cursor-pointer shrink-0 border ${
                    isActive
                      ? "bg-white text-blue-600 border-slate-200 shadow-2xs"
                      : "bg-slate-200/60 hover:bg-white/70 text-slate-600 border-transparent"
                  }`}
                >
                  <span>{tabName}</span>
                  {tabId !== null && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeChatTab(tabId);
                      }}
                      className="hover:text-rose-600 rounded-full p-0.5 transition cursor-pointer"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MESSENGER BODY (Split view on Desktop) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* CONVERSATION LIST PANE */}
          <div className={`w-full md:w-[260px] border-r border-slate-200/80 bg-slate-50 flex flex-col shrink-0 ${
            activeChatUserId !== undefined ? "hidden md:flex" : "flex"
          }`}>
            {/* Search Input */}
            <div className="p-3 border-b border-slate-200/70 bg-white">
              <div className="relative flex items-center">
                <IconSearch className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {filteredConversations.map((convo) => {
                const isOnline = convo.contact ? onlineUserIds.includes(convo.contact.id) : false;
                const isActive = activeChatUserId === (convo.isGeneral ? null : convo.id);

                return (
                  <button
                    key={convo.id}
                    onClick={() => openChat(convo.isGeneral ? null : convo.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition duration-150 text-left cursor-pointer border ${
                      isActive
                        ? "bg-blue-50/80 border-blue-200 text-blue-900"
                        : convo.unreadCount > 0
                        ? "bg-blue-50/40 border-blue-100 font-bold"
                        : "bg-white hover:bg-slate-100/70 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {convo.isGeneral ? (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                            📢
                          </div>
                        ) : convo.contact?.profileImage ? (
                          <img
                            src={convo.contact.profileImage}
                            alt={convo.contact.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {getInitials(convo.contact?.fullName || "System")}
                          </div>
                        )}
                        {isOnline && !convo.isGeneral && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {convo.isGeneral ? "General Chatroom" : convo.contact?.fullName}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                          {convo.lastMessage.content}
                        </p>
                      </div>
                    </div>

                    {convo.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                        {convo.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CHAT WINDOW */}
          <div className={`flex-1 flex flex-col bg-white min-w-0 ${
            activeChatUserId === undefined ? "hidden md:flex items-center justify-center p-6 text-center text-slate-400" : "flex"
          }`}>
            {activeChatUserId === undefined ? (
              <div className="flex flex-col items-center gap-2 select-none">
                <IconInbox className="w-12 h-12 text-slate-300 stroke-1" />
                <h4 className="text-xs font-bold text-slate-600">Select a student conversation to begin messaging</h4>
              </div>
            ) : (
              <>
                {/* Active Chat Header */}
                <div className="p-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => openChat(undefined)}
                      className="md:hidden text-slate-500 p-1 hover:bg-slate-200 rounded-lg"
                    >
                      <IconChevronLeft className="w-4 h-4" />
                    </button>

                    {activeChatUserId === null ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                        📢
                      </div>
                    ) : activeContact?.profileImage ? (
                      <img
                        src={activeContact.profileImage}
                        alt={activeContact.fullName}
                        onClick={() => setActiveProfilePreview(activeContact)}
                        className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0 cursor-pointer hover:opacity-90"
                      />
                    ) : (
                      <div
                        onClick={() => activeContact && setActiveProfilePreview(activeContact)}
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 cursor-pointer"
                      >
                        {getInitials(activeContact?.fullName || "Chat")}
                      </div>
                    )}

                    <div className="min-w-0 cursor-pointer" onClick={() => activeContact && setActiveProfilePreview(activeContact)}>
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                        {activeChatUserId === null ? "General Chatroom" : activeContact?.fullName}
                      </h4>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {activeChatUserId === null ? "Live Student Network" : "Online now"}
                      </p>
                    </div>
                  </div>

                  {activeContact && (
                    <button
                      onClick={() => setActiveProfilePreview(activeContact)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-150 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                    >
                      Profile
                    </button>
                  )}
                </div>

                {/* Messages Scroll Area */}
                <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/30">
                  <div className="text-center my-2 select-none">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      Today &middot; Encrypted Student Chat
                    </span>
                  </div>

                  {activeChatMessages.map((msg) => {
                    const isMe = currentUser && msg.userId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] ${
                          isMe ? "self-end" : "self-start"
                        }`}
                      >
                        {!isMe && (
                          <span className="text-[10px] font-bold text-slate-500 mb-0.5 pl-1">
                            {msg.fullName}
                          </span>
                        )}
                        <div
                          className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {isMe && " · Seen"}
                        </span>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="self-start bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400">typing</span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex flex-col gap-2 shrink-0">
                  {showEmojiPicker && (
                    <div className="flex gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-1 flex-wrap select-none animate-fadeIn">
                      {emojiList.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => handleEmojiClick(e)}
                          className="hover:scale-125 transition text-sm p-1 cursor-pointer"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}

                  <input
                    ref={attachmentInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <IconMoodSmile className="w-4.5 h-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleAttachmentClick}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <IconPaperclip className="w-4.5 h-4.5" />
                    </button>

                    <input
                      type="text"
                      placeholder="Type a message... (Press Enter to send)"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 text-xs bg-slate-100 border border-slate-200/80 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl p-2 transition cursor-pointer shrink-0 shadow-2xs"
                    >
                      <IconSend className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>

      </div>

      {/* 3. USER PROFILE SLIDE-OVER DRAWER */}
      {activeProfilePreview && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-[10000] p-5 flex flex-col justify-between overflow-y-auto font-sans animate-fadeIn select-none">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Student Profile</span>
              <button
                onClick={() => setActiveProfilePreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              {activeProfilePreview.profileImage ? (
                <img
                  src={activeProfilePreview.profileImage}
                  alt={activeProfilePreview.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-2xl border-4 border-blue-50 shadow-md">
                  {getInitials(activeProfilePreview.fullName)}
                </div>
              )}
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">{activeProfilePreview.fullName}</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeProfilePreview.selectedRole}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs">
              {activeProfilePreview.collegeStudying && (
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="text-slate-400 font-bold uppercase text-[10px] w-16">College:</span>
                  <span className="truncate">{activeProfilePreview.collegeStudying}</span>
                </div>
              )}
              {activeProfilePreview.branch && (
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="text-slate-400 font-bold uppercase text-[10px] w-16">Branch:</span>
                  <span>{activeProfilePreview.branch}</span>
                </div>
              )}
              {activeProfilePreview.year && (
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="text-slate-400 font-bold uppercase text-[10px] w-16">Year:</span>
                  <span>{activeProfilePreview.year} Year</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              {activeProfilePreview.linkedinLink && (
                <a
                  href={activeProfilePreview.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-bold text-blue-600 bg-blue-50 border border-blue-150 p-2 rounded-xl hover:bg-blue-100 transition"
                >
                  <span>LinkedIn Profile</span>
                  <IconExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {activeProfilePreview.portfolioLink && (
                <a
                  href={activeProfilePreview.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 p-2 rounded-xl hover:bg-indigo-100 transition"
                >
                  <span>Portfolio Website</span>
                  <IconExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                openChat(activeProfilePreview.id);
                setActiveProfilePreview(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <IconMessageCircle className="w-4 h-4" />
              <span>Open Chat</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
