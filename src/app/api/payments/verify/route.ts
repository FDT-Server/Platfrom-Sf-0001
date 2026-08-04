import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Session is invalid." },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay payment credentials." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Server error: RAZORPAY_KEY_SECRET is missing." },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature." },
        { status: 400 }
      );
    }

    // Signature is authentic! Upgrade user to Premium
    await prisma.user.update({
      where: { id: user.id },
      data: { isPremium: true },
    });

    // Record verified transaction in database
    await prisma.paymentRequest.create({
      data: {
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        plan: (plan || "PREMIUM").toUpperCase(),
        referenceNo: razorpay_order_id,
        name: user.fullName,
        utrNo: razorpay_payment_id,
        status: "APPROVED",
      },
    });

    return NextResponse.json({ success: true, message: "Payment verified successfully." });
  } catch (err: any) {
    console.error("Razorpay verify payment error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during verification." },
      { status: 500 }
    );
  }
}
