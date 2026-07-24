import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import { IconBriefcase, IconExternalLink, IconMapPin, IconClock } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true },
  });

  if (!user) redirect("/login");

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">

        <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200">
              <IconBriefcase className="w-3.5 h-3.5" />
              Careers &amp; Projects
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">Opportunities Board</h3>
            <p className="text-sm text-slate-600 mt-1">
              Explore curated jobs, internships, hackathons, and remote contracts selected for Studentforge Trainees.
            </p>
          </div>
          {opportunities.length > 0 && (
            <div className="text-xs text-slate-500 font-medium shrink-0">
              <strong className="text-slate-800">{opportunities.length}</strong> available role{opportunities.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mt-8">
            {opportunities.map((opp) => {
              const tags = opp.tags
                ? opp.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={opp.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition duration-150 gap-4"
                >

                  <div className="flex items-start gap-4">
                    {opp.imageUrl ? (
                      <img
                        src={opp.imageUrl}
                        alt={opp.company}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 ${opp.logoBg}`}>
                        {opp.logoLetter || opp.company.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-extrabold text-slate-850 leading-tight">{opp.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100 bg-amber-50 text-amber-700">
                          {opp.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-bold mt-1 flex items-center gap-1.5 flex-wrap">
                        {opp.company}
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5 font-semibold text-slate-500">
                          <IconMapPin className="w-3 h-3 shrink-0" /> {opp.location}
                        </span>
                      </p>

                      <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">{opp.description}</p>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-dashed border-slate-200 md:border-0 pt-4 md:pt-0 shrink-0 gap-3">
                    <div className="flex flex-col md:items-end">
                      <span className="text-xs font-bold text-slate-700">{opp.compensation}</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        {opp.type}
                      </span>
                    </div>

                    <a
                      href={opp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition duration-150 flex items-center gap-1 cursor-pointer border-0 shadow-xs"
                    >
                      Apply Now
                      <IconExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          <div className="flex flex-col items-center justify-center py-24 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <IconBriefcase className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">No opportunities yet</p>
            <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">
              Jobs, internships, and contracts will appear here once published by the admin.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
