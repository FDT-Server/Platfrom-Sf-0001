import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    
    const adminUser = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized. Session is invalid." },
        { status: 401 }
      );
    }

    
    if (
      adminUser.email.trim().toLowerCase() !== "webstrixx@gmail.com" &&
      adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com"
    ) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { requestId } = await params;

    
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: requestId },
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { error: "Payment request not found." },
        { status: 404 }
      );
    }

    
    const updatedRequest = await prisma.paymentRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
      },
    });

    
    const updatedUser = await prisma.user.update({
      where: { id: paymentRequest.userId },
      data: {
        isPremium: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully approved payment and enabled Premium for ${updatedUser.fullName}.`,
      paymentRequest: updatedRequest,
    });
  } catch (err) {
    console.error("Approve payment request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
