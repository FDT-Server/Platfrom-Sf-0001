import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PostDetailContent from "./PostDetailContent";
import { getPostById, FeedPost } from "@/components/feed/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedRole: true,
      otherRoleText: true,
      goals: true,
      profileImage: true,
      collegeStudying: true,
      branch: true,
      year: true,
      linkedinLink: true,
      portfolioLink: true,
      about: true,
      shareWithNetworking: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  let post: FeedPost | null = null;
  const dbPost = await prisma.post.findUnique({
    where: { id },
  });

  if (dbPost) {
    const bUserIds = Array.isArray(dbPost.bookmarkedUserIds) ? (dbPost.bookmarkedUserIds as string[]) : [];
    const comms = Array.isArray(dbPost.comments) ? (dbPost.comments as any[]) : [];

    post = {
      id: dbPost.id,
      title: dbPost.title || undefined,
      author: {
        id: dbPost.userId,
        name: dbPost.userName,
        role: dbPost.userRole || "Student Developer",
        image: dbPost.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbPost.userName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        isVerified: true,
        isFollowing: false,
      },
      createdAt: dbPost.createdAt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      visibility: "Public",
      category: (dbPost.category as any) || "General",
      content: dbPost.content,
      tags: dbPost.tags ? dbPost.tags.split(",").map((t) => t.trim()) : [],
      media: dbPost.imageUrl && dbPost.imageUrl.trim() !== ""
        ? [
            {
              id: `m-${dbPost.id}`,
              type: "image",
              url: dbPost.imageUrl,
              title: "Attachment",
            },
          ]
        : [],
      reactions: {
        like: dbPost.likesCount || 0,
        celebrate: 0,
        support: 0,
        insightful: 0,
        love: 0,
      },
      userReaction: "like",
      comments: comms.map((c: any) => ({
        id: c.id,
        author: {
          id: c.authorId || "u-anon",
          name: c.authorName || "Community Member",
          role: "Member",
          image: c.authorImage || null,
        },
        content: c.content,
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
        likes: 0,
        liked: false,
        replies: [],
      })),
      sharesCount: dbPost.sharesCount || 0,
      bookmarksCount: bUserIds.length,
      viewsCount: (dbPost.viewsCount || 0) + 1,
      bookmarked: bUserIds.includes(user.id),
    };
  } else {
    post = getPostById(id) || null;
  }

  if (!post) {
    redirect("/dashboard");
  }

  return <PostDetailContent user={user} post={post} />;
}
