"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconSchool,
  IconUser,
  IconClock,
  IconCheck,
  IconLock,
  IconArrowRight,
  IconTargetArrow,
  IconAward,
  IconArrowLeft,
} from "@tabler/icons-react";

interface Topic {
  id: string;
  title: string;
}

interface CourseWeek {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  topics: Topic[];
}

interface CourseDetailProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  imageUrl: string;
  skillsGain: string;
  outcomes: string;
  price: number;
  weeks: CourseWeek[];
}

interface CourseProgressInfo {
  completedWeeks: string[];
  completedTopics: string[];
  isCompleted: boolean;
  certificateId: string | null;
}

interface CourseDetailContentProps {
  user: { fullName: string; email: string; profileImage?: string | null };
  course: CourseDetailProps;
  enrollment: { id: string; status: string; utrNo: string } | null;
  isApproved: boolean;
  courseProgress?: CourseProgressInfo;
}

export default function CourseDetailContent({ user, course, courseProgress }: CourseDetailContentProps) {
  const completedTopics = courseProgress?.completedTopics || [];
  const completedWeeks = courseProgress?.completedWeeks || [];
  const isCompleted = courseProgress?.isCompleted || false;

  // Count total topics across all weeks
  const totalTopics = course.weeks.reduce((sum, w) => sum + (w.topics?.length || 0), 0);
  const doneTopics = completedTopics.length;
  const overallPct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  const skillsList = course.skillsGain ? course.skillsGain.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
        
        {/* Back Button */}
        <div>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-x-1">
            <IconArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
        </div>

        {/* Hero card */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase tracking-wider">
                Free Course
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 border border-indigo-200 rounded uppercase tracking-wider flex items-center gap-1">
                <IconSchool className="w-3 h-3" /> Interactive Editor
              </span>
              {isCompleted && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded uppercase tracking-wider flex items-center gap-1">
                  <IconAward className="w-3 h-3" /> Certificate Earned
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">{course.title}</h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1"><IconUser className="w-3.5 h-3.5" /> {course.instructor || "Platform Instructor"}</span>
              <span className="flex items-center gap-1"><IconClock className="w-3.5 h-3.5" /> {course.duration || "Self-paced"}</span>
              <span className="flex items-center gap-1"><IconSchool className="w-3.5 h-3.5" /> {course.weeks.length} Modules · {totalTopics} Topics</span>
            </div>

            {/* Overall progress */}
            {doneTopics > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-600">Overall Progress</span>
                  <span className="text-xs font-bold text-indigo-600">{doneTopics}/{totalTopics} topics · {overallPct}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsList.map(skill => (
                  <span key={skill} className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modules list */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 mb-4">Course Modules</h2>
          <div className="flex flex-col gap-4">
            {course.weeks.map((week, idx) => {
              const weekTopicIds = (week.topics || []).map(t => t.id);
              const weekDone = weekTopicIds.filter((tid: string) => completedTopics.includes(tid)).length;
              const weekTotal = weekTopicIds.length;
              const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
              const weekCompleted = completedWeeks.includes(week.id);

              // Lock logic: first week always open, others need prev week complete
              const prevWeek = idx > 0 ? course.weeks[idx - 1] : null;
              const isLocked = prevWeek ? !completedWeeks.includes(prevWeek.id) : false;

              const moduleColors = [
                { bg: "from-blue-600 to-indigo-700", badge: "bg-blue-50 text-blue-700 border-blue-200" },
                { bg: "from-violet-600 to-purple-700", badge: "bg-violet-50 text-violet-700 border-violet-200" },
                { bg: "from-amber-500 to-orange-600", badge: "bg-amber-50 text-amber-700 border-amber-200" },
                { bg: "from-emerald-500 to-teal-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              ];
              const color = moduleColors[idx % moduleColors.length];

              return (
                <div
                  key={week.id}
                  className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${
                    isLocked ? "opacity-60 border-slate-200" : "border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className={`bg-gradient-to-r ${color.bg} p-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-extrabold text-lg">
                        {weekCompleted ? <IconCheck className="w-5 h-5" /> : isLocked ? <IconLock className="w-5 h-5" /> : week.weekNumber}
                      </div>
                      <div>
                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Module {week.weekNumber}</p>
                        <h3 className="text-white font-extrabold text-base leading-tight">{week.title}</h3>
                      </div>
                    </div>
                    {!isLocked && (
                      <div className="text-right shrink-0">
                        <p className="text-white text-sm font-bold">{weekPct}%</p>
                        <p className="text-white/70 text-xs">{weekDone}/{weekTotal}</p>
                      </div>
                    )}
                    {isLocked && (
                      <span className="text-white/70 text-xs font-bold">Locked</span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{week.description}</p>

                    {/* Progress bar */}
                    {!isLocked && weekTotal > 0 && (
                      <div className="mb-4">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${weekPct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{weekDone} of {weekTotal} topics completed</p>
                      </div>
                    )}

                    {/* Topic previews */}
                    {!isLocked && week.topics && week.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {week.topics.slice(0, 8).map((topic) => {
                          const done = completedTopics.includes(topic.id);
                          return (
                            <span key={topic.id} className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                              {done && "✓ "}{topic.title}
                            </span>
                          );
                        })}
                        {week.topics.length > 8 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border bg-slate-50 text-slate-400 border-slate-200">
                            +{week.topics.length - 8} more
                          </span>
                        )}
                      </div>
                    )}

                    {isLocked ? (
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-semibold">
                        <IconLock className="w-4 h-4" />
                        Complete Module {idx} to unlock
                      </div>
                    ) : (
                      <Link
                        href={`/courses/${course.id}/${week.id}`}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
                      >
                        {weekCompleted ? "Review Module" : weekDone > 0 ? "Continue" : "Start Module"}
                        <IconArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcomes */}
        {course.outcomes && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 mb-4">
              <IconTargetArrow className="w-5 h-5 text-indigo-500" /> What You Will Learn
            </h3>
            <ul className="space-y-2">
              {course.outcomes.split(",").map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <IconAward className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {o.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certificate earned banner */}
        {isCompleted && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white flex items-center justify-between gap-4 shadow-md">
            <div>
              <p className="font-extrabold text-lg">🏆 Certificate Earned!</p>
              <p className="text-sm text-white/80 mt-1">
                You have completed this course. Your certificate is in the Certifications tab!
              </p>
            </div>
            <Link
              href="/certifications"
              className="bg-white text-amber-700 font-bold px-5 py-2.5 rounded-xl text-sm shrink-0 hover:bg-amber-50 transition"
            >
              View Certificate
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
