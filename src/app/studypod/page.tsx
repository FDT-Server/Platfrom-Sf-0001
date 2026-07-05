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

  const podIds = initialPods.map((p) => p.id);

  // Fetch all messages in these pods to extract active participant user IDs
  const podMessages = await prisma.studyPodMessage.findMany({
    where: { studyPodId: { in: podIds } },
    select: {
      studyPodId: true,
      userId: true,
      fullName: true,
    },
  });

  const creatorIds = Array.from(new Set(initialPods.map((pod) => pod.creatorId)));
  const participantIds = Array.from(new Set(podMessages.map((msg) => msg.userId)));
  const allUserIds = Array.from(new Set([...creatorIds, ...participantIds]));

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

  // Serialize timestamps and map details for Next.js boundary
  const studyPods = initialPods.map((pod) => {
    const creatorInfo = userMap.get(pod.creatorId);
    
    // Find unique active participants who sent messages (excluding the creator)
    const activeMsgSenders = podMessages.filter((m) => m.studyPodId === pod.id && m.userId !== pod.creatorId);
    const uniqueSenderIds = Array.from(new Set(activeMsgSenders.map((m) => m.userId)));
    
    const participantsList = uniqueSenderIds
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
