import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loggedInUser = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        selectedRole: true,
        profileImage: true,
        collegeStudying: true,
        branch: true,
        year: true,
        portfolioLink: true,
        linkedinLink: true,
        about: true,
        shareWithNetworking: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error("Get users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
