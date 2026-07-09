import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ enrollmentId: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: sessionToken } });
    if (!adminUser || adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { enrollmentId } = await params;
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const enrollment = await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { status },
      include: { course: { select: { title: true } } },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (err) {
    console.error("PATCH enrollment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
