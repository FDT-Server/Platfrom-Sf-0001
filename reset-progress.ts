import prisma from "./src/lib/db";

async function run() {
  const user = await prisma.user.findUnique({
    where: { email: "d@gmail.com" }
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  const course = await prisma.course.findFirst({
    where: { title: "Web Development Basics" },
    include: { weeks: { orderBy: { weekNumber: "asc" } } }
  });

  if (!course) {
    console.log("Course not found");
    return;
  }

  // Get weeks 1 to 3
  const completedWeeks = course.weeks.filter(w => w.weekNumber < 4);
  const completedWeekIds = completedWeeks.map(w => w.id);
  
  let completedTopicIds: string[] = [];
  completedWeeks.forEach(w => {
    const topics = w.topics as any[];
    if (topics) {
      completedTopicIds = completedTopicIds.concat(topics.map(t => t.id));
    }
  });

  // Update progress
  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  });

  if (progress) {
    await prisma.courseProgress.update({
      where: {
        userId_courseId: { userId: user.id, courseId: course.id }
      },
      data: {
        completedWeeks: completedWeekIds,
        completedTopics: completedTopicIds,
        certificateId: null,
      }
    });
    
    if (progress.certificateId) {
      await prisma.certificate.delete({
        where: { id: progress.certificateId }
      }).catch(e => console.log("Certificate already deleted or error:", e));
    }
  }

  console.log("Successfully reset progress to the end of Javascript module!");
  console.log(`Marked ${completedWeekIds.length} weeks and ${completedTopicIds.length} topics as completed.`);
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
