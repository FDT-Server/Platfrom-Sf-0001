import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import CourseDetailContent from "./CourseDetailContent";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      weeks: { orderBy: { weekNumber: "asc" } },
    },
  });

  if (!course) notFound();

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId: sessionToken } },
  });

  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: sessionToken, courseId } }
  });

  const isApproved = course.price === 0 ? true : enrollment?.status === "APPROVED";

  return (
    <CourseDetailContent
      user={user}
      course={{
        ...course,
        duration: course.duration || "",
        instructor: course.instructor || "",
        imageUrl: course.imageUrl || "",
        skillsGain: course.skillsGain || "",
        outcomes: course.outcomes || "",
        price: course.price ?? 0,
        weeks: course.weeks.map((w) => ({
          ...w,
          topics: (w.topics as any[]) || [],
        })),
      }}
      enrollment={enrollment ? {
        id: enrollment.id,
        status: enrollment.status,
        utrNo: enrollment.utrNo,
      } : null}
      isApproved={isApproved}
      courseProgress={progress ? {
        completedWeeks: progress.completedWeeks as string[],
        completedTopics: progress.completedTopics as string[],
        isCompleted: progress.isCompleted,
        certificateId: progress.certificateId
      } : { completedWeeks: [], completedTopics: [], isCompleted: false, certificateId: null }}
    />
  );
}
