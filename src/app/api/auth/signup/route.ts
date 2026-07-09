import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, selectedRole, otherRoleText, goals } = await req.json();

    if (!email || !password || !fullName || !selectedRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        selectedRole,
        otherRoleText: otherRoleText || null,
        goals: goals || [],
      },
    });

    
    try {
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
        to: email,
        subject: `Welcome to Studentforge Platform, ${fullName}!`,
        priority: "normal" as const,
        headers: {
          "X-Mailer": "Studentforge Mailer",
          "X-Priority": "3",
          "Importance": "Normal",
        },
        text: `Hello ${fullName},\n\nWelcome to the Studentforge Platform!\n\nYour account has been successfully created.\n\nRegistered Email: ${email}\nRole Track: ${selectedRole === "other" ? (otherRoleText || "Other") : selectedRole}\n\nHead over to your dashboard to get started:\n${process.env.NEXT_PUBLIC_APP_URL}/login\n\n— The Studentforge Team`,
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to Studentforge Platform</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #cbd5e1;max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#1d4ed8;padding:28px 40px;text-align:center;">
            <img src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" alt="Studentforge Platform" height="42" style="display:block;margin:0 auto 10px auto;max-height:42px;" />
            <p style="margin:0;color:#bfdbfe;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Studentforge Platform</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 40px 30px 40px;">
            <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.7;">Dear <strong>${fullName}</strong>,</p>
            <p style="margin:10px 0 20px 0;font-size:15px;color:#334155;line-height:1.7;">Welcome to the <strong>Studentforge Platform</strong>. Your account has been successfully created and you now have full access to our learning resources.</p>

            <!-- ACCOUNT DETAILS TABLE -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;border:1px solid #e2e8f0;">
              <tr style="background-color:#1d4ed8;">
                <td colspan="2" style="padding:10px 16px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Account Details</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;background-color:#f8fafc;width:40%;border-right:1px solid #e2e8f0;">Registered Email</td>
                <td style="padding:12px 16px;font-size:13px;color:#1e293b;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;background-color:#f8fafc;width:40%;border-right:1px solid #e2e8f0;">Role Track</td>
                <td style="padding:12px 16px;font-size:13px;color:#1e293b;">${selectedRole === "other" ? (otherRoleText || "Other") : selectedRole}</td>
              </tr>
            </table>

            <p style="margin:0 0 28px 0;font-size:15px;color:#334155;line-height:1.7;">You can now access your dashboard, browse curated engineering resources, watch video lectures, and explore database configurations.</p>

            <!-- CTA BUTTON -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 30px 0;">
              <tr>
                <td style="background-color:#1d4ed8;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">Go to Dashboard &rarr;</a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">If you did not create this account, please disregard this email.</p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" /></td></tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 40px;background-color:#f8fafc;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">This is an automated message from <strong style="color:#64748b;">Studentforge Platform</strong>. Please do not reply directly to this email.</p>
            <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;">&copy; ${new Date().getFullYear()} Studentforge Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      };

      
      transporter.sendMail(mailOptions).catch(err => {
        console.error("Failed to send welcome email in background:", err);
      });
    } catch (mailErr) {
      console.error("Welcome email transporter initialization error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
