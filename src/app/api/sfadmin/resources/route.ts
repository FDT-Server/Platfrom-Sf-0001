import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, resources });
  } catch (err) {
    console.error("GET resources error:", err);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
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
    const { title, publisher, category, link, imageUrl } = body;

    if (!title || !publisher || !category || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
    let headerBg = "bg-indigo-500 text-white";

    const catLower = category.toLowerCase();
    if (catLower === "styling") {
      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
      headerBg = "bg-emerald-450 text-emerald-950";
    } else if (catLower === "next.js") {
      badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
      headerBg = "bg-[#e2f952] text-slate-900";
    } else if (catLower === "components") {
      badgeColor = "bg-pink-50 text-pink-700 border-pink-100";
      headerBg = "bg-pink-450 text-white";
    } else if (catLower === "library") {
      badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
      headerBg = "bg-rose-500 text-white";
    } else if (catLower === "language") {
      badgeColor = "bg-sky-50 text-sky-700 border-sky-100";
      headerBg = "bg-sky-500 text-white";
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        publisher,
        category,
        link,
        date: dateStr,
        badgeColor,
        headerBg,
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (err) {
    console.error("POST resource error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
