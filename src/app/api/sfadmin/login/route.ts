import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "hrstudentforge@gmail.com") {
      return NextResponse.json(
        { error: "Access denied: Unauthorized admin email." },
        { status: 403 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {

      user = await prisma.user.create({
        data: {
          email: "hrstudentforge@gmail.com",
          fullName: "SF Admin",
          password: hashPassword("admin123"),
          selectedRole: "admin",
        },
      });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("SF Admin login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
