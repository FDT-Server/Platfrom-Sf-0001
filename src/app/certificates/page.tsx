import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import CertificatesClient from "./CertificatesClient";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const platformCertificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" },
  });

  const userCertificates = await prisma.userCertificate.findMany({
    where: { userId: sessionToken },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout user={user}>
      <CertificatesClient 
        platformCertificates={platformCertificates} 
        initialUserCertificates={userCertificates.map(c => ({...c, url: c.url || ""}))} 
      />
    </DashboardLayout>
  );
}
