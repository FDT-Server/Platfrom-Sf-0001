import prisma from './src/lib/db';

async function check() {
  const finalWeeks = await prisma.courseWeek.findMany({
    where: { title: "Final Project" }
  });

  console.log(`Found ${finalWeeks.length} Final Project weeks.`);
  for (const week of finalWeeks) {
    console.log("Week ID:", week.id, "Course ID:", week.courseId);
    const topics: any = week.topics;
    const project = topics.find((t: any) => t.id === "project-1");
    if (project) {
       console.log("STARTER CODE:", JSON.stringify(project.starterCode).substring(0, 50));
    } else {
       console.log("No project-1 in this week.");
    }
  }
}

check().catch(console.error);
