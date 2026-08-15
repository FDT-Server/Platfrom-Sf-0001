import prisma from "./src/lib/db";

async function main() {
  await prisma.opportunity.updateMany({
    where: {
      company: "TensorGo"
    },
    data: {
      imageUrl: "https://unavatar.io/tensorgo.com"
    }
  });

  console.log("Updated TensorGo images!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
