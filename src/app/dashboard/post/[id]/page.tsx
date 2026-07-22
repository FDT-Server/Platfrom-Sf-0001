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
    post = {
      id: dbPost.id,
      title: dbPost.title || undefined,
      author: {
        id: dbPost.userId,
        name: dbPost.userName,
        role: dbPost.userRole || "Student Developer",
        image: dbPost.userImage || null,
        isVerified: true,
        isFollowing: false,
      },
      createdAt: dbPost.createdAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      visibility: "Public",
      category: (dbPost.category as any) || "General",
      content: dbPost.content,
      tags: dbPost.tags ? dbPost.tags.split(",").map((t) => t.trim()) : [],
      media: dbPost.imageUrl
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
      comments: [],
      sharesCount: dbPost.sharesCount || 0,
      bookmarksCount: 0,
      viewsCount: 1,
      bookmarked: false,
    };
  } else {
    post = getPostById(id);
  }

  return <PostDetailContent user={user} post={post} />;
}
