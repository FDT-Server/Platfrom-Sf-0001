import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  // Fetch verified user details
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
    // If the session exists but user is deleted or missing from the database
    redirect("/login");
  }

  return <DashboardContent user={user} />;
}
