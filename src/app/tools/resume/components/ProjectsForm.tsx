import React, { useState } from "react";
import { Project, ResumeData } from "../types";
import { IconArrowUp, IconArrowDown, IconTrash, IconCopy, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface ProjectsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.projects.length > 0 ? data.projects[0].id : null
  );

  const updateProjItem = (id: string, fields: Partial<Project>) => {
    const updated = data.projects.map((item) =>
      item.id === id ? { ...item, ...fields } : item
    );
    onChange({ projects: updated });
  };

  const addProj = () => {
    const newId = `proj-${Date.now()}`;
    const newItem: Project = {
      id: newId,
      name: "",
      description: "",
      technologies: [],
      githubUrl: "",
      liveUrl: "",
    };
    onChange({ projects: [...data.projects, newItem] });
    setExpandedId(newId);
    toast.success("Added new project entry");
  };

  const deleteProj = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = data.projects.filter((item) => item.id !== id);
    onChange({ projects: updated });
    if (expandedId === id) {
      setExpandedId(updated.length > 0 ? updated[0].id : null);
    }
    toast.success("Removed project entry");
  };

  const duplicateProj = (item: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `proj-${Date.now()}`;
    const duplicated: Project = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
    };
    const index = data.projects.findIndex((x) => x.id === item.id);
    const updated = [...data.projects];
    updated.splice(index + 1, 0, duplicated);
    onChange({ projects: updated });
    setExpandedId(newId);
    toast.success("Duplicated project entry");
  };

  const moveProj = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const list = [...data.projects];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < list.length) {
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      onChange({ projects: list });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>📂</span> Projects
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Display your personal projects, technical stacks, and direct links.
          </p>
        </div>

        <button
          type="button"
          onClick={addProj}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
        >
          <IconPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.projects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <span className="text-2xl">📂</span>
            <p className="text-xs text-slate-500 font-medium mt-2">No projects added yet.</p>
            <button
              onClick={addProj}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 bg-transparent border-0 cursor-pointer"
            >
              Add your first project
            </button>
          </div>
        ) : (
          data.projects.map((item, idx) => {
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
                        {item.name || "New Project Name"}
                      </span>
                      {item.technologies && item.technologies.length > 0 && <span className="h-1 w-1 bg-slate-400 rounded-full" />}
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.technologies?.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => moveProj(idx, "up", e)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Up"
                    >
                      <IconArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => moveProj(idx, "down", e)}
                      disabled={idx === data.projects.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                      title="Move Down"
                    >
                      <IconArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => duplicateProj(item, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer border-0 bg-transparent"
                      title="Duplicate"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => deleteProj(item.id, e)}
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
                    {/* Project Name */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Project Name *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateProjItem(item.id, { name: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. AI Content Generator"
                      />
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={item.technologies?.join(", ") || ""}
                        onChange={(e) => updateProjItem(item.id, { technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="e.g. Next.js, Tailwind CSS, Prisma, OpenAI"
                      />
                    </div>

                    {/* GitHub Link */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={item.githubUrl || ""}
                        onChange={(e) => updateProjItem(item.id, { githubUrl: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="https://github.com/username/project"
                      />
                    </div>

                    {/* Live URL */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={item.liveUrl || ""}
                        onChange={(e) => updateProjItem(item.id, { liveUrl: e.target.value })}
                        className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                        placeholder="https://myproject.com"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1">Project Description *</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateProjItem(item.id, { description: e.target.value })}
                        className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none transition font-medium min-h-24 leading-relaxed w-full bg-white"
                        placeholder="Summarize the core capabilities and your unique contributions to the project..."
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
