import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const razorpay_order_id = formData.get("razorpay_order_id") as string;
    const razorpay_payment_id = formData.get("razorpay_payment_id") as string;
    const razorpay_signature = formData.get("razorpay_signature") as string;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.redirect(new URL("/checkout?error=missing_credentials", req.url), 303);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.redirect(new URL("/checkout?error=server_config", req.url), 303);
    }

    // Verify HMAC SHA256 Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.redirect(new URL("/checkout?error=invalid_signature", req.url), 303);
    }

    // Find user from order notes or session
    // Upgrade order if valid
    const payment = await prisma.paymentRequest.findFirst({
      where: { referenceNo: razorpay_order_id },
    });

    if (payment) {
      await prisma.user.update({
        where: { id: payment.userId },
        data: { isPremium: true },
      });

      await prisma.paymentRequest.update({
        where: { id: payment.id },
        data: { utrNo: razorpay_payment_id, status: "APPROVED" },
      });
    }

    return NextResponse.redirect(new URL("/checkout?success=true", req.url), 303);
  } catch (err) {
    console.error("Razorpay Callback Error:", err);
    return NextResponse.redirect(new URL("/checkout?error=callback_failed", req.url), 303);
  }
}
