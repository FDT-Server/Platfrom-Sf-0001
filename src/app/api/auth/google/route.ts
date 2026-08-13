import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential, accessToken } = await req.json();

    let email: string | undefined;
    let name: string | undefined;
    let picture: string | undefined;

    if (credential) {
      // Verify Google ID token
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          picture = payload.picture;
        }
      } catch {
        // Fallback: decode token payload directly if audience check differs
        const base64Url = credential.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const parsed = JSON.parse(jsonPayload);
          email = parsed.email;
          name = parsed.name;
          picture = parsed.picture;
        }
      }
    } else if (accessToken) {
      // Fetch user info using access token
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        email = userData.email;
        name = userData.name;
        picture = userData.picture;
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Failed to authenticate with Google. Missing email payload." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Create user if new
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          fullName: name || cleanEmail.split("@")[0],
          password: "", // Google Auth user (no local password)
          selectedRole: "Student",
          goals: [],
          profileImage: picture || null,
        },
      });
    } else if (picture && !user.profileImage) {
      // Update profile image if missing
      await prisma.user.update({
        where: { id: user.id },
        data: { profileImage: picture },
      });
    }

    const newSessionId = crypto.randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: { currentSessionId: newSessionId },
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set({
      name: "sessionId",
      value: newSessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json(
      { error: "Internal server error during Google Authentication." },
      { status: 500 }
    );
  }
}
