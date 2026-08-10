import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import CodingDsaContent from "./CodingDsaContent";

export const dynamic = "force-dynamic";

export default async function CodingDsaPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <CodingDsaContent
      user={{
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage || null,
      }}
    />
  );
}
