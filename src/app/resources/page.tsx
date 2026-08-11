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
  IconBrandCss3,
  IconBook,
  IconLock
} from "@tabler/icons-react";

export default async function ResourcesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
     isPremium: true, credits: true, streak: true,},
  });

  if (!user) {
    redirect("/login");
  }

  // Removed DB resources to show exactly the 3 static requested links
  const dbResources: any[] = [];

  const fallbackResources = [
    {
      id: "HTML5",
      date: "04/07/2026",
      publisher: "W3Schools",
      title: "HTML Tutorial",
      category: "HTML",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-100",
      headerBg: "bg-orange-500 text-white",
      link: "https://www.w3schools.com/html/",
      icon: IconBrandCss3, // HTML icon is not imported, reusing generic book or css if needed
    },
    {
      id: "CSS3",
      date: "04/07/2026",
      publisher: "W3Schools",
      title: "CSS Tutorial",
      category: "CSS",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      headerBg: "bg-blue-500 text-white",
      link: "https://www.w3schools.com/css/default.asp",
      icon: IconBrandCss3,
    },
    {
      id: "JS1",
      date: "04/07/2026",
      publisher: "W3Schools",
      title: "JavaScript Tutorial",
      category: "JavaScript",
      badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-100",
      headerBg: "bg-yellow-400 text-slate-900",
      link: "https://www.w3schools.com/js/default.asp",
      icon: IconBrandTypescript,
    }
  ];

  const resourceCards = dbResources.length > 0
    ? dbResources.map((r, index) => {
        let icon = IconBook;
        const catLower = r.category.toLowerCase();
        if (catLower === "database") icon = IconDatabase;
        else if (catLower === "styling") icon = IconBrandCss3;
        else if (catLower === "next.js") icon = IconBrandNextjs;
        else if (catLower === "components") icon = IconComponents;
        else if (catLower === "library") icon = IconBrandReact;
        else if (catLower === "language") icon = IconBrandTypescript;

        return {
          id: `RES-${String(index + 1).padStart(3, "0")}`,
          date: r.date,
          publisher: r.publisher,
          title: r.title,
          category: r.category,
          badgeColor: r.badgeColor,
          headerBg: r.headerBg,
          link: r.link,
          imageUrl: r.imageUrl || "",
          icon,
        };
      })
    : fallbackResources.map((r) => ({ ...r, imageUrl: "" }));

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">
        <div className="pb-6 border-b border-slate-100">
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
                className="flex flex-col rounded-2xl shadow-sm border border-slate-200 bg-white hover:shadow-md transition duration-150 overflow-hidden"
              >

                {card.imageUrl ? (
                  <div className="h-32 w-full overflow-hidden relative">
                    <img src={card.imageUrl} className="w-full h-full object-cover" alt={card.title} />
                    <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200/50 shadow-xs ${card.badgeColor}`}>
                      {card.category}
                    </span>
                  </div>
                ) : (
                  <div className={`flex justify-between items-center px-6 py-4 text-xs font-bold font-mono tracking-wider ${card.headerBg}`}>
                    <span>{card.id}</span>
                    <span>{card.date}</span>
                  </div>
                )}

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>

                    <div className="flex items-center gap-1.5">
                      <TechIcon className="w-4 h-4 text-slate-450 shrink-0" />
                      <p className="text-[11px] text-slate-500 font-semibold">{card.publisher}</p>
                    </div>
                    <div className="flex items-start justify-between gap-3 mt-2">
                      <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                        {card.title}
                      </h4>
                      {!card.imageUrl && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${card.badgeColor}`}>
                          {card.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-200 my-5" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                      Docs
                    </span>
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition duration-150 flex items-center gap-1 shadow-xs border-0 cursor-pointer"
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
