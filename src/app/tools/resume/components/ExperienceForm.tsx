import React, { useState } from "react";
import { ResumeData, WorkExperience } from "../types";
import { IconArrowUp, IconArrowDown, IconTrash, IconCopy, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import IconPlus from "@tabler/icons-react/dist/esm/icons/IconPlus.mjs";
import { toast } from "sonner";

interface ExperienceFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.experience.length > 0 ? data.experience[0].id : null
  );

  const updateExpItem = (id: string, fields: Partial<WorkExperience>) => {
    const updated = data.experience.map((item) =>
      item.id === id ? { ...item, ...fields } : item
    );
    onChange({ experience: updated });
  };

  const addExp = () => {
    const newId = `exp-${Date.now()}`;
    const newItem: WorkExperience = {
      id: newId,
      company: "",
      role: "",
      duration: "",
      location: "",
      description: "",
      achievements: [""],
    };
    onChange({ experience: [...data.experience, newItem] });
    setExpandedId(newId);
    toast.success("Added new experience card");
  };

  const deleteExp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.experience.filter((item) => item.id !== id);
    onChange({ experience: updated });
    if (expandedId === id) {
      setExpandedId(updated.length > 0 ? updated[0].id : null);
    }
    toast.success("Removed experience card");
  };

  const duplicateExp = (item: WorkExperience, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `exp-${Date.now()}`;
    const duplicated: WorkExperience = {
      ...item,
      id: newId,
      company: `${item.company} (Copy)`,
    };
    const index = data.experience.findIndex((x) => x.id === item.id);
    const updated = [...data.experience];
    updated.splice(index + 1, 0, duplicated);
    onChange({ experience: updated });
    setExpandedId(newId);
    toast.success("Duplicated experience card");
  };

  const moveExp = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const list = [...data.experience];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < list.length) {
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      onChange({ experience: list });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>💼</span> Work Experience
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            List your relevant jobs, roles, and accomplishments.
          </p>
        </div>

        <button
          type="button"
          onClick={addExp}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
        >
          <IconPlus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.experience.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <span className="text-2xl">💼</span>
            <p className="text-xs text-slate-500 font-medium mt-2">No work experiences added yet.</p>
            <button
              onClick={addExp}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 bg-transparent border-0 cursor-pointer"
            >
              Add your first job
            </button>
          </div>
        ) : (
          data.experience.map((item, idx) => {
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
                        {item.company || "New Experience / Company"}
                      </span>
                      {item.company && item.role && <span className="h-1 w-1 bg-slate-400 rounded-full" />}
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.role}
                      </span>
                    </div>
                    {item.duration && (
                      <p className="text-[10px] text-slate-450 font-bold mt-0.5">{item.duration} {item.location ? `| ${item.location}` : ""}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => moveExp(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Up"
                    >
                      <IconArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => moveExp(idx, "down", e)}
                      disabled={idx === data.experience.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Down"
                    >
                      <IconArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => duplicateExp(item, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent"
                      title="Duplicate"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => deleteExp(item.id, e)}
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
                    {/* Company */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company *</label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => updateExpItem(item.id, { company: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Google / TechForge Solutions"
                      />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Role / Job Title *</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => updateExpItem(item.id, { role: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Lead Software Engineer"
                      />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration / Date Range *</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => updateExpItem(item.id, { duration: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. 2024 - Present or Jan 2023 - Dec 2024"
                      />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                      <input
                        type="text"
                        value={item.location || ""}
                        onChange={(e) => updateExpItem(item.id, { location: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. San Francisco, CA / Remote"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Summary of Role *</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateExpItem(item.id, { description: e.target.value })}
                        className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none transition font-medium min-h-24 leading-relaxed w-full bg-white"
                        placeholder="Briefly describe your key responsibilities and overall objective..."
                      />
                    </div>

                    {/* Accomplishments (Achievements) list */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Key Accomplishments (One per line)</label>
                      <textarea
                        value={item.achievements?.join("\n") || ""}
                        onChange={(e) => updateExpItem(item.id, { achievements: e.target.value.split("\n") })}
                        className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none transition font-medium min-h-28 leading-relaxed w-full bg-white"
                        placeholder="Migrated server architecture, saving 20% database cost&#10;Mentored 4 junior engineers in React/TypeScript best practices"
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
