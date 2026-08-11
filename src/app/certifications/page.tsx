import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  // Placeholder data for available certifications
  const availableCertifications = [
    {
      id: "html",
      title: "HTML Developer Certification",
      description: "Prove your mastery of HTML structure, semantic tags, and forms. This exam consists of 20 MCQs and 10 coding challenges.",
      icon: "html",
      color: "bg-orange-500",
      status: "Available",
      href: "/certifications/html-exam"
    },
    {
      id: "css",
      title: "CSS Styling Certification",
      description: "Master layouts, Flexbox, Grid, and responsive design. Exam coming soon.",
      icon: "css",
      color: "bg-blue-500",
      status: "Upcoming",
      href: "#"
    },
    {
      id: "js",
      title: "JavaScript Engineer Certification",
      description: "Test your knowledge of ES6+, DOM manipulation, and asynchronous programming. Exam coming soon.",
      icon: "javascript",
      color: "bg-yellow-500",
      status: "Upcoming",
      href: "#"
    }
  ];

  return (
    <DashboardLayout user={user}>
      <div className="w-full h-full flex flex-col p-4 md:p-8 relative bg-slate-50 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Certifications</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">
          Complete courses, pass exams, and finish final projects to earn certifications. 
          Your earned certificates will automatically be added to your Portfolio tab.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCertifications.map((cert) => (
            <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${cert.color} shadow-lg`}>
                  <span className="material-symbols-outlined text-2xl">{cert.icon}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  cert.status === 'Available' ? 'bg-indigo-100 text-indigo-700' :
                  cert.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {cert.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{cert.title}</h3>
              <p className="text-slate-600 text-sm mb-6 flex-grow">{cert.description}</p>
              
              {cert.status === 'Available' ? (
                <Link href={cert.href} className="w-full block">
                  <button className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 hover:-translate-y-0.5">
                    Start Certification Exam
                  </button>
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
