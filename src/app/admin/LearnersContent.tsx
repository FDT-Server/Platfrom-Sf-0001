"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconShieldLock,
  IconUsers,
  IconAlertTriangle,
  IconTrash,
  IconX,
  IconFlame,
} from "@tabler/icons-react";
import { toast } from "sonner";

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
  isPremium: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface PaymentRequestInfo {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  referenceNo: string;
  name: string;
  utrNo: string;
  status: string;
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
  paymentRequests: PaymentRequestInfo[];
}

export default function LearnersContent({ adminUser, allUsers, paymentRequests }: LearnersContentProps) {
  const [users, setUsers] = useState<UserProfile[]>(allUsers);
  const [requests, setRequests] = useState<PaymentRequestInfo[]>(paymentRequests);
  const [togglingIds, setTogglingIds] = useState<Record<string, boolean>>({});
  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isPurging, setIsPurging] = useState(false);
  const [purgeError, setPurgeError] = useState("");

  const handleApprovePayment = async (requestId: string, userId: string) => {
    if (approvingIds[requestId]) return;
    setApprovingIds((prev) => ({ ...prev, [requestId]: true }));

    try {
      const res = await fetch(`/api/admin/payment-requests/${requestId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRequests((prev) =>
            prev.map((req) =>
              req.id === requestId ? { ...req, status: "APPROVED" } : req
            )
          );

          setUsers((prev) =>
            prev.map((user) =>
              user.id === userId ? { ...user, isPremium: true } : user
            )
          );
          toast.success("Payment approved successfully!");
        }
      }
    } catch (err) {
      console.error("Failed to approve payment request:", err);
    } finally {
      setApprovingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleTogglePremium = async (userId: string) => {
    if (togglingIds[userId]) return;

    setTogglingIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === userId ? { ...user, isPremium: data.user.isPremium } : user
            )
          );
          toast.success("User access status updated.");
        }
      }
    } catch (err) {
      console.error("Failed to toggle premium status:", err);
    } finally {
      setTogglingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handlePurgePlatformData = async () => {
    if (confirmationInput.trim() !== "DELETE ALL PLATFORM DATA") {
      setPurgeError("Please type 'DELETE ALL PLATFORM DATA' exactly to confirm.");
      return;
    }

    setIsPurging(true);
    setPurgeError("");

    try {
      const res = await fetch("/api/admin/reset-platform-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationText: confirmationInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Platform data purged! Admin login preserved.");
        setShowDeleteModal(false);
        setConfirmationInput("");
        window.location.reload();
      } else {
        setPurgeError(data.error || "Failed to purge platform data.");
      }
    } catch (err: any) {
      console.error("Purge error:", err);
      setPurgeError("Network error. Could not complete data purge.");
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <DashboardLayout user={adminUser}>
      <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn relative select-none">
        <div>
          {/* Header Bar */}
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

          {/* Learners List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Learners List
              </h4>
              <p className="text-xs text-slate-400">Click on a name to inspect full profile details</p>
            </div>

            <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full min-w-[950px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Full Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Email Address</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Role Track</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">College</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Branch</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Joined Date</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center whitespace-nowrap">Premium Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="py-4 px-4 text-sm font-bold whitespace-nowrap">
                          <Link
                            href={`/admin/learner/${u.id}`}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline text-left cursor-pointer transition font-bold"
                          >
                            {u.fullName}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 whitespace-nowrap">{u.email}</td>
                        <td className="py-4 px-4 text-sm whitespace-nowrap">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                            {u.selectedRole}
                            {u.selectedRole === "Other" && u.otherRoleText && ` (${u.otherRoleText})`}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 font-medium truncate max-w-[200px]" title={u.collegeStudying || ""}>{u.collegeStudying || "—"}</td>
                        <td className="py-4 px-4 text-sm text-slate-600 truncate max-w-[150px]" title={u.branch || ""}>{u.branch || "—"}</td>
                        <td className="py-4 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm text-center whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePremium(u.id)}
                            disabled={togglingIds[u.id]}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition select-none flex items-center justify-center gap-1 mx-auto border ${
                              u.isPremium
                                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {u.isPremium ? "workspace_premium" : "lock"}
                            </span>
                            {togglingIds[u.id] ? "Updating..." : u.isPremium ? "Premium (Revoke)" : "Free (Upgrade)"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-500 font-medium">
                        No learners registered in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Premium Requests Table */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 mt-10">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Premium Upgrade Requests
                </h4>
                <p className="text-xs text-slate-400">
                  Review reference numbers and UTR details from banking transactions.
                </p>
              </div>
            </div>

            <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full min-w-[950px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Learner Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Email Address</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Selected Plan</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Reference No</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Payer Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">UTR Number</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">{req.userName}</td>
                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{req.userEmail}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            req.plan === "YEARLY"
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                          }`}>
                            {req.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-mono whitespace-nowrap">{req.referenceNo}</td>
                        <td className="py-4 px-4 text-slate-800 font-semibold whitespace-nowrap">{req.name}</td>
                        <td className="py-4 px-4 text-slate-650 font-mono whitespace-nowrap">{req.utrNo}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-block font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            req.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                              : "bg-yellow-50 text-yellow-700 border-yellow-250 animate-pulse"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {req.status === "PENDING" ? (
                            <button
                              onClick={() => handleApprovePayment(req.id, req.userId)}
                              disabled={approvingIds[req.id]}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg px-3 py-1.5 font-bold transition select-none flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">done_all</span>
                              {approvingIds[req.id] ? "Approving..." : "Approve Premium"}
                            </button>
                          ) : (
                            <span className="text-slate-400 font-semibold flex items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                              Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-450 font-medium">
                        No premium payment logs submitted.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DANGER ZONE: PURGE ALL PLATFORM DATA */}
          <div className="bg-rose-50/50 border-2 border-rose-200/80 rounded-2xl p-6 mt-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shrink-0">
                  <IconAlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-rose-900 tracking-tight">
                      Danger Zone: Reset Platform Data
                    </h4>
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                      Admin Action
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium mt-1 leading-relaxed max-w-2xl">
                    Permanently delete all platform data including user accounts, posts, comments, study pods, messages, and payment logs. <strong className="underline">Admin login credentials (webstrixx@gmail.com) will be preserved.</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setConfirmationInput("");
                  setPurgeError("");
                  setShowDeleteModal(true);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 border-0"
              >
                <IconTrash className="w-4 h-4" />
                <span>Delete All Platform Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SAFETY MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl transition cursor-pointer"
            >
              <IconX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shrink-0">
                <IconFlame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Confirm Full Data Reset
                </h3>
                <p className="text-xs text-rose-600 font-bold mt-0.5">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 space-y-1.5">
              <p className="font-semibold">The following will be deleted immediately:</p>
              <ul className="list-disc list-inside text-[11px] space-y-0.5 text-rose-700">
                <li>All learner profiles & registered accounts</li>
                <li>All posts, feed discussions & comments</li>
                <li>All chat messages & study pod rooms</li>
                <li>All payment request history & logs</li>
              </ul>
              <p className="font-bold text-emerald-700 pt-1">
                ✓ Preserved: Admin login accounts (webstrixx@gmail.com)
              </p>
            </div>

            {purgeError && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl">
                {purgeError}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Type <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">DELETE ALL PLATFORM DATA</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="DELETE ALL PLATFORM DATA"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-rose-600 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgePlatformData}
                disabled={confirmationInput.trim() !== "DELETE ALL PLATFORM DATA" || isPurging}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isPurging ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Purging Data...</span>
                  </>
                ) : (
                  <>
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Confirm & Delete All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
