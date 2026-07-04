import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      fullName,
      profileImage,
      collegeStudying,
      branch,
      year,
      dob,
      portfolioLink,
      linkedinLink,
      about,
    } = await req.json();

    if (!fullName || fullName.trim() === "") {
      return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionToken },
      data: {
        fullName,
        profileImage,
        collegeStudying: collegeStudying || "",
        branch: branch || "",
        year: year || "",
        dob: dob || "",
        portfolioLink: portfolioLink || "",
        linkedinLink: linkedinLink || "",
        about: about || "",
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        collegeStudying: updatedUser.collegeStudying,
        branch: updatedUser.branch,
        year: updatedUser.year,
        dob: updatedUser.dob,
        portfolioLink: updatedUser.portfolioLink,
        linkedinLink: updatedUser.linkedinLink,
        about: updatedUser.about,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
