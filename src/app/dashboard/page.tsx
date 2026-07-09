import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardContent from "./DashboardContent";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
      selectedRole: true,
      otherRoleText: true,
      goals: true,
      profileImage: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  
  if (user.email.trim().toLowerCase() === "webstrixx@gmail.com") {
    redirect("/admin");
  }

  if (user.email.trim().toLowerCase() === "hrstudentforge@gmail.com") {
    redirect("/sfadmin/dashboard");
  }

  
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      day: true,
      month: true,
      time: true,
      duration: true,
      category: true,
      imageUrl: true,
      speakerName: true,
      speakerTitle: true,
      speakerCompany: true,
      speakerImage: true,
      joinLink: true,
      badgeText: true,
      badgeBg: true,
    },
  });

  return <DashboardContent user={user} events={events} />;
}
