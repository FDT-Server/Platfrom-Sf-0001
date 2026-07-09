"use client";

import React, { useState } from "react";
import { IconCalendarEvent, IconShieldLock } from "@tabler/icons-react";

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
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface EventsDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
  };
  initialEvents: EventInfo[];
}

export default function EventsDashboardContent({ adminUser, initialEvents }: EventsDashboardContentProps) {
  const [events, setEvents] = useState<EventInfo[]>(initialEvents);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
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
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents((prev) => [data.event, ...prev]);
        setSuccess(`Event "${form.title}" published successfully!`);
        setForm({
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
          imageUrl: "",
        });
      } else {
        setError(data.error || "Failed to publish event.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 md:p-10 shadow-sm animate-fadeIn relative">
      <div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200/50">
              <IconShieldLock className="w-3.5 h-3.5" />
              SF Events Console
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Welcome, {adminUser.fullName}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add and publish dynamic Trainee Academy events.
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          <div className="lg:col-span-1 border border-slate-200/60 rounded-xl p-5 bg-slate-50/50 h-fit">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1">
              <IconCalendarEvent className="w-4 h-4 text-amber-600" />
              Publish Event
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Event Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Scaling Postgres Backends"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Event Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide scope details..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Day</label>
                  <input
                    type="text"
                    required
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Month</label>
                  <input
                    type="text"
                    required
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    placeholder="e.g. AUGUST"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Time</label>
                  <input
                    type="text"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g. 6:00 PM IST"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Duration</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 60 mins"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-600">Speaker Name</label>
                <input
                  type="text"
                  required
                  value={form.speakerName}
                  onChange={(e) => setForm({ ...form, speakerName: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Speaker Title</label>
                  <input
                    type="text"
                    required
                    value={form.speakerTitle}
                    onChange={(e) => setForm({ ...form, speakerTitle: e.target.value })}
                    placeholder="Lead Advocate"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Speaker Company</label>
                  <input
                    type="text"
                    required
                    value={form.speakerCompany}
                    onChange={(e) => setForm({ ...form, speakerCompany: e.target.value })}
                    placeholder="Prisma"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-600">Event Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Join / Zoom Link</label>
                <input
                  type="url"
                  required
                  value={form.joinLink}
                  onChange={(e) => setForm({ ...form, joinLink: e.target.value })}
                  placeholder="https://zoom.us/..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                >
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Meetup">Meetup</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs border-0 mt-2"
              >
                {saving ? "Publishing..." : "Publish Event"}
              </button>
            </form>
          </div>

          
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Published Events Table</h4>
            <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 font-bold text-slate-600">
                    <th className="py-3 px-4 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Speaker</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Schedule</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/40 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-850">{evt.title}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <strong>{evt.speakerName}</strong> ({evt.speakerCompany})
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {evt.day} {evt.month} • {evt.time}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 border border-amber-200/40 rounded text-[10px] font-bold">
                            {evt.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {evt.imageUrl ? (
                            <a href={evt.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-450 italic">No events published.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
