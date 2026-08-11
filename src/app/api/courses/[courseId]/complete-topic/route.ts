import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await params;
    const body = await req.json();
    const { topicId, weekId } = body;

    if (!topicId || !weekId) return NextResponse.json({ error: "topicId and weekId required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { fullName: true }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { weeks: { orderBy: { weekNumber: "asc" } } }
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const week = course.weeks.find(w => w.id === weekId);
    if (!week) return NextResponse.json({ error: "Week not found" }, { status: 400 });

    // Validate topic belongs to this week
    const weekTopics = (week.topics as any[]) || [];
    const validTopic = weekTopics.find((t: any) => t.id === topicId);
    if (!validTopic) return NextResponse.json({ error: "Invalid topic" }, { status: 400 });

    // Fetch current progress
    const existing = await prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId: sessionToken, courseId } }
    });

    let completedTopics: string[] = existing ? (existing.completedTopics as string[]) : [];
    let completedWeeks: string[] = existing ? (existing.completedWeeks as string[]) : [];

    // Add topic if not already completed
    if (!completedTopics.includes(topicId)) {
      completedTopics.push(topicId);
    }

    // Check if the entire week is now complete
    const weekTopicIds = weekTopics.map((t: any) => t.id);
    const weekCompleted = weekTopicIds.every((tid: string) => completedTopics.includes(tid));

    if (weekCompleted && !completedWeeks.includes(weekId)) {
      completedWeeks.push(weekId);
    }

    // Check if all weeks are complete (course completion)
    const allWeekIds = course.weeks.map(w => w.id);
    const courseCompleted = allWeekIds.every(wid => completedWeeks.includes(wid));

    let certificateId = existing?.certificateId || null;

    // Generate certificate if course just completed
    if (courseCompleted && !certificateId) {
      const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const cert = await prisma.userCertificate.create({
        data: {
          userId: sessionToken,
          title: `Completion Certificate: ${course.title}`,
          issuer: "Student Forge Platform",
          issueDate,
          credentialId: `SF-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        }
      });
      certificateId = cert.id;
    }

    // Upsert progress
    await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId: sessionToken, courseId } },
      update: { completedTopics, completedWeeks, isCompleted: courseCompleted, certificateId },
      create: {
        userId: sessionToken,
        courseId,
        completedTopics,
        completedWeeks,
        isCompleted: courseCompleted,
        certificateId
      }
    });

    return NextResponse.json({
      success: true,
      completedTopics,
      completedWeeks,
      weekCompleted,
      courseCompleted,
      certificateId
    });
  } catch (error) {
    console.error("complete-topic error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
