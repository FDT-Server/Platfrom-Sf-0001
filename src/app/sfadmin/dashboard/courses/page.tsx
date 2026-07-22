import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import CoursesDashboardContent from "./CoursesDashboardContent";

export const dynamic = "force-dynamic";

export default async function SFAdminCoursesPage() {
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

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedCourses = courses.map((c) => ({
    ...c,
    duration: c.duration || "",
    instructor: c.instructor || "",
    link: c.link || "",
    imageUrl: c.imageUrl || "",
    skillsGain: c.skillsGain || "",
    outcomes: c.outcomes || "",
    price: c.price ?? 0,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout user={adminUser}>
      <CoursesDashboardContent
        adminUser={adminUser}
        initialCourses={serializedCourses}
      />
    </DashboardLayout>
  );
}
