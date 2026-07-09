import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import EventsDashboardContent from "./EventsDashboardContent";

export const dynamic = "force-dynamic";

export default async function SFAdminEventsPage() {
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

  
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedEvents = events.map((evt) => ({
    ...evt,
    speakerImage: evt.speakerImage || "",
    imageUrl: evt.imageUrl || "",
    createdAt: evt.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout user={adminUser}>
      <EventsDashboardContent
        adminUser={adminUser}
        initialEvents={serializedEvents}
      />
    </DashboardLayout>
  );
}
