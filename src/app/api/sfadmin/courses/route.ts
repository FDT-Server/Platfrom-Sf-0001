import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error("GET courses error:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
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
    const { title, description, duration, instructor, link, imageUrl, skillsGain, outcomes, price } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const parsedPrice = price ? parseFloat(String(price)) : 0.0;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        duration: duration || "",
        instructor: instructor || "",
        link: link || "",
        imageUrl: imageUrl || "",
        skillsGain: skillsGain || "",
        outcomes: outcomes || "",
        price: isNaN(parsedPrice) ? 0.0 : parsedPrice,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (err) {
    console.error("POST course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
