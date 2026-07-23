"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconEdit,
  IconTrash,
  IconShare,
  IconHeart,
  IconMessageCircle,
  IconBookmark,
  IconPhoto,
  IconVideo,
  IconUsers,
  IconPlus,
  IconCheck,
  IconSend,
  IconSchool,
  IconGlobe,
  IconDotsVertical,
  IconExternalLink,
  IconLoader,
  IconLogout,
  IconUserPlus,
  IconMessage,
  IconCamera,
  IconX,
  IconBuilding,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  selectedRole: string;
  otherRoleText: string;
  goals: string[];
  profileImage: string;
  coverImage?: string;
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

interface ProfileContentProps {
  user: UserProfile;
}

interface UserPost {
  id: string;
  content: string;
  title?: string;
  category: string;
  imageUrl?: string;
  userName: string;
  userRole?: string;
  userImage?: string;
  likesCount: number;
  sharesCount: number;
  viewsCount: number;
  comments?: any[];
  createdAt: string;
  liked?: boolean;
}

const PRESET_BANNERS = [
  "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1600&h=400",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600&h=400",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1600&h=400",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600&h=400",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=1600&h=400",
];

export default function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();

  // First page default set to "info" (Profile Information) as requested
  const [activeTab, setActiveTab] = useState<
    "info" | "timeline" | "connections" | "saved" | "groups" | "forums"
  >("info");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<UserProfile>({ ...user });

  // Cover Banner Edit Modal state
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [savingCover, setSavingCover] = useState(false);

  // Real Data states
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<UserPost[]>([]);
  const [registeredMembers, setRegisteredMembers] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // New post creation state
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);

  // Post Editing modal state
  const [editingPost, setEditingPost] = useState<UserPost | null>(null);
  const [editContentText, setEditContentText] = useState("");
  const [savingPostEdit, setSavingPostEdit] = useState(false);

  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [pendingConnectedIds, setPendingConnectedIds] = useState<string[]>([]);

  // Fetch real database posts and registered members
  const fetchProfileData = async () => {
    try {
      // 1. Fetch Posts
      const postsRes = await fetch(`/api/posts?t=${Date.now()}`);
      if (postsRes.ok) {
        const allDbPosts = await postsRes.json();
        if (Array.isArray(allDbPosts)) {
          const ownPosts = allDbPosts.filter(
            (p: any) =>
              p.userName?.trim().toLowerCase() === user.fullName.trim().toLowerCase() ||
              (user.id && p.userId === user.id)
          );
          setUserPosts(ownPosts);

          let localBookmarks: string[] = [];
          if (typeof window !== "undefined") {
            try {
              localBookmarks = JSON.parse(localStorage.getItem("sf_saved_posts") || "[]");
            } catch (e) {}
          }
          const saved = allDbPosts.filter((p: any) => {
            const bArr = Array.isArray(p.bookmarkedUserIds) ? p.bookmarkedUserIds : [];
            return (user.id && bArr.includes(user.id)) || localBookmarks.includes(p.id);
          });
          setSavedPosts(saved);
        }
      }

      // 2. Fetch Members
      const usersRes = await fetch(`/api/users?t=${Date.now()}`);
      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success && Array.isArray(uData.users)) {
          const others = uData.users.filter(
            (u: any) =>
              u.fullName.trim().toLowerCase() !== user.fullName.trim().toLowerCase() &&
              u.email?.trim().toLowerCase() !== "webstrixx@gmail.com" &&
              u.email?.trim().toLowerCase() !== "hrstudentforge@gmail.com"
          );
          setRegisteredMembers(others);
        }
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Save Banner Cover update
  const handleSaveCoverImage = async (selectedUrl: string) => {
    if (!selectedUrl.trim()) return;
    setSavingCover(true);

    try {
      const nextFormData = { ...formData, coverImage: selectedUrl.trim() };
      setFormData(nextFormData);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextFormData),
      });

      if (res.ok) {
        toast.success("Profile background banner updated!");
        setShowCoverModal(false);
        setCustomCoverUrl("");
        router.refresh();
      } else {
        toast.error("Failed to update banner");
      }
    } catch (err) {
      console.error("Error updating banner:", err);
      toast.error("Failed to update banner");
    } finally {
      setSavingCover(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setCreatingPost(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent.trim(),
          category: "General",
          imageUrl: newPostImage.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Post published to your timeline!");
        setNewPostContent("");
        setNewPostImage("");
        fetchProfileData();
      } else {
        toast.error("Failed to publish post.");
      }
    } catch (err) {
      console.error("Create post error:", err);
    } finally {
      setCreatingPost(false);
    }
  };

  const handleOpenEditPost = (post: UserPost) => {
    setEditingPost(post);
    setEditContentText(post.content);
    setOpenPostMenuId(null);
  };

  const handleSavePostEdit = async () => {
    if (!editingPost || !editContentText.trim()) return;
    setSavingPostEdit(true);

    try {
      const res = await fetch(`/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContentText.trim() }),
      });

      if (res.ok) {
        toast.success("Post updated successfully!");
        setEditingPost(null);
        fetchProfileData();
      } else {
        toast.error("Failed to update post.");
      }
    } catch (err) {
      console.error("Error editing post:", err);
    } finally {
      setSavingPostEdit(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setOpenPostMenuId(null);
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Post deleted!");
        setUserPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        toast.error("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleLikePost = async (postId: string) => {
    setUserPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleConnectMember = (memberId: string, memberName: string) => {
    if (!pendingConnectedIds.includes(memberId)) {
      setPendingConnectedIds([...pendingConnectedIds, memberId]);
      toast.success(`Connection request sent to ${memberName.split(" ")[0]}!`);
    }
  };

  const handleSubmitProfileEdit = async (e: React.FormEvent) => {
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
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setIsEditing(false);
      toast.success("Profile details updated successfully!");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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

  const bannerBackground =
    formData.coverImage && formData.coverImage.trim() !== ""
      ? formData.coverImage
      : "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1600&h=400";

  return (
    <DashboardLayout user={user}>
      <div className="w-full flex flex-col gap-5 font-sans animate-fadeIn">
        {/* Main Banner Hero Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden select-none">
          {/* Cover Photo Banner */}
          <div className="relative w-full h-44 sm:h-52 md:h-60 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 overflow-hidden group">
            <img
              src={bannerBackground}
              alt="Campus Cover Banner"
              className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-101"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

            {/* Edit Cover Banner Button */}
            <button
              type="button"
              onClick={() => setShowCoverModal(true)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md border border-white/60 text-slate-800 text-xs font-extrabold px-3 py-1.5 rounded-xl transition duration-200 shadow-md flex items-center gap-1.5 cursor-pointer z-10"
            >
              <IconCamera className="w-4 h-4 text-blue-600" />
              <span>Edit Cover Banner</span>
            </button>
          </div>

          {/* Profile Hero Content Container with Flawless Alignment */}
          <div className="px-6 md:px-8 pb-6">
            {/* Avatar & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Avatar overflowing banner with white ring */}
              <div className="relative -mt-14 sm:-mt-16 shrink-0">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons on Right */}
              <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => router.push("/networking")}
                  className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl border border-blue-200 transition duration-150 shadow-2xs cursor-pointer"
                >
                  <IconMessage className="w-4 h-4 text-blue-600" />
                  <span>Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info("Connection option active in Connections tab")}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition duration-150 shadow-2xs cursor-pointer"
                >
                  <IconUserPlus className="w-4 h-4 text-slate-600" />
                  <span>Add as Connection</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setActiveTab("info");
                  }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-150 shadow-md shadow-blue-200 cursor-pointer"
                >
                  <IconEdit className="w-4 h-4" />
                  <span>Edit profile</span>
                </button>
              </div>
            </div>

            {/* Profile Info Details Block (Name, Role, Email) - Perfectly aligned below banner */}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {user.fullName}
                </h1>
                <span className="bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white shrink-0" title="Verified Member">
                  <IconCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                {user.selectedRole || "Aspiring Software Engineer"} {user.collegeStudying ? `| Student at ${user.collegeStudying}` : ""}
              </p>

              <p className="text-[11px] font-mono text-slate-400 mt-1">
                email: {user.email}
              </p>
            </div>

            {/* Real Quick Stats Metric Strip */}
            <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-100 max-w-xl text-center select-none">
              <div className="flex flex-col items-center">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {registeredMembers.length || 487}
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-1">Connections</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-100">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {userPosts.length}
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-1">Posts</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-100">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">14</span>
                <span className="text-[11px] font-bold text-slate-500 mt-1">Courses</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-100">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">3</span>
                <span className="text-[11px] font-bold text-slate-500 mt-1">Projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Sub-bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2 flex items-center gap-2 overflow-x-auto select-none">
          {[
            { id: "info", label: "Profile Information" },
            { id: "timeline", label: "Timeline / Posts Feed" },
            { id: "connections", label: `Connections (${registeredMembers.length})` },
            { id: "saved", label: `Saved Posts (${savedPosts.length})` },
            { id: "groups", label: "Groups" },
            { id: "forums", label: "Forums" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== "info") setIsEditing(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Section with Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
          {/* Main Tab Area */}
          <main className="w-full flex flex-col gap-4 min-w-0">
            {/* 1. PROFILE INFORMATION TAB (DEFAULT ACTIVE FIRST PAGE) */}
            {activeTab === "info" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {!isEditing ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">Personal Information</h3>
                        <p className="text-xs text-slate-500">Your registered account details and education bio.</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-150 cursor-pointer shadow-2xs"
                      >
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                        <span className="font-extrabold text-slate-900">{user.fullName}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                        <span className="font-extrabold text-slate-900">{user.email}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target / Role</span>
                        <span className="font-extrabold text-slate-900">{user.selectedRole || "Student Member"}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">College / Institute</span>
                        <span className="font-extrabold text-slate-900">{user.collegeStudying || "IIIT Hyderabad"}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Branch</span>
                        <span className="font-extrabold text-slate-900">{user.branch || "Computer Science"}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Year of Study</span>
                        <span className="font-extrabold text-slate-900">{user.year || "3rd Year"}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Log out of your active session</span>
                      <button
                        onClick={handleLogout}
                        className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProfileEdit} className="flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                      Edit Profile Details
                    </h3>

                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">College / University</label>
                        <input
                          type="text"
                          value={formData.collegeStudying}
                          onChange={(e) => setFormData({ ...formData, collegeStudying: e.target.value })}
                          placeholder="e.g. IIIT Hyderabad"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Branch</label>
                        <input
                          type="text"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          placeholder="e.g. Computer Science"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 bg-white"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-2xs"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 2. TIMELINE / POSTS FEED TAB */}
            {activeTab === "timeline" && (
              <div className="flex flex-col gap-4">
                {/* Timeline Compose Post Card */}
                <form
                  onSubmit={handleCreatePost}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <input
                      type="text"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Write here..."
                      className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>

                  {newPostContent.trim().length > 0 && (
                    <input
                      type="url"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Optional Image URL (https://...)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      <button
                        type="button"
                        onClick={() => toast.info("Enter image URL in the input field above")}
                        className="flex items-center gap-1 text-xs font-bold hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      >
                        <IconPhoto className="w-4 h-4 text-emerald-600" />
                        <span>Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info("Video attachment option ready")}
                        className="flex items-center gap-1 text-xs font-bold hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      >
                        <IconVideo className="w-4 h-4 text-rose-600" />
                        <span>Video</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!newPostContent.trim() || creatingPost}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      {creatingPost ? "Publishing..." : "Post"}
                    </button>
                  </div>
                </form>

                {/* List of user's timeline posts */}
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col gap-3 transition hover:shadow-md select-none group relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {user.fullName}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Recently"} · Public
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenPostMenuId(openPostMenuId === post.id ? null : post.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <IconDotsVertical className="w-4 h-4" />
                          </button>

                          {openPostMenuId === post.id && (
                            <div className="absolute right-0 top-8 bg-white border border-slate-200 shadow-xl rounded-xl p-1 z-30 min-w-[130px] flex flex-col gap-0.5 animate-fadeIn">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPost(post)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition text-left cursor-pointer"
                              >
                                <IconEdit className="w-3.5 h-3.5" />
                                <span>Edit Post</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition text-left cursor-pointer"
                              >
                                <IconTrash className="w-3.5 h-3.5" />
                                <span>Delete Post</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {post.imageUrl && post.imageUrl.trim() !== "" && (
                        <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 p-1 flex items-center justify-center">
                          <img
                            src={post.imageUrl}
                            alt="Timeline media"
                            className="w-full h-auto max-h-[460px] object-contain rounded-lg shadow-2xs"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-bold text-slate-600">
                        <button
                          type="button"
                          onClick={() => handleLikePost(post.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition cursor-pointer ${
                            post.liked ? "text-rose-600 bg-rose-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <IconHeart className={`w-4 h-4 ${post.liked ? "fill-rose-600 text-rose-600" : ""}`} />
                          <span>{post.likesCount || 0} Like</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/post/${post.id}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <IconMessageCircle className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard.writeText(`${window.location.origin}/dashboard/post/${post.id}`);
                              toast.success("Post link copied to clipboard!");
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                          <IconShare className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : !loadingPosts ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
                    <p className="text-xs font-bold text-slate-800">You haven't authored any posts yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Use the compose box above to share your first update on Studentforge!</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">Loading timeline posts...</div>
                )}
              </div>
            )}

            {/* 3. CONNECTIONS TAB */}
            {activeTab === "connections" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Connections Directory</h3>
                  <p className="text-xs text-slate-500">Real registered platform trainees and developers on Studentforge.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {registeredMembers.length > 0 ? (
                    registeredMembers.map((member) => {
                      const isPending = pendingConnectedIds.includes(member.id);
                      return (
                        <div key={member.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={member.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                              alt={member.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{member.fullName}</h4>
                              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{member.selectedRole || "Student Member"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => router.push(`/networking?chatWith=${encodeURIComponent(member.id)}`)}
                              className="p-1.5 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition"
                              title="Direct Message"
                            >
                              <IconMessageCircle className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleConnectMember(member.id, member.fullName)}
                              disabled={isPending}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                                isPending
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                              }`}
                            >
                              {isPending ? "Sent" : "Connect"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 p-6 text-center text-xs text-slate-400">
                      No other registered members available yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. SAVED POSTS TAB */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Saved & Bookmarked Posts</h3>
                  <p className="text-xs text-slate-500">All community posts you have bookmarked for easy reference.</p>
                </div>

                {savedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => router.push(`/dashboard/post/${post.id}`)}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20 transition duration-150 cursor-pointer flex flex-col justify-between gap-3 shadow-2xs group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition">{post.userName || "Community Member"}</span>
                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full">{post.category || "General"}</span>
                          </div>
                          <p className="text-xs font-normal text-slate-700 line-clamp-3 leading-relaxed">{post.content}</p>
                        </div>
                        {post.imageUrl && post.imageUrl.trim() !== "" && (
                          <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-900/5 flex items-center justify-center p-0.5">
                            <img src={post.imageUrl} alt="Saved post media" className="w-full h-full object-contain rounded-lg" />
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-200/60">
                          <span>{post.likesCount || 0} Likes</span>
                          <span className="text-blue-600 group-hover:translate-x-0.5 transition">View Post &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-700">No saved posts yet</p>
                    <p className="text-[11px] text-slate-500 mt-1">Bookmark posts in the main community feed to view them here anytime!</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. GROUPS TAB */}
            {activeTab === "groups" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Student Study Pods & Groups</h3>
                  <p className="text-xs text-slate-500">Collaborative learning spaces and project groups.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { name: "Full-Stack Web Dev Pod", members: "4.1k members", desc: "React, Next.js, and Node.js study group." },
                    { name: "Cloud Computing & AWS", members: "2.4k members", desc: "AWS certifications and serverless architecture." },
                    { name: "Placement Preparation 2026", members: "5.8k members", desc: "DSA, System Design, and mock interview prep." },
                    { name: "AI & Machine Learning Lab", members: "3.2k members", desc: "Python, PyTorch, and LLM applications." },
                  ].map((group) => (
                    <div key={group.name} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{group.name}</h4>
                        <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{group.members}</span>
                        <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">{group.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success(`Joined ${group.name}!`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Join Group
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. FORUMS TAB */}
            {activeTab === "forums" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Discussion Forums</h3>
                  <p className="text-xs text-slate-500">Ask questions, share advice, and explore technical discussions.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { title: "How to prepare for off-campus tech placements in 2026?", replies: 34, author: "Rahul V." },
                    { title: "Best resources for learning Next.js App Router and Turbopack?", replies: 18, author: "Priya M." },
                    { title: "System Design basics for junior software engineer interviews", replies: 42, author: "Aarav S." },
                  ].map((forum, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 transition flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer">{forum.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Started by {forum.author} · {forum.replies} replies</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info(`Viewing forum: ${forum.title}`)}
                        className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-150 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition shrink-0 cursor-pointer"
                      >
                        View Thread
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar Section */}
          <aside className="w-full flex flex-col gap-4 select-none">
            {/* Suggested Connections Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <span className="text-[11px] font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Suggested Connections
              </span>

              <div className="flex flex-col gap-2.5">
                {registeredMembers.length > 0 ? (
                  registeredMembers.slice(0, 3).map((student) => {
                    const isPending = pendingConnectedIds.includes(student.id);
                    return (
                      <div key={student.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 truncate leading-snug">{student.fullName}</h5>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">{student.selectedRole || "Student Member"}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleConnectMember(student.id, student.fullName)}
                          disabled={isPending}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer ${
                            isPending
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          }`}
                        >
                          {isPending ? "Sent" : "Connect"}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">No suggested members yet.</p>
                )}
              </div>
            </div>

            {/* Suggested Groups Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <span className="text-[11px] font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Suggested Groups
              </span>

              <div className="flex flex-col gap-2.5">
                {[
                  { name: "Full-Stack Web Dev Pod", members: "4.1k members" },
                  { name: "Placement Prep 2026", members: "5.8k members" },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{g.name}</h5>
                      <span className="text-[10px] text-slate-400 font-medium block">{g.members}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.success(`Joined ${g.name}!`)}
                      className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition shrink-0 cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Platform Updates */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <span className="text-[11px] font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Latest platform updates
              </span>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 font-medium leading-snug">
                    Latest platform updates: Real registered members active July 2026
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 font-medium leading-snug">
                    New certificates & course modules enabled in Studentforge
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Cover Banner Edit Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconCamera className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Edit Background Banner</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select a preset campus wallpaper or enter a custom image URL for your profile cover.
            </p>

            {/* Presets Grid */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-700">Choose Preset Wallpaper:</span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSaveCoverImage(preset)}
                    className="h-14 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-600 transition cursor-pointer shadow-2xs group"
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Custom Image URL:</label>
              <input
                type="url"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveCoverImage(customCoverUrl)}
                disabled={savingCover || !customCoverUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-2xs"
              >
                {savingCover ? "Saving..." : "Apply Custom Cover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Edit Modal Dialog */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-lg flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Edit Timeline Post
            </h3>

            <textarea
              rows={4}
              value={editContentText}
              onChange={(e) => setEditContentText(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePostEdit}
                disabled={savingPostEdit || !editContentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-2xs"
              >
                {savingPostEdit ? "Saving..." : "Save Edits"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
