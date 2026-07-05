"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconShieldLock,
  IconUsers,
} from "@tabler/icons-react";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  selectedRole: string;
  otherRoleText: string | null;
  goals: string[];
  profileImage: string | null;
  collegeStudying: string | null;
  branch: string | null;
  year: string | null;
  dob: string | null;
  portfolioLink: string | null;
  linkedinLink: string | null;
  about: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface LearnersContentProps {
  adminUser: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
  allUsers: UserProfile[];
}

export default function LearnersContent({ adminUser, allUsers }: LearnersContentProps) {
  const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout user={adminUser}>
      <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn relative">
        <div>
          {/* Header Block (Styled matching the user dashboard) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit">
                <IconShieldLock className="w-3.5 h-3.5" />
                Learners Console Active
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                Welcome, {adminUser.fullName}!
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="bg-amber-100 text-amber-800 p-2 rounded-lg">
                <IconUsers className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Learners</p>
                <p className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">{allUsers.length}</p>
              </div>
            </div>
          </div>

          {/* Database Table Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Learners List
              </h4>
              <p className="text-xs text-slate-400">Click on a name to inspect full profile details</p>
            </div>
            
            <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role Track</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">College</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Branch</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allUsers.length > 0 ? (
                    allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="py-4 px-4 text-sm font-bold">
                          <Link
                            href={`/admin/learner/${u.id}`}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline text-left cursor-pointer transition font-bold"
                          >
                            {u.fullName}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{u.email}</td>
                        <td className="py-4 px-4 text-sm">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                            {u.selectedRole}
                            {u.selectedRole === "Other" && u.otherRoleText && ` (${u.otherRoleText})`}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 font-medium">{u.collegeStudying || "—"}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{u.branch || "—"}</td>
                        <td className="py-4 px-4 text-xs text-slate-500 font-mono">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500 font-medium">
                        No learners registered in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
