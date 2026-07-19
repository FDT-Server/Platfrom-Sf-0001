import React, { useState } from "react";
import { CustomSection, CustomSectionItem, ResumeData } from "../types";
import { IconTrash } from "@tabler/icons-react";
import IconPlus from "@tabler/icons-react/dist/esm/icons/IconPlus.mjs";
import { toast } from "sonner";

interface CustomSectionsFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
  activeCustomIndex: number;
}

export default function CustomSectionsForm({ data, onChange, activeCustomIndex }: CustomSectionsFormProps) {
  const sections = data.customSections || [];
  const currentSection = sections[activeCustomIndex];

  if (!currentSection) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center text-slate-500 font-medium">
        Custom section not found.
      </div>
    );
  }

  const updateSectionTitle = (title: string) => {
    const updated = sections.map((sec, i) =>
      i === activeCustomIndex ? { ...sec, title } : sec
    );
    onChange({ customSections: updated });
  };

  const addItem = () => {
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: "",
      description: "",
    };
    const updated = sections.map((sec, i) =>
      i === activeCustomIndex ? { ...sec, items: [...sec.items, newItem] } : sec
    );
    onChange({ customSections: updated });
    toast.success("Added new custom section item");
  };

  const deleteItem = (itemId: string) => {
    const updated = sections.map((sec, i) =>
      i === activeCustomIndex
        ? { ...sec, items: sec.items.filter((it) => it.id !== itemId) }
        : sec
    );
    onChange({ customSections: updated });
  };

  const updateItemFields = (itemId: string, fields: Partial<CustomSectionItem>) => {
    const updated = sections.map((sec, i) =>
      i === activeCustomIndex
        ? {
            ...sec,
            items: sec.items.map((it) => (it.id === itemId ? { ...it, ...fields } : it)),
          }
        : sec
    );
    onChange({ customSections: updated });
  };

  const deleteSection = () => {
    if (window.confirm("Are you sure you want to delete this entire custom section?")) {
      const updated = sections.filter((_, i) => i !== activeCustomIndex);
      onChange({ customSections: updated });
      toast.success("Custom section deleted");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <span className="p-1.5 bg-slate-50 rounded-lg text-slate-655 text-sm">⚙</span>
          <input
            type="text"
            value={currentSection.title}
            onChange={(e) => updateSectionTitle(e.target.value)}
            className="border-b border-slate-200 hover:border-slate-400 focus:border-slate-800 font-extrabold text-slate-900 uppercase tracking-wider text-sm focus:outline-none transition bg-transparent py-0.5 px-1 w-full"
            placeholder="Custom Section Title"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer border-0"
          >
            <IconPlus className="w-4 h-4" /> Add Item
          </button>
          <button
            type="button"
            onClick={deleteSection}
            className="flex items-center gap-1 text-red-500 hover:text-red-750 text-xs font-bold transition cursor-pointer border-0 bg-transparent"
          >
            <IconTrash className="w-4 h-4" /> Delete Section
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {currentSection.items.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No items in this section. Click "Add Item" above.
          </div>
        ) : (
          currentSection.items.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 relative bg-slate-50/60 hover:border-slate-350 transition shadow-xs">
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="absolute right-4 top-4 p-1 text-slate-400 hover:text-red-655 cursor-pointer border-0 bg-transparent"
                title="Delete item"
              >
                <IconTrash className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1 pr-12">
                <label className="text-[9px] font-bold text-slate-555 uppercase tracking-wider mb-1">Item Title *</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItemFields(item.id, { title: e.target.value })}
                  className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
                  placeholder="e.g. Volunteer Experience / Publications"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-555 uppercase tracking-wider mb-1">Item Description *</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItemFields(item.id, { description: e.target.value })}
                  className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition font-medium bg-white min-h-24 w-full leading-relaxed"
                  placeholder="Provide description or bullets..."
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
