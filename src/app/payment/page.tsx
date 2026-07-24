import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PaymentPlansContent from "./PaymentPlansContent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function PaymentPage({ searchParams }: PageProps) {
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
    },
  });

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const rawCycle =
    typeof params.billing === "string"
      ? params.billing.toLowerCase()
      : typeof params.plan === "string"
        ? params.plan.toLowerCase()
        : "monthly";

  const billing = rawCycle === "yearly" ? "yearly" : "monthly";

  return <PaymentPlansContent user={user} initialBilling={billing} />;
}
