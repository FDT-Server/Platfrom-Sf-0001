import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
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
      coverImage: true,
      collegeStudying: true,
      branch: true,
      year: true,
      dob: true,
      portfolioLink: true,
      linkedinLink: true,
      about: true,
      shareWithNetworking: true,
      isPremium: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const serializedUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    selectedRole: user.selectedRole,
    otherRoleText: user.otherRoleText || "",
    goals: user.goals,
    profileImage: user.profileImage || "",
    coverImage: (user as any).coverImage || "",
    collegeStudying: user.collegeStudying || "",
    branch: user.branch || "",
    year: user.year || "",
    dob: user.dob || "",
    portfolioLink: user.portfolioLink || "",
    linkedinLink: user.linkedinLink || "",
    about: user.about || "",
    shareWithNetworking: user.shareWithNetworking ?? false,
    isPremium: user.isPremium ?? false,
  };

  return <ProfileContent user={serializedUser} />;
}
