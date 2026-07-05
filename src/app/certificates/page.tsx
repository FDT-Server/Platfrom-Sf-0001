import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
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
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs animate-fadeIn">
        <h3 className="text-xl font-semibold text-slate-800">Certificates</h3>
        <p className="text-xs text-slate-500 mt-1">This module is currently empty.</p>
      </div>
    </DashboardLayout>
  );
}
