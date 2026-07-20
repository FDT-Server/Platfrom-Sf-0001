import React, { useState } from "react";
import { Reference, ResumeData } from "../types";
import { IconArrowUp, IconArrowDown, IconTrash, IconCopy, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface ReferencesFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function ReferencesForm({ data, onChange }: ReferencesFormProps) {
  const list = data.references || [];
  const [expandedId, setExpandedId] = useState<string | null>(
    list.length > 0 ? list[0].id : null
  );

  const updateRefItem = (id: string, fields: Partial<Reference>) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, ...fields } : item
    );
    onChange({ references: updated });
  };

  const addRef = () => {
    const newId = `ref-${Date.now()}`;
    const newItem: Reference = {
      id: newId,
      name: "",
      relationship: "",
      company: "",
      email: "",
      phone: "",
    };
    onChange({ references: [...list, newItem] });
    setExpandedId(newId);
    toast.success("Added new reference entry");
  };

  const deleteRef = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = list.filter((item) => item.id !== id);
    onChange({ references: updated });
    if (expandedId === id) {
      setExpandedId(updated.length > 0 ? updated[0].id : null);
    }
    toast.success("Removed reference entry");
  };

  const duplicateRef = (item: Reference, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `ref-${Date.now()}`;
    const duplicated: Reference = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
    };
    const index = list.findIndex((x) => x.id === item.id);
    const updated = [...list];
    updated.splice(index + 1, 0, duplicated);
    onChange({ references: updated });
    setExpandedId(newId);
    toast.success("Duplicated reference entry");
  };

  const moveRef = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...list];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < updated.length) {
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      onChange({ references: updated });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>👤</span> References (Optional)
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Provide details of professional or academic references.
          </p>
        </div>

        <button
          type="button"
          onClick={addRef}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
        >
          <IconPlus className="w-4 h-4" /> Add Reference
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {list.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <span className="text-2xl">👤</span>
            <p className="text-xs text-slate-500 font-medium mt-2">No references added yet.</p>
            <button
              onClick={addRef}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 bg-transparent border-0 cursor-pointer"
            >
              Add your first reference
            </button>
          </div>
        ) : (
          list.map((item, idx) => {
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
                        {item.name || "New Reference Name"}
                      </span>
                      {item.relationship && <span className="h-1 w-1 bg-slate-400 rounded-full" />}
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.relationship} {item.company ? `at ${item.company}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => moveRef(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Up"
                    >
                      <IconArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => moveRef(idx, "down", e)}
                      disabled={idx === list.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Down"
                    >
                      <IconArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => duplicateRef(item, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent"
                      title="Duplicate"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => deleteRef(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-655 cursor-pointer border-0 bg-transparent"
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
                    {/* Reference Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Reference Name *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateRefItem(item.id, { name: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Jane Smith"
                      />
                    </div>

                    {/* Relationship / Title */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Relationship / Title *</label>
                      <input
                        type="text"
                        value={item.relationship}
                        onChange={(e) => updateRefItem(item.id, { relationship: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Engineering Director / Professor"
                      />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => updateRefItem(item.id, { company: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. TechForge Solutions"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) => updateRefItem(item.id, { email: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="jane.smith@techforge.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={item.phone || ""}
                        onChange={(e) => updateRefItem(item.id, { phone: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="+1 (555) 019-9999"
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
