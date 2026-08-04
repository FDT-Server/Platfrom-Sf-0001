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

async function main() {
  console.log("Seeding Supabase PostgreSQL database...");

  const adminPasswordHash = hashPassword("AdminSecretPassword123!");
  const sfAdminPasswordHash = hashPassword("SfAdminSecretPassword123!");

  // 1. Seed Main Admin User
  const admin = await prisma.user.upsert({
    where: { email: "webstrixx@gmail.com" },
    update: {
      fullName: "Platform Super Admin",
      password: adminPasswordHash,
      selectedRole: "Platform Founder / Admin",
    },
    create: {
      email: "webstrixx@gmail.com",
      fullName: "Platform Super Admin",
      password: adminPasswordHash,
      selectedRole: "Platform Founder / Admin",
      profileImage: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
    },
  });
  console.log("Seeded Main Admin:", admin.email);

  // 2. Seed SF Admin User
  const sfAdmin = await prisma.user.upsert({
    where: { email: "hrstudentforge@gmail.com" },
    update: {
      fullName: "HR Studentforge Admin",
      password: sfAdminPasswordHash,
      selectedRole: "Studentforge HR Admin",
    },
    create: {
      email: "hrstudentforge@gmail.com",
      fullName: "HR Studentforge Admin",
      password: sfAdminPasswordHash,
      selectedRole: "Studentforge HR Admin",
      profileImage: "https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858",
    },
  });
  console.log("Seeded SF Admin:", sfAdmin.email);

  console.log("Supabase PostgreSQL Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding Supabase database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
