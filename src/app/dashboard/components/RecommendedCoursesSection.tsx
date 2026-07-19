"use client";

import React from "react";
import Link from "next/link";
import { IconSchool, IconStar, IconClock, IconArrowUpRight } from "@tabler/icons-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  rating: string;
  students: string;
  image: string;
}

const recommendedCourses: Course[] = [
  {
    id: "course-1",
    title: "Next.js 15 App Router Production Guide",
    instructor: "Maximillian V.",
    duration: "18 hours",
    rating: "4.9",
    students: "3.2k students",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=150&h=100",
  },
  {
    id: "course-2",
    title: "Modern UI/UX Design System Bootcamp",
    instructor: "Sarah Jenkins",
    duration: "24 hours",
    rating: "4.8",
    students: "5.4k students",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=150&h=100",
  },
  {
    id: "course-3",
    title: "Python & AI Foundations for Engineers",
    instructor: "Dr. Angela Yu",
    duration: "32 hours",
    rating: "4.9",
    students: "8.1k students",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=150&h=100",
  },
];

export default function RecommendedCoursesSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
            <IconSchool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">Recommended Courses</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Boost your track skills</p>
          </div>
        </div>

        <Link
          href="/courses"
          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <IconArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Vertical Compact Cards List */}
      <div className="flex flex-col gap-2.5">
        {recommendedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 flex items-center gap-3 hover:bg-slate-100/70 transition duration-150"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
            />

            <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                {course.title}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                {course.instructor}
              </p>

              <div className="flex items-center justify-between mt-1 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-0.5 text-amber-600">
                  <IconStar className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {course.rating}
                </span>
                <span className="flex items-center gap-0.5">
                  <IconClock className="w-3 h-3" />
                  {course.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
