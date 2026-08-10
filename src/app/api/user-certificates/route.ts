import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await prisma.userCertificate.findMany({
      where: { userId: sessionToken },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching user certificates:", error);
    return NextResponse.json({ error: "Failed to fetch user certificates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, issuer, issueDate, credentialId, url, imageUrl, type } = body;

    if (!title || (!url && !imageUrl)) {
      return NextResponse.json({ error: "Title and either URL or Image are required" }, { status: 400 });
    }

    const newCertificate = await prisma.userCertificate.create({
      data: {
        userId: sessionToken,
        title,
        issuer: issuer || "",
        issueDate: issueDate || "",
        credentialId: credentialId || "",
        url: url || "",
        imageUrl: imageUrl || "",
        type: type || "CERTIFICATE",
      },
    });

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("Error creating user certificate:", error);
    return NextResponse.json({ error: "Failed to create user certificate" }, { status: 500 });
  }
}
