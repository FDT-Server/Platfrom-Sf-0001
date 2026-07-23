import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment real view count when a post is accessed / viewed
    const post = await prisma.post.update({
      where: { id },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post details:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    const body = await req.json();
    const { action, commentText } = body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let currentLikedUserIds: string[] = Array.isArray(existingPost.likedUserIds)
      ? (existingPost.likedUserIds as string[])
      : [];
    let currentBookmarkedUserIds: string[] = Array.isArray(existingPost.bookmarkedUserIds)
      ? (existingPost.bookmarkedUserIds as string[])
      : [];
    let currentComments: any[] = Array.isArray(existingPost.comments)
      ? (existingPost.comments as any[])
      : [];

    const activeUserId = sessionToken || "guest-user";

    if (action === "like") {
      let nextLikes = currentLikedUserIds;
      if (currentLikedUserIds.includes(activeUserId)) {
        nextLikes = currentLikedUserIds.filter((uid) => uid !== activeUserId);
      } else {
        nextLikes = [...currentLikedUserIds, activeUserId];
      }

      const updated = await prisma.post.update({
        where: { id },
        data: {
          likedUserIds: nextLikes,
          likesCount: nextLikes.length,
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "bookmark") {
      let nextBookmarks = currentBookmarkedUserIds;
      if (currentBookmarkedUserIds.includes(activeUserId)) {
        nextBookmarks = currentBookmarkedUserIds.filter((uid) => uid !== activeUserId);
      } else {
        nextBookmarks = [...currentBookmarkedUserIds, activeUserId];
      }

      const updated = await prisma.post.update({
        where: { id },
        data: {
          bookmarkedUserIds: nextBookmarks,
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "share") {
      const updated = await prisma.post.update({
        where: { id },
        data: {
          sharesCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "comment" && commentText) {
      let authorName = "Community Member";
      let authorImage = null;

      if (sessionToken) {
        const u = await prisma.user.findUnique({
          where: { id: sessionToken },
          select: { fullName: true, profileImage: true },
        });
        if (u) {
          authorName = u.fullName;
          authorImage = u.profileImage || null;
        }
      }

      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        authorName,
        authorImage,
        content: commentText.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedComments = [...currentComments, newComment];

      const updated = await prisma.post.update({
        where: { id },
        data: {
          comments: updatedComments,
        },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating post metrics:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
