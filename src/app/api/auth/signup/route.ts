import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, selectedRole, otherRoleText, goals } = await req.json();

    if (!email || !password || !fullName || !selectedRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        selectedRole,
        otherRoleText: otherRoleText || null,
        goals: goals || [],
      },
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
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
