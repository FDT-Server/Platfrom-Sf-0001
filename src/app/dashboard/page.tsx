import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getConnectionExclusionIds } from "@/lib/connections";
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
      id: true,
      fullName: true,
      email: true,
      selectedRole: true,
      otherRoleText: true,
      goals: true,
      profileImage: true,
      collegeStudying: true,
      branch: true,
      year: true,
      linkedinLink: true,
      portfolioLink: true,
      about: true,
      shareWithNetworking: true,
     isPremium: true, credits: true, streak: true,},
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

  const [events, { excludedIds }] = await Promise.all([
    prisma.event.findMany({
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
    }),
    getConnectionExclusionIds(user.id),
  ]);

  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: { notIn: [user.id, ...Array.from(excludedIds)] },
      email: {
        notIn: ["webstrixx@gmail.com", "hrstudentforge@gmail.com"],
      },
      fullName: {
        not: user.fullName, // Hide test accounts with the exact same name
      },
    },
    take: 3,
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedRole: true,
      profileImage: true,
      collegeStudying: true,
    },
  });

  return <DashboardContent user={user as any} events={events} suggestedUsers={suggestedUsers} />;
}

