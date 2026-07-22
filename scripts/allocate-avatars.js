require("dotenv").config();
require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Illustrated vector avatar styles from DiceBear (Avataaars, Open Peeps, Micah, Persona, Bottts)
const illustratedStyles = ["avataaars", "open-peeps", "micah", "persona", "bottts"];

async function main() {
  console.log("Fetching all users from database...");
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users in database.`);

  let updatedCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const style = illustratedStyles[i % illustratedStyles.length];
    const seed = encodeURIComponent(user.fullName || user.id);
    
    // Allocate high quality DiceBear illustrated vector avatar URL
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    await prisma.user.update({
      where: { id: user.id },
      data: { profileImage: avatarUrl },
    });

    console.log(`Updated user ${user.fullName} (${user.email}) -> ${avatarUrl}`);
    updatedCount++;
  }

  console.log(`\n✅ Successfully allocated illustrated vector avatars for ${updatedCount} users.`);
}

main()
  .catch((e) => {
    console.error("Error allocating avatars:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
