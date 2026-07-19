import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PostDetailContent from "./PostDetailContent";
import { getPostById } from "@/components/feed/types";

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

  const post = getPostById(id);

  return <PostDetailContent user={user} post={post} />;
}
