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
     isPremium: true, credits: true, streak: true,},
  });

  if (!user) {
    redirect("/login");
  }

  const allPods = await prisma.studyPod.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initialPods = allPods.filter((pod) => {
    if (pod.creatorId === user.id) return true;
    if (user.email === "jaswanth@gmail.com" || user.email === "webstrixx@gmail.com") return true;

    let approved: string[] = [];
    let waiting: any[] = [];

    try {
      approved = typeof pod.approvedUserIds === "string" ? JSON.parse(pod.approvedUserIds) : (pod.approvedUserIds || []);
    } catch {}

    try {
      waiting = typeof pod.waitingUserIds === "string" ? JSON.parse(pod.waitingUserIds) : (pod.waitingUserIds || []);
    } catch {}

    const isWaiting = waiting.some((w) => w === user.id || w?.id === user.id);

    return approved.includes(user.id) || isWaiting;
  });

  const podIds = initialPods.map((p) => p.id);

  const podMessages = await prisma.studyPodMessage.findMany({
    where: { studyPodId: { in: podIds } },
    select: {
      studyPodId: true,
      userId: true,
      fullName: true,
    },
  });

  const creatorIds = Array.from(new Set(initialPods.map((pod) => pod.creatorId)));
  const allApprovedUserIds = initialPods.flatMap(pod => {
    try {
      return typeof pod.approvedUserIds === "string" ? JSON.parse(pod.approvedUserIds) : (pod.approvedUserIds || []);
    } catch {
      return [];
    }
  });
  const allUserIds = Array.from(new Set([...creatorIds, ...allApprovedUserIds]));

  const dbUsers = await prisma.user.findMany({
    where: { id: { in: allUserIds } },
    select: {
      id: true,
      fullName: true,
      email: true,
      profileImage: true,
      selectedRole: true,
    },
  });

  const userMap = new Map(dbUsers.map((u) => [u.id, u]));

  const studyPods = initialPods.map((pod) => {
    const creatorInfo = userMap.get(pod.creatorId);

    let approved: string[] = [];
    try {
      approved = typeof pod.approvedUserIds === "string" ? JSON.parse(pod.approvedUserIds) : (pod.approvedUserIds || []);
    } catch {}

    const participantsList = approved
      .map((uid) => userMap.get(uid))
      .filter((u): u is NonNullable<typeof u> => !!u)
      .map((u) => ({
        id: u.id,
        fullName: u.fullName,
        profileImage: u.profileImage,
        selectedRole: u.selectedRole,
      }));

    return {
      ...pod,
      createdAt: pod.createdAt.toISOString(),
      creatorImage: creatorInfo?.profileImage || null,
      creatorRole: creatorInfo?.selectedRole || null,
      participants: participantsList,
    };
  });

  return <StudyPodContent user={user} initialPods={studyPods} />;
}
