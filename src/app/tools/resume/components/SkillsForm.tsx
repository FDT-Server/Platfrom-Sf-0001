import React, { useState } from "react";
import { ResumeData, Skill } from "../types";
import { IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface SkillsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillGroup, setNewSkillGroup] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(80);

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      toast.error("Skill name is required");
      return;
    }
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
      group: newSkillGroup.trim() || undefined,
    };
    onChange({ skills: [...data.skills, newSkill] });
    setNewSkillName("");
    setNewSkillGroup("");
    setNewSkillLevel(80);
    toast.success(`Added skill: ${newSkill.name}`);
  };

  const deleteSkill = (id: string) => {
    const updated = data.skills.filter((s) => s.id !== id);
    onChange({ skills: updated });
  };

  const updateSkillLevel = (id: string, level: number) => {
    const updated = data.skills.map((s) => (s.id === id ? { ...s, level } : s));
    onChange({ skills: updated });
  };

  const updateSkillFields = (id: string, fields: Partial<Skill>) => {
    const updated = data.skills.map((s) => (s.id === id ? { ...s, ...fields } : s));
    onChange({ skills: updated });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div>
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>🛠</span> Skills
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Add your core skills, categorize them by groups, and rate your proficiency level.
        </p>
      </div>

      {/* Add Skill Quick Form */}
      <form onSubmit={addSkill} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1">Skill Name *</label>
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none transition bg-white font-medium"
            placeholder="e.g. TypeScript / React"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-555 uppercase tracking-wider mb-1">Group / Category</label>
          <input
            type="text"
            value={newSkillGroup}
            onChange={(e) => setNewSkillGroup(e.target.value)}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none transition bg-white font-medium"
            placeholder="e.g. Frontend / Languages"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer border-0 w-full"
          >
            <IconPlus className="w-4 h-4" /> Add Skill
          </button>
        </div>

        <div className="sm:col-span-3 flex items-center gap-3 mt-1 pr-6 px-1">
          <label className="text-[8px] font-bold text-slate-555 uppercase tracking-wider shrink-0">Initial Proficiency ({newSkillLevel}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </form>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.skills.length === 0 ? (
          <div className="sm:col-span-2 text-center py-6 text-slate-400 text-xs font-medium">
            No skills added yet. Use the form above to add your core competencies.
          </div>
        ) : (
          data.skills.map((skill) => (
            <div key={skill.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 relative bg-slate-50/40 hover:border-slate-300 transition shadow-xs">
              <button
                type="button"
                onClick={() => deleteSkill(skill.id)}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-650 cursor-pointer border-0 bg-transparent"
                title="Delete skill"
              >
                <IconTrash className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 gap-2 pr-6">
                <div className="flex flex-col gap-0.5">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkillFields(skill.id, { name: e.target.value })}
                    className="bg-transparent border-0 border-b border-transparent focus:border-slate-400 text-xs font-bold text-slate-800 focus:outline-none py-0.5"
                    placeholder="Skill Name"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <input
                    type="text"
                    value={skill.group || ""}
                    onChange={(e) => updateSkillFields(skill.id, { group: e.target.value })}
                    className="bg-transparent border-0 border-b border-transparent focus:border-slate-300 text-[10px] text-slate-500 font-semibold focus:outline-none py-0.5"
                    placeholder="Group (e.g. Frontend)"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1 pr-6">
                <label className="text-[8px] font-bold text-slate-555 uppercase tracking-wider shrink-0">Level ({skill.level}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
