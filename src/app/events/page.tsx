import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import { IconCalendarEvent, IconExternalLink } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true },
  });

  if (!user) redirect("/login");

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">

        <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200">
              <IconCalendarEvent className="w-3.5 h-3.5" />
              Events &amp; Masterclasses
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">Academy Schedule</h3>
            <p className="text-sm text-slate-600 mt-1">
              Join live workshops, industry tech talks, hackathons, and interactive guest lectures.
            </p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="flex flex-col gap-6 mt-8">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col lg:flex-row items-stretch rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition duration-150 bg-white"
              >

                <div className="bg-slate-50 border-r border-slate-200 w-full lg:w-36 flex flex-row lg:flex-col justify-center items-center p-4 lg:py-6 text-center gap-3 lg:gap-1 shrink-0">
                  <span className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">{evt.month}</span>
                  <span className="text-3xl lg:text-4xl font-black text-slate-800 font-sans leading-none">{evt.day}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md mt-0 lg:mt-2">
                    {evt.duration}
                  </span>
                </div>

                {evt.imageUrl && (
                  <div className="w-full lg:w-48 h-32 lg:h-auto overflow-hidden shrink-0 relative border-r border-slate-200/50">
                    <img src={evt.imageUrl} className="w-full h-full object-cover" alt={evt.title} />
                  </div>
                )}

                <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evt.badgeBg}`}>
                        {evt.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">{evt.badgeText}</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-850 mt-2 leading-snug">{evt.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-2.5">
                      {evt.speakerImage && (
                        <img
                          src={evt.speakerImage}
                          alt={evt.speakerName}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{evt.speakerName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {evt.speakerTitle} • <strong className="text-slate-650 font-semibold">{evt.speakerCompany}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">schedule</span>
                      Starts at {evt.time}
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:border-l border-slate-200 bg-slate-50/50 flex flex-col justify-center items-stretch w-full lg:w-48 gap-2.5 shrink-0">
                  {evt.joinLink ? (
                    <a
                      href={evt.joinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-2.5 px-3 text-center text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs"
                    >
                      Join Session
                      <IconExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="bg-slate-100 text-slate-400 rounded-lg py-2.5 px-3 text-center text-xs font-bold">
                      Link Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (

          <div className="flex flex-col items-center justify-center py-24 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <IconCalendarEvent className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">No events yet</p>
            <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">
              Events and masterclasses will appear here once they are published by the admin.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
