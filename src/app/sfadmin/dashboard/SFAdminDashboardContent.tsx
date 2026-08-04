"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconShieldLock,
  IconReceipt,
  IconCalendarEvent,
  IconLibrary,
  IconSchool,
  IconAward
} from "@tabler/icons-react";

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

interface EventInfo {
  id: string;
  title: string;
  description: string;
  day: string;
  month: string;
  time: string;
  duration: string;
  speakerName: string;
  speakerTitle: string;
  speakerCompany: string;
  speakerImage: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  joinLink: string;
  createdAt: string;
}

interface ResourceInfo {
  id: string;
  date: string;
  publisher: string;
  title: string;
  category: string;
  badgeColor: string;
  headerBg: string;
  link: string;
  createdAt: string;
}

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  link: string;
  createdAt: string;
}

interface CertificateInfo {
  id: string;
  title: string;
  description: string;
  issuedBy: string;
  link: string;
  createdAt: string;
}

interface SFAdminDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
  paymentRequests: PaymentRequestInfo[];
  initialEvents: EventInfo[];
  initialResources: ResourceInfo[];
  initialCourses: CourseInfo[];
  initialCertificates: CertificateInfo[];
}

export default function SFAdminDashboardContent({
  adminUser,
  paymentRequests,
  initialEvents,
  initialResources,
  initialCourses,
  initialCertificates,
}: SFAdminDashboardContentProps) {

  const [activeTab, setActiveTab] = useState<"payments" | "events" | "resources" | "courses" | "certificates">("payments");

  const [requests, setRequests] = useState<PaymentRequestInfo[]>(paymentRequests);
  const [events, setEvents] = useState<EventInfo[]>(initialEvents);
  const [resources, setResources] = useState<ResourceInfo[]>(initialResources);
  const [courses, setCourses] = useState<CourseInfo[]>(initialCourses);
  const [certificates, setCertificates] = useState<CertificateInfo[]>(initialCertificates);

  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    day: "",
    month: "",
    time: "",
    duration: "",
    speakerName: "",
    speakerTitle: "",
    speakerCompany: "",
    category: "Webinar",
    joinLink: "",
  });

  const [resourceForm, setResourceForm] = useState({
    title: "",
    publisher: "",
    category: "Database",
    link: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    instructor: "",
    link: "",
  });

  const [certificateForm, setCertificateForm] = useState({
    title: "",
    description: "",
    issuedBy: "",
    link: "",
  });

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
          setSuccess("Payment approved successfully! Learner upgraded to premium.");
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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents((prev) => [data.event, ...prev]);
        setSuccess(`Event "${eventForm.title}" added successfully!`);
        setEventForm({
          title: "",
          description: "",
          day: "",
          month: "",
          time: "",
          duration: "",
          speakerName: "",
          speakerTitle: "",
          speakerCompany: "",
          category: "Webinar",
          joinLink: "",
        });
      } else {
        setError(data.error || "Failed to add event.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resourceForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResources((prev) => [data.resource, ...prev]);
        setSuccess(`Resource "${resourceForm.title}" added successfully!`);
        setResourceForm({
          title: "",
          publisher: "",
          category: "Database",
          link: "",
        });
      } else {
        setError(data.error || "Failed to add resource.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCourses((prev) => [data.course, ...prev]);
        setSuccess(`Course "${courseForm.title}" added successfully!`);
        setCourseForm({
          title: "",
          description: "",
          duration: "",
          instructor: "",
          link: "",
        });
      } else {
        setError(data.error || "Failed to add course.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certificateForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertificates((prev) => [data.certificate, ...prev]);
        setSuccess(`Certificate "${certificateForm.title}" added successfully!`);
        setCertificateForm({
          title: "",
          description: "",
          issuedBy: "",
          link: "",
        });
      } else {
        setError(data.error || "Failed to add certificate.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-205">
                <IconShieldLock className="w-3.5 h-3.5" />
                SF Admin Control Panel Active
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                Welcome, {adminUser.fullName}!
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-600 flex items-center gap-1">
                <strong>{requests.filter(r => r.status === "PENDING").length}</strong> Pending Payments
              </span>
              <span className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-600 flex items-center gap-1">
                <strong>{events.length}</strong> Events
              </span>
              <span className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-600 flex items-center gap-1">
                <strong>{resources.length}</strong> Resources
              </span>
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

          <div className="flex flex-wrap gap-2 border-b border-slate-100 py-4 mt-2">
            <button
              onClick={() => { setActiveTab("payments"); setError(""); setSuccess(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "payments" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <IconReceipt className="w-4 h-4" />
              Payment Verification
            </button>
            <button
              onClick={() => { setActiveTab("events"); setError(""); setSuccess(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "events" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <IconCalendarEvent className="w-4 h-4" />
              Events adding
            </button>
            <button
              onClick={() => { setActiveTab("resources"); setError(""); setSuccess(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "resources" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <IconLibrary className="w-4 h-4" />
              Resources adding
            </button>
            <button
              onClick={() => { setActiveTab("courses"); setError(""); setSuccess(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "courses" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <IconSchool className="w-4 h-4" />
              Course addings
            </button>
            <button
              onClick={() => { setActiveTab("certificates"); setError(""); setSuccess(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "certificates" ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <IconAward className="w-4 h-4" />
              Certification addings
            </button>
          </div>

          <div className="mt-6">

            {activeTab === "payments" && (
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
                                ? "bg-amber-100 text-amber-900 border border-amber-250"
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
            )}

            {activeTab === "events" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Add Event Details</h4>
                  <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Event Title</label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="e.g. Mastering React 19 State"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Event Description</label>
                      <textarea
                        required
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Provide details about what will be covered..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700">Day</label>
                        <input
                          type="text"
                          required
                          value={eventForm.day}
                          onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                          placeholder="e.g. 15"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Month</label>
                        <input
                          type="text"
                          required
                          value={eventForm.month}
                          onChange={(e) => setEventForm({ ...eventForm, month: e.target.value })}
                          placeholder="e.g. AUGUST"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700">Time</label>
                        <input
                          type="text"
                          required
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          placeholder="e.g. 6:00 PM IST"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Duration</label>
                        <input
                          type="text"
                          required
                          value={eventForm.duration}
                          onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                          placeholder="e.g. 60 mins"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                    </div>
                    <div className="border-t border-slate-200/80 pt-3 space-y-3">
                      <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Speaker Information</p>
                      <div>
                        <label className="font-semibold text-slate-700">Speaker Name</label>
                        <input
                          type="text"
                          required
                          value={eventForm.speakerName}
                          onChange={(e) => setEventForm({ ...eventForm, speakerName: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-slate-700">Title</label>
                          <input
                            type="text"
                            required
                            value={eventForm.speakerTitle}
                            onChange={(e) => setEventForm({ ...eventForm, speakerTitle: e.target.value })}
                            placeholder="e.g. Tech Lead"
                            className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700">Company</label>
                          <input
                            type="text"
                            required
                            value={eventForm.speakerCompany}
                            onChange={(e) => setEventForm({ ...eventForm, speakerCompany: e.target.value })}
                            placeholder="e.g. Vercel"
                            className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-200/80 pt-3 space-y-3">
                      <div>
                        <label className="font-semibold text-slate-700">Event Type / Category</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        >
                          <option value="Webinar">Webinar</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Hackathon">Hackathon</option>
                          <option value="Meetup">Meetup</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Join / Register Link</label>
                        <input
                          type="url"
                          required
                          value={eventForm.joinLink}
                          onChange={(e) => setEventForm({ ...eventForm, joinLink: e.target.value })}
                          placeholder="https://zoom.us/..."
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs"
                    >
                      {saving ? "Saving Event..." : "Publish Event"}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Events ({events.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.length > 0 ? (
                      events.map((evt) => (
                        <div key={evt.id} className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                {evt.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {evt.day} {evt.month}
                              </span>
                            </div>
                            <h5 className="font-bold text-sm text-slate-800 leading-snug">{evt.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">{evt.description}</p>
                          </div>
                          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Speaker: <strong>{evt.speakerName}</strong> ({evt.speakerCompany})</span>
                            <span className="text-slate-400 font-semibold">{evt.duration}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-450 italic text-xs">No events added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 border border-slate-200 rounded-xl p-5 bg-slate-50/50 h-fit">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Add Resource</h4>
                  <form onSubmit={handleAddResource} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Resource Title</label>
                      <input
                        type="text"
                        required
                        value={resourceForm.title}
                        onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                        placeholder="e.g. Next.js App Router API"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Publisher</label>
                      <input
                        type="text"
                        required
                        value={resourceForm.publisher}
                        onChange={(e) => setResourceForm({ ...resourceForm, publisher: e.target.value })}
                        placeholder="e.g. Vercel / Microsoft"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Category</label>
                      <select
                        value={resourceForm.category}
                        onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      >
                        <option value="Database">Database</option>
                        <option value="Styling">Styling</option>
                        <option value="Next.js">Next.js</option>
                        <option value="Components">Components</option>
                        <option value="Library">Library</option>
                        <option value="Language">Language</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Resource Link</label>
                      <input
                        type="url"
                        required
                        value={resourceForm.link}
                        onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs"
                    >
                      {saving ? "Saving..." : "Add Resource"}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Resources ({resources.length})</h4>
                  <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full min-w-[600px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                          <th className="py-2.5 px-4 uppercase tracking-wider">Title</th>
                          <th className="py-2.5 px-4 uppercase tracking-wider">Publisher</th>
                          <th className="py-2.5 px-4 uppercase tracking-wider">Category</th>
                          <th className="py-2.5 px-4 uppercase tracking-wider">Added Date</th>
                          <th className="py-2.5 px-4 uppercase tracking-wider text-center">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {resources.length > 0 ? (
                          resources.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 transition">
                              <td className="py-3 px-4 font-semibold text-slate-800">{r.title}</td>
                              <td className="py-3 px-4 text-slate-500">{r.publisher}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-block font-bold text-[9px] px-2 py-0.5 rounded ${r.badgeColor}`}>
                                  {r.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-450">{r.date}</td>
                              <td className="py-3 px-4 text-center">
                                <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-450 italic">No resources available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 border border-slate-200 rounded-xl p-5 bg-slate-50/50 h-fit">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Add Course</h4>
                  <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Course Title</label>
                      <input
                        type="text"
                        required
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        placeholder="e.g. Master React 19 from Scratch"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Course scope details..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700">Duration</label>
                        <input
                          type="text"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          placeholder="e.g. 15 hours"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Instructor</label>
                        <input
                          type="text"
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Course Link / Syllabus URL</label>
                      <input
                        type="url"
                        value={courseForm.link}
                        onChange={(e) => setCourseForm({ ...courseForm, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs"
                    >
                      {saving ? "Saving..." : "Publish Course"}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Courses ({courses.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.length > 0 ? (
                      courses.map((c) => (
                        <div key={c.id} className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
                          <div>
                            <h5 className="font-bold text-sm text-slate-800">{c.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">{c.description}</p>
                          </div>
                          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-450">
                            <span>Instructor: <strong>{c.instructor || "—"}</strong></span>
                            <span>{c.duration || "Self-paced"}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-450 italic text-xs">No courses published yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 border border-slate-200 rounded-xl p-5 bg-slate-50/50 h-fit">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Add Certificate Option</h4>
                  <form onSubmit={handleAddCertificate} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Certificate Name / Title</label>
                      <input
                        type="text"
                        required
                        value={certificateForm.title}
                        onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                        placeholder="e.g. Certified Full Stack Engineer"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Description / Requirements</label>
                      <textarea
                        required
                        rows={3}
                        value={certificateForm.description}
                        onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                        placeholder="Requirements to earn this certificate..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Issued By</label>
                      <input
                        type="text"
                        value={certificateForm.issuedBy}
                        onChange={(e) => setCertificateForm({ ...certificateForm, issuedBy: e.target.value })}
                        placeholder="e.g. Studentforge Platform"
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Verification Link / Template URL</label>
                      <input
                        type="url"
                        value={certificateForm.link}
                        onChange={(e) => setCertificateForm({ ...certificateForm, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-350 focus:outline-none focus:border-amber-500 rounded-lg text-slate-800 bg-white mt-1"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs"
                    >
                      {saving ? "Saving..." : "Add Certificate"}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Certificates ({certificates.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.length > 0 ? (
                      certificates.map((cert) => (
                        <div key={cert.id} className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between shadow-xs hover:border-slate-300 transition">
                          <div>
                            <h5 className="font-bold text-sm text-slate-800">{cert.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">{cert.description}</p>
                          </div>
                          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-450">
                            <span>Issuer: <strong>{cert.issuedBy || "Studentforge"}</strong></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-450 italic text-xs">No certificates listed yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
