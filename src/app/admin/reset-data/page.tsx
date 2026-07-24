import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ResetDataContent from "./ResetDataContent";

export const dynamic = "force-dynamic";

export default async function ResetDataAdminPage() {
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

  const adminEmails = ["webstrixx@gmail.com", "hrstudentforge@gmail.com"];

  if (!adminUser || !adminEmails.includes(adminUser.email.trim().toLowerCase())) {
    redirect("/dashboard");
  }

  return <ResetDataContent adminUser={adminUser} />;
}
