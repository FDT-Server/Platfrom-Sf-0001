import prisma from "@/lib/db";

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

export type StudyPodRef = { id: string; name: string };

export type FreeTierStudyPodUsage = {
  ownedPods: StudyPodRef[];
  joinedPods: StudyPodRef[];
  waitingPods: StudyPodRef[];
  /** owned + joined + waiting (unique pods the free user is tied to) */
  involvementCount: number;
};

/**
 * Free (basic) accounts may be involved in exactly 1 Study Pod total:
 * either as host (created) OR as a joiner/waiting member — not both, and not multiple.
 */
export async function getFreeTierStudyPodUsage(
  userId: string
): Promise<FreeTierStudyPodUsage> {
  const pods = await prisma.studyPod.findMany({
    select: {
      id: true,
      name: true,
      creatorId: true,
      approvedUserIds: true,
      waitingUserIds: true,
    },
  });

  const ownedPods: StudyPodRef[] = [];
  const joinedPods: StudyPodRef[] = [];
  const waitingPods: StudyPodRef[] = [];

  for (const pod of pods) {
    const ref = { id: pod.id, name: pod.name };

    if (pod.creatorId === userId) {
      ownedPods.push(ref);
      continue;
    }

    const approved = parseJsonList<string>(pod.approvedUserIds, []);
    if (approved.includes(userId)) {
      joinedPods.push(ref);
      continue;
    }

    const waiting = parseJsonList<{ id?: string }>(pod.waitingUserIds, []);
    if (waiting.some((w) => w?.id === userId)) {
      waitingPods.push(ref);
    }
  }

  return {
    ownedPods,
    joinedPods,
    waitingPods,
    involvementCount: ownedPods.length + joinedPods.length + waitingPods.length,
  };
}

export function freeTierCreateBlockReason(
  isPremium: boolean,
  usage: FreeTierStudyPodUsage
): string | null {
  if (isPremium) return null;

  if (usage.ownedPods.length >= 1) {
    return "Free accounts can create only 1 Study Pod. Upgrade to Premium for unlimited pods.";
  }

  if (usage.joinedPods.length > 0 || usage.waitingPods.length > 0) {
    return "Free accounts can only be in 1 Study Pod. You already joined (or requested) another pod, so you cannot create a new one. Upgrade to Premium to unlock more.";
  }

  return null;
}

export function freeTierJoinBlockReason(
  isPremium: boolean,
  usage: FreeTierStudyPodUsage,
  targetRoomId: string
): string | null {
  if (isPremium) return null;

  // Already host / member / waiting for this same pod — allow (idempotent).
  if (usage.ownedPods.some((p) => p.id === targetRoomId)) {
    return "You are the host of this Study Pod.";
  }
  if (
    usage.joinedPods.some((p) => p.id === targetRoomId) ||
    usage.waitingPods.some((p) => p.id === targetRoomId)
  ) {
    return null;
  }

  if (usage.ownedPods.length >= 1) {
    return "Free accounts that created a Study Pod cannot join other pods. Upgrade to Premium to join more rooms.";
  }

  const otherInvolvement = [...usage.joinedPods, ...usage.waitingPods].filter(
    (p) => p.id !== targetRoomId
  );
  if (otherInvolvement.length >= 1) {
    return "Free accounts can join only 1 Study Pod. You are already in another pod. Upgrade to Premium to join more.";
  }

  return null;
}

export type PodPremiumFeaturesStatus = {
  unlocked: boolean;
  memberCount: number;
  premiumCount: number;
  freeCount: number;
  freeMembers: { id: string; fullName: string }[];
  message: string;
};

/**
 * Premium Study Pod features unlock only when EVERY current member
 * (host + approved joiners) is Premium — whether 1, 2, 3, or 4 people.
 * If any free member is in the room, premium features stay locked.
 */
export async function getPodPremiumFeaturesStatus(
  creatorId: string,
  approvedUserIds: string[]
): Promise<PodPremiumFeaturesStatus> {
  const memberIds = Array.from(
    new Set([creatorId, ...approvedUserIds.filter((id) => !!id)])
  );

  const users = await prisma.user.findMany({
    where: { id: { in: memberIds } },
    select: { id: true, fullName: true, isPremium: true },
  });

  // If creator row is missing, treat as free so features stay locked safely.
  const byId = new Map(users.map((u) => [u.id, u]));
  const ordered = memberIds.map((id) => {
    const u = byId.get(id);
    return u
      ? { id: u.id, fullName: u.fullName, isPremium: !!u.isPremium }
      : { id, fullName: "Unknown member", isPremium: false };
  });

  const freeMembers = ordered
    .filter((u) => !u.isPremium)
    .map((u) => ({ id: u.id, fullName: u.fullName }));
  const premiumCount = ordered.length - freeMembers.length;
  const unlocked = ordered.length > 0 && freeMembers.length === 0;

  const message = unlocked
    ? `Premium Study Pod features unlocked — all ${ordered.length} member(s) are Premium.`
    : `All members in this Study Pod must be Premium to unlock Premium features. ${freeMembers.length} free member(s) still need to upgrade (max 4 people in a pod).`;

  return {
    unlocked,
    memberCount: ordered.length,
    premiumCount,
    freeCount: freeMembers.length,
    freeMembers,
    message,
  };
}
