import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import twilio from "twilio";

export const dynamic = "force-dynamic";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    const existing = await prisma.mobileOtp.findUnique({
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

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SID;

    // DEV mode — no credentials set
    if (!accountSid || !authToken || !verifySid) {
      const otp = generateOtp();
      const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
      await prisma.mobileOtp.upsert({
        where: { phone: cleanPhone },
        update: { otpCode: otp, otpExpiry: expiry, verified: false },
        create: { phone: cleanPhone, otpCode: otp, otpExpiry: expiry, verified: false },
      });
      console.log(`\n🔐 [DEV OTP] Phone: +91${cleanPhone} → OTP: ${otp}\n`);
      return NextResponse.json({ success: true, dev: true, message: "OTP logged to server console (dev mode)" });
    }

    // Use Twilio Verify API — handles OTP natively, no DLT needed
    const client = twilio(accountSid, authToken);
    try {
      await client.verify.v2.services(verifySid).verifications.create({
        to: `+91${cleanPhone}`,
        channel: "sms",
      });
    } catch (err: any) {
      console.error("Twilio Verify error:", err.message);
      return NextResponse.json(
        { error: "Failed to send OTP. " + (err.message || "Please try again.") },
        { status: 500 }
      );
    }

    // Store a placeholder in DB so verify step works
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await prisma.mobileOtp.upsert({
      where: { phone: cleanPhone },
      update: { otpCode: "TWILIO_VERIFY", otpExpiry: expiry, verified: false },
      create: { phone: cleanPhone, otpCode: "TWILIO_VERIFY", otpExpiry: expiry, verified: false },
    });

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
