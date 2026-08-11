import prisma from './src/lib/db';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'd@gmail.com' }
  });
  
  if (!user) return;

  const course = await prisma.course.findFirst({
    where: { title: "Web Development Basics" }
  });

  if (!course) return;

  const progress = await prisma.courseProgress.findFirst({
    where: { userId: user.id, courseId: course.id }
  });

  console.log("Progress certificateId:", progress?.certificateId);
}

main();
