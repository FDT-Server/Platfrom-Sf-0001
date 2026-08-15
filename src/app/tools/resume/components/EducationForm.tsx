import React, { useState } from "react";
import { Education, ResumeData } from "../types";
import { IconArrowUp, IconArrowDown, IconTrash, IconCopy, IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface EducationFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.education.length > 0 ? data.education[0].id : null
  );

  const updateEduItem = (id: string, fields: Partial<Education>) => {
    const updated = data.education.map((item) =>
      item.id === id ? { ...item, ...fields } : item
    );
    onChange({ education: updated });
  };

  const addEdu = () => {
    const newId = `edu-${Date.now()}`;
    const newItem: Education = {
      id: newId,
      school: "",
      degree: "",
      fieldOfStudy: "",
      branch: "",
      duration: "",
      grade: "",
      description: "",
    };
    onChange({ education: [...data.education, newItem] });
    setExpandedId(newId);
    toast.success("Added new education entry");
  };

  const deleteEdu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.education.filter((item) => item.id !== id);
    onChange({ education: updated });
    if (expandedId === id) {
      setExpandedId(updated.length > 0 ? updated[0].id : null);
    }
    toast.success("Removed education entry");
  };

  const duplicateEdu = (item: Education, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `edu-${Date.now()}`;
    const duplicated: Education = {
      ...item,
      id: newId,
      school: `${item.school} (Copy)`,
    };
    const index = data.education.findIndex((x) => x.id === item.id);
    const updated = [...data.education];
    updated.splice(index + 1, 0, duplicated);
    onChange({ education: updated });
    setExpandedId(newId);
    toast.success("Duplicated education entry");
  };

  const moveEdu = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const list = [...data.education];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < list.length) {
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      onChange({ education: list });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>🎓</span> Education
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Manage your schools, degrees, grades, and graduation dates.
          </p>
        </div>

        <button
          type="button"
          onClick={addEdu}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
        >
          <IconPlus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.education.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <span className="text-2xl">🎓</span>
            <p className="text-xs text-slate-500 font-medium mt-2">No education entries added yet.</p>
            <button
              onClick={addEdu}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 bg-transparent border-0 cursor-pointer"
            >
              Add your first school
            </button>
          </div>
        ) : (
          data.education.map((item, idx) => {
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
                        {item.school || "New Education / Institution"}
                      </span>
                      {item.school && item.degree && <span className="h-1 w-1 bg-slate-400 rounded-full" />}
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ""}
                      </span>
                    </div>
                    {item.duration && (
                      <p className="text-[10px] text-slate-450 font-bold mt-0.5">{item.duration}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => moveEdu(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Up"
                    >
                      <IconArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => moveEdu(idx, "down", e)}
                      disabled={idx === data.education.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Down"
                    >
                      <IconArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => duplicateEdu(item, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent"
                      title="Duplicate"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => deleteEdu(item.id, e)}
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
                    {/* School Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Institution *</label>
                      <input
                        type="text"
                        value={item.school}
                        onChange={(e) => updateEduItem(item.id, { school: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. State University of Technology"
                      />
                    </div>

                    {/* Degree */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Degree *</label>
                      <input
                        type="text"
                        value={item.degree}
                        onChange={(e) => updateEduItem(item.id, { degree: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>

                    {/* Field of Study */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={item.fieldOfStudy}
                        onChange={(e) => updateEduItem(item.id, { fieldOfStudy: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Computer Science"
                      />
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Branch</label>
                      <input
                        type="text"
                        value={item.branch || ""}
                        onChange={(e) => updateEduItem(item.id, { branch: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Software Systems / Cybersecurity"
                      />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration / Date Range *</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => updateEduItem(item.id, { duration: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. 2019 - 2023"
                      />
                    </div>

                    {/* Grade (GPA / CGPA) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CGPA / GPA Grade</label>
                      <input
                        type="text"
                        value={item.grade || ""}
                        onChange={(e) => updateEduItem(item.id, { grade: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. GPA: 3.8/4.0 or 8.5 CGPA"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Description / Thesis / Honors</label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => updateEduItem(item.id, { description: e.target.value })}
                        className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none transition font-medium min-h-20 leading-relaxed w-full bg-white"
                        placeholder="Detail specialized courses, thesis work, or academic achievements..."
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
