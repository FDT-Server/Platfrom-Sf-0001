import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const draftId = sessionToken + "-draft";
    const draft = await prisma.resume.findUnique({ where: { id: draftId } });

    if (!draft) return NextResponse.json(null);

    const data = {
      personalDetails: draft.personalInfo || {},
      summary: draft.summary || "",
      education: draft.education || [],
      experience: draft.experience || [],
      projects: draft.projects || [],
      skills: draft.skills || [],
      certifications: draft.certifications || [],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET resume draft error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const draftId = sessionToken + "-draft";

    const updated = await prisma.resume.upsert({
      where: { id: draftId },
      update: {
        personalInfo: body.personalDetails || {},
        summary: body.summary || "",
        education: body.education || [],
        experience: body.experience || [],
        projects: body.projects || [],
        skills: body.skills || [],
        certifications: body.certifications || [],
        updatedAt: new Date(),
      },
      create: {
        id: draftId,
        userId: sessionToken,
        name: "My Resume Draft",
        status: "DRAFT",
        personalInfo: body.personalDetails || {},
        summary: body.summary || "",
        education: body.education || [],
        experience: body.experience || [],
        projects: body.projects || [],
        skills: body.skills || [],
        certifications: body.certifications || [],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("POST resume draft error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
