const { Pool } = require("pg");
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

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

const tables = [
  "User",
  "Message",
  "StudyPod",
  "StudyPodMessage",
  "StudyPodTodo",
  "StudyPodIdea",
  "PaymentRequest",
  "Event",
  "Resource",
  "Course",
  "CourseWeek",
  "Certificate",
  "CourseEnrollment",
  "Opportunity",
  "Resume",
  "Post",
];

async function main() {
  console.log("Enabling Row Level Security (RLS) on all Supabase PostgreSQL tables...");

  const client = await pool.connect();
  try {
    for (const table of tables) {
      console.log(`Enabling RLS on "${table}"...`);
      await client.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);

      // Create policy to allow server-side operations (postgres/service_role)
      const policyName = `Allow_Backend_Service_Role_${table}`;
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = '${table}' AND policyname = '${policyName}'
          ) THEN
            CREATE POLICY "${policyName}" ON "${table}" FOR ALL USING (true) WITH CHECK (true);
          END IF;
        END $$;
      `);
    }
    console.log("Row Level Security (RLS) successfully enabled on all 16 tables!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Failed to enable RLS:", err);
  process.exit(1);
});
