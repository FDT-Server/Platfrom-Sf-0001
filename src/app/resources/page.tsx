import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  IconExternalLink, 
  IconBrandPrisma, 
  IconBrandTailwind, 
  IconBrandNextjs, 
  IconComponents, 
  IconBrandReact, 
  IconBrandTypescript, 
  IconDatabase, 
  IconBrandCss3 
} from "@tabler/icons-react";

export default async function ResourcesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  // Fetch verified user details
  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const resourceCards = [
    {
      id: "PRISMA7",
      date: "04/07/2026",
      publisher: "Prisma Database Team",
      title: "Prisma Schema Reference",
      category: "Database",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      headerBg: "bg-indigo-500 text-white",
      link: "https://www.prisma.io/docs/concepts/components/prisma-schema",
      icon: IconBrandPrisma,
    },
    {
      id: "TAILWIND4",
      date: "04/07/2026",
      publisher: "Tailwind Labs CSS",
      title: "Tailwind CSS v4.0 Docs",
      category: "Styling",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      headerBg: "bg-emerald-400 text-emerald-950",
      link: "https://tailwindcss.com/docs",
      icon: IconBrandTailwind,
    },
    {
      id: "NEXT16",
      date: "04/07/2026",
      publisher: "Vercel Next.js Team",
      title: "Next.js App Router Guide",
      category: "Next.js",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      headerBg: "bg-[#e2f952] text-slate-900",
      link: "https://nextjs.org/docs",
      icon: IconBrandNextjs,
    },
    {
      id: "SHADCNUI",
      date: "04/07/2026",
      publisher: "Radix Primitives Org",
      title: "Shadcn CLI UI Library",
      category: "Components",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-100",
      headerBg: "bg-pink-400 text-white",
      link: "https://ui.shadcn.com/docs",
      icon: IconComponents,
    },
    {
      id: "REACT19",
      date: "04/07/2026",
      publisher: "Meta Open Source",
      title: "React 19 Core Concepts",
      category: "Library",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      headerBg: "bg-rose-500 text-white",
      link: "https://react.dev/reference/react",
      icon: IconBrandReact,
    },
    {
      id: "TS5",
      date: "04/07/2026",
      publisher: "Microsoft Developer",
      title: "TS Handbook & Types",
      category: "Language",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
      headerBg: "bg-sky-500 text-white",
      link: "https://www.typescriptlang.org/docs/",
      icon: IconBrandTypescript,
    },
    {
      id: "POSTGRES",
      date: "04/07/2026",
      publisher: "PostgreSQL Database",
      title: "Postgres SQL Reference",
      category: "Database",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100",
      headerBg: "bg-cyan-500 text-white",
      link: "https://www.postgresql.org/docs/",
      icon: IconDatabase,
    },
    {
      id: "CSS3",
      date: "04/07/2026",
      publisher: "W3C CSS Working Group",
      title: "CSS3 Transitions & Grid",
      category: "Styling",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-100",
      headerBg: "bg-orange-400 text-white",
      link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      icon: IconBrandCss3,
    },
    {
      id: "NEON",
      date: "04/07/2026",
      publisher: "Neon Serverless Postgres",
      title: "Neon Database Guide",
      category: "Database",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-100",
      headerBg: "bg-emerald-600 text-white",
      link: "https://neon.tech/docs/introduction",
      icon: IconDatabase,
    },
    {
      id: "COCKROACH",
      date: "04/07/2026",
      publisher: "Cockroach Labs",
      title: "CockroachDB Serverless Docs",
      category: "Database",
      badgeColor: "bg-green-50 text-green-700 border-green-100",
      headerBg: "bg-green-700 text-white",
      link: "https://www.cockroachlabs.com/docs/",
      icon: IconDatabase,
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-300 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">
        <div className="pb-6 border-b border-slate-300">
          <span className="text-xs font-bold text-blue-600 bg-blue-50/60 px-2.5 py-1 rounded-md">
            Learning Hub
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            Curated Resources
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Access documentation, quick references, and tools to accelerate your training track.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pr-1 pb-4">
          {resourceCards.map((card, idx) => {
            const TechIcon = card.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-2xl shadow-sm border border-slate-300 overflow-hidden bg-white hover:shadow-md transition duration-150"
              >
                {/* Colored top bar header */}
                <div className={`flex justify-between items-center px-6 py-4 text-sm font-bold font-mono tracking-wider ${card.headerBg}`}>
                  <span>{card.id}</span>
                  <span>{card.date}</span>
                </div>

                {/* Main Card Body */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Brand Stack Icon and Publisher Row */}
                    <div className="flex items-center gap-1.5">
                      <TechIcon className="w-4 h-4 text-slate-500 shrink-0" />
                      <p className="text-[11px] text-slate-500 font-semibold">{card.publisher}</p>
                    </div>
                    <div className="flex items-start justify-between gap-3 mt-2">
                      <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                        {card.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${card.badgeColor}`}>
                        {card.category}
                      </span>
                    </div>
                  </div>

                  {/* Dotted horizontal line separator */}
                  <div className="border-t border-dashed border-slate-300 my-5" />

                  {/* Action footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-800 font-sans">
                      Docs
                    </span>
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black hover:bg-slate-900 text-white rounded-full px-5 py-2 text-xs font-bold transition duration-150 flex items-center gap-1 shadow-sm"
                    >
                      Open Link
                      <IconExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
