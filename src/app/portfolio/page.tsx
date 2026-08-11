import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import CertificationsContent from "../certifications/CertificationsContent";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const certificates = await prisma.userCertificate.findMany({
    where: { userId: sessionToken },
    orderBy: { createdAt: "desc" }
  });

  return (
    <CertificationsContent 
      user={user} 
      certificates={certificates.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))} 
    />
  );
}
