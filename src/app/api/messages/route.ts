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

    // Verify session user exists
    const loggedInUser = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve latest 200 messages that are public OR involve the logged-in user
    const messages = await prisma.message.findMany({
      take: 200,
      where: {
        OR: [
          { recipientId: null },
          { userId: loggedInUser.id },
          { recipientId: loggedInUser.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ messages });
  } catch (err: any) {
    console.error("Fetch messages error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve sender user details
    const sender = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!sender) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, recipientId } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    // Save message to database, optional recipientId
    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: sender.id,
        fullName: sender.fullName,
        email: sender.email,
        role: sender.email.trim().toLowerCase() === "webstrixx@gmail.com" ? "Admin" : sender.selectedRole,
        recipientId: recipientId || null,
      },
    });

    return NextResponse.json({ message: newMessage });
  } catch (err: any) {
    console.error("Create message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
