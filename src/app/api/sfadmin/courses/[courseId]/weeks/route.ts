import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const weeks = await prisma.courseWeek.findMany({
      where: { courseId },
      orderBy: { weekNumber: "asc" },
    });
    return NextResponse.json({ success: true, weeks });
  } catch (err) {
    console.error("GET course weeks error:", err);
    return NextResponse.json({ error: "Failed to fetch weeks" }, { status: 555 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!adminUser || adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { courseId } = await params;
    const body = await req.json();
    const { title, description, videoLink, weekNumber } = body;

    if (!title || !description || !weekNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const week = await prisma.courseWeek.create({
      data: {
        courseId,
        weekNumber: parseInt(weekNumber),
        title,
        description,
        videoLink: videoLink || "",
      },
    });

    return NextResponse.json({ success: true, week });
  } catch (err) {
    console.error("POST course week error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!adminUser || adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const weekId = searchParams.get("weekId");

    if (!weekId) {
      return NextResponse.json({ error: "Missing weekId parameter" }, { status: 400 });
    }

    await prisma.courseWeek.delete({
      where: { id: weekId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE course week error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
