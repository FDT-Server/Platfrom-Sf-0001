import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function MZGHPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { email: true, fullName: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#000] text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-50">
      <AnalyticsDashboard userName={user.fullName} />
    </div>
  );
}
