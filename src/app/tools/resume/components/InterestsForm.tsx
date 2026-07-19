import React, { useState } from "react";
import { ResumeData } from "../types";
import { IconTrash } from "@tabler/icons-react";
import IconPlus from "@tabler/icons-react/dist/esm/icons/IconPlus.mjs";
import { toast } from "sonner";

interface InterestsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function InterestsForm({ data, onChange }: InterestsFormProps) {
  const [newInterest, setNewInterest] = useState("");
  const list = data.interests || [];

  const addInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (list.includes(newInterest.trim())) {
      toast.error("Interest already exists");
      return;
    }
    const updated = [...list, newInterest.trim()];
    onChange({ interests: updated });
    setNewInterest("");
  };

  const deleteInterest = (interest: string) => {
    const updated = list.filter((i) => i !== interest);
    onChange({ interests: updated });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div>
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>🎯</span> Personal Interests
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Add hobbies, activities, or topics you are passionate about (e.g. Open Source, Hiking).
        </p>
      </div>

      <form onSubmit={addInterest} className="flex gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none transition bg-white font-medium flex-1"
          placeholder="e.g. Web Performance / Photography"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer border-0 shrink-0"
        >
          <IconPlus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {list.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium w-full">
            No interests added yet.
          </div>
        ) : (
          list.map((interest, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 transition select-none"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => deleteInterest(interest)}
                className="text-slate-450 hover:text-red-650 focus:outline-none cursor-pointer border-0 bg-transparent text-[10px] font-bold"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
