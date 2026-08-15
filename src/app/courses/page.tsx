import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import CoursesListContent from "./CoursesListContent";

export const dynamic = "force-dynamic";

interface CourseCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  instructor: string;
  duration: string;
}

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const dbCourses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      instructor: true,
      duration: true,
    },
  });

  return <CoursesListContent user={user} courses={dbCourses as any} />;
}
