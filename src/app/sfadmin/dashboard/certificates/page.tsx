import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import CertificatesDashboardContent from "./CertificatesDashboardContent";

export const dynamic = "force-dynamic";

export default async function SFAdminCertificatesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/sfadmin");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  if (!adminUser) {
    redirect("/sfadmin");
  }

  if (adminUser.email.trim().toLowerCase() === "webstrixx@gmail.com") {
    redirect("/admin");
  }

  if (adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com") {
    redirect("/dashboard");
  }

  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedCertificates = certificates.map((cert) => ({
    ...cert,
    issuedBy: cert.issuedBy || "",
    link: cert.link || "",
    imageUrl: cert.imageUrl || "",
    createdAt: cert.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout user={adminUser}>
      <CertificatesDashboardContent
        adminUser={adminUser}
        initialCertificates={serializedCertificates}
      />
    </DashboardLayout>
  );
}
