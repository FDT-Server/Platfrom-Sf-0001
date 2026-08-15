const { Pool } = require("pg");

const sourceNeonUrl = "postgresql://neondb_owner:npg_mlvu2EAV4qHM@ep-quiet-cell-at1v0f7v.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";
const targetSupabaseUrl = "postgresql://postgres.kskthifgazwqgprwvjwx:dbpasswordstudentforge@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const neonPool = new Pool({ connectionString: sourceNeonUrl });
const supabasePool = new Pool({ connectionString: targetSupabaseUrl });

const tables = [
  "User",
  "Post",
  "Message",
  "StudyPod",
  "StudyPodMessage",
  "StudyPodTodo",
  "StudyPodIdea",
  "PaymentRequest",
  "Course",
  "CourseWeek",
  "CourseEnrollment",
  "Event",
  "Resource",
  "Certificate",
  "Opportunity",
  "Resume",
];

async function migrateTable(tableName, neonClient, supabaseClient) {
  try {
    const { rows } = await neonClient.query(`SELECT * FROM "${tableName}"`);
    console.log(`Found ${rows.length} records in Neon for "${tableName}"`);

    if (rows.length === 0) return;

    // Get column names
    const columns = Object.keys(rows[0]);
    const colNames = columns.map((c) => `"${c}"`).join(", ");

    for (const row of rows) {
      const values = columns.map((c) => row[c]);
      const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      const updateAssigns = columns
        .filter((c) => c !== "id" && c !== "email")
        .map((c) => `"${c}" = EXCLUDED."${c}"`)
        .join(", ");

      const conflictTarget = tableName === "User" ? `("id") DO UPDATE SET ${updateAssigns}` : tableName === "CourseEnrollment" ? `("courseId", "userId") DO UPDATE SET ${updateAssigns}` : `("id") DO UPDATE SET ${updateAssigns}`;

      const sql = `
        INSERT INTO "${tableName}" (${colNames})
        VALUES (${valuePlaceholders})
        ON CONFLICT ${conflictTarget};
      `;

      await supabaseClient.query(sql, values);
    }

    console.log(`Successfully migrated ${rows.length} rows into Supabase table "${tableName}"!`);
  } catch (err) {
    console.error(`Error migrating table "${tableName}":`, err.message);
  }
}

async function main() {
  console.log("Starting data migration from Neon DB to Supabase PostgreSQL...");

  const neonClient = await neonPool.connect();
  const supabaseClient = await supabasePool.connect();

  try {
    for (const table of tables) {
      await migrateTable(table, neonClient, supabaseClient);
    }
    console.log("\nALL DATA SUCCESSFULLY MIGRATED FROM NEON DB TO SUPABASE POSTGRESQL!");
  } finally {
    neonClient.release();
    supabaseClient.release();
    await neonPool.end();
    await supabasePool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
