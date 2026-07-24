import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import LearnersContent from "./LearnersContent";

export default async function AdminPanelPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  if (!adminUser || adminUser.email.trim().toLowerCase() !== "webstrixx@gmail.com") {
    redirect("/dashboard");
  }

  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      selectedRole: true,
      otherRoleText: true,
      goals: true,
      profileImage: true,
      collegeStudying: true,
      branch: true,
      year: true,
      dob: true,
      portfolioLink: true,
      linkedinLink: true,
      about: true,
      isPremium: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const paymentRequests = await prisma.paymentRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedUsers = allUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  const serializedRequests = paymentRequests.map((req) => ({
    ...req,
    createdAt: req.createdAt.toISOString(),
    updatedAt: req.updatedAt.toISOString(),
  }));

  return (
    <LearnersContent
      adminUser={adminUser}
      allUsers={serializedUsers}
      paymentRequests={serializedRequests}
    />
  );
}
