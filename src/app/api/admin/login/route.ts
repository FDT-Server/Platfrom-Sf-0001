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

    // STRICT Access Control: Block any email except webstrixx@gmail.com
    if (email.trim().toLowerCase() !== "webstrixx@gmail.com") {
      return NextResponse.json(
        { error: "Access denied: Unauthorized admin email." },
        { status: 403 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      if (email === "webstrixx@gmail.com") {
        // Auto-seed admin user if missing
        user = await prisma.user.create({
          data: {
            email: "webstrixx@gmail.com",
            fullName: "Admin",
            password: hashPassword("admin123"),
            selectedRole: "admin",
          },
        });
      } else {
        return NextResponse.json(
          { error: "Access denied: Admin user does not exist." },
          { status: 403 }
        );
      }
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    // Set secure HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
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
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
