"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconSchool,
  IconUser,
  IconClock,
  IconArrowUpRight,
  IconCurrencyRupee,
} from "@tabler/icons-react";

interface CourseCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  instructor: string;
  duration: string;
}

interface CoursesListContentProps {
  user: { fullName: string; email: string; profileImage?: string | null };
  courses: CourseCard[];
}

export default function CoursesListContent({ user, courses }: CoursesListContentProps) {
  return (
    <DashboardLayout user={user}>
      <div className="w-full flex flex-col gap-8">

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 md:px-10 shadow-sm">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <IconSchool className="w-3.5 h-3.5" />
            Trainee Academy
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-850 leading-tight">
            Curated Courses
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
            Deep-dive engineering & design courses handpicked to help you go from beginner to industry-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
            >

              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                ) : (

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-amber-50 to-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-white/70 border border-amber-200/60 flex items-center justify-center shadow-sm">
                      <IconSchool className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-amber-600/70 uppercase tracking-widest">
                      Course
                    </p>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              <div className="flex flex-col flex-1 p-5">

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <IconUser className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1 max-w-[120px]">{course.instructor}</span>
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="flex items-center gap-1">
                    <IconClock className="w-3 h-3 shrink-0" />
                    {course.duration}
                  </span>
                </div>

                <h4 className="font-extrabold text-[14px] text-slate-850 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                  {course.title}
                </h4>

                <p className="mt-2 text-[12px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
                  {course.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">

                  <div>
                    {course.price === 0 ? (
                      <span className="inline-block text-sm font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        Free
                      </span>
                    ) : (
                      <span className="flex items-center font-extrabold text-base text-slate-900">
                        <IconCurrencyRupee className="w-4 h-4" />
                        {(course.price * 83).toFixed(0)}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 inline-flex items-center gap-1 bg-amber-600 group-hover:bg-amber-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs">
                    View Course
                    <IconArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <IconSchool className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">No courses yet</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon — new courses are being added!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
