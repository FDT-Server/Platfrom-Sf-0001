import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isValidEmail } from "@/lib/security/sanitizer";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists. Please login instead." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.registrationOtp.upsert({
      where: { email: trimmedEmail },
      update: {
        otpCode,
        otpExpiry,
      },
      create: {
        email: trimmedEmail,
        otpCode,
        otpExpiry,
      },
    });

    // Send OTP via Email
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
          subject: `Your Studentforge Registration OTP`,
          text: `Hello,\n\nYour OTP Code for Studentforge Registration is: ${otpCode}\n\nThis code is valid for 10 minutes.\n\n— The Studentforge Team`,
          html: `<div style="font-family:sans-serif;padding:20px;color:#1e293b;">
            <h2>Registration OTP Verification</h2>
            <p>Your one-time password (OTP) to complete your registration is:</p>
            <h1 style="color:#4f46e5;font-size:32px;letter-spacing:5px;">${otpCode}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>`,
        };

        // Don't wait for email to send, just fire it off
        transporter.sendMail(mailOptions).catch((err) => {
          console.error("Failed to send OTP email:", err);
        });
      } else {
        console.warn("SMTP credentials not configured. OTP generated but email not sent.", otpCode);
      }
    } catch (mailErr) {
      console.error("OTP email transporter error:", mailErr);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Request OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
