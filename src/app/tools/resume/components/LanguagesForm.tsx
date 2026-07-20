import React, { useState } from "react";
import { Language, ResumeData } from "../types";
import { IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface LanguagesFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function LanguagesForm({ data, onChange }: LanguagesFormProps) {
  const [newLangName, setNewLangName] = useState("");
  const [newLangLevel, setNewLangLevel] = useState("Professional");

  const addLang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) {
      toast.error("Language name is required");
      return;
    }
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: newLangName.trim(),
      level: newLangLevel,
    };
    onChange({ languages: [...data.languages, newLang] });
    setNewLangName("");
    setNewLangLevel("Professional");
    toast.success(`Added language: ${newLang.name}`);
  };

  const deleteLang = (id: string) => {
    const updated = data.languages.filter((l) => l.id !== id);
    onChange({ languages: updated });
  };

  const updateLangLevel = (id: string, level: string) => {
    const updated = data.languages.map((l) => (l.id === id ? { ...l, level } : l));
    onChange({ languages: updated });
  };

  const updateLangName = (id: string, name: string) => {
    const updated = data.languages.map((l) => (l.id === id ? { ...l, name } : l));
    onChange({ languages: updated });
  };

  const levels = ["Native / Bilingual", "Fluent / Professional", "Intermediate", "Elementary"];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div>
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>🗣</span> Languages
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          List the languages you speak and your proficiency level.
        </p>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={addLang} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1">Language Name *</label>
          <input
            type="text"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none transition bg-white font-medium"
            placeholder="e.g. English / Spanish"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-555 uppercase tracking-wider mb-1">Proficiency Level</label>
          <select
            value={newLangLevel}
            onChange={(e) => setNewLangLevel(e.target.value)}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none transition bg-white font-medium pr-6"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer border-0 w-full"
          >
            <IconPlus className="w-4 h-4" /> Add Language
          </button>
        </div>
      </form>

      {/* Languages List */}
      <div className="flex flex-col gap-3">
        {data.languages.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No languages added yet.
          </div>
        ) : (
          data.languages.map((lang) => (
            <div key={lang.id} className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50/40 hover:border-slate-300 transition shadow-xs gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateLangName(lang.id, e.target.value)}
                  className="bg-transparent border-0 border-b border-transparent focus:border-slate-400 text-xs font-bold text-slate-800 focus:outline-none py-0.5"
                  placeholder="Language"
                />

                <select
                  value={lang.level}
                  onChange={(e) => updateLangLevel(lang.id, e.target.value)}
                  className="bg-transparent border-0 border-b border-transparent focus:border-slate-400 text-xs font-semibold text-slate-500 focus:outline-none py-0.5"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => deleteLang(lang.id)}
                className="p-1 text-slate-400 hover:text-red-655 cursor-pointer border-0 bg-transparent shrink-0"
                title="Delete language"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
