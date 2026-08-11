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
    const { weekId } = body;
    if (!weekId) return NextResponse.json({ error: "Week ID required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { fullName: true }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { weeks: true }
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Ensure the week belongs to this course
    const validWeek = course.weeks.find(w => w.id === weekId);
    if (!validWeek) return NextResponse.json({ error: "Invalid week" }, { status: 400 });

    // Upsert progress
    let progress = await prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId: sessionToken, courseId } }
    });

    let completedWeeks: string[] = progress ? (progress.completedWeeks as string[]) : [];
    
    if (!completedWeeks.includes(weekId)) {
      completedWeeks.push(weekId);
    }

    const allWeeksCompleted = course.weeks.every(w => completedWeeks.includes(w.id));
    let certificateId = progress?.certificateId || null;

    // Generate certificate if all weeks are completed and not already generated
    if (allWeeksCompleted && !certificateId) {
      const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const newCert = await prisma.userCertificate.create({
        data: {
          userId: sessionToken,
          title: `Completion Certificate: ${course.title}`,
          issuer: "Student Forge Platform",
          issueDate: issueDate,
          credentialId: `SF-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        }
      });
      certificateId = newCert.id;
    }

    progress = await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId: sessionToken, courseId } },
      update: {
        completedWeeks,
        isCompleted: allWeeksCompleted,
        certificateId,
      },
      create: {
        userId: sessionToken,
        courseId,
        completedWeeks,
        isCompleted: allWeeksCompleted,
        certificateId,
      }
    });

    return NextResponse.json({
      success: true,
      completedWeeks,
      isCompleted: allWeeksCompleted,
      certificateId
    });

  } catch (error) {
    console.error("Failed to mark course week complete:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
