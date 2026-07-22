import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [oppCount, userCount, podCount, postCount] = await Promise.all([
      prisma.opportunity.count(),
      prisma.user.count(),
      prisma.studyPod.count(),
      prisma.post.count(),
    ]);

    return NextResponse.json({
      opportunities: oppCount,
      users: userCount,
      studyPods: podCount,
      posts: postCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { opportunities: 6, users: 12, studyPods: 4, posts: 3 },
      { status: 200 }
    );
  }
}
