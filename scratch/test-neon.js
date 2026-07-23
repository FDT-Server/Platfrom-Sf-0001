const { Pool } = require("pg");

const neonUrl = "postgresql://neondb_owner:npg_mlvu2EAV4qHM@ep-quiet-cell-at1v0f7v.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full";
const pool = new Pool({ connectionString: neonUrl });

async function check() {
  try {
    const res = await pool.query('SELECT count(*) FROM "User"');
    console.log("Neon User count:", res.rows[0]);
  } catch (err) {
    console.error("Neon Query Error:", err.message);
  } finally {
    await pool.end();
  }
}
check();
