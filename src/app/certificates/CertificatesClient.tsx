"use client";

import React, { useState } from "react";
import { IconAward, IconClipboardCheck, IconExternalLink, IconPlus, IconTrash, IconSchool, IconRosette } from "@tabler/icons-react";
import { toast } from "sonner";

type PlatformCertificate = {
  id: string;
  title: string;
  description: string;
  issuedBy: string | null;
  link: string | null;
  createdAt: Date;
  imageUrl: string | null;
};

type UserCertificate = {
  id: string;
  userId: string;
  title: string;
  issuer: string | null;
  issueDate: string | null;
  credentialId: string | null;
  url: string;
  imageUrl: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function CertificatesClient({
  platformCertificates,
  initialUserCertificates,
}: {
  platformCertificates: PlatformCertificate[];
  initialUserCertificates: UserCertificate[];
}) {
  const [activeTab, setActiveTab] = useState<"platform" | "my">("platform");
  const [userCertificates, setUserCertificates] = useState<UserCertificate[]>(initialUserCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    url: "",
    imageUrl: "",
    type: "CERTIFICATE",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error("Title and Credential URL are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user-certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add credential");

      const newCert = await res.json();
      setUserCertificates((prev) => [newCert, ...prev]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        issuer: "",
        issueDate: "",
        credentialId: "",
        url: "",
        imageUrl: "",
        type: "CERTIFICATE",
      });
      toast.success("Credential added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add credential.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;
    
    try {
      const res = await fetch(`/api/user-certificates/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      setUserCertificates((prev) => prev.filter((cert) => cert.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete credential.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Header and Tabs */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200">
              <IconAward className="w-3.5 h-3.5" />
              Credentials Hub
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">Certificates &amp; Badges</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Verify your earned certifications from the platform or manage your external portfolio of learning credentials.
            </p>
          </div>
          {activeTab === "my" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
            >
              <IconPlus className="w-4 h-4" />
              Add Credential
            </button>
          )}
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-200 mt-8 gap-8">
          <button
            onClick={() => setActiveTab("platform")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "platform" ? "text-amber-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Platform Credentials
            {activeTab === "platform" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600 rounded-t-md"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "my" ? "text-amber-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Portfolio
            {activeTab === "my" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600 rounded-t-md"></span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col w-full min-h-[400px]">
        {activeTab === "platform" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformCertificates.length > 0 ? (
              platformCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col justify-between border border-slate-200 hover:shadow-md transition duration-200 rounded-2xl bg-white relative overflow-hidden"
                >
                  {cert.imageUrl ? (
                    <div className="h-40 w-full overflow-hidden relative border-b border-slate-100">
                      <img src={cert.imageUrl} className="w-full h-full object-cover" alt={cert.title} />
                    </div>
                  ) : (
                    <div className="h-32 bg-slate-50 w-full flex items-center justify-center border-b border-slate-100">
                       <IconAward className="w-12 h-12 text-slate-300" />
                    </div>
                  )}

                  <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-amber-50 border border-amber-100 text-amber-750 p-2 rounded-xl flex items-center justify-center">
                          <IconAward className="w-5 h-5 text-amber-700" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider flex items-center gap-1">
                          <IconClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                          VERIFIED
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-850 leading-snug">{cert.title}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">{cert.description}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-5">
                      <div className="text-xs text-slate-550 mb-3">
                        <span className="font-semibold text-slate-500">
                          Issuer: <strong className="text-slate-700">{cert.issuedBy || "Studentforge Platform"}</strong>
                        </span>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-lg py-2.5 text-center text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Verify Credential
                          <IconExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
                <IconAward className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-slate-700 font-bold">No Platform Credentials</h4>
                <p className="text-sm text-slate-500 mt-1">Check back later for new platform certificates.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "my" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertificates.length > 0 ? (
              userCertificates.map((cert) => (
                <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
                  <div>
                    {cert.imageUrl ? (
                      <div className="h-32 w-full overflow-hidden rounded-lg mb-4 border border-slate-100">
                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                    ) : null}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl ${cert.type === 'BADGE' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                        {cert.type === 'BADGE' ? <IconRosette className="w-6 h-6" /> : <IconSchool className="w-6 h-6" />}
                      </div>
                      <button 
                        onClick={() => handleDelete(cert.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition opacity-0 group-hover:opacity-100"
                        title="Delete Credential"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">{cert.title}</h4>
                    <p className="text-sm text-slate-600 font-medium">{cert.issuer || "Unknown Issuer"}</p>
                    
                    <div className="flex flex-col gap-1 mt-4 text-xs text-slate-500">
                      {cert.issueDate && <p>Issued: <span className="font-semibold text-slate-700">{cert.issueDate}</span></p>}
                      {cert.credentialId && <p>ID: <span className="font-mono text-slate-700">{cert.credentialId}</span></p>}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-2 text-center text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      View Credential
                      <IconExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <IconAward className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-slate-800 font-bold mb-1">Your Portfolio is Empty</h4>
                <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
                  Add your external certificates and badges here to keep all your credentials in one verified place.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2"
                >
                  <IconPlus className="w-4 h-4" />
                  Add Your First Credential
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Credential Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Add New Credential</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 rounded-md">
                <IconTrash className="w-4 h-4 hidden" /> {/* Just to keep IconTrash imported and used if needed, actually we need IconX but I'll use text for close */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-cert-form" onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credential Type <span className="text-red-500">*</span></label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700"
                    >
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="BADGE">Badge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Issuing Organization</label>
                    <input 
                      type="text" 
                      name="issuer"
                      placeholder="e.g. Amazon Web Services" 
                      value={formData.issuer} 
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    name="title"
                    placeholder="e.g. AWS Certified Cloud Practitioner" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credential URL <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="url" 
                    name="url"
                    placeholder="https://www.credly.com/badges/..." 
                    value={formData.url} 
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credential Image</label>
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-3 hover:bg-slate-50 transition cursor-pointer relative overflow-hidden group flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {formData.imageUrl ? (
                       <img src={formData.imageUrl} className="h-12 w-12 rounded-lg object-cover shadow-sm border border-slate-200" alt="Preview" />
                    ) : (
                      <div className="bg-white border border-slate-200 text-amber-500 p-2 rounded-lg shadow-sm">
                         <IconAward className="w-5 h-5 group-hover:text-amber-600 transition-colors" />
                      </div>
                    )}
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-700">{formData.imageUrl ? "Image Selected" : "Upload Credential Image"}</span>
                       <span className="text-xs text-slate-400 font-medium">Max 2MB (JPG, PNG)</span>
                    </div>
                  </div>
                  {formData.imageUrl && (
                    <div className="flex justify-end mt-1.5">
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); setFormData(prev => ({...prev, imageUrl: ""})) }}
                        className="text-xs text-red-500 font-bold hover:text-red-600 transition"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Issue Date</label>
                    <input 
                      type="text" 
                      name="issueDate"
                      placeholder="e.g. Jun 2024" 
                      value={formData.issueDate} 
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credential ID</label>
                    <input 
                      type="text" 
                      name="credentialId"
                      placeholder="Optional" 
                      value={formData.credentialId} 
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-cert-form"
                disabled={loading}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? "Saving..." : "Save Credential"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
