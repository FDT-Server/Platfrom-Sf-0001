import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import CreatePodContent from "./CreatePodContent";

export const dynamic = "force-dynamic";

export default async function CreateStudyPodPage() {
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
      profileImage: true,
      selectedRole: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <CreatePodContent user={user} />;
}
