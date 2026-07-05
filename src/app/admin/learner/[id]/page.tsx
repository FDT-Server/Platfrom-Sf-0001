import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import {
  IconUser,
  IconMail,
  IconBriefcase,
  IconSchool,
  IconCalendar,
  IconLink,
  IconBrandLinkedin,
  IconTarget,
  IconClock,
  IconChevronRight,
  IconBook,
} from "@tabler/icons-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  // Fetch administrator details to check session
  const adminUser = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  // Strict Server-Side Access Control: Check if logged-in user is adminUser and email is webstrixx@gmail.com
  if (!adminUser || adminUser.email.trim().toLowerCase() !== "webstrixx@gmail.com") {
    redirect("/dashboard");
  }

  // Fetch full details of the target learner
  const learner = await prisma.user.findUnique({
    where: { id },
  });

  if (!learner) {
    notFound();
  }

  const formatDate = (dateValue: Date | null) => {
    if (!dateValue) return "—";
    return dateValue.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout user={adminUser}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn gap-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 pb-4 border-b border-slate-100">
          <Link
            href="/admin"
            className="text-indigo-600 hover:text-indigo-800 transition duration-150 flex items-center gap-1 hover:underline"
          >
            Learners
          </Link>
          <IconChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">{learner.fullName}</span>
        </nav>

        {/* Core Header Card - Aligned, uncluttered profile summary */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 pb-6">
          <div className="relative">
            {learner.profileImage ? (
              <img
                src={learner.profileImage}
                alt={learner.fullName}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-24 h-24 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500">
                <IconUser className="w-12 h-12 stroke-[1.25]" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">{learner.fullName}</h3>
              <p className="text-sm font-medium text-slate-500 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <IconMail className="w-4 h-4 text-slate-400" />
                {learner.email}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                Role: {learner.selectedRole}
                {learner.selectedRole === "Other" && learner.otherRoleText && ` (${learner.otherRoleText})`}
              </span>
              <span className="bg-slate-50 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 font-mono">
                ID: {learner.id}
              </span>
            </div>
          </div>
        </div>

        {/* Bio / Description Card */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <IconBook className="w-4 h-4 text-indigo-500" />
            Professional Bio
          </h4>
          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap">
              {learner.about || "This learner has not filled in their professional bio or summary yet."}
            </p>
          </div>
        </div>

        {/* Details Grid (Aligned, clean, non-cluttered columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Academic Qualifications Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <IconSchool className="w-4 h-4 text-indigo-500" />
              Academic profile
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconSchool className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">College / University</span>
                  <span className="text-sm font-semibold text-slate-800">{learner.collegeStudying || "—"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconBriefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Specialization Branch</span>
                  <span className="text-sm font-semibold text-slate-800">{learner.branch || "—"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconCalendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Year of Study</span>
                  <span className="text-sm font-semibold text-slate-800">{learner.year ? `${learner.year} Year` : "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details & Links Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <IconLink className="w-4 h-4 text-indigo-500" />
              Links & Metadata
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconCalendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date of Birth</span>
                  <span className="text-sm font-semibold text-slate-800">{learner.dob || "—"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconLink className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Portfolio Website</span>
                  {learner.portfolioLink ? (
                    <a
                      href={learner.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
                    >
                      View Portfolio Website
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <IconBrandLinkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">LinkedIn Profile</span>
                  {learner.linkedinLink ? (
                    <a
                      href={learner.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition"
                    >
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Path Goals Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <IconTarget className="w-4 h-4 text-indigo-500" />
            Target Learning Path Goals
          </h4>
          <div className="flex flex-wrap gap-2">
            {learner.goals && learner.goals.length > 0 ? (
              learner.goals.map((goal, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs px-4 py-2 rounded-xl font-bold shadow-2xs"
                >
                  {goal}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No specific goals selected by this user.</span>
            )}
          </div>
        </div>

        {/* Timestamps footer */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[10px] gap-2 font-mono">
          <span className="flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" />
            Registered on: {formatDate(learner.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" />
            Last Profile Update: {formatDate(learner.updatedAt)}
          </span>
        </div>

      </div>
    </DashboardLayout>
  );
}
