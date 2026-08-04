// @ts-nocheck
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let creditsAdded = 0;
    let newStreak = (user as any).streak || 0;

    if (!user.lastLoginDate) {
      // First login ever
      creditsAdded = 2;
      newStreak = 1;
    } else {
      const lastLogin = new Date(user.lastLoginDate);
      const lastLoginDateOnly = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
      
      const diffTime = Math.abs(today.getTime() - lastLoginDateOnly.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        // Logged in yesterday, increment streak
        creditsAdded = 2;
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        creditsAdded = 2;
        newStreak = 1;
      } else {
        // Already logged in today
        creditsAdded = 0;
      }
    }

    if (creditsAdded > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: creditsAdded },
          streak: newStreak,
          lastLoginDate: now,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: `Claimed ${creditsAdded} daily credits!`,
        creditsAdded,
        newStreak
      }, { status: 200 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Daily credits already claimed today.",
      creditsAdded: 0,
      newStreak
    }, { status: 200 });

  } catch (error) {
    console.error("Daily login credit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
