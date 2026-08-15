import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type } = body;

    if (!type) return NextResponse.json({ error: "Certification type required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: sessionToken }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check if certificate already exists to avoid duplicates
    const existing = await prisma.userCertificate.findFirst({
      where: { userId: sessionToken, title: type }
    });

    if (existing) {
      return NextResponse.json({ success: true, certificate: existing });
    }

    const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const cert = await prisma.userCertificate.create({
      data: {
        userId: sessionToken,
        title: type,
        issuer: "Student Forge Exams",
        issueDate,
        credentialId: `SF-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      }
    });

    return NextResponse.json({ success: true, certificate: cert });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
