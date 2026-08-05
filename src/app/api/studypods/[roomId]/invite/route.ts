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
        { error: "Only the host creator can invite participants" },
        { status: 403 }
      );
    }

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId is required" },
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

    // Enforce max 4 members (1 host + 3 approved participants)
    if (approvedList.length >= 3) {
      return NextResponse.json(
        { error: "Study pod is full (max 4 members)" },
        { status: 400 }
      );
    }

    if (!approvedList.includes(targetUserId)) {
      approvedList.push(targetUserId);
    }

    await prisma.studyPod.update({
      where: { id: roomId },
      data: {
        approvedUserIds: approvedList,
      },
    });

    return NextResponse.json({
      success: true,
      approvedUserIds: approvedList,
    });
  } catch (err) {
    console.error("Invite member error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
