import React, { useState } from "react";
import { ResumeData } from "../types";
import { IconTrash, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface AchievementsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function AchievementsForm({ data, onChange }: AchievementsFormProps) {
  const [newAchievement, setNewAchievement] = useState("");
  const list = data.achievements || [];

  const addAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.trim()) return;
    const updated = [...list, newAchievement.trim()];
    onChange({ achievements: updated });
    setNewAchievement("");
    toast.success("Added achievement");
  };

  const deleteAchievement = (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    onChange({ achievements: updated });
  };

  const updateAchievement = (index: number, text: string) => {
    const updated = list.map((item, i) => (i === index ? text : item));
    onChange({ achievements: updated });
  };

  const moveAchievement = (index: number, direction: "up" | "down") => {
    const updated = [...list];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < updated.length) {
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      onChange({ achievements: updated });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div>
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>🏆</span> Achievements & Honors
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          List key awards, accomplishments, or recognitions you have received.
        </p>
      </div>

      <form onSubmit={addAchievement} className="flex gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
        <input
          type="text"
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none transition bg-white font-medium flex-1"
          placeholder="e.g. Dean's list for academic excellence"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer border-0 shrink-0"
        >
          <IconPlus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {list.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No achievements added yet.
          </div>
        ) : (
          list.map((ach, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between bg-slate-50/40 hover:border-slate-300 transition shadow-xs gap-3">
              <input
                type="text"
                value={ach}
                onChange={(e) => updateAchievement(idx, e.target.value)}
                className="bg-transparent border-0 border-b border-transparent focus:border-slate-400 text-xs font-semibold text-slate-800 focus:outline-none py-1 flex-1 min-w-0"
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveAchievement(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                >
                  <IconArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveAchievement(idx, "down")}
                  disabled={idx === list.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                >
                  <IconArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteAchievement(idx)}
                  className="p-1 text-slate-400 hover:text-red-655 cursor-pointer border-0 bg-transparent ml-1"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
