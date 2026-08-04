import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import CheckoutContent from "./CheckoutContent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: PageProps) {
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
      isPremium: true,
     credits: true, streak: true,},
  });

  if (!user) {
    redirect("/login");
  }

  // Redirect read-only users away
  if (user.email !== "jaswanth@gmail.com") {
    redirect("/dashboard");
  }

  const { plan } = await searchParams;
  const planString = typeof plan === "string" ? plan : "monthly";

  return <CheckoutContent user={user} plan={planString} />;
}
