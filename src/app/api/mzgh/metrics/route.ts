import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import os from "os";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: { email: true },
    });

    if (!user || (user.email !== "jaswanth@gmail.com" && user.email !== "d@gmail.com")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const startDbTime = performance.now();
    
    // Aggregate data using Promise.all for speed
    const [
      totalUsers,
      premiumUsers,
      totalPosts,
      totalStudyPods,
      totalMessages,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.post.count(),
      prisma.studyPod.count(),
      prisma.message.count(),
      prisma.user.count({
        where: {
          lastLoginDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Active in last 24h
          },
        },
      }),
    ]);

    const endDbTime = performance.now();
    const dbLatency = (endDbTime - startDbTime).toFixed(2);

    // Node process and OS metrics
    const memoryUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuLoad = os.loadavg();
    const uptime = os.uptime();

    return NextResponse.json({
      success: true,
      data: {
        database: {
          totalUsers,
          premiumUsers,
          totalPosts,
          totalStudyPods,
          totalMessages,
          activeUsers24h: recentUsers,
          queryLatencyMs: parseFloat(dbLatency),
        },
        system: {
          memory: {
            rssBytes: memoryUsage.rss,
            heapTotalBytes: memoryUsage.heapTotal,
            heapUsedBytes: memoryUsage.heapUsed,
            osTotalBytes: totalMem,
            osUsedBytes: usedMem,
          },
          cpu: {
            loadAvg1m: cpuLoad[0],
            loadAvg5m: cpuLoad[1],
            loadAvg15m: cpuLoad[2],
            cores: os.cpus().length,
          },
          uptimeSeconds: uptime,
          nodeUptimeSeconds: process.uptime(),
        },
        security: {
          wafStatus: "Active",
          environment: process.env.NODE_ENV,
        }
      }
    });

  } catch (error) {
    console.error("Failed to fetch MZGH metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
