"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import SuggestedConnectionsCard from "@/app/dashboard/components/SuggestedConnectionsCard";
import { toast } from "sonner";
import {
  IconEdit,
  IconExternalLink,
  IconLoader,
  IconLogout,
  IconBookmark,
  IconMessageCircle,
  IconBrandLinkedin,
  IconMail,
  IconDots,
  IconPhoto,
  IconVideo,
  IconHeart,
  IconShare,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  selectedRole: string;
  otherRoleText: string;
  goals: string[];
  profileImage: string;
  collegeStudying: string;
  branch: string;
  year: string;
  dob: string;
  portfolioLink: string;
  linkedinLink: string;
  about: string;
  shareWithNetworking: boolean;
  isPremium: boolean;
}

interface ProfileStats {
  postsCount: number;
  coursesCount: number;
  networkSize: number;
  projectsCount: number;
}

interface ProfileContentProps {
  user: UserProfile;
  stats: ProfileStats;
}

type ProfileTab =
  | "timeline"
  | "info"
  | "connections"
  | "saved"
  | "groups"
  | "forums";

interface FeedPost {
  id: string;
  content: string;
  category?: string;
  imageUrl?: string | null;
  userId: string;
  userName?: string;
  userImage?: string | null;
  likesCount?: number;
  sharesCount?: number;
  comments?: unknown;
  bookmarkedUserIds?: string[];
  createdAt: string;
}

const BANNER_URL =
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "timeline", label: "Timeline / Posts Feed" },
  { id: "info", label: "Profile Information" },
  { id: "connections", label: "Connections" },
  { id: "saved", label: "Saved Posts" },
  { id: "groups", label: "Groups" },
  { id: "forums", label: "Forums" },
];

const PLATFORM_UPDATES = [
  { date: "Jul 2, 2023", text: "Platform networking and messaging upgrades rolled out." },
  { date: "Jun 18, 2023", text: "Study Pods collaboration tools expanded for teams." },
  { date: "May 9, 2023", text: "New course enrollment and certificate workflows live." },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function ProfileContent({ user, stats }: ProfileContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ProfileTab>("timeline");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [savedPosts, setSavedPosts] = useState<FeedPost[]>([]);
  const [ownPosts, setOwnPosts] = useState<FeedPost[]>([]);
  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [connectionItems, setConnectionItems] = useState<
    { id: string; fullName: string; selectedRole: string; profileImage: string | null }[]
  >([]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const tagline = useMemo(() => {
    const role = user.selectedRole || "Aspiring Developer";
    const college = user.collegeStudying?.trim();
    return college ? `${role} | Student at ${college}` : role;
  }, [user.selectedRole, user.collegeStudying]);

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch(`/api/posts?t=${Date.now()}`);
        if (!res.ok) return;
        const allPosts = await res.json();
        if (!Array.isArray(allPosts)) return;

        let localBookmarks: string[] = [];
        try {
          localBookmarks = JSON.parse(localStorage.getItem("sf_saved_posts") || "[]");
        } catch {
          localBookmarks = [];
        }

        const mine = allPosts.filter((p: FeedPost) => p.userId === user.id);
        setOwnPosts(mine);

        const filtered = allPosts.filter((p: FeedPost) => {
          const bArr = Array.isArray(p.bookmarkedUserIds) ? p.bookmarkedUserIds : [];
          return (user?.id && bArr.includes(user.id)) || localBookmarks.includes(p.id);
        });
        setSavedPosts(filtered);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };

    loadPosts();
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const accepted: string[] = JSON.parse(localStorage.getItem("sf_connections") || "[]");
      const requests = JSON.parse(localStorage.getItem("sf_connection_requests") || "[]");
      const acceptedFromRequests = Array.isArray(requests)
        ? requests.filter((r: any) => r.status === "ACCEPTED")
        : [];
      const mergedIds = Array.from(
        new Set([
          ...accepted,
          ...acceptedFromRequests.map((r: any) => r.id).filter(Boolean),
        ])
      );
      setConnectionsCount(mergedIds.length || stats.networkSize);
      setConnectionItems(
        acceptedFromRequests.map((r: any) => ({
          id: r.id,
          fullName: r.fullName || "Connection",
          selectedRole: r.selectedRole || "Student Member",
          profileImage: r.profileImage || null,
        }))
      );
    } catch {
      setConnectionsCount(stats.networkSize);
    }
  }, [stats.networkSize]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 2MB");
      return;
    }
    setErrorMessage("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setIsEditing(false);
      toast.success("Profile updated");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setErrorMessage("");
    setIsEditing(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: composerText.trim(),
          category: "General",
        }),
      });
      if (!res.ok) {
        toast.error("Failed to publish post.");
        return;
      }
      const newPost = await res.json();
      setOwnPosts((prev) => [newPost, ...prev]);
      setComposerText("");
      toast.success("Post published!");
    } catch (err) {
      console.error(err);
      toast.error("Could not publish post.");
    } finally {
      setPosting(false);
    }
  };

  const displayPostsCount = Math.max(stats.postsCount, ownPosts.length);

  return (
    <DashboardLayout user={user}>
      <div className="w-full max-w-6xl mx-auto pb-8 animate-fadeIn">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-10 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Edit Your Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-blue-100 mb-4">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-blue-600">
                      {getInitials(formData.fullName)}
                    </span>
                  )}
                </div>
                <label className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  Max size: 2MB. Supports PNG, JPG, or GIF.
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">About Me</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College Studying
                    </label>
                    <input
                      type="text"
                      value={formData.collegeStudying}
                      onChange={(e) =>
                        setFormData({ ...formData, collegeStudying: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                      placeholder="e.g. IIIT Hyderabad"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Branch</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Year of Study
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioLink}
                      onChange={(e) =>
                        setFormData({ ...formData, portfolioLink: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                      placeholder="https://myportfolio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinLink}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedinLink: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shareWithNetworking}
                      onChange={(e) =>
                        setFormData({ ...formData, shareWithNetworking: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">
                        Share your details with networking
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Allow other trainees to view your college, year, DOB, portfolio, and
                        LinkedIn in the directory.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <IconLoader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* HERO */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
              <div className="relative h-40 md:h-48 w-full bg-slate-200">
                <img
                  src={BANNER_URL}
                  alt="Campus banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <a
                    href={`mailto:${user.email}`}
                    className="w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600"
                    title="Email"
                  >
                    <IconMail className="w-4 h-4" />
                  </a>
                  {user.linkedinLink ? (
                    <a
                      href={user.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600"
                      title="LinkedIn"
                    >
                      <IconBrandLinkedin className="w-4 h-4" />
                    </a>
                  ) : null}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMoreMenu((v) => !v)}
                      className="w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                      title="More"
                    >
                      <IconDots className="w-4 h-4" />
                    </button>
                    {showMoreMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <IconLogout className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative px-4 md:px-6 pb-5">
                <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-14">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100 flex items-center justify-center shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-extrabold text-blue-600">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-2 md:pt-0 md:pb-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                        {user.fullName}
                      </h1>
                      <svg
                        className="w-5 h-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.16-.43.25-.9.25-1.4 0-2.13-1.73-3.86-3.86-3.86-.5 0-.97.1-1.4.25-.67-1.3-1.91-2.19-3.34-2.19s-2.67.89-3.34 2.19c-.43-.15-.9-.25-1.4-.25C4.83 3.4 3.1 5.13 3.1 7.26c0 .5.1.97.25 1.4C2.04 9.33 1.15 10.57 1.15 12c0 1.43.89 2.67 2.2 3.34-.15.43-.25.9-.25 1.4 0 2.13 1.73 3.86 3.86 3.86.5 0 .97-.1 1.4-.25.67 1.3 1.91 2.19 3.34 2.19s2.67-.89 3.34-2.19c.43.15.9.25 1.4.25 2.13 0 3.86-1.73 3.86-3.86 0-.5-.1-.97-.25-1.4 1.31-.67 2.2-1.91 2.2-3.34z"
                          fill="#0095f6"
                        />
                        <path
                          d="M10.54 15.25L7.04 11.75l1.41-1.42 2.09 2.08 5.59-5.59 1.42 1.42-7.01 7.01z"
                          fill="white"
                        />
                      </svg>
                      {user.isPremium && (
                        <span className="inline-flex items-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{tagline}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1 truncate">
                      email: {user.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:pb-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => router.push("/networking")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      <IconMessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                    >
                      <IconEdit className="w-4 h-4" />
                      Edit profile
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
                  {[
                    { label: "Connections", value: connectionsCount },
                    { label: "Posts", value: displayPostsCount },
                    { label: "Courses", value: stats.coursesCount },
                    { label: "Projects", value: stats.projectsCount },
                  ].map((item, idx) => (
                    <div
                      key={item.label}
                      className={`px-4 py-3 text-center bg-slate-50/70 ${
                        idx > 0 ? "border-l border-slate-200" : ""
                      }`}
                    >
                      <p className="text-lg font-extrabold text-slate-900">{item.value}</p>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-4 overflow-hidden">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-none border-b border-slate-200">
                {TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative shrink-0 px-4 py-3 text-xs font-bold transition cursor-pointer ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-800"
                    } ${idx > 0 ? "border-l border-slate-100" : ""}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-4">
              <div className="min-w-0 space-y-4">
                {activeTab === "timeline" && (
                  <>
                    <form
                      onSubmit={handlePublish}
                      className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3.5 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0 border border-slate-100">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-blue-600">
                            {getInitials(user.fullName)}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        placeholder="Write here..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <div className="hidden sm:flex items-center gap-1 text-slate-400">
                        <IconPhoto className="w-5 h-5" />
                        <IconVideo className="w-5 h-5" />
                      </div>
                      <button
                        type="submit"
                        disabled={!composerText.trim() || posting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                      >
                        {posting ? "..." : "Post"}
                      </button>
                    </form>

                    {ownPosts.length > 0 ? (
                      ownPosts.map((post) => (
                        <article
                          key={post.id}
                          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
                        >
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border border-slate-100">
                              {(post.userImage || user.profileImage) ? (
                                <img
                                  src={post.userImage || user.profileImage}
                                  alt={post.userName || user.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-blue-600">
                                  {getInitials(post.userName || user.fullName)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {(post.userName || user.fullName).split(" ")[0]}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                {timeAgo(post.createdAt)}
                                <IconWorld className="w-3 h-3" />
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </p>
                          {post.imageUrl ? (
                            <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                              <img
                                src={post.imageUrl}
                                alt="Post media"
                                className="w-full max-h-72 object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <button
                              type="button"
                              onClick={() => router.push(`/dashboard/post/${post.id}`)}
                              className="inline-flex items-center gap-1.5 hover:text-rose-500 cursor-pointer"
                            >
                              <IconHeart className="w-4 h-4" />
                              Like {post.likesCount ? `(${post.likesCount})` : ""}
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/dashboard/post/${post.id}`)}
                              className="inline-flex items-center gap-1.5 hover:text-blue-600 cursor-pointer"
                            >
                              <IconMessageCircle className="w-4 h-4" />
                              Comment
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/dashboard/post/${post.id}`)}
                              className="inline-flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer"
                            >
                              <IconShare className="w-4 h-4" />
                              Share
                            </button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-sm font-bold text-slate-800">No posts yet</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Share your first update using the composer above.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "info" && (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 space-y-5">
                    <section>
                      <h3 className="text-sm font-extrabold text-slate-900 mb-2">About Me</h3>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[80px]">
                        {user.about || "No description provided."}
                      </p>
                    </section>
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "College", value: user.collegeStudying },
                        { label: "Branch", value: user.branch },
                        { label: "Year", value: user.year },
                        { label: "Date of Birth", value: user.dob },
                      ].map((f) => (
                        <div
                          key={f.label}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {f.label}
                          </p>
                          <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                            {f.value || "Not Specified"}
                          </p>
                        </div>
                      ))}
                    </section>
                    <section>
                      <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                        Preferred Track
                      </h3>
                      <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                        {user.selectedRole}
                        {user.otherRoleText ? ` (${user.otherRoleText})` : ""}
                      </p>
                    </section>
                    <section className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-900">Links</h3>
                      {user.linkedinLink && (
                        <a
                          href={user.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          <span className="truncate">{user.linkedinLink}</span>
                          <IconExternalLink className="w-4 h-4 shrink-0" />
                        </a>
                      )}
                      {user.portfolioLink && (
                        <a
                          href={user.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          <span className="truncate">{user.portfolioLink}</span>
                          <IconExternalLink className="w-4 h-4 shrink-0" />
                        </a>
                      )}
                      {!user.linkedinLink && !user.portfolioLink && (
                        <p className="text-xs text-slate-500">No public links added yet.</p>
                      )}
                    </section>
                    <section>
                      <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                        Networking Visibility
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.shareWithNetworking
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {user.shareWithNetworking
                          ? "Sharing Enabled"
                          : "Sharing Disabled (Private Details)"}
                      </span>
                    </section>
                  </div>
                )}

                {activeTab === "connections" && (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <IconUsers className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-extrabold text-slate-900">
                          Your Connections
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/networking")}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Open Networking
                      </button>
                    </div>
                    {connectionItems.length > 0 ? (
                      <div className="space-y-2">
                        {connectionItems.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50"
                          >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                              {c.profileImage ? (
                                <img
                                  src={c.profileImage}
                                  alt={c.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-blue-600">
                                  {getInitials(c.fullName)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {c.fullName}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {c.selectedRole}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-700">No connections yet</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Discover members in Networking and send connection requests.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "saved" && (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <IconBookmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          Saved & Bookmarked Posts
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Posts you bookmarked for quick reference.
                        </p>
                      </div>
                    </div>
                    {savedPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savedPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => router.push(`/dashboard/post/${post.id}`)}
                            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20 transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-slate-800">
                                {post.userName || "Community Member"}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full">
                                {post.category || "General"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 line-clamp-3">{post.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-700">No saved posts yet</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Click Save on any community post to bookmark it here.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(activeTab === "groups" || activeTab === "forums") && (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
                    <p className="text-sm font-extrabold text-slate-800">
                      {activeTab === "groups" ? "Groups" : "Forums"} coming soon
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      This section will let you join student groups and discussion forums.
                      Stay tuned.
                    </p>
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <aside className="space-y-4">
                <SuggestedConnectionsCard currentUserId={user.id} />

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <h3 className="text-xs font-extrabold text-slate-900 mb-3">Suggested Groups</h3>
                  <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Group recommendations will appear here soon.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <h3 className="text-xs font-extrabold text-slate-900 mb-3">
                    Latest Platform Updates
                  </h3>
                  <ul className="space-y-2.5">
                    {PLATFORM_UPDATES.map((u) => (
                      <li
                        key={u.date + u.text}
                        className="text-xs text-slate-600 leading-relaxed flex gap-2"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>
                          <span className="font-bold text-slate-800">{u.date}: </span>
                          {u.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
