"use client";

import React, { useState } from "react";
import { IconAward, IconShieldLock } from "@tabler/icons-react";

interface CertificateInfo {
  id: string;
  title: string;
  description: string;
  issuedBy: string;
  link: string;
  imageUrl: string;
  createdAt: string;
}

interface CertificatesDashboardContentProps {
  adminUser: {
    fullName: string;
    email: string;
  };
  initialCertificates: CertificateInfo[];
}

export default function CertificatesDashboardContent({ adminUser, initialCertificates }: CertificatesDashboardContentProps) {
  const [certificates, setCertificates] = useState<CertificateInfo[]>(initialCertificates);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    issuedBy: "",
    link: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/sfadmin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertificates((prev) => [data.certificate, ...prev]);
        setSuccess(`Certificate template "${form.title}" published successfully!`);
        setForm({
          title: "",
          description: "",
          issuedBy: "",
          link: "",
          imageUrl: "",
        });
      } else {
        setError(data.error || "Failed to publish certificate template.");
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
              SF Certificates Console
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              Welcome, {adminUser.fullName}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add and publish Trainee Academy certificate templates and badge tracks.
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
              <IconAward className="w-4 h-4 text-amber-600" />
              Publish Certificate
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-650">Certificate Name / Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Full Stack Developer Core Certificate"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Description / Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide scope details..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Issued By</label>
                <input
                  type="text"
                  value={form.issuedBy}
                  onChange={(e) => setForm({ ...form, issuedBy: e.target.value })}
                  placeholder="e.g. Studentforge"
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Certificate Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-slate-200/70 focus:outline-none focus:border-amber-500 rounded-lg text-slate-850 bg-white mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-650">Verification / Template Link</label>
                <input
                  type="url"
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
                {saving ? "Publishing..." : "Publish Certificate"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Published Certificate Templates</h4>
            <div className="w-full overflow-x-auto border border-slate-200/60 rounded-xl">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 font-bold text-slate-600">
                    <th className="py-3 px-4 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Issuer</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/40 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-850">
                          {cert.link ? (
                            <a href={cert.link} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
                              {cert.title}
                            </a>
                          ) : (
                            cert.title
                          )}
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{cert.description}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{cert.issuedBy || "Studentforge"}</td>
                        <td className="py-3.5 px-4 text-center">
                          {cert.imageUrl ? (
                            <a href={cert.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-450 italic">No certificates templates published yet.</td>
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
