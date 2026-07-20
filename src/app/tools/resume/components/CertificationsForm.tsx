import React, { useState } from "react";
import { Certification, ResumeData } from "../types";
import { IconArrowUp, IconArrowDown, IconTrash, IconCopy, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface CertificationsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.certifications.length > 0 ? data.certifications[0].id : null
  );

  const updateCertItem = (id: string, fields: Partial<Certification>) => {
    const updated = data.certifications.map((item) =>
      item.id === id ? { ...item, ...fields, link: fields.credentialUrl !== undefined ? fields.credentialUrl : item.link } : item
    );
    onChange({ certifications: updated });
  };

  const addCert = () => {
    const newId = `cert-${Date.now()}`;
    const newItem: Certification = {
      id: newId,
      title: "",
      issuer: "",
      date: "",
      link: "",
      credentialUrl: "",
    };
    onChange({ certifications: [...data.certifications, newItem] });
    setExpandedId(newId);
    toast.success("Added new certification card");
  };

  const deleteCert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.certifications.filter((item) => item.id !== id);
    onChange({ certifications: updated });
    if (expandedId === id) {
      setExpandedId(updated.length > 0 ? updated[0].id : null);
    }
    toast.success("Removed certification card");
  };

  const duplicateCert = (item: Certification, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `cert-${Date.now()}`;
    const duplicated: Certification = {
      ...item,
      id: newId,
      title: `${item.title} (Copy)`,
    };
    const index = data.certifications.findIndex((x) => x.id === item.id);
    const updated = [...data.certifications];
    updated.splice(index + 1, 0, duplicated);
    onChange({ certifications: updated });
    setExpandedId(newId);
    toast.success("Duplicated certification card");
  };

  const moveCert = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const list = [...data.certifications];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < list.length) {
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      onChange({ certifications: list });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>🏆</span> Certifications
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Add certificates, credentials, and verification links.
          </p>
        </div>

        <button
          type="button"
          onClick={addCert}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
        >
          <IconPlus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.certifications.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <span className="text-2xl">🏆</span>
            <p className="text-xs text-slate-500 font-medium mt-2">No certifications added yet.</p>
            <button
              onClick={addCert}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 bg-transparent border-0 cursor-pointer"
            >
              Add your first certificate
            </button>
          </div>
        ) : (
          data.certifications.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`border border-slate-200 rounded-2xl transition duration-150 overflow-hidden ${
                  isExpanded ? "bg-white shadow-md border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 shadow-xs"
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-800 truncate">
                        {item.title || "New Certificate Name"}
                      </span>
                      {item.issuer && <span className="h-1 w-1 bg-slate-400 rounded-full" />}
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.issuer}
                      </span>
                    </div>
                    {item.date && (
                      <p className="text-[10px] text-slate-455 font-bold mt-0.5">{item.date}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => moveCert(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Up"
                    >
                      <IconArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => moveCert(idx, "down", e)}
                      disabled={idx === data.certifications.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Down"
                    >
                      <IconArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => duplicateCert(item, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent"
                      title="Duplicate"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => deleteCert(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer border-0 bg-transparent"
                      title="Delete"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent ml-1"
                    >
                      {isExpanded ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Certificate Title */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Certificate Name *</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateCertItem(item.id, { title: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. AWS Certified Developer – Associate"
                      />
                    </div>

                    {/* Organization / Issuer */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Organization / Issuer *</label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) => updateCertItem(item.id, { issuer: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date *</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateCertItem(item.id, { date: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. 2025"
                      />
                    </div>

                    {/* Verification Link */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Credential URL</label>
                      <input
                        type="text"
                        value={item.credentialUrl || item.link || ""}
                        onChange={(e) => updateCertItem(item.id, { credentialUrl: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="https://aws.amazon.com/verify/abc123xyz"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
