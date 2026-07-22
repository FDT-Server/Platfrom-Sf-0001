"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export interface UserCompact {
  id: string;
  fullName: string;
  email: string;
  selectedRole: string;
  profileImage: string | null;
  collegeStudying?: string | null;
  branch?: string | null;
  year?: string | null;
  portfolioLink?: string | null;
  linkedinLink?: string | null;
  about?: string | null;
  shareWithNetworking?: boolean;
}

export interface ChatMessage {
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

interface ChatContextType {
  isOpen: boolean;
  isMinimized: boolean;
  activeChatUserId: string | null | undefined;
  openChat: (userId: string | null | undefined) => void;
  closeChat: () => void;
  toggleChat: () => void;
  openChatTabs: (string | null)[];
  closeChatTab: (userId: string | null) => void;
  setMinimized: (minimized: boolean) => void;
  messages: ChatMessage[];
  allUsers: UserCompact[];
  currentUser: UserCompact | null;
  loading: boolean;
  sending: boolean;
  sendMessage: (content: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  deleteMessage: (messageId: string, forEveryone: boolean) => Promise<void>;
  replyingToMessage: ChatMessage | null;
  setReplyingToMessage: (msg: ChatMessage | null) => void;
  unreadCount: number;
  connections: string[];
  sentRequests: string[];
  sendConnectRequest: (userId: string) => void;
  removeConnection: (userId: string) => void;
  activeProfilePreview: UserCompact | null;
  setActiveProfilePreview: (user: UserCompact | null) => void;
  onlineUserIds: string[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null | undefined>(undefined);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allUsers, setAllUsers] = useState<UserCompact[]>([]);
  const [currentUser, setCurrentUser] = useState<UserCompact | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);

  const [connections, setConnections] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [activeProfilePreview, setActiveProfilePreview] = useState<UserCompact | null>(null);

  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevMessagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConnections = localStorage.getItem("sf_connections");
      const storedRequests = localStorage.getItem("sf_sent_requests");

      if (storedConnections) setConnections(JSON.parse(storedConnections));
      if (storedRequests) setSentRequests(JSON.parse(storedRequests));

      const lastActive = localStorage.getItem("sf_last_active_chat");
      if (lastActive) {
        setActiveChatUserId(lastActive === "general" ? null : lastActive);
      }

      notificationAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav");
      notificationAudioRef.current.volume = 0.4;
    }
  }, []);

  const fetchUsers = async () => {
    try {

      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.success && profData.user) {
          setCurrentUser(profData.user);
        }
      }

      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success && usersData.users) {
          setAllUsers(usersData.users);

          const onlineIds = usersData.users
            .filter((u: any, idx: number) => idx % 3 === 0)
            .map((u: any) => u.id);
          setOnlineUserIds(onlineIds);
        }
      }
    } catch (err) {
      console.error("Error fetching chat users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (!currentUser) return;
    try {

      const queryParam = activeChatUserId ? activeChatUserId : "null";
      const res = await fetch(`/api/messages?activeChatUserId=${queryParam}&t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const newMsgs: ChatMessage[] = data.messages || [];

        // Play sound and show toast notification for new private messages
        if (prevMessagesRef.current.length > 0 && newMsgs.length > prevMessagesRef.current.length) {
          const addedMsgs = newMsgs.filter(
            (nm) => !prevMessagesRef.current.some((pm) => pm.id === nm.id)
          );

          addedMsgs.forEach((msg) => {
            // Is it a private message to me, and from someone else?
            const isPrivateToMe = msg.recipientId === currentUser.id;
            const isNotFromMe = msg.userId !== currentUser.id;

            if (isPrivateToMe && isNotFromMe) {
              // If the chat drawer is closed or minimizing or active chat is with someone else
              const isNotActiveChat = activeChatUserId !== msg.userId || !isOpen || isMinimized;

              if (isNotActiveChat) {
                // Play audio notification
                if (notificationAudioRef.current) {
                  notificationAudioRef.current.play().catch(() => {});
                }

                // Show standard notification toast
                toast.info(`New message from ${msg.fullName}`, {
                  description: msg.content.length > 60 ? `${msg.content.substring(0, 60)}...` : msg.content,
                  action: {
                    label: "Reply",
                    onClick: () => {
                      setIsOpen(true);
                      setIsMinimized(false);
                      setActiveChatUserId(msg.userId);
                    },
                  },
                });
              }
            }
          });
        }

        setMessages(newMsgs);
        prevMessagesRef.current = newMsgs;
      }
    } catch (err) {
      console.error("Error fetching messages in context:", err);
    }
  }, [currentUser, activeChatUserId, isOpen, isMinimized]);

  // Set up message polling
  useEffect(() => {
    if (!currentUser) return;
    fetchMessages(true);

    const interval = setInterval(() => {
      fetchMessages(false);
    }, 1500);

    return () => clearInterval(interval);
  }, [currentUser, fetchMessages]);

  const [openChatTabs, setOpenChatTabs] = useState<(string | null)[]>([null]);

  const openChat = (userId: string | null | undefined) => {
    setIsOpen(true);
    setIsMinimized(false);
    setActiveChatUserId(userId);

    if (userId !== undefined && !openChatTabs.includes(userId)) {
      setOpenChatTabs((prev) => [...prev, userId]);
    }

    if (typeof window !== "undefined") {
      if (userId === undefined) {
        localStorage.removeItem("sf_last_active_chat");
      } else {
        localStorage.setItem("sf_last_active_chat", userId || "general");
      }
    }
  };

  const closeChatTab = (userId: string | null) => {
    const nextTabs = openChatTabs.filter((id) => id !== userId);
    setOpenChatTabs(nextTabs);
    if (activeChatUserId === userId) {
      if (nextTabs.length > 0) {
        setActiveChatUserId(nextTabs[nextTabs.length - 1]);
      } else {
        setActiveChatUserId(undefined);
      }
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const setMinimized = (minimized: boolean) => {
    setIsMinimized(minimized);
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentUser || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          recipientId: activeChatUserId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setReplyingToMessage(null);

        // If chatting with a mock user (who is not the admin and not actually another real online user),
        // we can simulate an automatic friendly reply after a short delay!
        if (activeChatUserId && activeChatUserId !== "webstrixx" && activeChatUserId !== "hrstudentforge") {
          const recipientUser = allUsers.find(u => u.id === activeChatUserId);
          if (recipientUser) {
            // Trigger simulated typing and auto reply in 2.5 seconds
            setTimeout(async () => {
              // Check if we are still chatting with the same user
              const simulatedReplies = [
                `Hey! That sounds awesome. Let's study together sometime.`,
                `Thanks for reaching out! I'm currently working on a Next.js project. What are you building?`,
                `Hey there! Yes, I saw that event too, I'll definitely be attending.`,
                `Let's connect and share resume tips. Have you used the Student Forge Resume Builder?`,
                `That's a great question. Let's discuss it in our study pod.`,
              ];
              const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

              try {
                await fetch("/api/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },

                });

                const mockMsg: ChatMessage = {
                  id: Math.random().toString(),
                  content: randomReply,
                  userId: recipientUser.id,
                  fullName: recipientUser.fullName,
                  email: recipientUser.email,
                  role: recipientUser.selectedRole,
                  recipientId: currentUser.id,
                  createdAt: new Date().toISOString(),
                  seenBy: {}
                };

                setMessages(prev => [...prev, mockMsg]);

                if (notificationAudioRef.current) {
                  notificationAudioRef.current.play().catch(() => {});
                }
              } catch (e) {
                console.error("Simulation error:", e);
              }
            }, 2500);
          }
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const reactToMessage = async (messageId: string, emoji: string) => {
    if (!currentUser) return;
    try {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;

      let currentReactions = msg.reactions || {};
      if (typeof currentReactions === "string") {
        try {
          currentReactions = JSON.parse(currentReactions);
        } catch {
          currentReactions = {};
        }
      }

      const existingReaction = currentReactions[currentUser.id];
      const targetEmoji = existingReaction?.emoji === emoji ? null : emoji;

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const updatedReactions = { ...currentReactions };
            if (!targetEmoji) {
              delete updatedReactions[currentUser.id];
            } else {
              updatedReactions[currentUser.id] = { emoji: targetEmoji, fullName: currentUser.fullName };
            }
            return { ...m, reactions: updatedReactions };
          }
          return m;
        })
      );

      const res = await fetch(`/api/messages/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji: targetEmoji }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? data.message : m))
        );
      }
    } catch (err) {
      console.error("React message error:", err);
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string, forEveryone: boolean) => {
    try {
      // Remove locally first
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      if (forEveryone) {
        const res = await fetch(`/api/messages/${messageId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete message on backend");
        }
      }
    } catch (err) {
      console.error("Delete message error:", err);
      // Re-fetch in case of failure
      fetchMessages();
    }
  };

  // Compute overall unread messages count
  const unreadCount = currentUser
    ? messages.filter((msg) => {
        // Must be a private message sent to me
        const isToMe = msg.recipientId === currentUser.id;
        const isNotFromMe = msg.userId !== currentUser.id;
        if (!isToMe || !isNotFromMe) return false;

        let seenMap: any = msg.seenBy || {};
        if (typeof seenMap === "string") {
          try {
            seenMap = JSON.parse(seenMap);
          } catch {
            seenMap = {};
          }
        }
        return !seenMap[currentUser.id];
      }).length
    : 0;

  // Send connection request
  const sendConnectRequest = (userId: string) => {
    if (sentRequests.includes(userId) || connections.includes(userId)) return;

    const updatedRequests = [...sentRequests, userId];
    setSentRequests(updatedRequests);
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_sent_requests", JSON.stringify(updatedRequests));
    }

    const targetedUser = allUsers.find((u) => u.id === userId);
    toast.success(`Connection request sent to ${targetedUser?.fullName || "Student"}!`);

    // Simulate auto-accept connection request in 4 seconds for UX flow!
    setTimeout(() => {
      const currentSent = JSON.parse(localStorage.getItem("sf_sent_requests") || "[]");
      if (currentSent.includes(userId)) {
        // Remove from pending requests
        const filteredRequests = currentSent.filter((id: string) => id !== userId);
        setSentRequests(filteredRequests);
        localStorage.setItem("sf_sent_requests", JSON.stringify(filteredRequests));

        // Add to connections
        const currentConnections = JSON.parse(localStorage.getItem("sf_connections") || "[]");
        const updatedConnections = [...currentConnections, userId];
        setConnections(updatedConnections);
        localStorage.setItem("sf_connections", JSON.stringify(updatedConnections));

        toast.success(`${targetedUser?.fullName || "Student"} accepted your connection request! You can now message them.`);
      }
    }, 4000);
  };

  // Remove connection
  const removeConnection = (userId: string) => {
    const updatedConnections = connections.filter((id) => id !== userId);
    const updatedRequests = sentRequests.filter((id) => id !== userId);

    setConnections(updatedConnections);
    setSentRequests(updatedRequests);

    if (typeof window !== "undefined") {
      localStorage.setItem("sf_connections", JSON.stringify(updatedConnections));
      localStorage.setItem("sf_sent_requests", JSON.stringify(updatedRequests));
    }
    toast.info("Connection removed");
  };

  return (
    <ChatContext.Provider
      value={{
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
        loading,
        sending,
        sendMessage,
        reactToMessage,
        deleteMessage,
        replyingToMessage,
        setReplyingToMessage,
        unreadCount,
        connections,
        sentRequests,
        sendConnectRequest,
        removeConnection,
        activeProfilePreview,
        setActiveProfilePreview,
        onlineUserIds,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
