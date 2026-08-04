"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconAlertTriangle,
  IconTrash,
  IconX,
  IconFlame,
  IconShieldLock,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface ResetDataContentProps {
  adminUser: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

export default function ResetDataContent({ adminUser }: ResetDataContentProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isPurging, setIsPurging] = useState(false);
  const [purgeError, setPurgeError] = useState("");
  const [purgeSuccess, setPurgeSuccess] = useState(false);

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
        setPurgeSuccess(true);
        setShowDeleteModal(false);
        setConfirmationInput("");
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
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-rose-100">
                <IconShieldLock className="w-3.5 h-3.5" />
                Admin Danger Zone Console
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Reset Platform & Delete All Content
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Purge all platform data across Student Forge while preserving Admin login accounts
              </p>
            </div>
          </div>

          {/* Success Banner if purged */}
          {purgeSuccess && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
              <IconCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Platform data reset successfully! All non-admin content was purged. Admin login accounts were preserved.</span>
            </div>
          )}

          {/* Warning Banner & Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50/60 border-2 border-rose-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-rose-900 font-extrabold text-base mb-2">
                  <IconAlertTriangle className="w-6 h-6 text-rose-600 animate-pulse shrink-0" />
                  <span>Irreversible System Operation</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Executing this reset command will permanently wipe all test & trainee data from the database. Once triggered, the data cannot be recovered.
                </p>
              </div>

              <button
                onClick={() => {
                  setConfirmationInput("");
                  setPurgeError("");
                  setShowDeleteModal(true);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95 border-0"
              >
                <IconTrash className="w-4 h-4" />
                <span>Delete All Platform Data</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Target Data Purge Scope:
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span><strong>Users & Profiles:</strong> All registered non-admin learner accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span><strong>Posts & Discussions:</strong> All feed posts, likes, shares & comments</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span><strong>Messaging & Pods:</strong> All public & 1-on-1 chats, study pods & pod messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span><strong>Billing & History:</strong> All UTR payment logs & course enrollment records</span>
                </li>
                <li className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-emerald-700 font-bold">Preserved: Admin credentials (webstrixx@gmail.com)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SAFETY MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 relative select-none">
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
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 border-0"
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
