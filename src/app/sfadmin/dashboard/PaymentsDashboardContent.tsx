"use client";

import React, { useState } from "react";
import { IconShieldLock, IconReceipt, IconBook, IconCheck, IconX, IconClock } from "@tabler/icons-react";

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

interface CourseEnrollmentInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  classLevel: string;
  utrNo: string;
  status: string;
  createdAt: string;
  course: { title: string; imageUrl: string };
  user: { fullName: string; email: string };
}

interface PaymentsDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
  paymentRequests: PaymentRequestInfo[];
  courseEnrollments: CourseEnrollmentInfo[];
}

export default function PaymentsDashboardContent({ adminUser, paymentRequests, courseEnrollments }: PaymentsDashboardContentProps) {
  const [requests, setRequests] = useState<PaymentRequestInfo[]>(paymentRequests);
  const [enrollments, setEnrollments] = useState<CourseEnrollmentInfo[]>(courseEnrollments);
  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});
  const [enrollActionIds, setEnrollActionIds] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleApprovePayment = async (requestId: string, userId: string) => {
    if (approvingIds[requestId]) return;
    setApprovingIds((prev) => ({ ...prev, [requestId]: true }));
    setError("");
    setSuccess("");

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
          setSuccess("Payment approved successfully!");
        } else {
          setError(data.error || "Approval failed.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to approve payment request.");
    } finally {
      setApprovingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;

  const handleEnrollmentAction = async (enrollmentId: string, status: "APPROVED" | "REJECTED") => {
    if (enrollActionIds[enrollmentId]) return;
    setEnrollActionIds((prev) => ({ ...prev, [enrollmentId]: true }));
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/sfadmin/enrollments/${enrollmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnrollments((prev) =>
          prev.map((e) => (e.id === enrollmentId ? { ...e, status } : e))
        );
        setSuccess(`Enrollment ${status.toLowerCase()} successfully!`);
      } else {
        const data = await res.json();
        setError(data.error || "Action failed.");
      }
    } catch {
      setError("Failed to update enrollment.");
    } finally {
      setEnrollActionIds((prev) => ({ ...prev, [enrollmentId]: false }));
    }
  };

  return (
    <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 md:p-10 shadow-sm animate-fadeIn relative">
      <div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200/50">
              <IconShieldLock className="w-3.5 h-3.5" />
              SF Payments Console
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Welcome, {adminUser.fullName}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify trainee transaction records and authorize premium accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="bg-amber-100 text-amber-800 p-2 rounded-lg">
                <IconReceipt className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Requests</p>
                <p className="text-lg font-extrabold text-slate-850 leading-none mt-0.5">{totalRequests}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="bg-yellow-100 text-yellow-800 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[20px] font-bold">pending_actions</span>
              </span>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending</p>
                <p className="text-lg font-extrabold text-slate-850 leading-none mt-0.5">{pendingRequests}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[20px] font-bold">verified</span>
              </span>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approved</p>
                <p className="text-lg font-extrabold text-slate-850 leading-none mt-0.5">{approvedRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl p-3 font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-3 font-semibold">
            {success}
          </div>
        )}

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 mt-8">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Premium Upgrade Requests
            </h4>
            <p className="text-xs text-slate-400">
              Review reference numbers and UTR details from banking transactions.
            </p>
          </div>

          <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
            <table className="w-full min-w-[950px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Learner Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Email Address</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Selected Plan</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Reference No</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Payer Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">UTR Number</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition duration-150">
                      <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">{req.userName}</td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{req.userEmail}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          req.plan === "YEARLY"
                            ? "bg-amber-100 text-amber-900 border border-amber-200/50"
                            : "bg-blue-50 text-blue-850 border border-blue-100/50"
                        }`}>
                          {req.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono whitespace-nowrap">{req.referenceNo}</td>
                      <td className="py-4 px-4 text-slate-700 font-semibold whitespace-nowrap">{req.name}</td>
                      <td className="py-4 px-4 text-slate-500 font-mono whitespace-nowrap">{req.utrNo}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          req.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                            : "bg-yellow-50 text-yellow-750 border-yellow-200/50 animate-pulse"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {req.status === "PENDING" ? (
                          <button
                            onClick={() => handleApprovePayment(req.id, req.userId)}
                            disabled={approvingIds[req.id]}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg px-3 py-1.5 font-bold transition select-none flex items-center justify-center gap-1 mx-auto cursor-pointer border-0"
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
                    <td colSpan={8} className="py-8 text-center text-slate-450 font-medium italic">
                      No premium payment logs submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 mt-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-amber-50 border border-amber-200 text-amber-700 p-2 rounded-lg">
              <IconBook className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Course Enrollment Verifications</h4>
              <p className="text-xs text-slate-400">Review and approve trainee course enrollment requests.</p>
            </div>
          </div>

          <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
            <table className="w-full min-w-[950px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Course</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Trainee Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Class</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">UTR No</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-650 uppercase tracking-wider text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {enrollments.length > 0 ? (
                  enrollments.map((enroll) => (
                    <tr key={enroll.id} className="hover:bg-slate-50/40 transition duration-150">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {enroll.course.imageUrl && (
                            <img src={enroll.course.imageUrl} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                          )}
                          <span className="font-bold text-slate-800 line-clamp-1">{enroll.course.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">{enroll.name}</td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{enroll.email}</td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{enroll.phone}</td>
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{enroll.classLevel}</td>
                      <td className="py-4 px-4 text-slate-500 font-mono whitespace-nowrap">{enroll.utrNo || "—"}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          enroll.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                            : enroll.status === "REJECTED"
                            ? "bg-red-50 text-red-600 border-red-200/50"
                            : "bg-yellow-50 text-yellow-750 border-yellow-200/50 animate-pulse"
                        }`}>
                          {enroll.status === "APPROVED" && <IconCheck className="w-2.5 h-2.5" />}
                          {enroll.status === "REJECTED" && <IconX className="w-2.5 h-2.5" />}
                          {enroll.status === "PENDING" && <IconClock className="w-2.5 h-2.5" />}
                          {enroll.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {enroll.status === "PENDING" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEnrollmentAction(enroll.id, "APPROVED")}
                              disabled={enrollActionIds[enroll.id]}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 text-white rounded-lg px-3 py-1.5 font-bold transition cursor-pointer border-0 flex items-center gap-1"
                            >
                              <IconCheck className="w-3 h-3" />
                              {enrollActionIds[enroll.id] ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleEnrollmentAction(enroll.id, "REJECTED")}
                              disabled={enrollActionIds[enroll.id]}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg px-3 py-1.5 font-bold transition cursor-pointer flex items-center gap-1"
                            >
                              <IconX className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-semibold">
                            {enroll.status === "APPROVED" ? "✓ Verified" : "✗ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-450 font-medium italic">
                      No course enrollment requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
