import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, selectedRole, otherRoleText, goals } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields. Please fill in your name, email, and password." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists. Please login instead." },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    const roleToSave = selectedRole || "New / Aspiring Developer";

    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        fullName: fullName.trim(),
        selectedRole: roleToSave,
        otherRoleText: otherRoleText || null,
        goals: goals || [],
        profileImage: defaultAvatarUrl,
      },
    });

    // Automatically set session cookie for instant seamless login
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: user.id,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    // Send welcome email asynchronously
    try {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `"Studentforge Platform" <${process.env.SMTP_EMAIL}>`,
          to: trimmedEmail,
          subject: `Welcome to Studentforge Platform, ${fullName}!`,
          text: `Hello ${fullName},\n\nWelcome to Studentforge!\n\nRegistered Email: ${trimmedEmail}\n\n— The Studentforge Team`,
          html: `<div style="font-family:sans-serif;padding:20px;color:#1e293b;">
            <h2>Welcome to Studentforge, ${fullName}!</h2>
            <p>Your account has been created successfully.</p>
            <p>Registered Email: <strong>${trimmedEmail}</strong></p>
          </div>`,
        };

        transporter.sendMail(mailOptions).catch((err) => {
          console.error("Failed to send welcome email in background:", err);
        });
      }
    } catch (mailErr) {
      console.error("Welcome email transporter error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
