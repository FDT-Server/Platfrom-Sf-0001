// @ts-nocheck
import prisma from "@/lib/db";

type ConnRow = {
  fromUserId: string;
  toUserId: string;
  status: string;
};

/** Friend IDs + pending other-user IDs for the logged-in user */
export async function getConnectionExclusionIds(userId: string) {
  let rows: ConnRow[] = [];

  try {
    // Prefer Prisma model when the client is up to date
    if ((prisma as any).connectionRequest?.findMany) {
      rows = await prisma.connectionRequest.findMany({
        where: {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        select: { fromUserId: true, toUserId: true, status: true },
      });
    } else {
      // Fallback for stale hot-reloaded Prisma clients
      rows = await prisma.$queryRaw<ConnRow[]>`
        SELECT "fromUserId", "toUserId", status
        FROM "ConnectionRequest"
        WHERE ("fromUserId" = ${userId} OR "toUserId" = ${userId})
          AND status IN ('PENDING', 'ACCEPTED')
      `;
    }
  } catch (err) {
    console.error("getConnectionExclusionIds error:", err);
    return {
      friendIds: new Set<string>(),
      pendingIds: new Set<string>(),
      excludedIds: new Set<string>(),
    };
  }

  const friendIds = new Set<string>();
  const pendingIds = new Set<string>();

  for (const r of rows) {
    const otherId = r.fromUserId === userId ? r.toUserId : r.fromUserId;
    if (r.status === "ACCEPTED") friendIds.add(otherId);
    else pendingIds.add(otherId);
  }

  return {
    friendIds,
    pendingIds,
    excludedIds: new Set<string>([...friendIds, ...pendingIds]),
  };
}
