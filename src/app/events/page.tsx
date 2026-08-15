import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import EventsContent from "./EventsContent";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout user={user}>
      <EventsContent />
    </DashboardLayout>
  );
}
