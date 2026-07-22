import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import PaymentsDashboardContent from "./PaymentsDashboardContent";

export const dynamic = "force-dynamic";

export default async function SFAdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/sfadmin");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  if (!adminUser) {
    redirect("/sfadmin");
  }

  if (adminUser.email.trim().toLowerCase() === "webstrixx@gmail.com") {
    redirect("/admin");
  }

  if (adminUser.email.trim().toLowerCase() !== "hrstudentforge@gmail.com") {
    redirect("/dashboard");
  }

  const paymentRequests = await prisma.paymentRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedRequests = paymentRequests.map((req) => ({
    ...req,
    createdAt: req.createdAt.toISOString(),
    updatedAt: req.updatedAt.toISOString(),
  }));

  const courseEnrollments = await prisma.courseEnrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true, imageUrl: true } },
      user: { select: { fullName: true, email: true } },
    },
  });

  const serializedEnrollments = courseEnrollments.map((e) => ({
    id: e.id,
    name: e.name,
    phone: e.phone,
    email: e.email,
    classLevel: e.classLevel,
    utrNo: e.utrNo,
    status: e.status,
    createdAt: e.createdAt.toISOString(),
    course: { title: e.course.title, imageUrl: e.course.imageUrl || "" },
    user: { fullName: e.user.fullName, email: e.user.email },
  }));

  return (
    <DashboardLayout user={adminUser}>
      <PaymentsDashboardContent
        adminUser={adminUser}
        paymentRequests={serializedRequests}
        courseEnrollments={serializedEnrollments}
      />
    </DashboardLayout>
  );
}
