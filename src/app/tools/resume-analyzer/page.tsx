import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ResumeAnalyzerContent from "@/app/tools/resume-analyzer/ResumeAnalyzerContent";

export const dynamic = "force-dynamic";

export default async function ResumeAnalyzerPage() {
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
      profileImage: true,
      isPremium: true,
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

  const serializedUser = {
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage || null,
    isPremium: user.isPremium ?? false,
  };

  return <ResumeAnalyzerContent user={serializedUser} />;
}
