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
    select: { fullName: true, email: true, profileImage: true },
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

  const fallbackCourses: CourseCard[] = [
    {
      id: "course-1",
      title: "Advanced React & Next.js App Router Architecture",
      description: "Master React Server Components, Suspense boundaries, streaming data pipelines, Server Actions, and optimal routing patterns for highly scalable enterprise web applications.",
      imageUrl: "",
      price: 0,
      instructor: "Dan Abramov & Lee Robinson",
      duration: "18 Hours",
    },
    {
      id: "course-2",
      title: "Prisma & PostgreSQL Schema Design & Query Optimization",
      description: "Learn Postgres indexing strategies, database pooling, edge connectivity, zero-downtime migrations, and how to write high-performance queries with Prisma Client.",
      imageUrl: "",
      price: 0,
      instructor: "Nikolas Burk",
      duration: "12 Hours",
    },
  ];

  const courses: CourseCard[] = dbCourses.length > 0
    ? dbCourses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        imageUrl: c.imageUrl || "",
        price: c.price ?? 0,
        instructor: c.instructor || "Platform Instructor",
        duration: c.duration || "Self-paced",
      }))
    : fallbackCourses;

  return <CoursesListContent user={user} courses={courses} />;
}
