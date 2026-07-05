import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import StudyRoomContent from "./StudyRoomContent";

export const dynamic = "force-dynamic";

export default async function StudyRoomPage(
  props: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await props.params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  
  const studyPod = await prisma.studyPod.findUnique({
    where: { id: roomId },
  });

  if (!studyPod) {
    notFound();
  }

  const serializedPod = {
    id: studyPod.id,
    name: studyPod.name,
    creatorName: studyPod.creatorName,
    creatorId: studyPod.creatorId,
    approvedUserIds: studyPod.approvedUserIds,
    waitingUserIds: studyPod.waitingUserIds,
  };

  
  if (!sessionToken) {
    return <StudyRoomContent user={null} studyPod={serializedPod} roomId={roomId} />;
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
    
    return <StudyRoomContent user={null} studyPod={serializedPod} roomId={roomId} />;
  }

  return <StudyRoomContent user={user} studyPod={serializedPod} roomId={roomId} />;
}
