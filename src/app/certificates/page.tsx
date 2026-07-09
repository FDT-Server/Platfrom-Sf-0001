import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import { IconAward, IconClipboardCheck, IconExternalLink } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true },
  });

  if (!user) redirect("/login");

  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">

        
        <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit border border-amber-200">
              <IconAward className="w-3.5 h-3.5" />
              Credentials Hub
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">Certificates &amp; Badges</h3>
            <p className="text-sm text-slate-600 mt-1">
              Verify your earned certifications, learning credentials, and complete study pod track milestones.
            </p>
          </div>
        </div>

        
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col justify-between border border-slate-200 hover:shadow-md transition duration-200 rounded-2xl bg-white relative overflow-hidden"
              >
                {cert.imageUrl && (
                  <div className="h-40 w-full overflow-hidden relative border-b border-slate-100">
                    <img src={cert.imageUrl} className="w-full h-full object-cover" alt={cert.title} />
                  </div>
                )}

                
                {!cert.imageUrl && (
                  <span className="absolute -right-4 -bottom-4 text-slate-50 select-none pointer-events-none">
                    <IconAward className="w-28 h-28" />
                  </span>
                )}

                <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-50 border border-amber-100 text-amber-750 p-2.5 rounded-xl flex items-center justify-center">
                        <IconAward className="w-5 h-5 text-amber-700" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider flex items-center gap-1">
                        <IconClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                        VERIFIED TRACK
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-850 leading-snug">{cert.title}</h4>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{cert.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6 relative z-10">
                    <div className="flex flex-col gap-1.5 text-xs text-slate-550 mb-4">
                      <span className="font-semibold text-slate-500">
                        Issuer: <strong className="text-slate-700">{cert.issuedBy || "Studentforge Platform"}</strong>
                      </span>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-2.5 text-center text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs"
                      >
                        Verify Credential
                        <IconExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          <div className="flex flex-col items-center justify-center py-24 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <IconAward className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">No certificates yet</p>
            <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">
              Certificates and badges will appear here once they are published by the admin.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
