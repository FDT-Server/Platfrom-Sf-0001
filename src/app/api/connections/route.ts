import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { getConnectionExclusionIds } from "@/lib/connections";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = ["webstrixx@gmail.com", "hrstudentforge@gmail.com"];

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  selectedRole: true,
  profileImage: true,
  collegeStudying: true,
  branch: true,
  year: true,
} as const;

type ConnRow = {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  return prisma.user.findUnique({
    where: { id: sessionToken },
    select: { id: true, fullName: true, email: true },
  });
}

async function findConnRowsForUser(userId: string): Promise<ConnRow[]> {
  return prisma.$queryRaw<ConnRow[]>`
    SELECT id, "fromUserId", "toUserId", status, "createdAt", "updatedAt"
    FROM "ConnectionRequest"
    WHERE ("fromUserId" = ${userId} OR "toUserId" = ${userId})
      AND status IN ('PENDING', 'ACCEPTED')
    ORDER BY "updatedAt" DESC
  `;
}

async function findConnBetween(a: string, b: string): Promise<ConnRow | null> {
  const rows = await prisma.$queryRaw<ConnRow[]>`
    SELECT id, "fromUserId", "toUserId", status, "createdAt", "updatedAt"
    FROM "ConnectionRequest"
    WHERE (
      ("fromUserId" = ${a} AND "toUserId" = ${b})
      OR ("fromUserId" = ${b} AND "toUserId" = ${a})
    )
      AND status IN ('PENDING', 'ACCEPTED')
    LIMIT 1
  `;
  return rows[0] || null;
}

async function findConnById(id: string): Promise<ConnRow | null> {
  const rows = await prisma.$queryRaw<ConnRow[]>`
    SELECT id, "fromUserId", "toUserId", status, "createdAt", "updatedAt"
    FROM "ConnectionRequest"
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function findDeclined(fromUserId: string, toUserId: string): Promise<ConnRow | null> {
  const rows = await prisma.$queryRaw<ConnRow[]>`
    SELECT id, "fromUserId", "toUserId", status, "createdAt", "updatedAt"
    FROM "ConnectionRequest"
    WHERE "fromUserId" = ${fromUserId} AND "toUserId" = ${toUserId}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await findConnRowsForUser(user.id);

    const otherIds = Array.from(
      new Set(rows.map((r) => (r.fromUserId === user.id ? r.toUserId : r.fromUserId)))
    );

    const others = await prisma.user.findMany({
      where: { id: { in: otherIds } },
      select: userSelect,
    });
    const otherMap = new Map(others.map((u) => [u.id, u]));

    const friends: any[] = [];
    const pendingIncoming: any[] = [];
    const pendingOutgoing: any[] = [];

    for (const r of rows) {
      const otherId = r.fromUserId === user.id ? r.toUserId : r.fromUserId;
      const other = otherMap.get(otherId);
      if (!other) continue;

      const item = {
        requestId: r.id,
        id: other.id,
        fullName: other.fullName,
        email: other.email,
        selectedRole: other.selectedRole,
        profileImage: other.profileImage,
        collegeStudying: other.collegeStudying,
        branch: other.branch,
        year: other.year,
        status: r.status,
        fromUserId: r.fromUserId,
        toUserId: r.toUserId,
        incoming: r.toUserId === user.id,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      if (r.status === "ACCEPTED") {
        friends.push(item);
      } else if (r.toUserId === user.id) {
        pendingIncoming.push(item);
      } else {
        pendingOutgoing.push(item);
      }
    }

    const { friendIds, pendingIds } = await getConnectionExclusionIds(user.id);

    return NextResponse.json({
      success: true,
      friends,
      pendingIncoming,
      pendingOutgoing,
      friendIds: Array.from(friendIds),
      pendingIds: Array.from(pendingIds),
      excludedIds: Array.from(new Set([...friendIds, ...pendingIds])),
    });
  } catch (err) {
    console.error("Get connections error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "send") {
      const toUserId = body.toUserId as string;
      if (!toUserId) {
        return NextResponse.json({ error: "toUserId is required" }, { status: 400 });
      }
      if (toUserId === user.id) {
        return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });
      }

      const target = await prisma.user.findUnique({
        where: { id: toUserId },
        select: { id: true, fullName: true, email: true },
      });
      if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (ADMIN_EMAILS.includes((target.email || "").toLowerCase())) {
        return NextResponse.json({ error: "Cannot connect with this account" }, { status: 403 });
      }

      const existing = await findConnBetween(user.id, toUserId);

      if (existing) {
        if (existing.status === "ACCEPTED") {
          return NextResponse.json({ error: "You are already connected" }, { status: 400 });
        }
        if (existing.fromUserId === user.id) {
          return NextResponse.json({ error: "Request already sent" }, { status: 400 });
        }
        await prisma.$executeRaw`
          UPDATE "ConnectionRequest"
          SET status = 'ACCEPTED', "updatedAt" = NOW()
          WHERE id = ${existing.id}
        `;
        return NextResponse.json({
          success: true,
          status: "ACCEPTED",
          request: { ...existing, status: "ACCEPTED" },
          message: `You are now connected with ${target.fullName}`,
        });
      }

      const declined = await findDeclined(user.id, toUserId);
      let requestId = declined?.id;

      if (declined) {
        await prisma.$executeRaw`
          UPDATE "ConnectionRequest"
          SET status = 'PENDING', "updatedAt" = NOW()
          WHERE id = ${declined.id}
        `;
        requestId = declined.id;
      } else {
        requestId = randomUUID();
        await prisma.$executeRaw`
          INSERT INTO "ConnectionRequest" (id, "fromUserId", "toUserId", status, "createdAt", "updatedAt")
          VALUES (${requestId}, ${user.id}, ${toUserId}, 'PENDING', NOW(), NOW())
        `;
      }

      return NextResponse.json({
        success: true,
        status: "PENDING",
        request: {
          id: requestId,
          fromUserId: user.id,
          toUserId,
          status: "PENDING",
        },
        message: `Connection request sent to ${target.fullName}`,
      });
    }

    if (action === "accept") {
      const requestId = body.requestId as string;
      if (!requestId) {
        return NextResponse.json({ error: "requestId is required" }, { status: 400 });
      }

      const request = await findConnById(requestId);
      if (!request || request.status !== "PENDING") {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      if (request.toUserId !== user.id) {
        return NextResponse.json(
          { error: "Only the recipient can accept this request" },
          { status: 403 }
        );
      }

      await prisma.$executeRaw`
        UPDATE "ConnectionRequest"
        SET status = 'ACCEPTED', "updatedAt" = NOW()
        WHERE id = ${requestId}
      `;

      return NextResponse.json({
        success: true,
        status: "ACCEPTED",
        request: { ...request, status: "ACCEPTED" },
      });
    }

    if (action === "decline") {
      const requestId = body.requestId as string;
      if (!requestId) {
        return NextResponse.json({ error: "requestId is required" }, { status: 400 });
      }

      const request = await findConnById(requestId);
      if (!request || request.status !== "PENDING") {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      if (request.toUserId !== user.id && request.fromUserId !== user.id) {
        return NextResponse.json({ error: "Not allowed" }, { status: 403 });
      }

      await prisma.$executeRaw`
        UPDATE "ConnectionRequest"
        SET status = 'DECLINED', "updatedAt" = NOW()
        WHERE id = ${requestId}
      `;

      return NextResponse.json({ success: true, status: "DECLINED" });
    }

    if (action === "remove") {
      const otherUserId = body.userId as string;
      if (!otherUserId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
      }

      await prisma.$executeRaw`
        DELETE FROM "ConnectionRequest"
        WHERE (
          ("fromUserId" = ${user.id} AND "toUserId" = ${otherUserId})
          OR ("fromUserId" = ${otherUserId} AND "toUserId" = ${user.id})
        )
      `;

      return NextResponse.json({ success: true, status: "REMOVED" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Connections POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
