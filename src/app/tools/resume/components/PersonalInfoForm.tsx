import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalDetails, ResumeData } from "../types";
import { personalDetailsSchema } from "../schemas";

interface PersonalInfoFormProps {
  data: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data.personalDetails as any,
    mode: "onChange",
  });

  const values = watch();

  // Auto-save: propagate changes to parent
  useEffect(() => {
    // Only update if changes actually occurred to prevent cycles
    if (JSON.stringify(values) !== JSON.stringify(data.personalDetails)) {
      onChange({ personalDetails: values });
    }
  }, [values, onChange, data.personalDetails]);

  // Sync external changes (like resetting data)
  useEffect(() => {
    if (JSON.stringify(data.personalDetails) !== JSON.stringify(values)) {
      reset(data.personalDetails);
    }
  }, [data.personalDetails, reset]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div>
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>👤</span> Personal Information
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Enter your contact details and professional job title.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
          <input
            type="text"
            {...register("name")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="John Doe"
          />
          {errors.name && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.name.message?.toString()}</span>}
        </div>

        {/* Professional Title */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Professional Title</label>
          <input
            type="text"
            {...register("title")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="john.doe@example.com"
          />
          {errors.email && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.email.message?.toString()}</span>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
          <input
            type="text"
            {...register("phone")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="+1 (555) 019-2834"
          />
        </div>

        {/* Address / Location */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Address / Location</label>
          <input
            type="text"
            {...register("address")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Portfolio Website */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">Portfolio Link</label>
          <input
            type="text"
            {...register("portfolio")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="https://johndoe.dev"
          />
          {errors.portfolio && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.portfolio.message?.toString()}</span>}
        </div>

        {/* LinkedIn Profile */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">LinkedIn Profile</label>
          <input
            type="text"
            {...register("linkedin")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="https://linkedin.com/in/johndoe"
          />
          {errors.linkedin && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.linkedin.message?.toString()}</span>}
        </div>

        {/* GitHub Profile */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1">GitHub Profile</label>
          <input
            type="text"
            {...register("github")}
            className="border border-slate-200 hover:border-slate-350 focus:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition bg-white w-full font-medium"
            placeholder="https://github.com/johndoe"
          />
          {errors.github && <span className="text-[10px] text-red-500 font-bold mt-1">{errors.github.message?.toString()}</span>}
        </div>
      </div>
    </div>
  );
}
