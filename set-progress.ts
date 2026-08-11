import prisma from './src/lib/db';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'd@gmail.com' }
  });

  if (!user) {
    console.log("User d@gmail.com not found!");
    return;
  }

  const course = await prisma.course.findFirst({
    where: { title: "Web Development Basics" },
    include: {
      weeks: true
    }
  });

  if (!course) {
    console.log("Course not found!");
    return;
  }

  // Get all topics up to the JS module (week 3). 
  // Let's sort weeks by weekNumber
  const sortedWeeks = [...course.weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  
  let completedTopicIds: string[] = [];
  let foundLastJsTopic = false;

  for (const week of sortedWeeks) {
    if (week.weekNumber <= 3) {
      // It's HTML, CSS, or JS module
      const topics: any = week.topics;
      if (week.weekNumber === 3) {
        // For JS (week 3), complete all EXCEPT the last one so the user can test the completion animation
        for (let i = 0; i < topics.length - 1; i++) {
          completedTopicIds.push(topics[i].id);
        }
      } else {
        // Complete all topics for HTML (1) and CSS (2)
        for (const topic of topics) {
          completedTopicIds.push(topic.id);
        }
      }
    }
  }

  const existingProgress = await prisma.courseProgress.findFirst({
    where: {
      userId: user.id,
      courseId: course.id
    }
  });

  if (existingProgress) {
    await prisma.courseProgress.update({
      where: { id: existingProgress.id },
      data: {
        completedTopics: completedTopicIds,
        completedWeeks: sortedWeeks.filter(w => w.weekNumber < 3).map(w => w.id), // Mark HTML and CSS weeks as completed
        isCompleted: false,
        certificateId: null
      }
    });
  } else {
    await prisma.courseProgress.create({
      data: {
        userId: user.id,
        courseId: course.id,
        completedTopics: completedTopicIds,
        completedWeeks: sortedWeeks.filter(w => w.weekNumber < 3).map(w => w.id)
      }
    });
  }

  // Ensure certificates for this user are removed so they don't break the flow
  await prisma.userCertificate.deleteMany({
    where: {
      userId: user.id
    }
  });

  console.log("Progress for d@gmail.com successfully updated to just before completing JS!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
