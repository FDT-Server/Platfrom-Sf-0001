import prisma from "./src/lib/db";

async function main() {
  await prisma.opportunity.deleteMany();

  const opps = [
    {
      title: "Software Engineering Intern",
      company: "TensorGo",
      location: "Hyderabad, India / Remote",
      type: "Internship",
      compensation: "₹25,000 / mo",
      category: "Engineering",
      description: "Join the TensorGo team to build scalable AI/ML solutions and web applications. You'll work closely with senior engineers on real-world computer vision products.",
      tags: "React,Node.js,Python,AI",
      link: "https://tensorgo.com/careers/",
      logoLetter: "T",
      logoBg: "bg-blue-600 text-white",
      imageUrl: "https://tensorgo.com/wp-content/uploads/2023/10/TensorGo-Logo.svg"
    },
    {
      title: "Data Science Intern",
      company: "TensorGo",
      location: "Hyderabad, India",
      type: "Internship",
      compensation: "₹30,000 / mo",
      category: "Artificial Intelligence",
      description: "As a Data Science Intern at TensorGo, you will help design and implement advanced machine learning models and data pipelines for video analytics.",
      tags: "Python,PyTorch,Computer Vision",
      link: "https://tensorgo.com/careers/",
      logoLetter: "T",
      logoBg: "bg-blue-600 text-white",
      imageUrl: "https://tensorgo.com/wp-content/uploads/2023/10/TensorGo-Logo.svg"
    },
    {
      title: "Software Engineer, Early Career",
      company: "Google",
      location: "Bengaluru, India",
      type: "Full-time",
      compensation: "₹18 - ₹24 LPA",
      category: "Engineering",
      description: "Work on Google's core products. You'll write robust code and collaborate with a team of world-class engineers to solve complex technical problems.",
      tags: "C++,Java,Go,Distributed Systems",
      link: "https://careers.google.com/jobs/",
      logoLetter: "G",
      logoBg: "bg-emerald-600 text-white",
      imageUrl: "https://unavatar.io/google.com"
    },
    {
      title: "Product Design Intern",
      company: "Microsoft",
      location: "Remote (India)",
      type: "Internship",
      compensation: "₹45,000 / mo",
      category: "Design",
      description: "Help shape the future of Microsoft products. You'll conduct user research, create wireframes, and design beautiful, accessible interfaces.",
      tags: "Figma,UX Research,UI Design",
      link: "https://careers.microsoft.com/",
      logoLetter: "M",
      logoBg: "bg-blue-500 text-white",
      imageUrl: "https://unavatar.io/microsoft.com"
    }
  ];

  for (const opp of opps) {
    await prisma.opportunity.create({
      data: opp
    });
  }

  console.log("Seeded 4 real opportunities!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
