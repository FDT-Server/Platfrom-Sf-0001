"use client";

import React, { useState } from "react";
import { IconLibrary, IconShieldLock } from "@tabler/icons-react";

interface ResourceInfo {
  id: string;
  date: string;
  publisher: string;
  title: string;
  category: string;
  badgeColor: string;
  headerBg: string;
  link: string;
  imageUrl: string;
  createdAt: string;
}

interface ResourcesDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
  };
  initialResources: ResourceInfo[];
}

export default function ResourcesDashboardContent({ adminUser, initialResources }: ResourcesDashboardContentProps) {
  const [resources, setResources] = useState<ResourceInfo[]>(initialResources);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    publisher: "",
    category: "Database",
    link: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResources((prev) => [data.resource, ...prev]);
        setSuccess(`Resource "${form.title}" added successfully!`);
        setForm({
          title: "",
          publisher: "",
          category: "Database",
          link: "",
          imageUrl: "",
        });
      } else {
        setError(data.error || "Failed to add resource.");
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
              SF Resources Console
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Welcome, {adminUser.fullName}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add and publish curated Trainee Academy learning resources.
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
              <IconLibrary className="w-4 h-4 text-amber-600" />
              Add Resource
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-650">Resource Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Next.js App Router API"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Publisher</label>
                <input
                  type="text"
                  required
                  value={form.publisher}
                  onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                  placeholder="e.g. Vercel"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
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
                <label className="font-semibold text-slate-650">Resource Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Resource Link</label>
                <input
                  type="url"
                  required
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-lg transition duration-150 cursor-pointer shadow-xs border-0 mt-2"
              >
                {saving ? "Adding..." : "Add Resource"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Curated Resources Table</h4>
            <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 font-bold text-slate-600">
                    <th className="py-3 px-4 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Publisher</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Publish Date</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resources.length > 0 ? (
                    resources.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/40 transition">
                        <td className="py-3 px-4 font-bold text-slate-850">
                          <a href={r.link} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
                            {r.title}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{r.publisher}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block font-bold text-[9px] px-2 py-0.5 rounded border border-slate-200/40 ${r.badgeColor}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-450 font-mono">{r.date}</td>
                        <td className="py-3 px-4 text-center">
                          {r.imageUrl ? (
                            <a href={r.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-450 italic">No resources added yet.</td>
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
