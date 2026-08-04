import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, certificates });
  } catch (err) {
    console.error("GET certificates error:", err);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { title, description, issuedBy, link, imageUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        description,
        issuedBy: issuedBy || "",
        link: link || "",
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({ success: true, certificate });
  } catch (err) {
    console.error("POST certificate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
