const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:dbpasswordstudentforge@db.kskthifgazwqgprwvjwx.supabase.co:5432/postgres' });

async function run() {
  await client.connect();
  try {
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS credits INT DEFAULT 0, ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0, ADD COLUMN IF NOT EXISTS "lastNotificationReadAt" TIMESTAMP(3), ADD COLUMN IF NOT EXISTS "lastLoginDate" TIMESTAMP(3);`);
    console.log('Columns added successfully');
    
    const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`);
    console.log(res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error running SQL:', err);
  } finally {
    await client.end();
  }
}

run();
