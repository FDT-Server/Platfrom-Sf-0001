import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET room details or just metadata if unauthenticated
export async function GET(
  req: Request,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await props.params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    const studyPod = await prisma.studyPod.findUnique({
      where: { id: roomId },
    });

    if (!studyPod) {
      return NextResponse.json(
        { error: "Study Pod not found." },
        { status: 404 }
      );
    }

    // Check if user is logged in
    if (!sessionToken) {
      return NextResponse.json({
        authenticated: false,
        studyPod: {
          id: studyPod.id,
          name: studyPod.name,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        studyPod: {
          id: studyPod.id,
          name: studyPod.name,
        },
      });
    }

    // Gating check: Is the user the host?
    const isHost = user.id === studyPod.creatorId;

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

    if (!isHost && !approvedList.includes(user.id)) {
      // User is not approved yet - check if already waiting
      const isAlreadyWaiting = waitingList.some((w) => w.id === user.id);
      if (!isAlreadyWaiting) {
        waitingList.push({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage || null,
          selectedRole: user.selectedRole || "Academy Learner",
        });

        await prisma.studyPod.update({
          where: { id: roomId },
          data: {
            waitingUserIds: waitingList,
          },
        });
      }

      return NextResponse.json({
        authenticated: true,
        status: "waiting",
        studyPod: {
          id: studyPod.id,
          name: studyPod.name,
          creatorName: studyPod.creatorName,
        },
      });
    }

    // User is approved or host - fetch room assets
    const [messages, todos, ideas] = await Promise.all([
      prisma.studyPodMessage.findMany({
        where: { studyPodId: roomId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.studyPodTodo.findMany({
        where: { studyPodId: roomId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.studyPodIdea.findMany({
        where: { studyPodId: roomId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Fetch user profile images to display user avatars on the client sidebar
    const userIds = Array.from(new Set(messages.map((m) => m.userId)));
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, profileImage: true },
    });

    const userProfileMap = new Map(users.map((u) => [u.id, u.profileImage]));

    const messagesWithProfiles = messages.map((m) => ({
      ...m,
      profileImage: userProfileMap.get(m.userId) || null,
    }));

    return NextResponse.json({
      authenticated: true,
      status: "approved",
      studyPod,
      messages: messagesWithProfiles,
      todos,
      ideas,
    });
  } catch (err) {
    console.error("Fetch study pod detail error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add message, todo, or idea to workspace
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

    const { type, content, title, description } = await req.json();

    if (type === "message") {
      if (!content || !content.trim()) {
        return NextResponse.json({ error: "Message content is required" }, { status: 400 });
      }
      const msg = await prisma.studyPodMessage.create({
        data: {
          studyPodId: roomId,
          content: content.trim(),
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      });
      return NextResponse.json({ success: true, message: msg });
    }

    if (type === "todo") {
      if (!title || !title.trim()) {
        return NextResponse.json({ error: "Todo title is required" }, { status: 400 });
      }
      const todo = await prisma.studyPodTodo.create({
        data: {
          studyPodId: roomId,
          title: title.trim(),
          creatorName: user.fullName,
        },
      });
      return NextResponse.json({ success: true, todo });
    }

    if (type === "idea") {
      if (!title || !title.trim() || !description || !description.trim()) {
        return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
      }
      const idea = await prisma.studyPodIdea.create({
        data: {
          studyPodId: roomId,
          title: title.trim(),
          description: description.trim(),
          creatorName: user.fullName,
        },
      });
      return NextResponse.json({ success: true, idea });
    }

    return NextResponse.json({ error: "Invalid dynamic write type" }, { status: 400 });
  } catch (err) {
    console.error("Workspace post error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Toggle todo completion
export async function PATCH(
  req: Request,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { todoId, completed } = await req.json();

    if (!todoId) {
      return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
    }

    await prisma.studyPodTodo.update({
      where: { id: todoId },
      data: { completed },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Toggle todo error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a todo or idea
export async function DELETE(
  req: Request,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, id } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ error: "ID and type are required" }, { status: 400 });
    }

    if (type === "todo") {
      await prisma.studyPodTodo.delete({
        where: { id },
      });
    } else if (type === "idea") {
      await prisma.studyPodIdea.delete({
        where: { id },
      });
    } else {
      return NextResponse.json({ error: "Invalid delete target type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete workspace asset error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
