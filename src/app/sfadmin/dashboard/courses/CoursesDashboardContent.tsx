"use client";

import React, { useState } from "react";
import { IconSchool, IconShieldLock, IconBook, IconTrash, IconX, IconPlus } from "@tabler/icons-react";

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  link: string;
  imageUrl: string;
  skillsGain: string;
  outcomes: string;
  price: number;
  createdAt: string;
}

interface CourseWeekInfo {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  description: string;
  videoLink: string;
  createdAt: string;
}

interface CoursesDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
  };
  initialCourses: CourseInfo[];
}

export default function CoursesDashboardContent({ adminUser, initialCourses }: CoursesDashboardContentProps) {
  const [courses, setCourses] = useState<CourseInfo[]>(initialCourses);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const [weeks, setWeeks] = useState<CourseWeekInfo[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState(false);
  const [savingWeek, setSavingWeek] = useState(false);
  const [weekForm, setWeekForm] = useState({
    weekNumber: "1",
    title: "",
    description: "",
    videoLink: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    instructor: "",
    link: "",
    imageUrl: "",
    skillsGain: "",
    outcomes: "",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCourses((prev) => [data.course, ...prev]);
        setSuccess(`Course "${form.title}" published successfully!`);
        setForm({
          title: "",
          description: "",
          duration: "",
          instructor: "",
          link: "",
          imageUrl: "",
          skillsGain: "",
          outcomes: "",
          price: "",
        });
      } else {
        setError(data.error || "Failed to publish course.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach server.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCurriculum = async (course: CourseInfo) => {
    setSelectedCourse(course);
    setLoadingWeeks(true);
    setWeeks([]);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/sfadmin/courses/${course.id}/weeks`);
      const data = await res.json();
      if (res.ok && data.success) {
        setWeeks(data.weeks);
        setWeekForm((prev) => ({
          ...prev,
          weekNumber: String(data.weeks.length + 1),
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load weeks for course.");
    } finally {
      setLoadingWeeks(false);
    }
  };

  const handleAddWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setSavingWeek(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/sfadmin/courses/${selectedCourse.id}/weeks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weekForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const nextWeeks = [...weeks, data.week].sort((a, b) => a.weekNumber - b.weekNumber);
        setWeeks(nextWeeks);
        setSuccess(`Week ${weekForm.weekNumber} added successfully!`);
        setWeekForm({
          title: "",
          description: "",
          videoLink: "",
          weekNumber: String(nextWeeks.length + 1),
        });
      } else {
        setError(data.error || "Failed to add week.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add week.");
    } finally {
      setSavingWeek(false);
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    if (!confirm("Are you sure you want to delete this week's curriculum?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/sfadmin/courses/${selectedCourse?.id}/weeks?weekId=${weekId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const remaining = weeks.filter((w) => w.id !== weekId);
        setWeeks(remaining);
        setSuccess("Week curriculum deleted successfully!");
        setWeekForm((prev) => ({
          ...prev,
          weekNumber: String(remaining.length + 1),
        }));
      } else {
        setError(data.error || "Failed to delete week.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete week.");
    }
  };

  return (
    <div className="flex h-fit w-full flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 md:p-10 shadow-sm animate-fadeIn relative">
      <div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200/50">
              <IconShieldLock className="w-3.5 h-3.5" />
              SF Courses Console
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Welcome, {adminUser.fullName}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add courses and manage weekly curriculums with video lectures.
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
              <IconSchool className="w-4 h-4 text-amber-600" />
              Publish Course
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-655">Course Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Master React 19 from Scratch"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-655">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide scope details..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-855 bg-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-655">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 15 hours"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-655">Instructor</label>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    placeholder="e.g. Dan Abramov"
                    className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-655">Course Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-655">Course Link / Syllabus URL</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-655">Course Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 49.99 (use 0 for Free)"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-655">Skills You Gain (comma-separated)</label>
                <input
                  type="text"
                  value={form.skillsGain}
                  onChange={(e) => setForm({ ...form, skillsGain: e.target.value })}
                  placeholder="e.g. Next.js, React Server Components, CSS Modules"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-655">Outcomes You Get (comma-separated)</label>
                <input
                  type="text"
                  value={form.outcomes}
                  onChange={(e) => setForm({ ...form, outcomes: e.target.value })}
                  placeholder="e.g. Build 5 SaaS projects, Access private Discord, Get certified"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs border-0 mt-2"
              >
                {saving ? "Publishing..." : "Publish Course"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Published Courses Table</h4>
            <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
              <table className="w-full min-w-[800px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 font-bold text-slate-600">
                    <th className="py-3 px-4 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Instructor</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Duration</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Image</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Curriculum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/40 transition">
                        <td className="py-3 px-4 font-bold text-slate-855">
                          {c.link ? (
                            <a href={c.link} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
                              {c.title}
                            </a>
                          ) : (
                            c.title
                          )}
                          <p className="text-[10px] text-slate-450 font-normal mt-0.5 line-clamp-1">{c.description}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            <span className="text-[9px] font-extrabold text-amber-750 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 font-mono">
                              Price: {c.price === 0 ? "Free" : `$${c.price}`}
                            </span>
                            {c.skillsGain && (
                              <span className="text-[9px] text-slate-400 font-semibold truncate max-w-xs">
                                Skills: {c.skillsGain}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-semibold">{c.instructor || "—"}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{c.duration || "Self-paced"}</td>
                        <td className="py-3 px-4 text-center">
                          {c.imageUrl ? (
                            <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleOpenCurriculum(c)}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50 rounded-lg px-2.5 py-1.5 font-bold flex items-center gap-1.5 mx-auto select-none cursor-pointer transition"
                          >
                            <IconBook className="w-3.5 h-3.5" />
                            Curriculum
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-450 italic">No courses published yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/30 rounded uppercase tracking-wider">
                  Syllabus Builder
                </span>
                <h4 className="text-base font-extrabold text-slate-800 mt-1">
                  Manage Weeks: {selectedCourse.title}
                </h4>
              </div>
              <button
                onClick={() => { setSelectedCourse(null); setError(""); setSuccess(""); }}
                className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4 border-r border-slate-150 pr-0 md:pr-6">
                <h5 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <IconPlus className="w-4 h-4 text-amber-600" />
                  Add Weekly syllabus
                </h5>

                <form onSubmit={handleAddWeek} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-650">Week Number</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={weekForm.weekNumber}
                      onChange={(e) => setWeekForm({ ...weekForm, weekNumber: e.target.value })}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-650">Week Title</label>
                    <input
                      type="text"
                      required
                      value={weekForm.title}
                      onChange={(e) => setWeekForm({ ...weekForm, title: e.target.value })}
                      placeholder="e.g. Week 1: Introduction to server actions"
                      className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-650">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={weekForm.description}
                      onChange={(e) => setWeekForm({ ...weekForm, description: e.target.value })}
                      placeholder="e.g. Cover routing, data fetching methods..."
                      className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-650">Course Video Link / Recording URL</label>
                    <input
                      type="url"
                      value={weekForm.videoLink}
                      onChange={(e) => setWeekForm({ ...weekForm, videoLink: e.target.value })}
                      placeholder="https://youtube.com/embed/... or loom.com"
                      className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingWeek}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs border-0 mt-2"
                  >
                    {savingWeek ? "Saving..." : "Add Week to Course"}
                  </button>
                </form>
              </div>

              <div className="space-y-4 flex flex-col overflow-hidden">
                <h5 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Current Weeks Curriculum</span>
                  <span className="text-slate-400 font-semibold">{weeks.length} Weeks</span>
                </h5>

                <div className="overflow-y-auto pr-1 flex-1 space-y-3 scrollbar-thin">
                  {loadingWeeks ? (
                    <p className="text-slate-450 italic text-xs py-4 text-center">Loading weeks curriculum...</p>
                  ) : weeks.length > 0 ? (
                    weeks.map((w) => (
                      <div key={w.id} className="border border-slate-150 rounded-xl p-3 bg-slate-50/30 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50/80 border border-amber-200/40 rounded px-1.5 py-0.5 uppercase tracking-wider font-mono">
                              Week {w.weekNumber}
                            </span>
                            <span className="font-bold text-slate-800">{w.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{w.description}</p>
                          {w.videoLink && (
                            <span className="text-[10px] text-blue-600 font-medium block pt-1 break-all">
                              Video: <a href={w.videoLink} target="_blank" rel="noreferrer" className="underline">{w.videoLink}</a>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteWeek(w.id)}
                          className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition shrink-0"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-450 italic text-xs py-8 text-center bg-slate-50/30 border border-dashed border-slate-200 rounded-xl">
                      No weeks curriculum added yet. Publish week links using the form on the left.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
