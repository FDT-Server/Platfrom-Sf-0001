import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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

    
    const url = new URL(req.url);
    const activeChatId = url.searchParams.get("activeChatUserId");

    
    const messagesToMarkSeen = messages.filter((msg) => {
      const isInActiveChat =
        (activeChatId === "null" || !activeChatId)
          ? msg.recipientId === null 
          : (msg.userId === activeChatId && msg.recipientId === loggedInUser.id) ||
            (msg.userId === loggedInUser.id && msg.recipientId === activeChatId); 

      if (!isInActiveChat) return false;

      let seenMap: any = msg.seenBy || {};
      if (typeof seenMap === "string") {
        try {
          seenMap = JSON.parse(seenMap);
        } catch {
          seenMap = {};
        }
      }
      return !seenMap[loggedInUser.id];
    });

    if (messagesToMarkSeen.length > 0) {
      const now = new Date().toISOString();
      for (const msg of messagesToMarkSeen) {
        let seenMap: any = msg.seenBy || {};
        if (typeof seenMap === "string") {
          try {
            seenMap = JSON.parse(seenMap);
          } catch {
            seenMap = {};
          }
        }
        seenMap[loggedInUser.id] = {
          fullName: loggedInUser.fullName,
          seenAt: now,
        };

        await prisma.message.update({
          where: { id: msg.id },
          data: {
            seenBy: seenMap,
          },
        });

        
        msg.seenBy = seenMap;
      }
    }

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
