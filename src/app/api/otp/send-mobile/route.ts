import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpViaSms(phone: string, otp: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.TWOFACTOR_API_KEY;

  if (!apiKey) {
    // DEV fallback — log OTP to console
    console.log(`\n🔐 [DEV OTP] Phone: +91${phone} → OTP: ${otp}\n`);
    return { ok: true };
  }

  try {
    // 2factor.in — free Indian OTP SMS, no recharge needed
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/OTP1`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Status === "Success") {
      return { ok: true };
    }

    console.error("2factor.in error:", data.Details);
    return { ok: false, error: data.Details };
  } catch (err: any) {
    console.error("SMS fetch error:", err);
    return { ok: false, error: err.message };
  }
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, "").replace(/^(\+91|91)/, "");

    // Spam protection — 60 second cooldown
    const existing = await (prisma as any).mobileOtp.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing && existing.otpExpiry > new Date()) {
      const timeSinceSent =
        (OTP_EXPIRY_MINUTES * 60 * 1000 - (existing.otpExpiry.getTime() - Date.now())) / 1000;
      if (timeSinceSent < 60) {
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(60 - timeSinceSent)}s before requesting another OTP.` },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to DB
    await (prisma as any).mobileOtp.upsert({
      where: { phone: cleanPhone },
      update: { otpCode: otp, otpExpiry: expiry, verified: false },
      create: { phone: cleanPhone, otpCode: otp, otpExpiry: expiry, verified: false },
    });

    const result = await sendOtpViaSms(cleanPhone, otp);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    const isDev = !process.env.TWOFACTOR_API_KEY;

    return NextResponse.json({
      success: true,
      dev: isDev,
      message: isDev
        ? "OTP logged to server console (dev mode)"
        : `OTP sent to +91 ${cleanPhone}`,
    });
  } catch (err: any) {
    console.error("Send Mobile OTP error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
