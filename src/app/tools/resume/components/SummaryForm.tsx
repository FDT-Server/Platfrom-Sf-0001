import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeData } from "../types";
import { summarySchema } from "../schemas";
import { toast } from "sonner";

interface SummaryFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function SummaryForm({ data, onChange }: SummaryFormProps) {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<{ summary?: string }>({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: data.summary },
    mode: "onChange",
  });

  const values = watch();

  useEffect(() => {
    const nextVal = values.summary || "";
    if (nextVal !== data.summary) {
      onChange({ summary: nextVal });
    }
  }, [values, onChange, data.summary]);

  useEffect(() => {
    if (data.summary !== (values.summary || "")) {
      reset({ summary: data.summary });
    }
  }, [data.summary, reset]);

  const handleAISuggestion = () => {
    toast.info("AI Writing Assistant integration ready!", {
      description: "This hook connects to the Studentforge AI copilot to generate optimized resume bullet points.",
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>✍</span> Professional Summary
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Write a brief summary statement highlighting your key strengths and experience.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAISuggestion}
          className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl transition cursor-pointer"
        >
          ✨ Improve with AI
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Summary Statement</label>
        <textarea
          {...register("summary")}
          className="border border-slate-200 hover:border-slate-355 focus:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none transition font-medium min-h-36 leading-relaxed w-full bg-white"
          placeholder="e.g. A passionate Software Engineer with 3+ years of experience building scalable web applications. Specialised in TypeScript, Next.js, and serverless architectures."
        />
        {errors.summary && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.summary.message}</span>}
      </div>
    </div>
  );
}
