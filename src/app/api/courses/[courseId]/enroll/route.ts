import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: sessionToken } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();
    const { name, phone, email, classLevel, utrNo } = body;

    if (!name || !phone || !email || !classLevel || !utrNo) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    
    const existing = await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId, userId: user.id } },
    });

    if (existing) {
      return NextResponse.json({ success: true, enrollment: existing, alreadyEnrolled: true });
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        userId: user.id,
        name,
        phone,
        email,
        classLevel,
        utrNo,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (err) {
    console.error("POST enrollment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ enrolled: false });
    }

    const { courseId } = await params;
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId, userId: sessionToken } },
    });

    return NextResponse.json({
      enrolled: !!enrollment,
      status: enrollment?.status || null,
    });
  } catch (err) {
    console.error("GET enrollment error:", err);
    return NextResponse.json({ enrolled: false });
  }
}
