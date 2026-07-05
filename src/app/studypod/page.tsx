import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import StudyPodContent from "./StudyPodContent";

export const dynamic = "force-dynamic";

export default async function StudyPodPage() {
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

  // Fetch initial Study Pods list
  const initialPods = await prisma.studyPod.findMany({
    orderBy: { createdAt: "desc" },
  });

  const creatorIds = Array.from(new Set(initialPods.map((pod) => pod.creatorId)));
  const users = await prisma.user.findMany({
    where: { id: { in: creatorIds } },
    select: {
      id: true,
      profileImage: true,
      selectedRole: true,
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  // Serialize timestamps and map details for Next.js boundary
  const studyPods = initialPods.map((pod) => {
    const creatorInfo = userMap.get(pod.creatorId);
    return {
      ...pod,
      createdAt: pod.createdAt.toISOString(),
      creatorImage: creatorInfo?.profileImage || null,
      creatorRole: creatorInfo?.selectedRole || null,
    };
  });

  return <StudyPodContent user={user} initialPods={studyPods} />;
}
