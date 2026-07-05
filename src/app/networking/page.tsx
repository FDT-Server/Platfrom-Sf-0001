import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import NetworkingContent from "./NetworkingContent";

export default async function NetworkingPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  // Fetch logged-in user profile details
  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      id: true,
      email: true,
      fullName: true,
      selectedRole: true,
      profileImage: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch all registered users to display in the networking active list
  const allUsers = await prisma.user.findMany({
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedRole: true,
      profileImage: true,
      collegeStudying: true,
      branch: true,
      year: true,
      dob: true,
      portfolioLink: true,
      linkedinLink: true,
      about: true,
      shareWithNetworking: true,
    },
  });

  return <NetworkingContent user={user} allUsers={allUsers} />;
}
