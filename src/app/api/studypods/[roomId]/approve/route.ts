import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await props.params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studyPod = await prisma.studyPod.findUnique({
      where: { id: roomId },
    });

    if (!studyPod) {
      return NextResponse.json({ error: "Study Pod not found" }, { status: 404 });
    }

    if (studyPod.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Only the host creator can approve participants" },
        { status: 403 }
      );
    }

    const { targetUserId, action } = await req.json();

    if (!targetUserId || !action) {
      return NextResponse.json(
        { error: "targetUserId and action are required" },
        { status: 400 }
      );
    }

    let approvedList: string[] = [];
    try {
      if (studyPod.approvedUserIds) {
        approvedList = typeof studyPod.approvedUserIds === "string"
          ? JSON.parse(studyPod.approvedUserIds)
          : (studyPod.approvedUserIds as string[]);
      }
    } catch {
      approvedList = [];
    }

    let waitingList: any[] = [];
    try {
      if (studyPod.waitingUserIds) {
        waitingList = typeof studyPod.waitingUserIds === "string"
          ? JSON.parse(studyPod.waitingUserIds)
          : (studyPod.waitingUserIds as any[]);
      }
    } catch {
      waitingList = [];
    }

    const updatedWaitingList = waitingList.filter((w) => w.id !== targetUserId);

    if (action === "accept") {
      if (!approvedList.includes(targetUserId)) {
        approvedList.push(targetUserId);
      }
    }

    await prisma.studyPod.update({
      where: { id: roomId },
      data: {
        approvedUserIds: approvedList,
        waitingUserIds: updatedWaitingList,
      },
    });

    return NextResponse.json({
      success: true,
      approvedUserIds: approvedList,
      waitingUserIds: updatedWaitingList,
    });
  } catch (err) {
    console.error("Approve member error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
