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
      isPremium: true,
     credits: true, streak: true,},
  });

  if (!user) {
    redirect("/login");
  }


  const allPods = await prisma.studyPod.findMany();
  
  let totalPodsCount = 0;
  
  for (const pod of allPods) {
    if (pod.creatorId === user.id) {
      totalPodsCount++;
      continue;
    }
    
    let approved: string[] = [];
    try {
      approved = typeof pod.approvedUserIds === "string" ? JSON.parse(pod.approvedUserIds) : (pod.approvedUserIds || []);
    } catch {}
    
    if (approved.includes(user.id)) {
      totalPodsCount++;
    }
  }

  return <CreatePodContent user={{ ...user, createdPodsCount: totalPodsCount }} />;
}
