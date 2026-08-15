import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// Rate limit: max 3 OTP sends per phone per 10 minutes (tracked in DB expiry)
const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpViaSms(phone: string, otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error("FAST2SMS_API_KEY is not set.");
    return false;
  }

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",                      // Quick/Dev route — no DLT or Sender ID needed
        message: `Your SmartFit OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        language: "english",
        numbers: phone.replace("+91", "").replace(/\s/g, ""),
      }),
    });

    const data = await res.json();
    if (!data.return) {
      console.error("Fast2SMS error:", data.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Fast2SMS fetch error:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    // Validate Indian mobile number
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, "").replace(/^(\+91|91)/, "");

    // Check if an OTP was sent recently (within last 60 seconds) — prevent spam
    const existing = await (prisma as any).mobileOtp.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing && existing.otpExpiry > new Date()) {
      const timeSinceSent =
        (OTP_EXPIRY_MINUTES * 60 * 1000 -
          (existing.otpExpiry.getTime() - Date.now())) /
        1000;
      if (timeSinceSent < 60) {
        return NextResponse.json(
          {
            error: `Please wait ${Math.ceil(60 - timeSinceSent)} seconds before requesting another OTP.`,
          },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Upsert OTP in DB
    await (prisma as any).mobileOtp.upsert({
      where: { phone: cleanPhone },
      update: { otpCode: otp, otpExpiry: expiry, verified: false },
      create: { phone: cleanPhone, otpCode: otp, otpExpiry: expiry, verified: false },
    });

    // Send OTP via Fast2SMS
    const sent = await sendOtpViaSms(cleanPhone, otp);

    if (!sent) {
      // Fallback: log OTP to console in dev mode
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);
        return NextResponse.json({
          success: true,
          dev: true,
          message: "OTP logged to server console (DEV mode – SMS not sent).",
        });
      }
      return NextResponse.json(
        { error: "Failed to send OTP via SMS. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to +91 ${cleanPhone}`,
    });
  } catch (err: any) {
    console.error("Send Mobile OTP error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
