import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/db";
import LearnContent from "./LearnContent";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string; weekId: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { fullName: true, email: true, profileImage: true, isPremium: true, credits: true, streak: true },
  });

  if (!user) redirect("/login");

  const { courseId, weekId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, weeks: { orderBy: { weekNumber: "asc" } } },
  });

  if (!course) notFound();

  const week = course.weeks.find(w => w.id === weekId);
  if (!week) notFound();

  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: sessionToken, courseId } },
  });

  const completedTopics: string[] = progress ? (progress.completedTopics as string[]) : [];
  const completedWeeks: string[] = progress ? (progress.completedWeeks as string[]) : [];

  // Determine if this module is locked — week 1 is always unlocked, others require previous week completion
  let isLocked = false;
  if (week.weekNumber > 1) {
    const prevWeek = course.weeks.find(w => w.weekNumber === week.weekNumber - 1);
    if (prevWeek && !completedWeeks.includes(prevWeek.id)) {
      isLocked = true;
    }
  }

  // Determine if this is the final project module and find the next week
  const sortedWeeks = course.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
  const currentWeekIndex = sortedWeeks.findIndex(w => w.id === week.id);
  const isFinalProject = currentWeekIndex === sortedWeeks.length - 1;
  const nextWeekId = isFinalProject ? undefined : sortedWeeks[currentWeekIndex + 1].id;

  return (
    <LearnContent
      user={user}
      course={{ id: course.id, title: course.title }}
      week={{
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        topics: (week.topics as any[]) || [],
      }}
      completedTopics={completedTopics}
      isLocked={isLocked}
      nextWeekId={nextWeekId}
      isFinalProject={isFinalProject}
    />
  );
}
