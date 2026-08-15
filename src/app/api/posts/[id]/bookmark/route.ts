import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const bookmarks = Array.isArray(post.bookmarkedUserIds)
      ? (post.bookmarkedUserIds as string[])
      : [];

    const isBookmarked = bookmarks.includes(user.id);
    let updatedBookmarks: string[];

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((uid) => uid !== user.id);
    } else {
      updatedBookmarks = [...bookmarks, user.id];
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { bookmarkedUserIds: updatedBookmarks },
    });

    return NextResponse.json({
      success: true,
      bookmarked: !isBookmarked,
      bookmarkedUserIds: updatedPost.bookmarkedUserIds,
    });
  } catch (err) {
    console.error("Bookmark API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
