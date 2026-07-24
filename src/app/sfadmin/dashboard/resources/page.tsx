import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import ResourcesDashboardContent from "./ResourcesDashboardContent";

export const dynamic = "force-dynamic";

export default async function SFAdminResourcesPage() {
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

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedResources = resources.map((r) => ({
    ...r,
    imageUrl: r.imageUrl || "",
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout user={adminUser}>
      <ResourcesDashboardContent
        adminUser={adminUser}
        initialResources={serializedResources}
      />
    </DashboardLayout>
  );
}
