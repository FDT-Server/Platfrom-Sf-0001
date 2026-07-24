import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    const body = await req.json();
    const { content, category, imageUrl, tags, title } = body;

    let userId = "user-guest";
    let userName = "Community Trainee";
    let userRole = "Student Developer";
    let userImage = "";

    if (sessionToken) {
      const user = await prisma.user.findUnique({
        where: { id: sessionToken },
        select: { id: true, fullName: true, selectedRole: true, profileImage: true },
      });
      if (user) {
        userId = user.id;
        userName = user.fullName;
        userRole = user.selectedRole || "Student Developer";
        userImage = user.profileImage || "";
      }
    }

    const newPost = await prisma.post.create({
      data: {
        title: title || "",
        content,
        category: category || "General",
        imageUrl: imageUrl || "",
        tags: tags || "",
        userId,
        userName,
        userRole,
        userImage,
        likesCount: 0,
        sharesCount: 0,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
