"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconSchool,
  IconUser,
  IconClock,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronUp,
  IconPlayerPlay,
  IconX,
  IconCheck,
  IconLock,
  IconStar,
  IconTargetArrow,
  IconCreditCard,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";

interface CourseWeek {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  videoLink: string;
}

interface CourseDetailProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  link: string;
  imageUrl: string;
  skillsGain: string;
  outcomes: string;
  price: number;
  createdAt: string;
  weeks: CourseWeek[];
}

interface EnrollmentInfo {
  id: string;
  status: string;
  utrNo: string;
}

interface CourseDetailContentProps {
  user: { fullName: string; email: string; profileImage?: string | null };
  course: CourseDetailProps;
  enrollment: EnrollmentInfo | null;
  isApproved: boolean;
}

type Step = "detail" | "enroll" | "payment" | "pending";

export default function CourseDetailContent({ user, course, enrollment, isApproved }: CourseDetailContentProps) {
  const [step, setStep] = useState<Step>(
    isApproved ? "detail" :
    enrollment?.status === "PENDING" ? "pending" :
    "detail"
  );

  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [enrollForm, setEnrollForm] = useState({
    name: user.fullName || "",
    phone: "",
    email: user.email || "",
    classLevel: "",
    utrNo: "",
  });

  const skillsList = course.skillsGain
    ? course.skillsGain.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const outcomesList = course.outcomes
    ? course.outcomes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.alreadyEnrolled) {
          setStep("pending");
        } else if (course.price === 0) {
          setStep("pending");
        } else {
          setStep("payment");
        }
      } else {
        setError(data.error || "Failed to submit enrollment.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentDone = async () => {
    setStep("pending");
  };

  
  if (step === "pending") {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-fit w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
            <IconClock className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Enrollment Submitted!</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Your enrollment for <strong>{course.title}</strong> is pending admin verification. You will get full access once approved.
          </p>
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 text-xs text-amber-800 font-semibold max-w-sm">
            <IconAlertCircle className="w-4 h-4 inline mr-1" />
            Approvals typically take 1–2 business days.
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-8 text-xs text-slate-500 hover:text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <IconArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
        </div>
      </DashboardLayout>
    );
  }

  
  if (step === "payment") {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
          <button
            onClick={() => setStep("enroll")}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 font-bold mb-6 cursor-pointer w-fit"
          >
            <IconArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                  Payment Required
                </span>
                <h2 className="text-2xl font-extrabold text-slate-850 mt-2">Complete Your Payment</h2>
                <p className="text-sm text-slate-500 mt-1">
                  To enroll in <strong>{course.title}</strong>, please complete your payment via UPI and submit the UTR number.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Course Fee</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{(course.price * 83).toFixed(0)}
                    <span className="text-xs text-slate-400 font-normal ml-1">/ one-time</span>
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600">
                  <p className="font-semibold">UPI Payment Instructions:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                    <li>Pay to UPI ID: <strong className="text-slate-800 font-mono">studentforge@upi</strong></li>
                    <li>Enter exact amount: <strong>₹{(course.price * 83).toFixed(0)}</strong></li>
                    <li>Copy the <strong>UTR / Transaction ID</strong> from the success screen</li>
                    <li>Enter it below and submit</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">UTR / Transaction Reference Number</label>
                <input
                  type="text"
                  value={enrollForm.utrNo}
                  onChange={(e) => setEnrollForm({ ...enrollForm, utrNo: e.target.value })}
                  placeholder="e.g. 423876509182"
                  className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:border-amber-500 rounded-xl text-sm text-slate-800 bg-white"
                />
                {error && (
                  <p className="text-xs text-red-600 font-semibold">{error}</p>
                )}
                <button
                  onClick={handlePaymentDone}
                  disabled={!enrollForm.utrNo || saving}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition cursor-pointer border-0 flex items-center justify-center gap-2 text-sm shadow-xs"
                >
                  <IconCreditCard className="w-4 h-4" />
                  Submit Payment & Complete Enrollment
                </button>
              </div>
            </div>

            <div className="w-full md:w-64 shrink-0 border border-slate-200 rounded-2xl overflow-hidden h-fit bg-white shadow-xs">
              {course.imageUrl && (
                <img src={course.imageUrl} className="w-full h-36 object-cover" alt={course.title} />
              )}
              <div className="p-4 space-y-2">
                <p className="font-extrabold text-sm text-slate-800">{course.title}</p>
                <p className="text-[11px] text-slate-500">{course.instructor} · {course.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  
  if (step === "enroll") {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
          <button
            onClick={() => setStep("detail")}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 font-bold mb-6 cursor-pointer w-fit"
          >
            <IconArrowLeft className="w-4 h-4" /> Back to Course
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                  Enrollment Form
                </span>
                <h2 className="text-2xl font-extrabold text-slate-850 mt-2">Enroll in this Course</h2>
                <p className="text-sm text-slate-500 mt-1">Fill in your details to begin your learning journey.</p>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      required
                      value={enrollForm.name}
                      onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-amber-500 rounded-xl text-sm text-slate-800 bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-amber-500 rounded-xl text-sm text-slate-800 bg-white mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    required
                    type="email"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-amber-500 rounded-xl text-sm text-slate-800 bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Class / Year of Study</label>
                  <select
                    required
                    value={enrollForm.classLevel}
                    onChange={(e) => setEnrollForm({ ...enrollForm, classLevel: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-amber-500 rounded-xl text-sm text-slate-800 bg-white mt-1"
                  >
                    <option value="">Select your class / year</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="1st Year College">1st Year College</option>
                    <option value="2nd Year College">2nd Year College</option>
                    <option value="3rd Year College">3rd Year College</option>
                    <option value="4th Year College">4th Year College</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition cursor-pointer border-0 flex items-center justify-center gap-2 text-sm shadow-xs"
                >
                  {saving ? "Submitting..." : (
                    <>
                      Continue to {course.price === 0 ? "Confirm" : "Payment"}
                      <IconArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="w-full md:w-64 shrink-0 border border-slate-200 rounded-2xl overflow-hidden h-fit bg-white shadow-xs">
              {course.imageUrl && (
                <img src={course.imageUrl} className="w-full h-36 object-cover" alt={course.title} />
              )}
              <div className="p-4 space-y-2">
                <p className="font-extrabold text-sm text-slate-800">{course.title}</p>
                <p className="text-[11px] text-slate-500">{course.instructor} · {course.duration}</p>
                <p className="text-lg font-extrabold text-amber-700">
                  {course.price === 0 ? "Free" : `₹${(course.price * 83).toFixed(0)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  
  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col gap-6 animate-fadeIn">

        
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch">
            
            <div className="w-full lg:w-80 shrink-0 bg-slate-100 relative overflow-hidden">
              {course.imageUrl ? (
                <img src={course.imageUrl} className="w-full h-56 lg:h-full object-cover" alt={course.title} />
              ) : (
                <div className="w-full h-56 lg:h-full flex items-center justify-center">
                  <IconSchool className="w-20 h-20 text-slate-300" />
                </div>
              )}
            </div>

            
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase tracking-wider">
                    {isApproved ? "Enrolled" : "Trainee Academy"}
                  </span>
                  {isApproved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded uppercase tracking-wider flex items-center gap-1">
                      <IconCheck className="w-3 h-3" /> Access Granted
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-850 leading-tight">{course.title}</h1>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><IconUser className="w-3.5 h-3.5" /> {course.instructor || "Platform Instructor"}</span>
                  <span className="flex items-center gap-1"><IconClock className="w-3.5 h-3.5" /> {course.duration || "Self-paced"}</span>
                  <span className="flex items-center gap-1"><IconSchool className="w-3.5 h-3.5" /> {course.weeks.length} Weeks</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Course Fee</p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {course.price === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `₹${(course.price * 83).toFixed(0)}`
                    )}
                  </p>
                </div>

                {!isApproved ? (
                  <button
                    onClick={() => setStep("enroll")}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer border-0 shadow-xs text-sm flex items-center gap-2"
                  >
                    Enroll Now <IconArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                    <IconCheck className="w-4 h-4" /> Full Access Unlocked
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
        {(skillsList.length > 0 || outcomesList.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsList.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                  <IconStar className="w-4 h-4 text-amber-500" /> Skills You Gain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-750 px-3 py-1.5 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {outcomesList.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                  <IconTargetArrow className="w-4 h-4 text-emerald-500" /> Outcomes You Get
                </h3>
                <ul className="space-y-2">
                  {outcomesList.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <IconSchool className="w-4 h-4 text-amber-600" />
              Course Curriculum ({course.weeks.length} Weeks)
            </h3>
            {!isApproved && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                <IconLock className="w-3 h-3" /> Enroll to access videos
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {course.weeks.length > 0 ? course.weeks.map((week) => {
              const isOpen = expandedWeek === week.id;
              return (
                <div key={week.id}>
                  <button
                    onClick={() => setExpandedWeek(isOpen ? null : week.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 font-mono uppercase shrink-0">
                        Week {week.weekNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{week.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!isApproved && week.videoLink && (
                        <IconLock className="w-3.5 h-3.5 text-slate-350" />
                      )}
                      {isOpen ? (
                        <IconChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <IconChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 bg-slate-50/20">
                      <p className="text-xs text-slate-600 leading-relaxed">{week.description}</p>
                      {week.videoLink && (
                        <div className="mt-4">
                          {isApproved ? (
                            <button
                              onClick={() => setActiveVideo({ url: week.videoLink, title: week.title })}
                              className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer"
                            >
                              <IconPlayerPlay className="w-3.5 h-3.5 fill-emerald-700" />
                              Watch Lecture
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 w-fit">
                              <IconLock className="w-3.5 h-3.5" />
                              Enroll to watch this lecture
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }) : (
              <p className="px-6 py-8 text-xs text-slate-400 italic text-center">
                No curriculum added yet for this course.
              </p>
            )}
          </div>
        </div>

        
        {!isApproved && (
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="font-extrabold text-amber-900 text-base">Ready to start learning?</p>
              <p className="text-xs text-amber-700 mt-0.5">Enroll now to unlock all {course.weeks.length} weeks of curriculum and video lectures.</p>
            </div>
            <button
              onClick={() => setStep("enroll")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer border-0 shadow-xs text-sm shrink-0 flex items-center gap-2"
            >
              Enroll Now · {course.price === 0 ? "Free" : `₹${(course.price * 83).toFixed(0)}`}
              <IconArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-1.5 rounded-lg">
                  <IconPlayerPlay className="w-4 h-4 fill-emerald-700" />
                </span>
                {activeVideo.title}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 relative aspect-video">
              <iframe
                src={activeVideo.url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveVideo(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
