import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { email: true },
    });

    const adminEmails = ["webstrixx@gmail.com", "hrstudentforge@gmail.com"];

    if (!adminUser || !adminEmails.includes(adminUser.email.trim().toLowerCase())) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    if (body.confirmationText !== "DELETE ALL PLATFORM DATA") {
      return NextResponse.json(
        { error: "Invalid confirmation text. Must match 'DELETE ALL PLATFORM DATA'." },
        { status: 400 }
      );
    }

    // Delete platform data while preserving admin users
    await prisma.$transaction([
      prisma.post.deleteMany({}),
      prisma.message.deleteMany({}),
      prisma.studyPodMessage.deleteMany({}),
      prisma.studyPodTodo.deleteMany({}),
      prisma.studyPodIdea.deleteMany({}),
      prisma.studyPod.deleteMany({}),
      prisma.paymentRequest.deleteMany({}),
      prisma.courseEnrollment.deleteMany({}),
      prisma.resume.deleteMany({}),
      prisma.user.deleteMany({
        where: {
          email: {
            notIn: adminEmails,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "All platform data purged successfully. Admin accounts preserved.",
    });
  } catch (error: any) {
    console.error("Purge platform data error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to purge platform data." },
      { status: 500 }
    );
  }
}
