"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

// Custom SVG Icons
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

interface DashboardContentProps {
  user: {
    fullName: string;
    email: string;
    selectedRole: string;
    otherRoleText: string | null;
    goals: string[];
  };
}

export default function DashboardContent({ user }: DashboardContentProps) {
  return (
    <DashboardLayout user={user}>
      {/* Main Dashboard Panel - Pure Light Theme */}
      <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50/60 px-2.5 py-1 rounded-md">
                Dashboard Active
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                Welcome, {user.fullName}!
              </h3>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h4 className="text-xs font-bold text-slate-600 mb-2">
                Profile Tailoring Details
              </h4>
              <p className="text-sm text-slate-700">
                <strong>Current Position:</strong> {user.selectedRole}
                {user.selectedRole === "Other" && user.otherRoleText && ` (${user.otherRoleText})`}
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-600 mb-3">
                Recommended Training Paths
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.goals.length > 0 ? (
                  user.goals.map((goal, idx) => (
                    <div key={idx} className="border border-blue-100/60 bg-blue-50/5 p-4 rounded-xl flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full p-1 text-xs mt-0.5 flex items-center justify-center">
                        <CheckIcon />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-blue-900">Customized Path</p>
                        <p className="text-xs text-slate-700 mt-0.5">{goal}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No specific goals selected. Showing general web developer paths.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end mt-8">
          <button
            onClick={() => alert("Learning session starts! Good luck with your study!")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-md shadow-indigo-200 cursor-pointer"
          >
            Start Custom Learning Session
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
