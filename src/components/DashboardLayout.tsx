"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserPermissionsProvider } from "@/context/UserPermissionsContext";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export const Logo = () => (
  <a href="/dashboard" className="relative z-20 flex items-center gap-2 py-1">
    <span className="text-lg font-bold tracking-tight text-white select-none">Platform</span>
    <div className="h-4 w-[1px] bg-white/20"></div>
    <img
      src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
      className="h-9 w-auto object-contain"
      alt="Studentforge Logo"
    />
  </a>
);

export const LogoIcon = () => (
  <a href="/dashboard" className="relative z-20 flex items-center py-1">
    <img
      src="https://ik.imagekit.io/dypkhqxip/temp_logo.png"
      className="h-8 w-auto object-contain"
      alt="Studentforge Logo Icon"
    />
  </a>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
    avatarImage?: string | null;
    isPremium?: boolean;
    credits?: number;
    streak?: number;
  };
}

function DashboardLayoutContent({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isViewAllNotifsOpen, setIsViewAllNotifsOpen] = useState(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState(false);
  const [isCreditsPopoverOpen, setIsCreditsPopoverOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ users: any[], courses: any[], posts: any[], events: any[], resources: any[], studyPods: any[], opportunities: any[], certificates: any[], features: any[] }>({ users: [], courses: [], posts: [], events: [], resources: [], studyPods: [], opportunities: [], certificates: [], features: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  const createPostRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createPostRef.current && !createPostRef.current.contains(event.target as Node)) {
        setIsCreatePopoverOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (streakRef.current && !streakRef.current.contains(event.target as Node)) {
        setIsStreakPopoverOpen(false);
      }
      if (creditsRef.current && !creditsRef.current.contains(event.target as Node)) {
        setIsCreditsPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const PLATFORM_FEATURES = [
    { id: 'f1', title: 'Dashboard', link: '/dashboard', icon: 'dashboard', category: 'Page' },
    { id: 'f2', title: 'Networking', link: '/networking', icon: 'forum', category: 'Page' },
    { id: 'f3', title: 'Study Pods', link: '/studypod', icon: 'groups', category: 'Page' },
    { id: 'f4', title: 'Video Lectures', link: '/lectures', icon: 'ondemand_video', category: 'Page' },
    { id: 'f5', title: 'Resources', link: '/resources', icon: 'menu_book', category: 'Page' },
    { id: 'f6', title: 'Courses', link: '/courses', icon: 'school', category: 'Page' },
    { id: 'f7', title: 'Certificates', link: '/certificates', icon: 'workspace_premium', category: 'Page' },
    { id: 'f8', title: 'Opportunities', link: '/opportunities', icon: 'work', category: 'Page' },
    { id: 'f9', title: 'Events', link: '/events', icon: 'event', category: 'Page' },
    { id: 'f10', title: 'Tools', link: '/tools', icon: 'construction', category: 'Page' },
    { id: 'f11', title: 'Profile', link: '/profile', icon: 'person', category: 'Page' },
    { id: 'f12', title: 'Resume Builder', link: '/tools/resume', icon: 'description', category: 'Tool' },
  ];

  // Debounced Global Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], courses: [], posts: [], events: [], resources: [], studyPods: [], opportunities: [], certificates: [], features: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          const q = searchQuery.toLowerCase();
          const localFeatures = PLATFORM_FEATURES.filter(f => f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
          setSearchResults({ ...data, features: localFeatures });
        }
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const isNetworkingPage = typeof window !== "undefined" && window.location.pathname === "/networking";

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`/api/messages?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          const messages = data.messages || [];

          if (isNetworkingPage) {
            if (messages.length > 0) {
              const latestTime = messages[messages.length - 1].createdAt;
              localStorage.setItem("lastSeenMessageTime", latestTime);
            } else {
              localStorage.setItem("lastSeenMessageTime", new Date().toISOString());
            }
            setUnreadCount(0);
          } else {
            const lastSeen = localStorage.getItem("lastSeenMessageTime") || new Date(0).toISOString();
            const unread = messages.filter((msg: any) => {
              return (
                msg.email.trim().toLowerCase() !== user.email.trim().toLowerCase() &&
                msg.createdAt > lastSeen
              );
            });
            setUnreadCount(unread.length);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notification count:", err);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 8000);

    return () => clearInterval(interval);
  }, [user.email]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (user.email.trim().toLowerCase() === "hrstudentforge@gmail.com") {
        router.push("/sfadmin");
      } else {
        router.push("/login");
      }
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const [premium, setPremium] = useState<boolean>(user.isPremium || false);
  const [prevIsPremium, setPrevIsPremium] = useState(user.isPremium);
  if (user.isPremium !== prevIsPremium) {
    setPrevIsPremium(user.isPremium);
    setPremium(user.isPremium || false);
  }

  const isAdmin = user.email.trim().toLowerCase() === "webstrixx@gmail.com" || user.email.trim().toLowerCase() === "hrstudentforge@gmail.com";

  useEffect(() => {
    if (isAdmin) return;
    const fetchPremiumStatus = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setPremium(data.user.isPremium);
          }
        }
      } catch (err) {
        console.error("Failed to fetch premium status:", err);
      }
    };
    fetchPremiumStatus();
  }, [isAdmin]);

  const isSfAdmin = user.email.trim().toLowerCase() === "hrstudentforge@gmail.com";

  const links = isAdmin
    ? (isSfAdmin
      ? [
        {
          label: "Payments",
          href: "/sfadmin/dashboard",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              payments
            </span>
          ),
        },
        {
          label: "Events",
          href: "/sfadmin/dashboard/events",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              calendar_month
            </span>
          ),
        },
        {
          label: "Resources",
          href: "/sfadmin/dashboard/resources",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              folder_special
            </span>
          ),
        },
        {
          label: "Courses",
          href: "/sfadmin/dashboard/courses",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              local_library
            </span>
          ),
        },
        {
          label: "Certificates",
          href: "/sfadmin/dashboard/certificates",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              workspace_premium
            </span>
          ),
        },
        {
          label: "Reset Platform Data",
          href: "/admin/reset-data",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-rose-300 group-hover/sidebar:text-rose-100 transition-colors duration-150 select-none animate-pulse">
              delete_forever
            </span>
          ),
        }
      ]
      : [
        {
          label: "Learners",
          href: "/admin",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              shield_person
            </span>
          ),
        },
        {
          label: "Networking",
          href: "/networking",
          icon: (
            <div className="relative flex items-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
                forum
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
          ),
        },
        {
          label: "Study Pods",
          href: "/studypod",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
              groups
            </span>
          ),
        },
        {
          label: "Reset Platform Data",
          href: "/admin/reset-data",
          icon: (
            <span className="material-symbols-outlined shrink-0 text-[20px] text-rose-300 group-hover/sidebar:text-rose-100 transition-colors duration-150 select-none animate-pulse">
              delete_forever
            </span>
          ),
        },
      ]
    )
    : [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            team_dashboard
          </span>
        ),
      },
      {
        label: "Networking",
        href: "/networking",
        icon: (
          <div className="relative flex items-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
              forum
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
        ),
      },
      {
        label: "Study Pods",
        href: "/studypod",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            groups
          </span>
        ),
      },
      {
        label: "Learnings",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            menu_book
          </span>
        ),
        subLinks: [
          {
            label: "Courses",
            href: "/courses",
            icon: (
              <span className="material-symbols-outlined shrink-0 text-[18px]">
                school
              </span>
            ),
          },
          {
            label: "Certifications",
            href: "/certifications",
            icon: (
              <span className="material-symbols-outlined shrink-0 text-[18px]">
                workspace_premium
              </span>
            ),
          },
          {
            label: "Resources",
            href: "/resources",
            icon: (
              <span className="material-symbols-outlined shrink-0 text-[18px]">
                library_books
              </span>
            ),
          },
        ]
      },

      {
        label: "Opportunities",
        href: "/opportunities",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            work
          </span>
        ),
      },
      {
        label: "Events",
        href: "/events",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            calendar_month
          </span>
        ),
      },
    ];

  if (!isAdmin && premium) {
    links.push(
      {
        label: "Mentorship",
        href: "/mentorship",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            diversity_3
          </span>
        ),
      },
      {
        label: "Startup Hub",
        href: "/startup-hub",
        icon: (
          <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
            rocket_launch
          </span>
        ),
      }
    );
  }

  if (!isAdmin) {
    links.push({
      label: "AI Tools",
      href: "/tools",
      icon: (
        <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
          construction
        </span>
      ),
    });
  }

  links.push({
    label: "Portfolio",
    href: "/portfolio",
    icon: (
      <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
        account_box
      </span>
    ),
  });

  return (
    <UserPermissionsProvider email={user.email}>
      <div className="flex h-screen w-screen bg-slate-50 overflow-hidden md:flex-row flex-col">
        <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className={cn("flex w-full items-center transition-all duration-300", open ? "justify-start px-2" : "justify-center")}>
              {open ? <Logo /> : <LogoIcon />}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {open && !isAdmin && !premium && (
              <div
                className="mx-2 p-3 rounded-xl text-slate-950 shadow-sm border border-amber-400/80 flex flex-col gap-2 relative overflow-hidden animate-fadeIn"
                style={{ backgroundImage: "url('/gold-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/30 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-1.5 font-sans font-black text-[10px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-slate-950 font-bold">workspace_premium</span>
                  <span>Go Premium</span>
                </div>
                  <Link
                    href="/plans"
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white rounded-lg py-1.5 text-[10px] font-bold transition shadow-md hover:shadow-lg cursor-pointer text-center select-none block font-sans"
                  >
                    Upgrade Now
                  </Link>
                </div>
            )}

            <a
              href="#"
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 group/sidebar py-2 transition-all duration-150 cursor-pointer",
                open ? "justify-start px-2" : "justify-center w-full"
              )}
            >
              <span className="material-symbols-outlined shrink-0 text-[20px] text-red-300 group-hover/sidebar:text-red-100 transition-colors duration-150 select-none">
                logout
              </span>
              <motion.span
                initial={false}
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                  x: open ? 0 : -6,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-red-300 text-sm font-semibold group-hover/sidebar:text-red-100 group-hover/sidebar:translate-x-1 transition-transform duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </a>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 w-full flex-col overflow-y-auto scroll-smooth custom-scrollbar bg-slate-50 relative">
        {/* Top Header / Nav Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3 w-full">
          {/* Global Search Bar */}
          <div className="flex-1 sm:max-w-xl flex" ref={searchRef}>
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-blue-500 transition-colors pointer-events-none">
                search
              </span>
              <input 
                type="text" 
                placeholder="Search courses, users, posts..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500/30 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 shadow-sm focus:shadow"
              />
              
              {/* Search Dropdown Overlay */}
              {isSearchOpen && searchQuery.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 max-h-[70vh] overflow-y-auto z-50 flex flex-col p-2 animate-scaleIn origin-top">
                  {isSearching ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                       <span className="material-symbols-outlined animate-spin text-2xl text-blue-500">progress_activity</span>
                       <span className="text-sm font-medium">Searching...</span>
                    </div>
                  ) : (
                    <>
                      {searchResults.users?.length === 0 && searchResults.courses?.length === 0 && searchResults.posts?.length === 0 && searchResults.events?.length === 0 && searchResults.resources?.length === 0 && searchResults.studyPods?.length === 0 && searchResults.opportunities?.length === 0 && searchResults.certificates?.length === 0 && searchResults.features?.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl opacity-20">search_off</span>
                          <span className="text-sm">No results found for "{searchQuery}"</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 p-1">
                          {/* Platform Features / Tools */}
                          {searchResults.features?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">apps</span>
                                Platform Features
                              </h3>
                              {searchResults.features.map((f: any) => (
                                <Link 
                                  href={f.link} 
                                  key={f.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50">
                                    <span className="material-symbols-outlined text-[16px] text-indigo-500">{f.icon}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800">{f.title}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{f.category}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Users */}
                          {searchResults.users?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5 ${searchResults.features?.length > 0 ? "pt-2 border-t border-slate-50" : ""}`}>
                                <span className="material-symbols-outlined text-[14px]">group</span>
                                Users
                              </h3>
                              {searchResults.users.map((u: any) => (
                                <Link 
                                  href="/networking" 
                                  key={u.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  {u.profileImage ? (
                                    <img src={u.profileImage} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
                                      <span className="material-symbols-outlined text-[16px] text-slate-500">person</span>
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800">{u.fullName}</span>
                                    <span className="text-xs text-slate-500">{u.selectedRole}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Courses */}
                          {searchResults.courses?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">school</span>
                                Courses
                              </h3>
                              {searchResults.courses.map((c: any) => (
                                <Link 
                                  href={`/courses/${c.id}`} 
                                  key={c.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                                >
                                  {c.imageUrl ? (
                                    <img src={c.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50">
                                      <span className="material-symbols-outlined text-[20px] text-indigo-500">school</span>
                                    </div>
                                  )}
                                  <div className="flex flex-col flex-1">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{c.title}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{c.instructor}</span>
                                  </div>
                                  <div>
                                    {c.isEnrolled ? (
                                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">Enrolled</span>
                                    ) : (
                                      <span className="px-2 py-1 bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-[10px] font-bold rounded uppercase tracking-wider">View</span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Posts */}
                          {searchResults.posts?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">article</span>
                                Posts
                              </h3>
                              {searchResults.posts.map((p: any) => (
                                <Link 
                                  href={`/dashboard/post/${p.id}`} 
                                  key={p.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                    <span className="material-symbols-outlined text-[16px] text-blue-500">post</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                                      {p.title || p.content}
                                    </span>
                                    <span className="text-xs text-slate-500">By {p.userName} in {p.category}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Events */}
                          {searchResults.events?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">event</span>
                                Events
                              </h3>
                              {searchResults.events.map((e: any) => (
                                <Link 
                                  href="/events" 
                                  key={e.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  {e.imageUrl ? (
                                    <img src={e.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100/50">
                                      <span className="material-symbols-outlined text-[20px] text-rose-500">calendar_month</span>
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{e.title}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{e.speakerName} • {e.category}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Resources */}
                          {searchResults.resources?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                                Resources
                              </h3>
                              {searchResults.resources.map((r: any) => (
                                <a 
                                  href={r.link} 
                                  target="_blank"
                                  rel="noreferrer"
                                  key={r.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                                    <span className="material-symbols-outlined text-[20px] text-emerald-500">book</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{r.title}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{r.category}</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Study Pods */}
                          {searchResults.studyPods?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">groups</span>
                                Study Pods
                              </h3>
                              {searchResults.studyPods.map((sp: any) => (
                                <Link 
                                  href="/studypod" 
                                  key={sp.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50">
                                    <span className="material-symbols-outlined text-[20px] text-indigo-500">hub</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{sp.name}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">Created by {sp.creatorName}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Opportunities */}
                          {searchResults.opportunities?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">work</span>
                                Opportunities
                              </h3>
                              {searchResults.opportunities.map((opp: any) => (
                                <Link 
                                  href="/opportunities" 
                                  key={opp.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                                    <span className="material-symbols-outlined text-[20px] text-orange-500">work</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{opp.title}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{opp.company} • {opp.type}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Certificates */}
                          {searchResults.certificates?.length > 0 && (
                            <div className="flex flex-col">
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                                Certificates
                              </h3>
                              {searchResults.certificates.map((cert: any) => (
                                <Link 
                                  href="/certificates" 
                                  key={cert.id} 
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/50">
                                    <span className="material-symbols-outlined text-[20px] text-amber-500">workspace_premium</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{cert.title}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">Issued by {cert.issuedBy}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions / Stats */}
          <div className="flex items-center gap-2.5 sm:gap-4 ml-auto">
            {/* Create Post Button (Desktop only) */}
            <div className="relative hidden md:block" ref={createPostRef}>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-compose', { detail: { category: 'General' } }))}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm hover:shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Post
              </button>
            </div>

            {/* Chat/Messages */}
            <Link href="/networking" className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[22px]">chat_bubble_outline</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative block" ref={notifRef}>
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
                  </span>
                )}
              </button>
              
              {isNotifOpen && (
                <>
                  <div className="absolute top-full mt-3 right-0 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-0 z-50 animate-scaleIn origin-top-right overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                      <button onClick={() => { handleMarkAllAsRead(); }} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">Mark all as read</button>
                    </div>
                    
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar flex flex-col">
                      {notifications.length === 0 ? (
                         <div className="p-8 text-center text-slate-400 text-sm">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => {
                          let icon = "notifications";
                          let bgClass = "bg-slate-50 border-slate-100 text-slate-500";
                          if (notif.type === "EVENT") { icon = "event"; bgClass = "bg-blue-50 border-blue-100 text-blue-500"; }
                          else if (notif.type === "COURSE") { icon = "school"; bgClass = "bg-emerald-50 border-emerald-100 text-emerald-500"; }
                          else if (notif.type === "PREMIUM") { icon = "workspace_premium"; bgClass = "bg-amber-50 border-amber-100 text-amber-500"; }

                          return (
                            <div key={notif.id} className={`flex gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer ${notif.read ? 'opacity-70' : 'bg-slate-50/30'}`} onClick={() => setIsNotifOpen(false)}>
                              <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${bgClass}`}>
                                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                              </div>
                              <div className="flex flex-col gap-1 flex-1">
                                <p className="text-xs text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: notif.message }} />
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                      <button onClick={() => { setIsNotifOpen(false); setIsViewAllNotifsOpen(true); }} className="text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">View all notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-[1px] h-6 bg-slate-200 hidden sm:block mx-1"></div>

            {/* Streak */}
            {user.streak !== undefined && (
              <div className="relative hidden sm:block" ref={streakRef}>
                <div 
                  onClick={() => setIsStreakPopoverOpen(!isStreakPopoverOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-600 rounded-full border border-orange-200/60 shadow-sm transition-all cursor-pointer select-none" 
                  title="Daily Streak"
                >
                  <span className="material-symbols-outlined text-[18px] text-orange-500">local_fire_department</span>
                  <span className="text-sm font-bold">{user.streak}</span>
                </div>
                
                {isStreakPopoverOpen && (
                  <div className="absolute top-full mt-3 right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-4 z-50 animate-scaleIn origin-top-right">
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                      <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                      <h4 className="font-bold text-sm">Daily Streak</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your streak increases every consecutive day you log in. Keep it burning to unlock exclusive community badges and showcase your dedication!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Credits */}
            {user.credits !== undefined && (
              <div className="relative hidden sm:block" ref={creditsRef}>
                <div 
                  onClick={() => setIsCreditsPopoverOpen(!isCreditsPopoverOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-600 rounded-full border border-amber-200/60 shadow-sm transition-all cursor-pointer select-none" 
                  title="Available Credits"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-500">monetization_on</span>
                  <span className="text-sm font-bold">{user.credits}</span>
                </div>
                
                {isCreditsPopoverOpen && (
                  <div className="absolute top-full mt-3 right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-4 z-50 animate-scaleIn origin-top-right">
                    <div className="flex items-center gap-2 mb-2 text-amber-600">
                      <span className="material-symbols-outlined text-[20px]">monetization_on</span>
                      <h4 className="font-bold text-sm">Studentforge Credits</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Earn credits by participating on the platform. Use them to redeem premium platform features, unlock hidden perks, and upgrade your learning experience!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="w-[1px] h-6 bg-slate-200 hidden sm:block mx-1"></div>

            {/* Avatar Dropdown */}
            <Link href="/profile" className="flex items-center gap-2 group cursor-pointer pl-1">
              <div className="relative">
                {user.profileImage || user.avatarImage ? (
                  <img src={(user.profileImage || user.avatarImage) as string} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-indigo-100 transition-colors" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || "User")}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-indigo-100 transition-colors" />
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full p-3 sm:p-5 md:p-6">
          <div className="w-full flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* View All Notifications Modal */}
      {isViewAllNotifsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsViewAllNotifsOpen(false)}></div>
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col w-full max-w-3xl h-[80vh] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] relative z-10 animate-scaleIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">notifications</span>
                All Notifications
              </h2>
              <div className="flex items-center gap-4">
                <button onClick={handleMarkAllAsRead} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Mark all as read</button>
                <button onClick={() => setIsViewAllNotifsOpen(false)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">notifications_off</span>
                  <p>You have no notifications.</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  let icon = "notifications";
                  let bgClass = "bg-slate-50 border-slate-100 text-slate-500";
                  if (notif.type === "EVENT") { icon = "event"; bgClass = "bg-blue-50 border-blue-100 text-blue-500"; }
                  else if (notif.type === "COURSE") { icon = "school"; bgClass = "bg-emerald-50 border-emerald-100 text-emerald-500"; }
                  else if (notif.type === "PREMIUM") { icon = "workspace_premium"; bgClass = "bg-amber-50 border-amber-100 text-amber-500"; }

                  return (
                    <div key={notif.id} className={`flex gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 ${notif.read ? 'opacity-70' : 'bg-blue-50/10'}`}>
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${bgClass}`}>
                        <span className="material-symbols-outlined text-[24px]">{icon}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1 justify-center">
                        <p className="text-sm text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: notif.message }} />
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(notif.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.read && (
                        <div className="flex items-center">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </UserPermissionsProvider>
  );
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <DashboardLayoutContent user={user}>
      {children}
    </DashboardLayoutContent>
  );
}
