"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { IconUsers, IconUsersPlus } from "@tabler/icons-react";

interface CreatePodContentProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

export default function CreatePodContent({ user }: CreatePodContentProps) {
  const router = useRouter();
  const [newPodName, setNewPodName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodName.trim() || creating) return;

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/studypods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPodName }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect directly into the newly created room workspace
        router.push(`/studypod/${data.studyPod.id}`);
      } else {
        setError(data.error || "Failed to create Study Pod");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="w-full px-4 md:px-8 py-6 space-y-6 animate-fadeIn">
        
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium select-none">
          <a href="/studypod" className="hover:text-indigo-600 transition">
            Study Pods
          </a>
          <span className="text-slate-350">/</span>
          <span className="text-slate-800 font-semibold">Create Pod</span>
        </div>

        {/* Creation Card container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs max-w-2xl overflow-hidden">
          
          {/* Accent Header */}
          <div className="bg-yellow-100/80 border-b border-yellow-200/50 p-6">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <IconUsers className="w-5 h-5 text-indigo-650" />
              New Study Pod Collaborative Room
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Create a custom collaborative room workspace. Once created, you can generate invite links to invite study partners.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="text-xs text-red-655 bg-red-50 border border-red-100 p-3 rounded-xl font-semibold leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePod} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={newPodName}
                  onChange={(e) => setNewPodName(e.target.value)}
                  placeholder="e.g. AI System Design Pod"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition text-slate-800"
                  maxLength={100}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push("/studypod")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newPodName.trim()}
                  className="bg-slate-950 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium px-5 py-2.5 rounded-lg text-xs shadow-xs transition duration-150 cursor-pointer flex items-center gap-1.5"
                >
                  <IconUsersPlus className="w-4.5 h-4.5" />
                  {creating ? "Creating Room..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
