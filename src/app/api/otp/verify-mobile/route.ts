import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import twilio from "twilio";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, "").replace(/^(\+91|91)/, "");

    const record = await prisma.mobileOtp.findUnique({
      where: { phone: cleanPhone },
    });

    if (!record) {
      return NextResponse.json(
        { error: "No OTP found for this number. Please request a new OTP." },
        { status: 404 }
      );
    }

    if (record.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 410 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SID;

    // DEV mode — verify against DB stored OTP
    if (!accountSid || !authToken || !verifySid) {
      if (record.otpCode !== otp.trim()) {
        return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
      }
      await prisma.mobileOtp.update({ where: { phone: cleanPhone }, data: { verified: true } });
      return NextResponse.json({ success: true, message: "Mobile number verified successfully." });
    }

    // Twilio Verify mode
    const client = twilio(accountSid, authToken);
    try {
      const check = await client.verify.v2.services(verifySid).verificationChecks.create({
        to: `+91${cleanPhone}`,
        code: otp.trim(),
      });

      if (check.status !== "approved") {
        return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
      }
    } catch (err: any) {
      console.error("Twilio Verify check error:", err.message);
      return NextResponse.json({ error: "OTP verification failed. Please try again." }, { status: 400 });
    }

    await prisma.mobileOtp.update({ where: { phone: cleanPhone }, data: { verified: true } });

    return NextResponse.json({ success: true, message: "Mobile number verified successfully." });
  } catch (err: any) {
    console.error("Verify Mobile OTP error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
