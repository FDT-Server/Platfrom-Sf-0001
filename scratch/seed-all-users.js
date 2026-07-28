const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const sep = trimmed.indexOf("=");
      const key = trimmed.slice(0, sep).trim();
      const val = trimmed.slice(sep + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {}
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const initialUsers = [
  {
    email: "webstrixx@gmail.com",
    fullName: "Platform Super Admin",
    password: hashPassword("AdminSecretPassword123!"),
    selectedRole: "Platform Founder / Admin",
    profileImage: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
    shareWithNetworking: true,
    isPremium: true,
  },
  {
    email: "hrstudentforge@gmail.com",
    fullName: "HR Studentforge Admin",
    password: hashPassword("SfAdminSecretPassword123!"),
    selectedRole: "Studentforge HR Admin",
    profileImage: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
    shareWithNetworking: true,
    isPremium: true,
  },
  {
    email: "aarav.sharma@example.com",
    fullName: "Aarav Sharma",
    password: hashPassword("StudentPass123!"),
    selectedRole: "Full Stack Developer",
    collegeStudying: "IIT Delhi",
    branch: "Computer Science & Engineering",
    year: "4th Year",
    profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300",
    shareWithNetworking: true,
    about: "Passionate about building scalable cloud architectures, Next.js, and AI microservices.",
  },
  {
    email: "diya.patel@example.com",
    fullName: "Diya Patel",
    password: hashPassword("StudentPass123!"),
    selectedRole: "Frontend UI/UX Engineer",
    collegeStudying: "BITS Pilani",
    branch: "Information Technology",
    year: "3rd Year",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    shareWithNetworking: true,
    about: "Crafting beautiful interactive user interfaces and design systems with React and Tailwind CSS.",
  },
  {
    email: "rohan.gupta@example.com",
    fullName: "Rohan Gupta",
    password: hashPassword("StudentPass123!"),
    selectedRole: "Backend & Systems Engineer",
    collegeStudying: "NIT Trichy",
    branch: "Computer Applications",
    year: "4th Year",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    shareWithNetworking: true,
    about: "Specializing in distributed databases, PostgreSQL optimization, and high-concurrency Node.js backends.",
  },
  {
    email: "ananya.singh@example.com",
    fullName: "Ananya Singh",
    password: hashPassword("StudentPass123!"),
    selectedRole: "AI/ML Research Intern",
    collegeStudying: "IIIT Hyderabad",
    branch: "Artificial Intelligence & Data Science",
    year: "3rd Year",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300",
    shareWithNetworking: true,
    about: "Researching Transformer architectures, LLM fine-tuning, and multimodal AI pipelines.",
  },
];

async function main() {
  console.log("Seeding Supabase PostgreSQL database with active registered users...");

  for (const u of initialUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
    console.log(`Successfully seeded user: ${user.fullName} (${user.email})`);
  }

  console.log("\nAll initial users successfully seeded into Supabase PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("Error seeding users into Supabase:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
