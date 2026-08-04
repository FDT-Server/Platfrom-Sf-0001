import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";
import { hashPassword } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "hrstudentforge@gmail.com") {
      return NextResponse.json(
        { error: "Access denied: Unauthorized admin email." },
        { status: 403 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {

      user = await prisma.user.create({
        data: {
          email: "hrstudentforge@gmail.com",
          fullName: "SF Admin",
          password: hashPassword("admin123"),
          selectedRole: "admin",
        },
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Studentforge Platform" <${process.env.SMTP_EMAIL}>`,
      replyTo: process.env.SMTP_EMAIL,
      to: normalizedEmail,
      subject: `Studentforge Platform - Admin Password Reset OTP for ${user.fullName}`,
      priority: "high" as const,
      headers: {
        "X-Mailer": "Studentforge Mailer",
        "X-Priority": "1",
        "Importance": "High",
      },
      text: `Hello ${user.fullName},\n\nWe received a request to reset the password for your Studentforge Platform Admin account.\n\nYour OTP Code: ${otpCode}\n\nThis code is valid for 10 minutes. Do not share this code with anyone.\n\nIf you did not request a password reset, please ignore this email.\n\n— The Studentforge Team`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Password Reset - Studentforge Platform</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #cbd5e1;max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#1d4ed8;padding:28px 40px;text-align:center;">
            <img src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" alt="Studentforge Platform" height="42" style="display:block;margin:0 auto 10px auto;max-height:42px;" />
            <p style="margin:0;color:#bfdbfe;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Studentforge Platform Admin</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 40px 30px 40px;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#1d4ed8;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Security Notice</p>
            <h2 style="margin:0 0 20px 0;font-size:20px;color:#0f172a;font-weight:700;">Admin Password Reset Request</h2>
            <p style="margin:0 0 20px 0;font-size:15px;color:#1e293b;line-height:1.7;">Dear <strong>${user.fullName}</strong>,</p>
            <p style="margin:0 0 24px 0;font-size:15px;color:#334155;line-height:1.7;">We received a request to reset the password associated with your Studentforge Admin account. Use the verification code below to proceed.</p>

            <!-- OTP BOX -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
              <tr>
                <td style="background-color:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #1d4ed8;padding:24px;text-align:center;">
                  <p style="margin:0 0 8px 0;font-size:11px;color:#1d4ed8;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your OTP Verification Code</p>
                  <p style="margin:0;font-size:36px;font-weight:800;color:#0f172a;letter-spacing:10px;font-family:Courier New,monospace;">${otpCode}</p>
                  <p style="margin:10px 0 0 0;font-size:12px;color:#64748b;">Valid for <strong>10 minutes</strong> only</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px 0;font-size:14px;color:#334155;line-height:1.7;">Enter this code in the password reset form to set a new password for your account.</p>

            <!-- SECURITY WARNING TABLE -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;border:1px solid #e2e8f0;">
              <tr style="background-color:#1d4ed8;">
                <td style="padding:10px 16px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Security Notice</td>
              </tr>
              <tr>
                <td style="padding:14px 16px;font-size:13px;color:#334155;line-height:1.7;">
                  Do not share this code with anyone. Studentforge Platform will never ask for your OTP via phone or chat.
                  If you did not initiate this request, please ignore this email — your account remains secure.
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">This code will automatically expire after 10 minutes for your security.</p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" /></td></tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 40px;background-color:#f8fafc;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">This is an automated security message from <strong style="color:#64748b;">Studentforge Platform</strong>. Please do not reply directly to this email.</p>
            <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;">&copy; ${new Date().getFullYear()} Studentforge Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SF Admin forgot password request error:", err);
    return NextResponse.json(
      { error: "Failed to send OTP verification email. Please try again." },
      { status: 500 }
    );
  }
}
