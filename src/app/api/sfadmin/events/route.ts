import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (err) {
    console.error("GET events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
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
    const { title, description, day, month, time, duration, speakerName, speakerTitle, speakerCompany, category, joinLink, imageUrl } = body;

    if (!title || !description || !day || !month || !time || !duration || !speakerName || !speakerTitle || !speakerCompany || !category || !joinLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        day,
        month,
        time,
        duration,
        speakerName,
        speakerTitle,
        speakerCompany,
        category,
        badgeText: category,
        joinLink,
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("POST event error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
