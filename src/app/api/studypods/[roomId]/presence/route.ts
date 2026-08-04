import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRESENCE_TTL_MS = 12_000;

function parsePresence(value: unknown): Record<string, string> {
  try {
    if (!value) return {};
    if (typeof value === "string") return JSON.parse(value) as Record<string, string>;
    if (typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

function parseJsonList<T>(value: unknown, fallback: T[]): T[] {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value) as T[];
    if (Array.isArray(value)) return value as T[];
    return fallback;
  } catch {
    return fallback;
  }
}

function getOnlineUserIds(presence: Record<string, string>, now = Date.now()) {
  return Object.entries(presence)
    .filter(([, ts]) => {
      const t = Date.parse(ts);
      return Number.isFinite(t) && now - t <= PRESENCE_TTL_MS;
    })
    .map(([userId]) => userId);
}

export async function GET(
  req: Request,
  props: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await props.params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { id: true },
  });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const studyPod = await prisma.studyPod.findUnique({
    where: { id: roomId },
    select: { creatorId: true, approvedUserIds: true },
  });
  if (!studyPod) {
    return new Response("Not found", { status: 404 });
  }

  const approvedList = parseJsonList<string>(studyPod.approvedUserIds, []);
  const allowed =
    user.id === studyPod.creatorId || approvedList.includes(user.id);
  if (!allowed) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (ids: string[]) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ onlineUserIds: ids })}\n\n`)
        );
      };

      const tick = async () => {
        try {
          const rows = await prisma.$queryRaw<Array<{ activePresence: unknown }>>`
            SELECT "activePresence" FROM "StudyPod" WHERE id = ${roomId}
          `;
          const presence = parsePresence(rows[0]?.activePresence ?? {});
          send(getOnlineUserIds(presence));
        } catch (err) {
          console.error("Presence stream tick error:", err);
        }
      };

      await tick();
      const interval = setInterval(tick, 1000);

      const abort = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      req.signal.addEventListener("abort", abort);
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
